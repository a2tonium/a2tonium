import { Card } from "@/components/ui/card";
import { CourseAttribute } from "@/types/courseData";

interface CertificateAttributesProps {
    attributes: CourseAttribute;
}

export function CertificateAttributes({
    attributes,
}: CertificateAttributesProps) {
    return (
        <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Attributes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {attributes.map(({ trait_type, value }) => (
                    <Card
                        key={trait_type}
                        className="p-4 border hover:border-blue-500 transition-colors duration-200 break-words cursor-pointer"
                    >
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                            {trait_type}
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-gray-900">
                            {value || "—"}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
