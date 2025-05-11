import useSWR from "swr";
import { CourseDataInterface } from "@/types/courseData";
import { fetchIfEnrolled } from "@/services/ton.service";
import { useTonConnect } from "@/hooks/useTonConnect";

/**
 * Проверяет, заэнроллен ли пользователь и, если да — возвращает данные курса.
 */
export function useCourseDataIfEnrolled(contractAddress?: string) {
    const { address: userAddress } = useTonConnect();

    const fetcher = async (): Promise<CourseDataInterface | null> => {
        if (!userAddress || !contractAddress) return null;
        return await fetchIfEnrolled(userAddress, contractAddress);
    };
    return useSWR<CourseDataInterface | null>(
        userAddress && contractAddress
            ? ["enrolled-course", userAddress, contractAddress]
            : null,
        fetcher,
        { shouldRetryOnError: false }
    );
}
