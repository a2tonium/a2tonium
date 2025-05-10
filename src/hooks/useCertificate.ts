import useSWR from "swr"
import { fetchMockCertificate } from "@/lib/tonService"
import { CertificateCompletionInterface } from "@/types/courseData"

export function useCertificate(certificateAddr?: string) {
  return useSWR<CertificateCompletionInterface>(certificateAddr ? "certificate" : null, fetchMockCertificate, {
    shouldRetryOnError: false,
  })
}