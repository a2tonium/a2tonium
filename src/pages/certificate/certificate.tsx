import { Link, useParams } from "react-router-dom";
import { CertificateAttributes } from "@/components/certificate/certificateAttributes";
import { useCertificateData } from "@/hooks/useCertificateData";
import { ErrorPage } from "@/pages/error/error";
import { Check, ChevronRight, Copy } from "lucide-react";
import { CertificateSkeleton } from "@/components/certificate/certificateSkeleton";
import { ShareButtonCertificate } from "@/components/certificate/shareButton";
import { useState } from "react";
import { CertificateGrades } from "@/components/certificate/certificateGrades";
import { useTranslation } from "react-i18next";
import { getLink } from "@/utils/ton.utils"

export function Certificate() {
    const { certificateAddr } = useParams();
    const { t } = useTranslation();
    const [copiedOwner, setCopiedOwner] = useState(false);
    const [copiedCert, setCopiedCert] = useState(false);

    const { data, error, isLoading } = useCertificateData(certificateAddr);

    if (isLoading || !data?.certificate) return <CertificateSkeleton />;
    if (error || !data?.certificate) {
        return (
            <ErrorPage
                first={t("certificate.error.title")}
                second={t("certificate.error.message")}
                third={t("certificate.error.retry")}
            />
        );
    }

    const { certificate, course } = data;

    const handleCopy = (str: string) => {
        const text =
            str === "owner"
                ? certificate.ownerAddress
                : certificate.certificateAddress;
        if (!text) return;
        navigator.clipboard.writeText(text);
        if (str === "owner") {
            setCopiedOwner(true);
            setTimeout(() => setCopiedOwner(false), 1000);
        } else {
            setCopiedCert(true);
            setTimeout(() => setCopiedCert(false), 1000);
        }
    };

    return (
        <div className="bg-white p-6 w-full mx-auto rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-1/2">
                    <img
                        src={certificate.image}
                        alt={t("certificate.alt")}
                        className="w-full rounded-xl object-cover"
                    />
                </div>

                <div className="flex-1 space-y-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {t("certificate.title")}
                    </h1>

                    {course && (
                        <Link
                            to={`/course/${certificate.courseAddress}`}
                            className="flex items-center space-x-2 group"
                        >
                            <img
                                src={getLink(course.image)}
                                alt="Course"
                                className="w-6 h-6 rounded object-cover"
                            />
                            <span className="hover:text-blue-600 font-semibold transition duration-200 text-sm sm:text-base flex items-center">
                                <span>{course.name}</span>
                                <ChevronRight className="w-[17px] h-[17px]" />
                            </span>
                        </Link>
                    )}

                    <p className="text-sm sm:text-[18px] font-[550] break-words">
                        {certificate.description}
                    </p>

                    <div className="text-sm sm:text-base">
                        <span className="text-gray-600">
                            {t("certificate.owner")}:{" "}
                        </span>
                        <div className="space-x-2">
                            <Link
                                to={`/user/${certificate.ownerAddress}`}
                                className="hover:underline font-[550]"
                            >
                                {certificate.ownerAddress?.slice(0, 8)}...
                                {certificate.ownerAddress?.slice(-8)}
                            </Link>
                            <button
                                onClick={() => handleCopy("owner")}
                                className="hover:text-primary text-gray-600 duration-200"
                            >
                                {copiedOwner ? (
                                    <Check className="w-[13px] h-[13px] text-blue-500" />
                                ) : (
                                    <Copy className="w-[13px] h-[13px]" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="text-sm sm:text-base">
                        <span className="text-gray-600">
                            {t("certificate.address")}:{" "}
                        </span>
                        <div className="space-x-2">
                            <Link
                                to={`/user/${certificate.certificateAddress}`}
                                className="hover:underline font-[550]"
                            >
                                {certificate.certificateAddress?.slice(0, 8)}...
                                {certificate.certificateAddress?.slice(-8)}
                            </Link>
                            <button
                                onClick={() => handleCopy("certificate")}
                                className="hover:text-primary text-gray-600 duration-200"
                            >
                                {copiedCert ? (
                                    <Check className="w-[13px] h-[13px] text-blue-500" />
                                ) : (
                                    <Copy className="w-[13px] h-[13px]" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="text-sm sm:text-base">
                        <ShareButtonCertificate />
                    </div>

                    <CertificateAttributes
                        attributes={certificate.attributes}
                    />
                    <CertificateGrades grades={certificate.grades} />
                </div>
            </div>
        </div>
    );
}
