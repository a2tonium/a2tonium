import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QuizSidebar } from "@/components/quizSidebar/quizSidebar";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { QuizSkeleton } from "@/components/quiz/quizSkeleton";
import { useCourseDataIfEnrolledWithGrades } from "@/hooks/useCourseDataIfEnrolledWithGrades";
import { ErrorPage } from "@/pages/error/error";
import { useTranslation } from "react-i18next";

export function Quiz() {
    const { t } = useTranslation();
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const { courseAddress } = useParams();

    const {
        data: course,
        error,
        isLoading,
    } = useCourseDataIfEnrolledWithGrades(courseAddress);

    if (error) {
        if (error.message === "Access denied") {
            return (
                <ErrorPage
                    first={t("quiz.accessDenied.title")}
                    second={t("quiz.accessDenied.message")}
                    third={t("quiz.accessDenied.retry")}
                />
            );
        } else {
            return (
                <ErrorPage
                    first={t("quiz.error.title")}
                    second={t("quiz.error.message")}
                    third={t("quiz.error.retry")}
                />
            );
        }
    }

    if (isLoading || !course) {
        return <QuizSkeleton />;
    }

    const quizzes = course.data!.modules.map((m, index) => {
        const reversedIndex = course.grades.length - 1 - index;
        const gradeEntry = course.grades[reversedIndex];
        const score = gradeEntry?.quizGrade
            ? parseFloat(gradeEntry.quizGrade)
            : null;

        return {
            id: m.id,
            title: m.title,
            completed: score !== null,
            score: score,
            totalQuestions: m.quiz.questions.length,
        };
    });

    const currentQuizIndex = quizzes.findIndex((q) => q.id === quizId);
    const currentQuiz = quizzes[currentQuizIndex];

    const goQuiz = (index: number) => navigate(`../quiz/${quizzes[index].id}`);
    const isFirstQuiz = currentQuizIndex === 0;
    const isLastQuiz = currentQuizIndex === quizzes.length - 1;

    const handlePrevQuiz = () => !isFirstQuiz && goQuiz(currentQuizIndex - 1);
    const handleNextQuiz = () => !isLastQuiz && goQuiz(currentQuizIndex + 1);
    const handleQuizButtonClick = () =>
        navigate(currentQuiz.completed ? `review` : `attempt`);

    const sidebarPayload = {
        course: {
            courseId: "1",
            courseTitle: course.data!.name,
        },
        quizzes,
    };

    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] md:border-[6px] border-gray-200">
                <QuizSidebar data={sidebarPayload} />
                <div className="hidden md:block w-[0.1px] bg-gray-200" />
                <div className="py-6 flex-grow space-y-20">
                    <div className="flex items-center mx-4">
                        <SidebarTrigger className="block min-[1000px]:hidden px-3" />
                        <h1 className="pl-3 text-lg sm:text-2xl font-semibold text-gray-800 break-all sm:break-words">
                            {currentQuiz.id}. {currentQuiz.title}
                        </h1>
                    </div>

                    <div className="w-[95%] md:w-[80%] mx-auto">
                        <div className="bg-blue-50 p-4 rounded-lg flex flex-col justify-between mb-4">
                            <h2 className="font-semibold mb-1">
                                {t("quiz.assignmentDetails")}
                            </h2>
                            <div className="flex justify-between items-center w-full space-x-20">
                                <div className="text-xs sm:text-sm text-gray-600">
                                    <div>{t("quiz.due")}: -</div>
                                    <div>{t("quiz.attempts")}</div>
                                </div>
                                <Button
                                    onClick={handleQuizButtonClick}
                                    variant="default"
                                    className="bg-blue-500 hover:bg-blue-600 text-white ml-4 rounded-sm"
                                >
                                    {t("quiz.start")}
                                </Button>
                            </div>
                        </div>

                        <div className="border p-4 rounded-lg flex mb-4">
                            <div className="flex flex-col items-left">
                                <h3 className="font-semibold mb-1 text-gray-800">
                                    {t("quiz.yourGrade")}
                                </h3>
                                {currentQuiz.completed ? (
                                    (() => {
                                        const correctAnswers = Math.round(
                                            (currentQuiz.score! / 100) *
                                                currentQuiz.totalQuestions
                                        );
                                        const passed = currentQuiz.score! >= 70;

                                        return (
                                            <>
                                                <div
                                                    className={`flex items-center gap-2 text-sm font-medium ${
                                                        passed
                                                            ? "text-green-600"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {passed ? (
                                                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    ) : (
                                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    )}
                                                    <span>
                                                        {t("quiz.score")}:{" "}
                                                        {correctAnswers}/
                                                        {
                                                            currentQuiz.totalQuestions
                                                        }
                                                    </span>
                                                </div>
                                                <div
                                                    className={`mt-2 font-bold text-xl ${
                                                        passed
                                                            ? "text-green-600"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {currentQuiz.score}%
                                                </div>
                                            </>
                                        );
                                    })()
                                ) : (
                                    <>
                                        <div className="text-sm text-gray-600">
                                            {t("quiz.notSubmitted")}
                                        </div>
                                        <div className="mt-2 font-bold text-xl text-gray-400">
                                            --
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between mt-6 mx-6">
                            <Button
                                onClick={handlePrevQuiz}
                                disabled={isFirstQuiz}
                                className={`rounded-2xl bg-blue-500 p-2.5 flex items-center gap-2 ${
                                    isFirstQuiz
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "hover:bg-blue-700"
                                }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>{t("quiz.previous")}</span>
                            </Button>

                            <Button
                                onClick={handleNextQuiz}
                                disabled={isLastQuiz}
                                className={`rounded-2xl bg-blue-500 p-2.5 flex items-center gap-2 ${
                                    isLastQuiz
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "hover:bg-blue-700"
                                }`}
                            >
                                <span>{t("quiz.next")}</span>
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
