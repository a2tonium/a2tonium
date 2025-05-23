import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface CertificateGradesProps {
    grades: string[];
}

export function CertificateGrades({ grades }: CertificateGradesProps) {
    const { t } = useTranslation();

    return (
        <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
                {t("certificate.grades.title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {grades.map((grade, index) => (
                    <Card
                        key={index}
                        className="p-4 border hover:border-blue-500 transition-colors duration-200 break-words cursor-pointer"
                    >
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                            {t("certificate.grades.quiz", {
                                number: index + 1,
                            })}
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900">
                            {grade || "—"}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
