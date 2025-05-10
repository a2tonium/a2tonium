import { useTranslation } from "react-i18next";

export function useCategoryNames(
    categoryIds: string[] | undefined | null
): string[] {
    const { t } = useTranslation();

    if (!Array.isArray(categoryIds)) {
        return [];
    }

    return categoryIds.map((id) => t(`category.${id}`));
}
