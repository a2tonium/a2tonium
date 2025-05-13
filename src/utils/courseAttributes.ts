import {
    CourseCreationInterface,
    CourseDeployedInterface,
} from "@/types/courseData";

type CourseAttribute = {
    trait_type: string;
    value: string;
};

// Универсальный тип, объединяющий оба курса
type AnyCourse = CourseCreationInterface | CourseDeployedInterface | undefined | null;

export function getAttribute(course: AnyCourse, key: string): string {
    if (Array.isArray(course?.attributes)) {
        const found = (course?.attributes as CourseAttribute[]).find(
            (attr) => attr.trait_type.toLowerCase() === key.toLowerCase()
        );
        return found?.value ?? "";
    }

    // 🔐 Преобразуем через `unknown`, затем в Record<string, string>
    const oldAttributes = course?.attributes as unknown as Record<string, string>;
    return oldAttributes?.[key] ?? "";
}
