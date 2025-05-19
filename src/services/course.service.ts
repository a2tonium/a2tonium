import { extractYoutubeVideoId } from "@/utils/youtube.utils";
import {
    createPinataInstance,
    findPinataGateway,
} from "@/lib/pinata/pinataClient.lib";
import {
    uploadCourseDataToPinata,
    uploadImagesToPinata,
} from "@/lib/pinata/pinataUploader.lib";
import {
    CourseCreationInterface,
    CourseDeployedInterface,
    CoursePromoInterface,
    EnrolledCoursePreview,
    OwnerCoursePreview,
} from "@/types/courseData";
import { encryptCourseAnswers } from "@/utils/crypt.utils";
import { CustomSender } from "@/types/tonTypes";
import { SendTransactionResponse } from "@tonconnect/ui-react";
import { Address, Sender } from "@ton/core";
import { getCourseData, getEnrolledCourseAddresses, getOwnedCourseAddresses } from "@/lib/ton.lib";
import { ipfsToHttp } from "@/utils/ton.utils";

export async function createCourse(
    course: CourseCreationInterface,
    jwt: string,
    publicKey: string,
    sender: CustomSender,
    coursePrice: string,
    createCourseContract: (
        sender: CustomSender,
        courseURL: string,
        coursePrice: string
    ) => Promise<SendTransactionResponse | null>,
    limitedVideos: string[]
): Promise<SendTransactionResponse | null> {
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
        `ipfs://${imageUrl}`,
        `ipfs://${coverImageUrl}`,
        `ipfs://${certificateUrl}`,
        publicKey,
        limitedVideos
    );

    console.log("cleaned", cleaned);
    const courseURL = await uploadCourseDataToPinata(cleaned, pinata);
    return await createCourseContract(sender, courseURL, coursePrice);
}

export async function editCourse(
    course: CourseCreationInterface,
    jwt: string,
    publicKey: string,
    sender: Sender,
    coursePrice: string,
    courseAddress: string,
    updateCourseContract: (
        sender: Sender,
        courseURL: string,
        courseAddress: string,
        courseCost: string
    ) => Promise<void | null>,
    limitedVideos: string[]
) {
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
        `ipfs://${imageUrl}`,
        `ipfs://${coverImageUrl}`,
        `ipfs://${certificateUrl}`,
        publicKey,
        limitedVideos
    );

    console.log("cleaned", cleaned);
    const courseURL = await uploadCourseDataToPinata(cleaned, pinata);
    await updateCourseContract(sender, courseURL, courseAddress, coursePrice);
}

export async function promoteCourse(
    sender: Sender,
    courseAddress: string,
    promoteCourseContract: (
        sender: Sender,
        courseAddress: string
    ) => Promise<void | null>
) {
    await promoteCourseContract(sender, courseAddress);
}

export async function withdrawCourse(
    sender: Sender,
    courseAddress: string,
    withdrawCourseContract: (
        sender: Sender,
        courseAddress: string
    ) => Promise<void | null>
) {
    await withdrawCourseContract(sender, courseAddress);
}

export async function courseEnroll(
    sender: Sender,
    courseAddress: string,
    IIN: string,
    gmail: string,
    courseCost: string,
    enrollToCourseContract: (
        sender: Sender,
        courseAddress: string,
        IIN: string,
        gmail: string,
        courseCost: string
    ) => Promise<void | null>
) {
    await enrollToCourseContract(sender, courseAddress, IIN, gmail, courseCost);
}

export async function fetchCourseIfEnrolled(
    userAddress: string,
    contractAddress: string,
    ownedCourses: string[]
): Promise<{data: CourseDeployedInterface, cost: string}> {
    const enrolledCourses = await getEnrolledCourseAddresses(userAddress);
    // console.log("owned: ",ownedCourses.includes(Address.parse(contractAddress).toString()))
    // console.log("enrolled: ",enrolledCourses.includes(Address.parse(contractAddress).toString()))
    if (
        !ownedCourses.includes(Address.parse(contractAddress).toString()) &&
        !enrolledCourses.includes(Address.parse(contractAddress).toString())
    ) {
        console.warn(
            "User is not enrolled in this course or does not own the course contract."
        );
        throw new Error("Access denied");
    }
    const { collectionContent, cost } = await getCourseData(contractAddress);
    const data = await fetch(collectionContent).then((res) => res.json());

    return {data, cost};
}



