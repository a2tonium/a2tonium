import { CourseAttribute } from "@/types/course.types";

export function getAttribute(
    attributes: CourseAttribute | undefined,
    key: string
): string {
    if (Array.isArray(attributes)) {
        const found = attributes.find(
            (attr) => attr.trait_type.toLowerCase() === key.toLowerCase()
        );
        return found?.value ?? "";
    }

    const oldAttributes = attributes as unknown as Record<string, string>;
    return oldAttributes?.[key] ?? "";
}
