import { extractYoutubeVideoId } from "@/utils/youtube.utils";
import {
    createPinataInstance,
    findPinataGateway,
} from "@/lib/pinata/pinata.client.lib";
import {
    uploadCourseDataToPinata,
    uploadImagesToPinata,
} from "@/lib/pinata/pinata.uploader.lib";
import {
    CourseCreationInterface,
    CourseDeployedInterface,
    CoursePromoInterface,
    EnrolledCoursePreview,
    MAX_FAILURES,
    OwnerCoursePreview,
    QuizAnswers,
    RETRY_DELAY,
} from "@/types/course.types";
import { encryptCourseAnswers } from "@/utils/crypt.utils";
import { CustomSender } from "@/types/ton.types";
import { SendTransactionResponse } from "@tonconnect/ui-react";
import { Address, Sender } from "@ton/core";
import {
    fetchAndClassifyCourses,
    getCourseData,
    getEnrolledCourseAddresses,
    getOwnedCourseAddresses,
} from "@/lib/ton.lib";
import { getLink } from "@/utils/ton.utils";
import { getQuizGrades } from "./certificate.service";

export async function createCourse(
    course: CourseCreationInterface,
    jwt: string,
    ownerPublicKey: string,
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
        ownerPublicKey,
        limitedVideos
    );

    const courseURL = await uploadCourseDataToPinata(cleaned, pinata);
    return await createCourseContract(sender, courseURL, coursePrice);
}

export async function editCourse(
    course: CourseCreationInterface,
    jwt: string,
    publicKey: string,
    ownerPublicKey: string,
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
        ownerPublicKey,
        limitedVideos
    );

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
): Promise<{ data: CourseDeployedInterface; cost: string }> {
    const enrolledCourses = await getEnrolledCourseAddresses(userAddress);

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

    return { data, cost };
}

export async function fetchCourseIfEnrolledWithGrades(
    userAddress: string,
    contractAddress: string,
    ownedCourses: string[]
): Promise<{
    data: CourseDeployedInterface;
    cost: string;
    grades: QuizAnswers[];
}> {
    const enrolledCourses = await getEnrolledCourseAddresses(userAddress);

    if (
        !ownedCourses.includes(Address.parse(contractAddress).toString()) &&
        !enrolledCourses.includes(Address.parse(contractAddress).toString())
    ) {
        console.warn(
            "User is not enrolled in this course or does not own the course contract."
        );
        throw new Error("Access denied");
    }
    const { collectionContent, cost, ownerAddress } = await getCourseData(
        contractAddress
    );

    const data = await fetch(collectionContent).then((res) => res.json());
    const grades = await getQuizGrades(
        userAddress,
        contractAddress,
        ownerAddress
    );

    return { data, cost, grades };
}

export async function fetchCoursePromo(
    contractAddress: string
): Promise<CoursePromoInterface> {
    const { collectionContent, cost, enrolledNumber, ownerAddress } =
        await getCourseData(contractAddress);
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

    if (!courseAddrs || courseAddrs.length === 0) {
        return [];
    }

    const previews: EnrolledCoursePreview[] = [];

    for (const addr of courseAddrs) {
        let attempts = 0;

        while (attempts < MAX_FAILURES) {
            try {
                const { collectionContent } = await getCourseData(addr);

                if (
                    !collectionContent ||
                    collectionContent === "" ||
                    collectionContent === undefined
                ) {
                    console.warn("No collection content for course:", addr);
                    break; // skip this course
                }

                const res = await fetch(collectionContent);

                if (res.status === 429) {
                    throw new Error("Too many requests (429)");
                }

                if (!res.ok) {
                    throw new Error(`Fetch failed: ${res.status}`);
                }

                const course: CourseCreationInterface = await res.json();

                previews.push({
                    courseAddress: Address.parse(addr).toString(),
                    title: course.name,
                    image: getLink(course.image),
                });

                break; // success, break retry loop
            } catch (err) {
                attempts++;
                console.warn(
                    `Error loading enrolled course ${addr} (attempt ${attempts}):`,
                    err
                );
                await new Promise((r) => setTimeout(r, RETRY_DELAY));
            }
        }
    }

    return previews;
}

