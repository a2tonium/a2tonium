import { PinataSDK } from "pinata";
import {
    CourseDataInterface,
    CourseDataInterfaceNew,
} from "@/types/courseData";
import { extractYoutubeVideoId } from "@/components/createCourse/videoExistsLogic";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { edwardsToMontgomeryPub } from "@noble/curves/ed25519";
import { decryptAnswers } from "./answersDecrypt";

export const createPinataInstance = (jwt: string, gateway: string) => {
    return new PinataSDK({
        pinataJwt: jwt,
        pinataGateway: gateway,
    });
};

export const checkPinataConnection = async (jwt: string): Promise<boolean> => {
    try {
        const res = await fetch(
            "https://api.pinata.cloud/data/testAuthentication",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        return res.ok;
    } catch (error) {
        console.error("Ошибка при проверке Pinata:", error);
        return false;
    }
};

export const findPinataGateway = async (jwt: string): Promise<string> => {
    try {
        const res = await fetch("https://api.pinata.cloud/v3/ipfs/gateways", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch gateways");
        }

        const data = await res.json();
        const gateway = data?.data?.rows?.[0]?.domain;
        if (!gateway) throw new Error("No available gateways");
        return gateway;
    } catch (error) {
        console.error("Ошибка при получении шлюза:", error);
        throw error;
    }
};

async function getBase64FromImageURL(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function uploadImageToPinata(
    type: string,
    courseName: string,
    base64: string,
    pinata: PinataSDK
): Promise<string> {
    try {
        const baseFilename = `${type}_${formatCourseFilename(courseName)}`;
        let file;
        if (type == "certificate" && base64 == "/images/cards/1.png") {
            const fullBase64 = await getBase64FromImageURL(base64);

            file = base64ToFile(fullBase64, baseFilename);
        } else {
            file = base64ToFile(base64, baseFilename);
        }

        const result = await pinata.upload.public.file(file);
        return `${result.cid}`;
    } catch (error) {
        console.error(`Error uploading ${type} image to Pinata:`, error);
        throw error;
    }
}

function formatCourseFilename(courseName: string): string {
    return courseName
        .trim()
        .slice(0, 20)
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
}

function base64ToFile(base64: string, filename: string): File {
    let mime = "image/png";
    let ext = "png";
    let data = base64;

    if (base64.includes(",")) {
        const parts = base64.split(",");
        const match = parts[0].match(
            /data:(image\/(png|jpeg|jpg|webp));base64/
        );
        if (match) {
            mime = match[1];
            ext = match[2] === "jpeg" ? "jpg" : match[2];
        }
        data = parts[1];
    }

    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }

    return new File([array], `${filename}.${ext}`, { type: mime });
}

export async function uploadImagesToPinata(
    image: string,
    cover_image: string,
    certificate: string,
    pinata: PinataSDK,
    courseName: string
): Promise<[string, string, string]> {
    const imageUrl = await uploadImageToPinata(
        "logo",
        courseName,
        image,
        pinata
    );
    const coverImageUrl =
        cover_image !== ""
            ? await uploadImageToPinata(
                  "cover",
                  courseName,
                  cover_image,
                  pinata
              )
            : "";
    const certificateUrl = await uploadImageToPinata(
        "certificate",
        courseName,
        certificate,
        pinata
    );

    return [imageUrl, coverImageUrl, certificateUrl];
}

export async function uploadCourseDataToPinata(
    course: CourseDataInterfaceNew,
    pinata: PinataSDK
): Promise<string> {
    try {
        const result = await pinata.upload.public
            .json(course)
            .name(`${formatCourseFilename(course.name)}.json`);
        return `${result.cid}`;
    } catch (error) {
        console.error("Error uploading course data to Pinata:", error);
        throw error;
    }
}

export async function sendCourseToPinata(
    course: CourseDataInterface,
    jwt: string,
    publicKey: string
): Promise<string> {
    const gateway = await findPinataGateway(jwt);
    const pinata = createPinataInstance(jwt, gateway);
    const [imageUrl, coverImageUrl, certificateUrl] =
        await uploadImagesToPinata(
            course.image,
            course.cover_image || "",
            course.courseCompletion[0].certificate,
            pinata,
            course.name
        );

    const cleaned = await reformatCourseData(
        course,
        imageUrl,
        coverImageUrl,
        certificateUrl,
        publicKey
    );
    const curve25519PrivateKey = convertEd25519ToCurve25519(publicKey);
    const decrypted = decryptAnswers(
        JSON.parse(cleaned.quiz_answers),
        curve25519PrivateKey
    );
    console.log("Decrypted:", decrypted); // e.g. "abcdbcacdda

    console.log("cleaned", cleaned);
    return await uploadCourseDataToPinata(cleaned, pinata);
}

export async function reformatCourseData(
    course: CourseDataInterface,
    imageUrl: string,
    coverImageUrl: string,
    certificateUrl: string,
    walletPublicKey: string // base64 string
): Promise<CourseDataInterfaceNew> {
    const formatted: CourseDataInterfaceNew = {
        ...course,
        image: imageUrl,
        cover_image: coverImageUrl,
        video: course.video
            ? extractYoutubeVideoId(course.video) || undefined
            : undefined,
        courseCompletion: [
            {
                ...course.courseCompletion[0],
                certificate: certificateUrl,
            },
        ],
        quiz_answers: "", // will be set later
        modules: [],
    };

    let lessonCount = 0;
    const allAnswers: string[] = [];

    formatted.modules = course.modules.map((mod) => {
        const updatedLessons = mod.lessons.map((lesson) => {
            lessonCount++;
            return {
                id: lesson.id || crypto.randomUUID(),
                title: lesson.title,
                videoId: extractYoutubeVideoId(lesson.videoId) || "",
            };
        });

        // Store answers
        allAnswers.push(mod.quiz.correct_answers);

        return {
            id: mod.id,
            title: mod.title,
            lessons: updatedLessons,
            quiz: {
                questions: mod.quiz.questions,
            },
        };
    });

    formatted.attributes.lessons = lessonCount;

    // Encrypt all answers
    const encrypted = encryptAnswers(allAnswers.join(""), walletPublicKey);
    formatted.quiz_answers = JSON.stringify(encrypted);

    return formatted;
}

function convertEd25519ToCurve25519(ed25519PubKeyBase64: string): Uint8Array {
    console.log("ed25519PubKeyBase64", ed25519PubKeyBase64);
    const ed25519PubKeyBytes = naclUtil.decodeBase64(ed25519PubKeyBase64);

    // This function does the actual conversion: Ed25519 -> X25519
    return edwardsToMontgomeryPub(ed25519PubKeyBytes);
}

export function encryptAnswers(answers: string, ed25519PubKeyBase64: string) {
    const curve25519PubKey = convertEd25519ToCurve25519(ed25519PubKeyBase64);
    const ephemeralKeyPair = nacl.box.keyPair();
    const messageUint8 = naclUtil.decodeUTF8(answers);
    const nonce = nacl.randomBytes(24);

    const encrypted = nacl.box(
        messageUint8,
        nonce,
        curve25519PubKey,
        ephemeralKeyPair.secretKey
    );

    return {
        encrypted: naclUtil.encodeBase64(encrypted),
        nonce: naclUtil.encodeBase64(nonce),
        ephemeralPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
    };
}
