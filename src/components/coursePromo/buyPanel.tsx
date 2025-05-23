import { Separator } from "@/components/ui/separator";
import { CoursePromoInterface } from "@/types/course.types";
import { BuyDialog } from "@/components/coursePromo/buyDialog";
import { getAttribute } from "@/utils/course.attributes.utils";
import { useTranslation } from "react-i18next";

interface BuyPanelProps {
    course: CoursePromoInterface;
    courseAddress: string | undefined;
}

export function BuyPanel({ course, courseAddress }: BuyPanelProps) {
    const { t } = useTranslation();

    return (
        <div
            className="w-full md:w-[35%] md:sticky md:top-20 h-fit bg-white p-2 md:p-6 
                fixed bottom-0 left-0 md:relative shadow-[0px_-4px_10px_rgba(0,0,0,0.12)] md:shadow-none"
            style={{ maxWidth: "100vw", zIndex: "50" }}
        >
            <div className="w-[90%] sm:w-[60%] md:w-full mx-auto">
                <div className="w-full">
                    <h3 className="text-xl font-bold text-gray-800">
                        {course.cost} {t("catalog.ton")}
                    </h3>
                    <BuyDialog courseAddress={courseAddress} course={course} />

                    <Separator className="my-2 md:my-4" />

                    <div className="hidden md:block">
                        <h3 className="text-md font-semibold text-gray-800">
                            {t("promo.learnImmediately")}
                        </h3>
                        <p className="text-sm text-gray-800 underline">
                            {getAttribute(course.attributes, "workload")}
                        </p>
                        <p className="text-sm text-gray-800 underline">
                            {getAttribute(course.attributes, "duration")}
                        </p>
                        <Separator className="my-4" />
                    </div>

                    {/* Course Includes */}
                    <div className="bg-gray-100 px-2 md:p-4 rounded-lg">
                        <h4 className="text-md font-semibold text-gray-800 hidden md:block">
                            {t("promo.includesTitle")}
                        </h4>
                        <p className="text-sm text-gray-700 mt-1">
                            <strong>
                                {getAttribute(course.attributes, "lessons")}
                            </strong>{" "}
                            {t("promo.includesLessons")}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>{course.modules.length}</strong>{" "}
                            {t("promo.includesModules")}
                        </p>
                        <a
                            href="#course-content"
                            className="text-blue-600 hover:underline mt-2 block text-sm"
                        >
                            {t("promo.viewContent")}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
