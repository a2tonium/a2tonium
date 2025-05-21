import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCourseDataIfEnrolled } from "@/hooks/useCourseDataIfEnrolled";
import { ErrorPage } from "@/pages/error/error";
import { useCourseContract } from "@/hooks/useCourseContract";
import { useToast } from "@/hooks/use-toast";
import { useTonConnect } from "@/hooks/useTonConnect";
import { sendAnswersToQuiz } from "@/services/course.service";

export function QuizAttempt() {
    const { quizId, courseAddress } = useParams<{
        quizId: string;
        courseAddress: string;
    }>();

    const navigate = useNavigate();
    const {
        data: course,
        error,
        isLoading,
    } = useCourseDataIfEnrolled(courseAddress);
    const { answerQuiz } = useCourseContract();
    const { address: studentAddress } = useTonConnect();

    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [errors, setErrors] = useState<number[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (course) {
            const currentModule = course.data?.modules.find(
                (m) => m.id === quizId
            );
            if (currentModule) {
                setSelectedAnswers(
                    Array(currentModule.quiz.questions.length).fill(-1)
                );
            }
        }
    }, [course, quizId]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    const handleBack = () => {
        const confirmExit = window.confirm(
            "Are you sure you want to leave? Your answers will be lost."
        );
        if (confirmExit) navigate(-1);
    };

    if (error) {
        return (
            <ErrorPage
                first={
                    error.message === "Access denied"
                        ? "Access Denied"
                        : "Course Not Found"
                }
                second={
                    error.message === "Access denied"
                        ? "You are not enrolled in this course."
                        : "We couldn't find your course."
                }
                third={
                    error.message === "Access denied"
                        ? "Please check your course list."
                        : "Please try again later."
                }
            />
        );
    }

    if (isLoading || !course) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                    <p className="text-gray-700 font-medium">Please wait</p>
                </div>
            </div>
        );
    }

    const currentModule = course.data?.modules.find((m) => m.id === quizId);

    if (!currentModule) {
        return (
            <ErrorPage
                first="Quiz Not Found"
                second="This quiz does not exist in the course."
                third="Please contact support if you think this is a mistake."
            />
        );
    }

    const questions = currentModule.quiz.questions;

    const handleSelect = (questionIndex: number, optionIndex: number) => {
        setSelectedAnswers((prev) => {
            const updated = [...prev];
            updated[questionIndex] = optionIndex;
            return updated;
        });

        // Убираем ошибку, если пользователь ответил на вопрос
        setErrors((prev) => prev.filter((e) => e !== questionIndex));
    };

    const handleSubmit = async () => {
        const missing = selectedAnswers
            .map((ans, i) => (ans === -1 ? i : -1))
            .filter((i) => i !== -1) as number[];

        if (missing.length > 0) {
            setErrors(missing);
            return;
        }

        setErrors([]);
        try {
            console.log(
                "Submitting quiz...",
                convertAnswerToString(selectedAnswers)
            );
            await sendAnswersToQuiz(
                courseAddress!,
                studentAddress,
                BigInt(quizId!),
                convertAnswerToString(selectedAnswers),
                course.data!.owner_public_key,
                answerQuiz
            );
            toast({
                title: "Successful Quiz Submission",
                description: `Wait for the teacher to check your answers.`,
                className: "bg-green-500 text-white rounded-[2vw] border-none",
            });
            navigate(-1);
        } catch (error) {
            console.error("Error creating course:", error);
            toast({
                title: "Error",
                description: "Failed to submit quiz.",
                variant: "destructive",
            });
        }
    };

    const convertAnswerToString = (answers: number[]): string => {
        return answers.map((ans) => String.fromCharCode(97 + ans)).join("");
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between px-2 sm:px-10 py-4 bg-white shadow-sm">
                <div className="flex space-x-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-blue-700 hover:underline space-x-1 text-sm font-semibold"
                    >
                        <ArrowLeft className="w-[18px] h-[18px]" />
                        <span>Back</span>
                    </button>
                    <div>
                        <p className="text-md font-semibold text-gray-900">
                            {currentModule.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                            Quiz • {questions.length} Questions
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-6">
                {questions.map((item, questionIndex) => (
                    <Card key={questionIndex} className="p-5 border-0">
                        <h3 className="text-md font-semibold text-gray-900">
                            {questionIndex + 1}. {item.text}
                        </h3>
                        <RadioGroup
                            className="mt-4 space-y-2"
                            value={
                                selectedAnswers[questionIndex] !== -1
                                    ? String(selectedAnswers[questionIndex])
                                    : ""
                            }
                            onValueChange={(value) =>
                                handleSelect(questionIndex, Number(value))
                            }
                        >
                            {item.options.map((option, optionIndex) => (
                                <Label
                                    key={optionIndex}
                                    className="flex items-center font-medium space-x-2 text-black-50 cursor-pointer"
                                >
                                    <RadioGroupItem
                                        value={String(optionIndex)}
                                    />
                                    <span>
                                        {String.fromCharCode(97 + optionIndex)}.{" "}
                                        {option}
                                    </span>
                                </Label>
                            ))}
                        </RadioGroup>
                        {errors.includes(questionIndex) && (
                            <p className="text-sm text-red-500 mt-2">
                                Please select an answer
                            </p>
                        )}
                    </Card>
                ))}
            </div>

            <Separator className="mb-6" />

            <div className="mt-8 flex justify-end">
                <Button
                    onClick={handleSubmit}
                    className="font-bold bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}