export async function fetchCoursePromo(
    contractAddress: string
): Promise<CoursePromoInterface> {
    const { collectionContent, cost, enrolledNumber, ownerAddress } = await getCourseData(
        contractAddress
    );
    const data = await fetch(collectionContent).then((res) => res.json());
    const dataWithCost = {
        ...data,
        cost: cost,
        enrolledNumber: enrolledNumber,
        ownerAddress: ownerAddress,
    };
    return dataWithCost;
}

export async function listEnrolledCourses(
    userAddress: string
): Promise<EnrolledCoursePreview[]> {
    const courseAddrs = await getEnrolledCourseAddresses(userAddress);

    const previews = await Promise.all(
        courseAddrs.map(async (addr): Promise<EnrolledCoursePreview | null> => {
            try {
                const { collectionContent } = await getCourseData(addr);
                if (
                    collectionContent == undefined ||
                    collectionContent == null ||
                    collectionContent === "" ||
                    !collectionContent
                ) {
                    console.warn(
                        "No collection content found for course:",
                        addr
                    );
                    return null;
                }
                const course: CourseCreationInterface = await fetch(
                    collectionContent
                ).then((res) => res.json());

                return {
                    courseAddress: addr,
                    title: course.name,
                    image: ipfsToHttp(course.image),
                };
            } catch (err) {
                console.warn("Skipping invalid course:", addr, err);
                return null;
            }
        })
    );

    return previews.filter(Boolean) as EnrolledCoursePreview[];
}

export async function listOwnerCourses(
    userAddress: string
): Promise<OwnerCoursePreview[]> {

    const courseAddrs = await getOwnedCourseAddresses(userAddress);
    
    console.log("courseADADADADAD", courseAddrs);
    if (!courseAddrs) {
        return [];
    }

    const previews = await Promise.all(
        courseAddrs?.map(async (addr): Promise<OwnerCoursePreview | null> => {
            try {
                const { collectionContent, cost } = await getCourseData(addr);
                if (
                    collectionContent == undefined ||
                    collectionContent == null ||
                    collectionContent === "" ||
                    !collectionContent
                ) {
                    console.warn(
                        "No collection content found for course:",
                        addr
                    );
                    return null;
                }
                const course: CourseDeployedInterface = await fetch(
                    collectionContent
                ).then((res) => res.json());

                return {
                    courseAddress: addr,
                    cost: cost,
                    course: course,
                };
            } catch (err) {
                console.warn("Skipping invalid course:", addr, err);
                return null;
            }
        })
    );

    return previews.filter(Boolean) as OwnerCoursePreview[];
}

export async function reformatCourseData(
    course: CourseCreationInterface,
    imageUrl: string,
    coverImageUrl: string,
    certificateUrl: string,
    walletPublicKey: string,
    limitedVideos: string[]
): Promise<CourseDeployedInterface> {
    const formatted: CourseDeployedInterface = {
        ...course,
        image: imageUrl,
        limitedVideos: limitedVideos,
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
        attributes: Object.entries(course.attributes).map(([key, value]) => ({
            trait_type: key.charAt(0).toUpperCase() + key.slice(1),
            value: String(value),
        })),
        quiz_answers: {
            encrypted_answers: "",
            sender_public_key: "",
        },
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

    formatted.attributes = formatted.attributes.map((attr) =>
        attr.trait_type === "Lessons"
            ? { ...attr, value: String(lessonCount) }
            : attr
    );

    // Encrypt all answers
    const { encryptedMessage, senderPublicKey } = await encryptCourseAnswers(
        allAnswers.join(","),
        walletPublicKey
    );
    formatted.quiz_answers.encrypted_answers = encryptedMessage;
    formatted.quiz_answers.sender_public_key = senderPublicKey;

    return formatted;
}
