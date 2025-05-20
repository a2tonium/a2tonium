import useSWR from "swr";
import { useProfileContract } from "@/hooks/useProfileContract";
import { getCertificate } from "@/services/certificate.service";
import { fetchCoursePromo } from "@/services/course.service";
import { fetchProfileData } from "@/services/profile.service";
import { CertificateCompletionInterface, CoursePromoInterface } from "@/types/courseData";
import { ProfileDataInterface } from "@/types/profileData";

interface CertificateDataBundle {
    certificate: CertificateCompletionInterface | null;
    course: CoursePromoInterface | null;
    profile: ProfileDataInterface | undefined;
}

export function useCertificateData(certificateAddr?: string) {
    const { ready } = useProfileContract();

    const fetcher = async (): Promise<CertificateDataBundle> => {
        if (!certificateAddr) return { certificate: null, course: null, profile: undefined };

        const certificate = await getCertificate(certificateAddr);

        let course: CoursePromoInterface | null = null;
        let profile: ProfileDataInterface | undefined = undefined;

        if (certificate?.courseAddress) {
            course = await fetchCoursePromo(certificate.courseAddress);
        }

        if (ready && course?.ownerAddress) {
            profile = await fetchProfileData(course.ownerAddress);
        }

        return { certificate, course, profile };
    };

    return useSWR<CertificateDataBundle>(
        ready && certificateAddr ? ["certificate-data", certificateAddr] : null,
        fetcher,
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );
}
