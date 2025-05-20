import useSWR from "swr";
import { listCertificates } from "@/services/certificate.service";
import { CertificateInterface } from "@/types/courseData";

export function useOwnerCertificateList(certificateAddr?: string) {
    const fetcher = async (): Promise<CertificateInterface[]> => {
        if (!certificateAddr) return [];
        return await listCertificates(certificateAddr);
    };

    return useSWR<CertificateInterface[]>(
        certificateAddr ? "certificate" : null,
        fetcher,
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );
}
