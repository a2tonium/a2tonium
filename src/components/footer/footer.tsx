import React from "react";
import { useTranslation } from "react-i18next";
import { SocialIcon } from "react-social-icons";

interface FooterProps {
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
    const { t } = useTranslation();

    const socialLinks = [
        "https://www.linkedin.com/company/a2tonium/",
        "https://t.me/a2tonium",
        "https://github.com/a2tonium",
        "mailto:a2tonium@gmail.com",
    ];

    return (
        <footer className="text-gray-500 bg-white relative pb-6 sm:py-6">
            <div className={`container px-4 mx-auto  ${className}`}>
                <div className="">
                    {/* LOGO — CENTERED on all screens */}
                    <div className="order-first md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
                        <img
                            src="/images/logo/logo(blue).png"
                            alt="Logo"
                            className="h-12 w-12 mx-auto"
                        />
                    </div>
                    <div className="w-full flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-6 md:space-y-0 relative">
                        {/* Left Section */}
                        <div className="flex flex-wrap justify-center md:justify-start space-x-2 sm:space-x-6">
                            {/* <a
                                href="/about"
                                className="text-xs sm:text-sm hover:text-blue-500"
                            >
                                {t("about")}
                            </a> */}
                            <a
                                href="/learn"
                                className="text-xs sm:text-sm hover:text-blue-500"
                            >
                                {t("learning")}
                            </a>
                            <a
                                href="/teach"
                                className="text-xs sm:text-sm hover:text-blue-500"
                            >
                                {t("teaching")}
                            </a>
                            <a
                                href="/catalog"
                                className="text-xs sm:text-sm hover:text-blue-500"
                            >
                                {t("catalog")}
                            </a>
                        </div>

                        {/* Right Section */}
                        <div className="flex-col items-start md:items-end justify-center md:justify-end space-y-2">
                            <p className="text-[13.5px] font-thin text-xs sm:text-sm">
                                {t("logo-text-footer")}
                            </p>
                            <div className="flex space-x-2 justify-center md:justify-end">
                                {socialLinks.map((url, idx) => (
                                    <div
                                        key={idx}
                                        className="transition duration-300 hover:scale-110"
                                    >
                                        <SocialIcon
                                            url={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            bgColor="#94a3b8"
                                            fgColor="#ffffff"
                                            className=""
                                            style={{ height: 22, width: 22 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
