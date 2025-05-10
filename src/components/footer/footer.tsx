import React from "react";
import { useTranslation } from "react-i18next";

interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
    const { t } = useTranslation();

    return (
        <footer className={`text-gray-600 bg-white shadow-2xl`}>
            {/* Line on Top */}

            <div className={`container mx-auto px-4 py-6 ${className}`}>
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Left Section */}
                    <div>
                        <p className="text-sm">
                            <span className="font-semibold">
                                {t("logo-text-footer")}
                            </span>{" "}
                            {t("all-rights-reserved")}
                        </p>
                        <p className="text-sm">
                            {t("contact-us")}
                            <a
                                href="mailto:dlms@gmail.com"
                                className="transition hover:text-blue-500 hover:underline"
                            >
                                {t("dlms-gmail")}
                            </a>
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-wrap justify-center md:justify-start space-x-6">
                        <a
                            href="/about"
                            className="text-sm hover:text-blue-500"
                        >
                            {t("about")}
                        </a>
                        <a
                            href="/learn"
                            className="text-sm hover:text-blue-500"
                        >
                            {t("learning")}
                        </a>
                        <a
                            href="/teach"
                            className="text-sm hover:text-blue-500"
                        >
                            {t("teaching")}
                        </a>
                        <a
                            href="/contact"
                            className="text-sm hover:text-blue-500"
                        >
                            {t("contact")}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
