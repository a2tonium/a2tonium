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
    CourseDataInterface,
    CourseDataInterfaceNew,
} from "@/types/courseData";
import { encryptCourseAnswers } from "@/utils/crypt.utils";

export async function createCourse(
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
