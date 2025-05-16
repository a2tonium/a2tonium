import useSWR from "swr";
import { CourseDeployedInterface } from "@/types/courseData";
import { fetchCourseIfEnrolled } from "@/services/course.service";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useCourseContract } from "@/hooks/useCourseContract";

export function useCourseDataIfEnrolled(contractAddress?: string) {
    const { address: userAddress } = useTonConnect();
    const { getOwnerCourseContractList, ready } = useCourseContract();

    const fetcher = async (): Promise<{data:CourseDeployedInterface | null, cost: string}> => {
        if (!userAddress || !contractAddress || !ready) return { data: null, cost: "" };
        const ownerCourseAddresses = await getOwnerCourseContractList(
            userAddress
        );
        console.log(ownerCourseAddresses)
        return await fetchCourseIfEnrolled(
            userAddress,
            contractAddress,
            ownerCourseAddresses
        );
    };
    return useSWR<{data:CourseDeployedInterface | null, cost: string}>(
        ready && contractAddress
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
