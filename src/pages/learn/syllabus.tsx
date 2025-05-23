import { useNavigate, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CourseSidebar } from "@/components/courseSidebar/courseSidebar";
import { SyllabusSkeleton } from "@/components/syllabus/syllabusSkeleton";
import { ErrorPage } from "@/pages/error/error";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCourseDataIfEnrolledWithGrades } from "@/hooks/useCourseDataIfEnrolledWithGrades";
import { useTranslation } from "react-i18next";

export function Syllabus() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { courseAddress } = useParams();
    const {
        data: course,
        error,
        isLoading,
    } = useCourseDataIfEnrolledWithGrades(courseAddress);

    const handleLessonClick = (lessonId: string) => {
        navigate(`../lesson/${lessonId}`);
    };

    const handleModuleClick = (firstLessonId: string) => {
        navigate(`../lesson/${firstLessonId}`);
    };

    if (error) {
        if (error.message === "Access denied") {
            return (
                <ErrorPage
                    first={t("syllabus.accessDenied.title")}
                    second={t("syllabus.accessDenied.message")}
                    third={t("syllabus.accessDenied.retry")}
                />
            );
        } else {
            return (
                <ErrorPage
                    first={t("syllabus.error.title")}
                    second={t("syllabus.error.message")}
                    third={t("syllabus.error.retry")}
                />
            );
        }
    }

    if (isLoading || !course) {
        return <SyllabusSkeleton />;
    }

    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] md:border-[6px] border-gray-200">
                <CourseSidebar
                    courseData={course.data!}
                    grades={course.grades}
                />

                <div className="max-w-4xl flex-grow mx-auto p-0 pt-6 md:pr-6 md:p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <SidebarTrigger className="block min-[1000px]:hidden pl-3" />
                        <h2 className="text-xl sm:text-2xl font-bold">
                            {t("syllabus.title")}
                        </h2>
                    </div>

                    <Separator className="mb-4" />

                    <div className="w-full space-y-4">
                        {course.data!.modules.map((mod, mIndex) => {
                            const firstLessonId = mod.lessons[0]?.id;

                            return (
                                <div key={mIndex}>
                                    <Card
                                        onClick={() =>
                                            handleModuleClick(firstLessonId)
                                        }
                                        className="p-3 border bg-white cursor-pointer hover:bg-gray-50 transition"
                                    >
                                        <div className="flex justify-between items-center">
                                            <Label className="cursor-pointer text-sm sm:text-base font-semibold ml-2 hover:underline">
                                                {mIndex + 1}. {mod.title}
                                            </Label>
                                            {(() => {
                                                const gradeStr =
                                                    course.grades[
                                                        course.grades.length -
                                                            1 -
                                                            mIndex
                                                    ]?.quizGrade;
                                                const gradeNum =
                                                    parseFloat(gradeStr);

                                                const gradeColorClass =
                                                    !gradeStr
                                                        ? "text-gray-400"
                                                        : gradeNum > 70
                                                        ? "text-green-500"
                                                        : "text-red-500";

                                                return (
                                                    <span
                                                        className={`text-xs sm:text-sm mr-2 ${gradeColorClass}`}
                                                    >
                                                        {gradeStr
                                                            ? `${t(
                                                                  "syllabus.grade"
                                                              )}: ${gradeStr}`
                                                            : t(
                                                                  "syllabus.notCompleted"
                                                              )}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </Card>

                                    {mod.lessons.map((lesson, lIndex) => {
                                        const isLast =
                                            lIndex === mod.lessons.length - 1;

                                        return (
                                            <Card
                                                key={lesson.id}
                                                onClick={() =>
                                                    handleLessonClick(lesson.id)
                                                }
                                                className={`flex rounded-none items-center p-2 sm:p-3 md:p-4 border cursor-pointer hover:bg-gray-50 transition ml-4 ${
                                                    isLast
                                                        ? "rounded-b-lg"
                                                        : "rounded-none"
                                                }`}
                                            >
                                                <div className="ml-2 sm:ml-4 flex-1 min-w-0">
                                                    <Label className="cursor-pointer break-all sm:break-words text-xs md:text-sm lg:text-base font-medium line-clamp-2">
                                                        {mIndex + 1}.
                                                        {lIndex + 1}{" "}
                                                        {lesson.title}
                                                    </Label>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
