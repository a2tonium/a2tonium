import useSWR from "swr";
import { useTonConnect } from "@/hooks/useTonConnect";
// import { useCourseContract } from "@/hooks/useCourseContract";
import { listOwnerCourses } from "@/services/course.service";
import { OwnerCoursePreview } from "@/types/courseData";

export function useClientOwnedCoursesList() {
    const { address } = useTonConnect();
    // const { getOwnerCourseContractList, ready } = useCourseContract();

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
