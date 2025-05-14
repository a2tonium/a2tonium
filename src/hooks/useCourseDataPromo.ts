import useSWR from "swr";
import { CoursePromoInterface } from "@/types/courseData";
import { fetchCoursePromo } from "@/services/course.service";

export function useCourseDataPromo(contractAddress?: string) {
    const fetcher = async (): Promise<CoursePromoInterface | null> => {
        if (!contractAddress) return null;
        return await fetchCoursePromo(contractAddress);
    };
    return useSWR<CoursePromoInterface | null>(
        contractAddress ? ["course-promo", contractAddress] : null,
        fetcher,
        { shouldRetryOnError: false }
    );
}
