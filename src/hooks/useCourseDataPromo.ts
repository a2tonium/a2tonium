import useSWR from "swr";
import { useProfileContract } from "@/hooks/useProfileContract";
import { CoursePromoInterface } from "@/types/courseData";
import { fetchCoursePromo } from "@/services/course.service";
import { fetchProfileData } from "@/services/profile.service";
import { ProfileDataInterface } from "@/types/profileData";

interface CoursePromoWithProfile {
    course: CoursePromoInterface | null;
    profile: ProfileDataInterface | undefined;
}

export function useCourseDataPromo(contractAddress?: string) {
    const { ready } = useProfileContract();

    const fetcher = async (): Promise<CoursePromoWithProfile> => {
        if (!contractAddress) return { course: null, profile: undefined };

        const course = await fetchCoursePromo(contractAddress);
        console.log("Fetched course promo data:", course);
        let profile: ProfileDataInterface | undefined = undefined;

        if (ready && course?.ownerAddress) {
            console.log("Fetching profile data for owner address:", course.ownerAddress);
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
