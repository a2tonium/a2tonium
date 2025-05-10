import useSWR from "swr";
import { CourseDataInterface } from "@/types/courseData";
import { fetchPromo } from "@/lib/tonService";

export function useCourseDataPromo(contractAddress?: string) {
    const fetcher = async (): Promise<CourseDataInterface | null> => {
        if (!contractAddress) return null;
        return await fetchPromo(contractAddress);
    };
    return useSWR<CourseDataInterface | null>(
        contractAddress ? ["course-promo", contractAddress] : null,
        fetcher,
        { shouldRetryOnError: false }
    );
}
