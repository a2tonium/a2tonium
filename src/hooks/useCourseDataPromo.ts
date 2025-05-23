import useSWR from "swr";
import { useProfileContract } from "@/hooks/useProfileContract";
import { CoursePromoInterface } from "@/types/course.types";
import { fetchCoursePromo } from "@/services/course.service";
import { fetchProfileData } from "@/services/profile.service";
import { ProfileDataInterface } from "@/types/profile.types";

interface CoursePromoWithProfile {
    course: CoursePromoInterface | null;
    profile: ProfileDataInterface | undefined;
}

export function useCourseDataPromo(contractAddress?: string) {
    const { ready } = useProfileContract();

    const fetcher = async (): Promise<CoursePromoWithProfile> => {
        if (!contractAddress) return { course: null, profile: undefined };

        const course = await fetchCoursePromo(contractAddress);
        let profile: ProfileDataInterface | undefined = undefined;

        if (ready && course?.ownerAddress) {
            profile = await fetchProfileData(course.ownerAddress);
        }

        return { course, profile };
    };

    return useSWR<CoursePromoWithProfile>(
        ready ? ["course-promo", ready] : null,
        fetcher,
        { shouldRetryOnError: false }
    );
}
