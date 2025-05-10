import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const quizData = {
    title: "Module Test 1",
    attempts: 3,
    timer: 60,
    questions: [
        {
            id: 1,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "They is students.",
                "We is students.",
                "They are students.",
                "Are they students?",
            ],
            correctAnswer: 2,
        },
        {
            id: 2,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
        {
            id: 3,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
        {
            id: 4,
            text: "Next.js Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals",
            options: [
                "She are happy. Next.js Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals",
                "She is happy. Next.js Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals Fundamentals",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
        {
            id: 5,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
        {
            id: 6,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
        {
            id: 7,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
        {
            id: 8,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
        {
            id: 9,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
        {
            id: 10,
            text: "Which sentence is correct? Select the correct option.",
            options: [
                "She are happy.",
                "She is happy.",
                "She am happy.",
                "Are she happy?",
            ],
            correctAnswer: 1,
        },
    ],
};

export function QuizAttempt() {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
        Array(quizData.questions.length).fill(-1)
    );

    const handleSelect = (questionIndex: number, optionIndex: number) => {
        setSelectedAnswers((prev) => {
            const updatedAnswers = [...prev];
            updatedAnswers[questionIndex] = optionIndex;
            return updatedAnswers;
        });
    };
    const navigate = useNavigate();

    const handleBackButton = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between px-2 sm:px-10 py-4 bg-white shadow-sm">
                <div className="flex space-x-6">
                    {/* Left: Back Button */}
                    <button
                        onClick={handleBackButton}
                        className="flex items-center text-blue-700 hover:underline space-x-1 text-sm font-semibold"
                    >
                        <ArrowLeft className="w-[18px] h-[18px]" />{" "}
                        <span>Back</span>
                    </button>

                    {/* Center: Quiz Title */}
                    <div className="">
                        <p className="text-md font-semibold text-gray-900">
                            {quizData.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                            Graded Assignment • 1h
                        </p>
                    </div>
                </div>

                {/* Right: Language & Due Date */}
                {/* <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1 text-gray-600 cursor-pointer">
                        <Globe className="w-4 h-4" />
                        <span>English</span>
                    </div>

                    <div className="text-gray-900 font-medium flex items-center space-x-1">
                        <span className="text-gray-500">Due</span>
                        <span>Feb 18, 12:59 AM +06</span>
                    </div>
                </div> */}
            </div>
            <div className="  ">
                <Separator className="mb-6" />

                {/* Quiz Questions */}
                <div className="space-y-6">
                    {quizData.questions.map((item, questionIndex) => (
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
                                            className=""
                                            value={String(optionIndex)}
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
                        </Card>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <Button className="font-bold bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}
