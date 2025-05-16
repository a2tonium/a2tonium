import {
    CourseAttributesInterface,
    CourseCreationInterface,
    CourseDeployedInterface,
} from "@/types/courseData";

export function base64ToFile(base64: string, filename: string): File {
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

export function formatFilename(courseName: string): string {
    return courseName
        .trim()
        .slice(0, 20)
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
}

export async function getBase64FromImageURL(imageUrl: string): Promise<string> {
    let url = imageUrl;
    if (imageUrl.startsWith("ipfs://")) {
        url = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
    }
    const response = await fetch(url);
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

export function isBase64(str: string) {
    const base64Regex =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str);
}

// Helper function to convert string to Uint8Array
export const stringToUint8Array = (str: string): Uint8Array =>
    new TextEncoder().encode(str);

export const uint8ArrayToBase64 = (arr: Uint8Array): string => {
    return btoa(
        Array.from(arr)
            .map((byte) => String.fromCharCode(byte))
            .join("")
    );
};

export function hexToUint8Array(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        array[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return array;
}

export const uint8ArrayToString = (arr: Uint8Array): string =>
    new TextDecoder().decode(arr);

export const giveFullYoutubeLink = (url: string): string => {
    return `https://www.youtube.com/watch?v=${url}`;
};

export const reformatToCourseCreation = async (
    course: CourseDeployedInterface
): Promise<CourseCreationInterface> => {
    const {
        image,
        cover_image,
        video,
        courseCompletion,
        attributes,
        modules,
        ...rest
    } = course;

    const defaultAttributes: CourseAttributesInterface = {
        category: [],
        duration: "",
        level: "Beginner",
        lessons: 0,
        language: "English",
        workload: "",
        learn: "",
        about: "",
        gains: "",
        requirements: "",
    };

    const parsedAttributes = attributes.reduce((acc, { trait_type, value }) => {
        switch (trait_type) {
            case "Category":
                acc.category = Array.isArray(value)
                    ? value
                    : typeof value === "string"
                    ? value.split(",").map((v) => v.trim())
                    : [];
                break;
            case "Lessons":
                acc.lessons = typeof value === "number" ? value : parseInt(value);
                break;
            case "Language":
                acc.language = String(value);
                break;
            case "Level":
                acc.level = String(value);
                break;
            case "Duration":
                acc.duration = String(value);
                break;
            case "Workload":
                acc.workload = String(value);
                break;
            case "Learn":
                acc.learn = String(value);
                break;
            case "About":
                acc.about = String(value);
                break;
            case "Gains":
                acc.gains = String(value);
                break;
            case "Requirements":
                acc.requirements = String(value);
                break;
            default:
                console.warn(`Unknown trait_type: ${trait_type}`);
        }
        return acc;
    }, defaultAttributes);

    return {
        ...rest,
        image: (await getBase64FromImageURL(image)) || "",
        cover_image: cover_image
            ? (await getBase64FromImageURL(cover_image)) || ""
            : "",
        video: video ? giveFullYoutubeLink(video) : "",
        social_links: course.social_links ?? [],
        courseCompletion: [
            {
                ...courseCompletion[0],
                certificate: (await getBase64FromImageURL(courseCompletion[0]?.certificate)) || "",
            },
        ],
        attributes: parsedAttributes,
        modules: modules.map((module) => ({
            id: module.id,
            title: module.title,
            lessons: module.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                videoId: giveFullYoutubeLink(lesson.videoId),
            })),
            quiz: {
                correct_answers:  "",
                questions: module.quiz.questions,
            },
        })),
    };
};
