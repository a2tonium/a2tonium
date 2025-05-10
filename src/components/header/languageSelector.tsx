import React from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next"; // Import the i18next hook

export const LanguageSelector: React.FC = () => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="flex items-center">
            {/* Language Dropdown */}
            <Select onValueChange={changeLanguage}>
                <SelectTrigger className="text-base flex items-center px-1 py-2 rounded-md hover:text-blue-500 duration-200 border-none">
                    {/* Icon and Text Together */}
                    <div className="flex items-center space-x-2">
                        <Languages className="w-5 h-5" />
                        <SelectValue placeholder={t("current-language")} />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">
                        <div className="text-right text-base hover:text-blue-500 duration-200">
                            English
                        </div>
                    </SelectItem>
                    <SelectItem value="ru">
                        <div className="text-right text-base hover:text-blue-500 duration-200">
                            Русский
                        </div>
                    </SelectItem>
                    <SelectItem value="kz">
                        <div className="text-right text-base hover:text-blue-500 duration-200">
                            Қазақша
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};
