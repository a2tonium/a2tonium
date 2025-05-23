import useSWR from "swr";
import { useTonConnect } from "@/hooks/useTonConnect";
import { listEnrolledCourses } from "@/services/course.service";
import { EnrolledCoursePreview } from "@/types/course.types";

export function useEnrolledCoursesList() {
    const { address } = useTonConnect();

    const fetcher = () => {
        if (!address) return Promise.resolve([]);
        return listEnrolledCourses(address);
    };

    return useSWR<EnrolledCoursePreview[]>(
        address ? ["enrolled-courses", address] : null,
        fetcher,
        { shouldRetryOnError: false }
    );
}
