import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CircleCheck, XCircle } from "lucide-react";

const quizData = {
    title: "Module Test 1",
    attempts: 3,
    latestScore: 25,
    highestScore: 37.5,
    passingScore: 70,
    timer: 60,
    questions: [
        {
            id: 1,
            question: "Which sentence is correct? Select the correct option.",
            options: [
                "They is students.",
                "We is students.",
                "They are students.",
                "Are they students?",
            ],
            correctAnswer: 2,
            selectedAnswer: 3, // User selected answer (index)
            points: "0 / 1", // Points system
        },
        {
            id: 2,
            question: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
            selectedAnswer: 1, // User selected answer (index)
            points: "1 / 1", // Full points for correct answer
        },
    ],
};

export function QuizReview() {
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between px-2 sm:px-10 py-4 bg-white shadow-sm">
                <div className="flex space-x-6">
                    {/* Back Button */}
                    <button
                        onClick={handleBackButton}
                        className="flex items-center text-blue-700 hover:underline space-x-1 text-sm font-semibold"
                    >
                        <ArrowLeft className="w-[18px] h-[18px]" />{" "}
                        <span>Back</span>
                    </button>

                    {/* Quiz Title */}
                    <div>
                        <p className="text-md font-semibold text-gray-900">
                            {quizData.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                            Graded Assignment • 1h
                        </p>
                    </div>
                </div>
            </div>
            <Separator className="mb-6" />

            {/* Grading Panel */}
            <div className=" bg-red-100 text-red-700 p-4 rounded-lg my-6">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">
                        Your grade:{" "}
                        <span className="text-red-700">
                            {quizData.highestScore}%
                        </span>
                    </div>
                    <Button className="bg-blue-600 font-semibold hover:bg-blue-700 text-white px-6 py-2">
                        ↻ Retry
                    </Button>
                </div>
                {/* Score Breakdown */}
                <div className="flex justify-start text-gray-700 text-sm space-x-4 mb-2">
                    <span>
                        <strong>Your latest:</strong> {quizData.latestScore}%
                    </span>
                    <span>
                        <strong>Your highest:</strong> {quizData.highestScore}%
                    </span>
                    <span>
                        To pass you need at least {quizData.passingScore}%. We
                        keep your highest score.
                    </span>
                </div>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-6">
                {quizData.questions.map((item, questionIndex) => {
                    const isCorrect =
                        item.selectedAnswer === item.correctAnswer;

                    return (
                        <Card key={item.id} className="p-5 border-0 relative">
                            {/* Points Display (Top Right) */}
                            <div className="absolute top-2 right-2 px-2 py-1 bg-gray-100 rounded-lg text-gray-700 text-sm">
                                {item.points} point
                                {item.points !== "1" ? "s" : ""}
                            </div>

                            {/* Question Text */}
                            <h3 className="text-md font-semibold text-gray-900">
                                {questionIndex + 1}. {item.question}
                            </h3>

                            {/* Options */}
                            <RadioGroup className="mt-4 space-y-2">
                                {item.options.map((option, optionIndex) => (
                                    <Label
                                        key={optionIndex}
                                        className={`flex items-center font-medium space-x-2 cursor-pointer text-gray-700`}
                                    >
                                        <RadioGroupItem
                                            className={`border-gray-900 text-gray-900 `}
                                            value={String(optionIndex)}
                                            checked={
                                                item.selectedAnswer ===
                                                optionIndex
                                            } // This makes sure the selected option stays checked
                                            disabled
                                        />
                                        <span>
                                            {String.fromCharCode(
                                                97 + optionIndex
                                            )}
                                            . {option}
                                        </span>
                                    </Label>
                                ))}
                            </RadioGroup>

                            {/* Correct / Incorrect Feedback */}
                            <div
                                className={`mt-4 p-3 rounded-lg ${
                                    isCorrect
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                <div className="flex items-center space-x-2 font-semibold">
                                    {isCorrect ? (
                                        <CircleCheck className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span>
                                        {isCorrect ? "Correct!" : "Incorrect!"}
                                    </span>
                                </div>
                                <p className="text-sm mt-1">
                                    {isCorrect
                                        ? `The answer is: ${
                                              item.options[item.correctAnswer]
                                          }`
                                        : `The correct answer was: ${
                                              item.options[item.correctAnswer]
                                          }`}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
                <Button className="font-bold bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Finish Review
                </Button>
            </div>
        </div>
    );
}
