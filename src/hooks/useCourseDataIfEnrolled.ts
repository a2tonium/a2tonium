import useSWR from "swr";
import { CourseDeployedInterface } from "@/types/courseData";
import { fetchCourseIfEnrolled } from "@/services/course.service";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useCourseContract } from "@/hooks/useCourseContract";

export function useCourseDataIfEnrolled(contractAddress?: string) {
    const { address: userAddress } = useTonConnect();
    const { getOwnerCourseContractList, ready } = useCourseContract();

    const fetcher = async (): Promise<CourseDeployedInterface | null> => {
        if (!userAddress || !contractAddress || !ready) return null;
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
    return useSWR<CourseDeployedInterface | null>(
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
