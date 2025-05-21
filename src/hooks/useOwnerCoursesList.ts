import useSWR from "swr";
// import { useCourseContract } from "@/hooks/useCourseContract";
import { listOwnerCourses } from "@/services/course.service";
import { OwnerCoursePreview } from "@/types/course.types";

export function useOwnerCoursesList(address?: string) {
    const fetcher = async (): Promise<OwnerCoursePreview[]> => {
        if (!address) return [];
        // const courseAddresses = await getOwnerCourseContractList(address);
        // if (!courseAddresses) return [];
        return await listOwnerCourses(address);
    };

    const shouldFetch = address;

    return useSWR<OwnerCoursePreview[]>(
        shouldFetch ? ["owned-courses", address] : null,
        fetcher,
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );
}
