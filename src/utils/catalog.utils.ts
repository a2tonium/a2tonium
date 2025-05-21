import { CatalogCourseInterface } from "@/types/course.types";

export function filterAndSortCourses(
    courses: CatalogCourseInterface[],
    selectedCategory: string[],
    selectedDifficulty: string[],
    selectedRating: number[],
    selectedPrice: number[],
    sortBy: string
) {
    let filtered = [...courses];

    if (selectedCategory.length > 0) {
        filtered = filtered.filter((c) =>
            selectedCategory.every((cat) => c.categories.includes(cat))
        );
    }

    if (selectedDifficulty.length > 0) {
        filtered = filtered.filter((c) =>
            selectedDifficulty.includes(c.difficulty)
        );
    }

    if (selectedRating.length > 0) {
        filtered = filtered.filter((c) =>
            selectedRating.some((r) => c.rating >= r)
        );
    }

    if (selectedPrice.length > 0) {
        filtered = filtered.filter((c) =>
            selectedPrice.some((p) => c.price <= p)
        );
    }

    switch (sortBy) {
        case "featured":
            return filtered.sort((a, b) => b.rating - a.rating);
        case "newest":
            return filtered.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        case "low-to-high":
            return filtered.sort((a, b) => a.price - b.price);
        case "high-to-low":
            return filtered.sort((a, b) => b.price - a.price);
        default:
            return filtered;
    }
}
