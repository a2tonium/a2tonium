import useSWR from "swr";
import { useTonConnect } from "@/hooks/useTonConnect";
import { listOwnerCourses } from "@/services/course.service";
import { OwnerCoursePreview } from "@/types/course.types";

export function useClientOwnedCoursesList() {
    const { address } = useTonConnect();

    const fetcher = async (): Promise<OwnerCoursePreview[]> => {
        if (!address) return [];
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
