import { LearnCard } from "@/components/learnCard/learnCard";
import { LearnCardSkeleton } from "@/components/learnCard/learnCardSkeleton";
import { ErrorPage } from "@/pages/error/error";
import { Link } from "react-router-dom";
import { useEnrolledCoursesList } from "@/hooks/useEnrolledCourseList";
import { useTranslation } from "react-i18next";

export const Learn = () => {
    const { t } = useTranslation();
    const { data: courses, isLoading, error } = useEnrolledCoursesList();

    if (error) {
        return (
            <ErrorPage
                first={t("learn.error.title")}
                second={t("learn.error.message")}
                third={t("learn.error.retry")}
            />
        );
    }

    return (
        <main className="flex flex-col min-h-96 items-center mx-auto max-w-4xl w-full bg-white p-4 pt-6 pb-10 rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="w-full max-w-3xl">
                <div className="mb-6">
                    <h2 className="md:text-2xl sm:text-xl font-bold">
                        {t("learn.title")}
                    </h2>
                </div>
                <div className="w-full space-y-4 flex flex-col items-center">
                    {isLoading && !courses && (
                        <>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <LearnCardSkeleton key={index} />
                            ))}
                        </>
                    )}

                    {courses && courses.length === 0 && (
                        <div className="flex flex-col items-center space-y-4 mt-8">
                            <img
                                src="/images/coding.svg"
                                alt={t("learn.noCourses.alt")}
                                className="w-[180px] h-auto"
                            />
                            <p className="text-gray-700 text-center text-sm md:text-lg">
                                {t("learn.noCourses.text")}{" "}
                                <Link
                                    to="/catalog"
                                    className="text-goluboy hover:text-blue-600 underline"
                                >
                                    {t("learn.noCourses.link")}
                                </Link>
                                .
                            </p>
                        </div>
                    )}

                    {courses &&
                        courses.length > 0 &&
                        courses.map((course) => (
                            <LearnCard key={course.courseAddress} {...course} />
                        ))}
                </div>
            </div>
        </main>
    );
};
