import useSWR from "swr";
import { fetchMockCertificate } from "@/services/certificate.service";
import { CertificateCompletionInterface } from "@/types/courseData";

export function useCertificate(certificateAddr?: string) {
    return useSWR<CertificateCompletionInterface>(
        certificateAddr ? "certificate" : null,
        fetchMockCertificate,
        {
            shouldRetryOnError: false,
        }
    );
}
