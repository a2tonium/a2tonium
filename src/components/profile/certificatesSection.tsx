import type { CertificateInterface } from "@/types/courseData" // Assuming this interface is defined in a types file
import { CertificateCards } from "@/components/profile/certificateCards"

interface CertificatesSectionProps {
  certificates: CertificateInterface[]
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {

  return (
    <div className="py-4">
      <CertificateCards certificates={certificates} />
    </div>
  )
}