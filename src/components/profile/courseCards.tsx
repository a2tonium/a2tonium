import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { OwnerCoursePreview } from "@/types/course.types";
import { useTranslation } from "react-i18next";
import { getLink } from "@/utils/ton.utils";

interface CourseCardsProps {
    courses: OwnerCoursePreview[];
}

export function CourseCards({ courses }: CourseCardsProps) {
    const { t } = useTranslation();

    if (!courses || courses.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">{t("courseCards.noCourses")}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
                <Link
                    to={`/course/${course.courseAddress}`}
                    key={course.courseAddress}
                    className="block"
                >
                    <Card className="overflow-hidden rounded-xl h-full shadow-md transition-shadow hover:shadow-lg">
                        <CardContent className="p-0">
                            <div className="aspect-square w-full overflow-hidden">
                                <img
                                    src={getLink(course.course.image)}
                                    alt={course.course.name}
                                    className="h-full w-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-105"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-white">
                            <h3 className="font-medium text-sm sm:text-base md:text-lg line-clamp-2">
                                {course.course.name}
                            </h3>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
