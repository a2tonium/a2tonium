import { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";
import { FaTelegramPlane, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import ShareButton from "@/components/ui/share-button";
import { useTranslation } from "react-i18next";

export function ShareButtonCertificate() {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const shareLinks = [
        {
            icon: FaTelegramPlane,
            onClick: () =>
                window.open(`https://t.me/share?url=${window.location.href}`),
            label: t("certificate.share.telegram"),
        },
        {
            icon: FaFacebookF,
            onClick: () => window.open("https://facebook.com/share"),
            label: t("certificate.share.facebook"),
        },
        {
            icon: FaLinkedinIn,
            onClick: () => window.open("https://linkedin.com/share"),
            label: t("certificate.share.linkedin"),
        },
        {
            icon: copied ? Check : LinkIcon,
            onClick: handleCopy,
            label: t("certificate.share.copy"),
        },
    ];

    return (
        <div>
            <ShareButton links={shareLinks} className="text-lg font-medium">
                {copied ? <Check size={15} /> : <LinkIcon size={15} />}
                {t("certificate.share.button")}
            </ShareButton>
        </div>
    );
}
