import useSWR from "swr";
import { CourseDeployedInterface } from "@/types/course.types";
import { fetchCourseIfEnrolled } from "@/services/course.service";
import { useTonConnect } from "@/hooks/useTonConnect";
import { getOwnedCourseAddresses } from "@/lib/ton.lib";

export function useCourseDataIfEnrolled(contractAddress?: string) {
    const { address: userAddress } = useTonConnect();

    const fetcher = async (): Promise<{
        data: CourseDeployedInterface | null;
        cost: string;
    }> => {
        if (!userAddress || !contractAddress) return { data: null, cost: "" };
        const ownerCourseAddresses = await getOwnedCourseAddresses(userAddress);
        return await fetchCourseIfEnrolled(
            userAddress,
            contractAddress,
            ownerCourseAddresses
        );
    };
    return useSWR<{ data: CourseDeployedInterface | null; cost: string }>(
        userAddress && contractAddress
            ? ["enrolled-course", userAddress, contractAddress]
            : null,
        fetcher,
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );
}