export async function listOwnerCourses(
    userAddress: string
): Promise<OwnerCoursePreview[]> {
    const courseAddrs = await getOwnedCourseAddresses(userAddress);

    if (!courseAddrs || courseAddrs.length === 0) {
        return [];
    }

    const previews: OwnerCoursePreview[] = [];

    for (const addr of courseAddrs) {
        let attempts = 0;

        while (attempts < MAX_FAILURES) {
            try {
                const { collectionContent, cost } = await getCourseData(addr);

                if (
                    !collectionContent ||
                    collectionContent === "" ||
                    collectionContent === undefined
                ) {
                    console.warn("No collection content for course:", addr);
                    break; // skip this course
                }

                const res = await fetch(collectionContent);

                if (res.status === 429) {
                    throw new Error("Too many requests (429)");
                }

                if (!res.ok) {
                    throw new Error(`Fetch failed: ${res.status}`);
                }

                const course: CourseDeployedInterface = await res.json();

                previews.push({
                    courseAddress: Address.parse(addr).toString(),
                    cost,
                    course,
                });

                break; // success, break retry loop
            } catch (err) {
                attempts++;
                console.warn(
                    `Error loading course ${addr} (attempt ${attempts}):`,
                    err
                );
                await new Promise((r) => setTimeout(r, RETRY_DELAY));
            }
        }
    }

    return previews;
}

export async function reformatCourseData(
    course: CourseCreationInterface,
    imageUrl: string,
    coverImageUrl: string,
    certificateUrl: string,
    walletPublicKey: string,
    ownerPublicKey: string,
    limitedVideos: string[]
): Promise<CourseDeployedInterface> {
    console.log(walletPublicKey)
    const formatted: CourseDeployedInterface = {
        ...course,
        image: imageUrl,
        limitedVideos: limitedVideos,
        cover_image: coverImageUrl,
        owner_public_key: ownerPublicKey,
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
    let allAnswers = ""; // Инициализируем как строку

    formatted.modules = course.modules.map((mod) => {
        const updatedLessons = mod.lessons.map((lesson) => {
            lessonCount++;
            return {
                id: lesson.id || crypto.randomUUID(),
                title: lesson.title,
                videoId: extractYoutubeVideoId(lesson.videoId) || "",
            };
        });

        // Добавляем ответы с пробелом
        allAnswers += mod.quiz.correct_answers + " ";

        return {
            id: mod.id,
            title: mod.title,
            lessons: updatedLessons,
            quiz: {
                questions: mod.quiz.questions,
            },
        };
    });

    allAnswers = allAnswers.trim();

    formatted.attributes = formatted.attributes.map((attr) =>
        attr.trait_type === "Lessons"
            ? { ...attr, value: String(lessonCount) }
            : attr
    );

    const { encryptedMessage, senderPublicKey } = await encryptCourseAnswers(
        allAnswers,
        ownerPublicKey
    );

    formatted.quiz_answers.encrypted_answers = encryptedMessage;
    formatted.quiz_answers.sender_public_key = senderPublicKey;

    return formatted;
}

export async function sendAnswersToQuiz(
    courseAddress: string,
    studentAddress: string,
    quizId: bigint,
    answers: string,
    ownerPublicKey: string,
    answerQuiz: (
        courseAddress: string,
        quizId: bigint,
        answers: string,
        ownerPublicKey: string
    ) => Promise<void>
) {
    const { notCompleted } = await fetchAndClassifyCourses(studentAddress);

    const matchedNFT = notCompleted.find(
        (nft) =>
            Address.parse(nft.collection.address).toString() ===
            Address.parse(courseAddress).toString()
    );

    if (!matchedNFT) {
        console.warn(
            "User is not enrolled in this course or does not own the course contract."
        );
        throw new Error("Access denied");
    }
    const nftAddress = Address.parse(matchedNFT.address).toString();

    const { encryptedMessage, senderPublicKey } = await encryptCourseAnswers(
        answers,
        ownerPublicKey
    );
    await answerQuiz(
        nftAddress,
        BigInt(quizId!),
        encryptedMessage,
        senderPublicKey
    );
}

export async function issueCertificateService(
    courseAddress: string,
    studentAddress: string,
    quizId: bigint,
    rating: string,
    review: string,
    issueCertficate: (
        certificateAddress: string,
        quizId: bigint,
        rating: string,
        review: string
    ) => Promise<void>
) {
    const { notCompleted } = await fetchAndClassifyCourses(studentAddress);

    const matchedNFT = notCompleted.find(
        (nft) =>
            Address.parse(nft.collection.address).toString() ===
            Address.parse(courseAddress).toString()
    );

    if (!matchedNFT) {
        console.warn(
            "User is not enrolled in this course or does not own the course contract."
        );
        throw new Error("Access denied");
    }
    const nftAddress = Address.parse(matchedNFT.address).toString();

    await issueCertficate(nftAddress, quizId, rating, review);
}
