import { useTranslation } from "react-i18next";

export const LevelIndicator = ({ level }: { level: string }) => {
    const { t } = useTranslation();

    let bars = [];

    switch (level) {
        case "Beginner":
            bars = [true, false, false];
            break;
        case "Intermediate":
            bars = [true, true, false];
            break;
        case "Expert":
            bars = [true, true, true];
            break;
        default:
            bars = [true, false, false];
    }

    return (
        <div className="flex items-center space-x-2 text-gray-700 font-medium">
            <div className="flex space-x-[2px]">
                {bars.map((active, index) => (
                    <div
                        key={index}
                        className={`w-[4px] h-4 rounded-sm ${
                            active ? "bg-green-500" : "bg-gray-300"
                        }`}
                    />
                ))}
            </div>
            <span className="text-goluboy">
                <span className="font-semibold">
                    {t(`catalog.level.${level.toLowerCase()}`)}
                </span>{" "}
                {t("promo.level")}
            </span>
        </div>
    );
};
