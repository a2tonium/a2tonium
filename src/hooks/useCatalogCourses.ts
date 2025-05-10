import useSWR from "swr"
import { CatalogCourseInterface } from "@/types/courseData"
import { fetchCatalogCourses } from "@/lib/catalogService"

export function useCatalogCourses() {
  return useSWR<CatalogCourseInterface[]>("catalog-courses", fetchCatalogCourses, {
    shouldRetryOnError: false,
  })
}