import React, { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { Bolt, Sun, Moon, Monitor, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useTonConnect } from "@/hooks/useTonConnect";

export const SettingsPopover: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [theme, setTheme] = useState<string>("system"); // Default to system theme
    const [selectedLang, setSelectedLang] = useState<string>(
        i18n.language || "en"
    );

    const { address, isConnected } = useTonConnect();
    const profileLink = `/user/${address}`;

    const changeTheme = (newTheme: string) => {
        setTheme(newTheme);
        // Update your theme logic here (e.g., apply theme class to the body)
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    const changeLanguage = (lang: string) => {
        setSelectedLang(lang);
        i18n.changeLanguage(lang);
    };

    return (
        <Popover>
            <PopoverTrigger>
                <div className="cursor-pointer">
                    <Bolt className="hover:text-blue-500 transition duration-200" />
                </div>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="center"
                sideOffset={20}
                className="font-[800] bg-white p-2 rounded-xl shadow-xl w-[180px] space-y-2"
            >
                {/* Theme Selector */}
                <div>
                    <div className="space-y-1">
                        <div className="mb-2">
                            {isConnected && (
                                <div>
                                    <Link
                                        to={profileLink}
                                        className="flex items-center space-x-2 text-center text-base p-2 block w-full text-gray-900 hover:text-blue-500 hover:bg-gray-100 rounded-md transition duration-200"
                                    >
                                        <span>{t("profile")}</span>
                                    </Link>
                                    <Separator className="bg-gray-200" />
                                </div>
                            )}
                            <div className="md:hidden">
                                <Link
                                    to="/catalog"
                                    className="flex items-center space-x-2 text-center text-base p-2 block w-full text-gray-900 hover:text-blue-500 hover:bg-gray-100 rounded-md transition duration-200"
                                >
                                    <span>{t("catalog")}</span>
                                </Link>
                                <Link
                                    to="/learn"
                                    className="flex items-center space-x-2 text-center text-base p-2 block w-full text-gray-900 hover:text-blue-500 hover:bg-gray-100 rounded-md transition duration-200"
                                >
                                    <span>{t("learning")}</span>
                                </Link>
                                <Link
                                    to="/teach"
                                    className="flex items-center space-x-2 text-center text-base p-2 block w-full text-gray-900 hover:text-blue-500 hover:bg-gray-100 rounded-md transition duration-200"
                                >
                                    <span>{t("teaching")}</span>
                                </Link>
                            </div>
                            <Separator className="md:hidden bg-gray-200" />
                        </div>
                        <div className="">
                            <p className="pl-2 text-sm text-gray-800 mb-2">
                                {t("theme")}
                            </p>
                            <button
                                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                                    theme === "system"
                                        ? "bg-gray-100 text-blue-500"
                                        : "hover:bg-gray-100"
                                }`}
                                onClick={() => changeTheme("system")}
                            >
                                <span className="flex items-center space-x-2">
                                    <Monitor className="w-[18px] h-[18px]" />
                                    <span>{t("system")}</span>
                                </span>
                                {theme === "system" && (
                                    <Check className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                                    theme === "dark"
                                        ? "bg-gray-100 text-blue-500"
                                        : "hover:bg-gray-100"
                                }`}
                                onClick={() => changeTheme("dark")}
                            >
                                <span className="flex items-center space-x-2">
                                    <Moon className="w-[18px] h-[18px]" />
                                    <span>{t("dark")}</span>
                                </span>
                                {theme === "dark" && (
                                    <Check className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                                    theme === "light"
                                        ? "bg-gray-100 text-blue-500"
                                        : "hover:bg-gray-100"
                                }`}
                                onClick={() => changeTheme("light")}
                            >
                                <span className="flex items-center space-x-2">
                                    <Sun className="w-[18px] h-[18px]" />
                                    <span>{t("light")}</span>
                                </span>
                                {theme === "light" && (
                                    <Check className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Language Selector */}
                <div className="p-2">
                    <p className="text-sm text-gray-800 mb-2">
                        {t("language")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {["en", "ru", "kz"].map((lang) => (
                            <button
                                key={lang}
                                className={`px-2 py-1 text-sm font-[600] rounded-md ${
                                    selectedLang === lang
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                                onClick={() => changeLanguage(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
