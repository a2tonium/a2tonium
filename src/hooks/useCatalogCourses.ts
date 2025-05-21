import useSWR from "swr";
import { CatalogCourseInterface } from "@/types/course.types";
import { fetchCatalogCourses } from "@/services/catalog.service";

export function useCatalogCourses() {
    return useSWR<CatalogCourseInterface[]>(
        "catalog-courses",
        fetchCatalogCourses,
        {
            shouldRetryOnError: false,
        }
    );
}
