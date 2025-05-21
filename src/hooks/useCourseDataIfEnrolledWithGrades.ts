import useSWR from "swr";
import { CourseDeployedInterface, QuizAnswers } from "@/types/courseData";
import { fetchCourseIfEnrolledWithGrades } from "@/services/course.service";
import { useTonConnect } from "@/hooks/useTonConnect";
import { getOwnedCourseAddresses } from "@/lib/ton.lib";

export function useCourseDataIfEnrolledWithGrades(contractAddress?: string) {
    const { address: userAddress } = useTonConnect();

    const fetcher = async (): Promise<{data:CourseDeployedInterface | null, cost: string; grades: QuizAnswers[]}> => {
        if (!userAddress || !contractAddress) return { data: null, cost: "", grades: [] as unknown as QuizAnswers[] };
        const ownerCourseAddresses = await getOwnedCourseAddresses(
            userAddress
        );
        console.log(ownerCourseAddresses)
        return await fetchCourseIfEnrolledWithGrades(
            userAddress,
            contractAddress,
            ownerCourseAddresses
        );
    };
    return useSWR<{data:CourseDeployedInterface | null, cost: string; grades: QuizAnswers[]}>(
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
