import { useTranslation } from "react-i18next";

export function useCategoryNames(categoryValue: string | null | undefined): string[] {
    const { t } = useTranslation();

    if (!categoryValue || typeof categoryValue !== "string") {
        return [];
    }

    return categoryValue
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
        .map((id) => t(`category.${id}`));
}

export function useCategoryNamesSample(
    categoryIds: string[] | undefined | null
): string[] {
    const { t } = useTranslation();

    if (!Array.isArray(categoryIds)) {
        return [];
    }

    return categoryIds.map((id) => t(`category.${id}`));
}
