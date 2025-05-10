import { Link, useParams } from "react-router-dom";
import { CertificateAttributes } from "@/components/certificate/certificateAttributes";
import { useCertificate } from "@/hooks/useCertificate";
import { ErrorPage } from "@/pages/error/error";
import { Check, ChevronRight, Copy } from "lucide-react";
import { CertificateSkeleton } from "@/components/certificate/certificateSkeleton";
import { ShareButtonCertificate } from "@/components/certificate/shareButton";
import { useState } from "react";

export function Certificate() {
    const { certificateAddr } = useParams();
    const [copiedOwner, setCopiedOwner] = useState(false);
    const [copiedCert, setCopiedCert] = useState(false);
    const {
        data: certificateData,
        error,
        isLoading,
    } = useCertificate(certificateAddr);

    if (isLoading) return <CertificateSkeleton />;

    if (error || !certificateData) {
        return (
            <ErrorPage
                first={"Certificate Not Found"}
                second={"We couldn't find this certificate."}
                third={"Please double-check the address and try again."}
            />
        );
    }
    

    const handleCopy = (str: string) => {
        if (str === "owner") {
            if (!certificateData.ownerAddress) return;
            navigator.clipboard.writeText(certificateData.ownerAddress);
            setCopiedOwner(true);
            setTimeout(() => setCopiedOwner(false), 1000);
        } else if (str === "certificate") {
            if (!certificateData.certificateAddress) return;
            navigator.clipboard.writeText(certificateData.certificateAddress);
            setCopiedCert(true);
            setTimeout(() => setCopiedCert(false), 1000);
        }
    };

    return (
        <div className="bg-white p-6 w-full mx-auto rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Certificate Image */}
                <div className="w-1/2">
                    <img
                        src="/images/cards/1.png"
                        alt="Certificate"
                        className="w-full rounded-xl object-cover"
                    />
                </div>

                {/* Info Panel */}
                <div className="flex-1 space-y-4">
                    {/* Title */}
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {certificateData.certificateId}
                    </h1>

                    {/* Course Info */}
                    <Link
                        to={`/course/${certificateData.courseAddress}`}
                        className="flex items-center space-x-2 group"
                    >
                        <img
                            src={certificateData.courseImage}
                            alt="Course"
                            className="w-6 h-6 rounded object-cover"
                        />
                        <span className="hover:text-blue-600 font-semibold transition duration-200 text-sm sm:text-base flex items-center">
                            <span>{certificateData.courseTitle}</span>
                            <ChevronRight className="w-[17px] h-[17px]" />
                        </span>
                    </Link>

                    {/* Description */}
                    <p className="text-sm sm:text-[18px] font-[550] break-words">
                        {certificateData.description}
                    </p>

                    {/* Owner Address */}
                    <div className="text-sm sm:text-base ">
                        <span className="text-gray-600">Owner: </span>
                        <div className="space-x-2">
                        <Link
                            to={`/users/${certificateData.ownerAddress}`}
                            className="hover:underline font-[550]"
                        >
                            {certificateData.ownerAddress?.slice(0, 8)}...
                            {certificateData.ownerAddress?.slice(-8)}
                        </Link>
                        <button onClick={() => handleCopy("owner")} className="hover:text-primary text-gray-600 duration-200">
                            {copiedOwner ? (
                                <Check className="w-[13px] h-[13px] text-blue-500" />
                            ) : (
                                <Copy className="w-[13px] h-[13px]" />
                            )}
                        </button>
                        </div>
                    </div>
                    {/* Certificate Address */}
                    <div className="text-sm sm:text-base ">
                        <span className="text-gray-600">Address: </span>
                        <div className="space-x-2">
                        <Link
                            to={`/users/${certificateData.certificateAddress}`}
                            className="hover:underline font-[550]"
                        >
                            {certificateData.certificateAddress?.slice(0, 8)}...
                            {certificateData.certificateAddress?.slice(-8)}
                        </Link>
                        <button onClick={() => handleCopy("certificate")} className="hover:text-primary text-gray-600 duration-200">
                            {copiedCert ? (
                                <Check className="w-[13px] h-[13px] text-blue-500" />
                            ) : (
                                <Copy className="w-[13px] h-[13px]" />
                            )}
                        </button>
                        </div>
                    </div>
                    <div className="text-sm sm:text-base ">
                        <span>
                            <ShareButtonCertificate />
                        </span>
                    </div>

                    {/* Attributes */}
                    <CertificateAttributes
                        attributes={certificateData.attributes}
                    />
                </div>
            </div>
        </div>
    );
}
