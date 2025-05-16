import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QuizSidebar } from "@/components/quizSidebar/quizSidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { QuizSkeleton } from "@/components/quiz/quizSkeleton";
import { useCourseDataIfEnrolled } from "@/hooks/useCourseDataIfEnrolled";
import { ModuleInterfaceNew } from "@/types/courseData";
import { ErrorPage } from "@/pages/error/error";

export function Quiz() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const { courseAddress } = useParams();
    const {
        data: course,
        error,
        isLoading,
    } = useCourseDataIfEnrolled(courseAddress);

    if (error) {
        if (error.message === "Access denied") {
            return (
                <ErrorPage
                    first={"Access Denied"}
                    second={"You are not enrolled in this course."}
                    third={"Please check your course list."}
                />
            );
        } else {
            return (
                <ErrorPage
                    first={"Courses Not Found"}
                    second={"We couldn't find your courses."}
                    third={"Please try again later."}
                />
            );
        }
    }

    if (isLoading || !course) {
        return <QuizSkeleton />;
    }

    type QuizItem = {
        id: string;
        title: string;
        completed: boolean;
        score: number | null;
        totalQuestions: number;
    };

    const quizzes: QuizItem[] = course.data!.modules.map((m: ModuleInterfaceNew) => ({
        id: m.id,
        title: m.title,
        // completed: m.completed,
        completed: false,
        // score: m.score ?? null,
        score: null,
        totalQuestions: m.quiz.questions.length,
    }));

    const currentQuizIndex = quizzes.findIndex((q) => q.id === quizId);
    const currentQuiz = quizzes[currentQuizIndex];

    const goQuiz = (index: number) => navigate(`../quiz/${quizzes[index].id}`);

    // Next/Prev quiz logic
    const isFirstQuiz = currentQuizIndex === 0;
    const isLastQuiz = currentQuizIndex === quizzes.length - 1;

    const handlePrevQuiz = () => !isFirstQuiz && goQuiz(currentQuizIndex - 1);
    const handleNextQuiz = () => !isLastQuiz && goQuiz(currentQuizIndex + 1);

    const handleQuizButtonClick = () => {
        navigate(currentQuiz.completed ? `review` : `attempt`);
    };

    const sidebarPayload = {
        course: {
            courseId:
                // course.id,
                "1",
            courseTitle: course.data!.name,
        },
        quizzes,
    };

    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] md:border-[6px] border-gray-200">
                {/* Quiz Sidebar */}
                <div>
                    <QuizSidebar data={sidebarPayload} />
                </div>

                <div className="hidden md:block w-[0.1px] bg-gray-200" />

                {/* Main Content */}
                <div className="py-6 flex-grow space-y-20">
                    {/* Top row: sidebar trigger + quiz title */}
                    <div className="flex items-center mx-4">
                        <SidebarTrigger className="block min-[1000px]:hidden px-3" />
                        <h1 className="pl-3 text-lg sm:text-2xl font-semibold text-gray-800 break-all sm:break-words">
                            {currentQuiz.id}. {currentQuiz.title}
                        </h1>
                    </div>
                    {/* <Separator className="my-2" /> */}

                    <div className="w-[95%] md:w-[80%] mx-auto">
                        {/* "Assignment details" area */}
                        <div className="bg-blue-50 p-4 rounded-lg flex flex-col justify-between mb-4 ">
                            <div className="">
                                <h2 className="font-semibold mb-1">
                                    Assignment details
                                </h2>
                            </div>

                            {/* Wrap the Attempts and Button inside a flex div */}
                            <div className="flex justify-between items-center w-full space-x-20">
                                <div className="text-xs sm:text-sm text-gray-600">
                                    <div>Due: -</div>
                                    <div>Attempts: Unlimited</div>
                                </div>

                                <Button
                                    onClick={handleQuizButtonClick}
                                    variant="default"
                                    className="bg-blue-500 hover:bg-blue-600 text-white ml-4 rounded-sm"
                                >
                                    {currentQuiz.completed ? "Review" : "Start"}
                                </Button>
                            </div>
                        </div>

                        {/* "Your grade" area */}
                        <div className="border p-4 rounded-lg flex mb-4 ">
                            <div className="flex flex-col items-left">
                                <h3 className="font-semibold mb-1 text-gray-800">
                                    Your grade
                                </h3>
                                {currentQuiz.completed ? (
                                    <div className="text-sm text-gray-800">
                                        Highest score:{" "}
                                        {currentQuiz.score ?? "--"}/
                                        {currentQuiz.totalQuestions}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-600">
                                        You haven’t submitted this yet. We keep
                                        your highest score.
                                    </div>
                                )}
                                <div className="mt-2 font-bold text-xl">
                                    {currentQuiz.completed
                                        ? `${currentQuiz.score ?? "--"}/${
                                              currentQuiz.totalQuestions
                                          }`
                                        : "--"}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
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
                                <span>Previous</span>
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
                                <span>Next</span>
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
