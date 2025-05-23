import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, CirclePlus } from "lucide-react";
import { CourseCreationInterface } from "@/types/course.types";
import { useTranslation } from "react-i18next";

interface StepThreeProps {
    courseData: CourseCreationInterface;
    setCourseData: React.Dispatch<
        React.SetStateAction<CourseCreationInterface>
    >;
    setValidationStatus: React.Dispatch<
        React.SetStateAction<{
            stepOne: boolean;
            stepTwo: boolean;
            stepThree: boolean;
            stepFour: boolean;
        }>
    >;
    showErrors: boolean;
    activeQuizIndex: number;
    setActiveQuizIndex: (idx: number) => void;
}

export function StepThree({
    courseData,
    setCourseData,
    setValidationStatus,
    showErrors,
    activeQuizIndex,
    setActiveQuizIndex,
}: StepThreeProps) {
    const { t } = useTranslation();
    // Храним ошибки в виде errorMessages[moduleIndex] -> { questions: ... }
    const [errorMessages, setErrorMessages] = useState<
        Record<
            number,
            {
                questions?: Record<
                    number,
                    {
                        questionText?: string;
                        options?: string[];
                        correctAnswer?: string;
                    }
                >;
            }
        >
    >({});

    const quizModules = courseData.modules;

    const singleQuizSchema = z.object({
        questions: z
            .array(
                z.object({
                    text: z.string().min(5, t("stepThree.error.questionText")),
                    options: z
                        .array(
                            z.string().min(1, t("stepThree.error.optionEmpty"))
                        )
                        .min(2, t("stepThree.error.optionMin")),
                })
            )
            .min(1, t("stepThree.error.questionsRequired")),
    });

    const stepThreeSchema = z.object({
        modules: z.array(
            z.object({
                quiz: singleQuizSchema.optional(),
            })
        ),
    });

    useEffect(() => {
        if (quizModules.length === 0) {
            setValidationStatus((prev) => ({ ...prev, stepThree: true }));
            setErrorMessages({});
            return;
        }

        const validate = () => {
            const partial = {
                modules: courseData.modules.map((mod) => {
                    return {
                        hasQuiz: true,
                        quiz: mod.quiz,
                    };
                }),
            };

            const result = stepThreeSchema.safeParse(partial);

            if (!result.success) {
                const tempErrors: Record<
                    number,
                    {
                        questions?: Record<
                            number,
                            {
                                questionText?: string;
                                options?: string[];
                                correctAnswer?: string;
                            }
                        >;
                    }
                > = {};

                for (const issue of result.error.issues) {
                    if (issue.path[0] === "modules") {
                        const moduleIndex = Number(issue.path[1]);
                        if (Number.isNaN(moduleIndex)) continue;

                        // quiz-level errors
                        if (!tempErrors[moduleIndex]) {
                            tempErrors[moduleIndex] = {};
                        }
                        if (issue.path[2] === "quiz") {
                            if (issue.path[3] === "questions") {
                                const qIdx = Number(issue.path[4]);
                                if (!tempErrors[moduleIndex].questions) {
                                    tempErrors[moduleIndex].questions = {};
                                }
                                if (!tempErrors[moduleIndex].questions![qIdx]) {
                                    tempErrors[moduleIndex].questions![qIdx] =
                                        {};
                                }

                                if (issue.path[5] === "text") {
                                    tempErrors[moduleIndex].questions![
                                        qIdx
                                    ].questionText = issue.message;
                                } else if (issue.path[5] === "options") {
                                    const optIndex = Number(issue.path[6]);
                                    if (
                                        !tempErrors[moduleIndex].questions![
                                            qIdx
                                        ].options
                                    ) {
                                        tempErrors[moduleIndex].questions![
                                            qIdx
                                        ].options = [];
                                    }
                                    tempErrors[moduleIndex].questions![
                                        qIdx
                                    ].options![optIndex] = issue.message;
                                }
                            }
                        }
                    }
                }

                setErrorMessages(tempErrors);
                setValidationStatus((prev) => ({ ...prev, stepThree: false }));
            } else {
                setErrorMessages({});
                setValidationStatus((prev) => ({ ...prev, stepThree: true }));
            }
        };

        validate();
    }, [courseData, quizModules, setValidationStatus]);

    if (quizModules.length === 0) {
        return (
            <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-500">
                    {t("stepThree.noQuizzes")}
                </p>
            </div>
        );
    }

    const moduleIndexesWithQuiz = courseData.modules.map((_, i) => i);

    const currentModuleIndex = moduleIndexesWithQuiz[activeQuizIndex];

    const mod = courseData.modules[currentModuleIndex];

    if (!mod.quiz) {
        mod.quiz = { questions: [], correct_answers: "" };
    }

    const handleAddQuestion = () => {
        const updated = { ...courseData };
        const quiz = updated.modules[currentModuleIndex].quiz;

        if (!quiz) {
            updated.modules[currentModuleIndex].quiz = {
                correct_answers: "a",
                questions: [
                    {
                        id: "1",
                        text: "",
                        options: ["", ""],
                    },
                ],
            };
        } else {
            quiz.questions.push({
                id: quiz.questions.length.toString(),
                text: "",
                options: ["", ""],
            });

            quiz.correct_answers += "a";
        }

        setCourseData(updated);
    };

    const handleRemoveQuestion = (qIndex: number) => {
        const updated = { ...courseData };
        const quiz = updated.modules[currentModuleIndex].quiz!;
        quiz.questions = quiz.questions.filter((_, i) => i !== qIndex);
        setCourseData(updated);
    };

    const handleQuestionTextChange = (qIndex: number, text: string) => {
        const updated = { ...courseData };
        const quiz = updated.modules[currentModuleIndex].quiz!;
        quiz.questions[qIndex].text = text;
        setCourseData(updated);
    };

    const handleCorrectAnswerChange = (qIndex: number, optIndex: number) => {
        const updated = { ...courseData };

        const currentQuiz = updated.modules[currentModuleIndex].quiz;

        if (!currentQuiz) return;

        const correctAnswersArray = currentQuiz.correct_answers.split("");

        const optionLetter = String.fromCharCode(97 + optIndex); // 97 = "a"

        while (correctAnswersArray.length <= qIndex) {
            correctAnswersArray.push("a");
        }

        correctAnswersArray[qIndex] = optionLetter;

        currentQuiz.correct_answers = correctAnswersArray.join("");

        setCourseData(updated);
    };

    const handleOptionChange = (
        qIndex: number,
        optIndex: number,
        value: string
    ) => {
        const updated = { ...courseData };
        updated.modules[currentModuleIndex].quiz!.questions[qIndex].options[
            optIndex
        ] = value;
        setCourseData(updated);
    };

    const handleRemoveOption = (qIndex: number, optIndex: number) => {
        const updated = { ...courseData };
        const module = updated.modules[currentModuleIndex];
        const question = module.quiz.questions[qIndex];
        const quiz = module.quiz;

        question.options.splice(optIndex, 1);

        const correctAnswersArray = quiz.correct_answers.split("");

        if (correctAnswersArray.length > qIndex) {
            const correctLetter = correctAnswersArray[qIndex];
            const correctIndex = correctLetter.charCodeAt(0) - 97;

            if (correctIndex === optIndex) {
                correctAnswersArray[qIndex] = "a";
            } else if (correctIndex > optIndex) {
                correctAnswersArray[qIndex] = String.fromCharCode(
                    97 + (correctIndex - 1)
                );
            }
        }

        quiz.correct_answers = correctAnswersArray.join("");

        setCourseData(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                    {t("stepThree.title")}
                </h2>
            </div>

            <Tabs
                defaultValue="quiz-0"
                value={`quiz-${activeQuizIndex}`}
                onValueChange={(val) => {
                    setActiveQuizIndex(parseInt(val.split("-")[1], 10));
                }}
            >
                <TabsList className="py-6 rounded-t-2xl bg-white w-full flex justify-start">
                    <ScrollArea className="">
                        <div className="flex space-x-0">
                            {moduleIndexesWithQuiz.map((mIndex, tabIndex) => {
                                const hasErr = !!errorMessages[mIndex];

                                return (
                                    <div
                                        key={mIndex}
                                        className="flex items-center border rounded-t-2xl"
                                    >
                                        <TabsTrigger
                                            className={`rounded-t-2xl transition-colors duration-200 px-3 py-1 ${
                                                hasErr && showErrors
                                                    ? "text-red-500 border-red-500"
                                                    : "text-gray-900 border-gray-300"
                                            }`}
                                            value={`quiz-${tabIndex}`}
                                        >
                                            {`${t("stepThree.moduleTest")} ${
                                                tabIndex + 1
                                            }`}
                                        </TabsTrigger>
                                    </div>
                                );
                            })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </TabsList>

                {moduleIndexesWithQuiz.map((mIndex, tabIndex) => {
                    const moduleErr = errorMessages[mIndex] || {};
                    const quiz = courseData.modules[mIndex].quiz;
                    if (!quiz) {
                        courseData.modules[mIndex].quiz = {
                            correct_answers: "",
                            questions: [],
                        };
                    }
                    const qz = courseData.modules[mIndex].quiz!;

                    return (
                        <TabsContent key={mIndex} value={`quiz-${tabIndex}`}>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">
                                    {`${t("stepThree.moduleTest")} ${
                                        tabIndex + 1
                                    }`}
                                </h3>

                                {/* QUESTIONS */}
                                {qz.questions.map((question, qIndex) => {
                                    const qErr =
                                        moduleErr.questions?.[qIndex] || {};
                                    return (
                                        <div
                                            key={qIndex}
                                            className="p-4 border rounded-xl bg-gray-50 space-y-3 relative"
                                        >
                                            {qz.questions.length > 5 && (
                                                <Button
                                                    onClick={() =>
                                                        handleRemoveQuestion(
                                                            qIndex
                                                        )
                                                    }
                                                    className="w-6 h-6 p-1 absolute top-3 right-3 bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-gray-50 transition"
                                                    type="button"
                                                >
                                                    <X className="w-5 h-5" />
                                                </Button>
                                            )}

                                            <div>
                                                <Label>{`${t(
                                                    "stepThree.question"
                                                )} ${qIndex + 1}`}</Label>
                                            </div>

                                            {/* questionText */}
                                            <div className="space-y-1">
                                                <Textarea
                                                    value={question.text}
                                                    onChange={(e) =>
                                                        handleQuestionTextChange(
                                                            qIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={t(
                                                        "stepThree.enterQuestionText"
                                                    )}
                                                    className="rounded-2xl"
                                                    maxLength={512}
                                                />
                                                <div className="flex justify-between">
                                                    <div>
                                                        {showErrors &&
                                                            qErr.questionText && (
                                                                <p className="text-red-500 text-xs">
                                                                    {
                                                                        qErr.questionText
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                    <div className="text-gray-500 text-xs mt-1 text-right">
                                                        <span>
                                                            {
                                                                question.text
                                                                    .length
                                                            }
                                                            /512
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Options */}
                                            {question.options.map(
                                                (optVal, optIndex) => {
                                                    const optErr =
                                                        qErr.options?.[
                                                            optIndex
                                                        ];
                                                    return (
                                                        <div key={optIndex}>
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    name={`correct-answer-${qIndex}`}
                                                                    checked={
                                                                        courseData
                                                                            .modules[
                                                                            mIndex
                                                                        ].quiz
                                                                            .correct_answers[
                                                                            qIndex
                                                                        ] ===
                                                                        String.fromCharCode(
                                                                            97 +
                                                                                optIndex
                                                                        )
                                                                    }
                                                                    onChange={() =>
                                                                        handleCorrectAnswerChange(
                                                                            qIndex,
                                                                            optIndex
                                                                        )
                                                                    }
                                                                    className="mr-1"
                                                                />
                                                                <Label className="block text-sm font-medium">
                                                                    {String.fromCharCode(
                                                                        97 +
                                                                            optIndex
                                                                    )}
                                                                    .
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        optVal
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleOptionChange(
                                                                            qIndex,
                                                                            optIndex,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder={`${t(
                                                                        "stepThree.option"
                                                                    )} ${String.fromCharCode(
                                                                        65 +
                                                                            optIndex
                                                                    )}`}
                                                                    maxLength={
                                                                        256
                                                                    }
                                                                    className="rounded-2xl"
                                                                />
                                                                {question
                                                                    .options
                                                                    .length >
                                                                    2 && (
                                                                    <Button
                                                                        onClick={() =>
                                                                            handleRemoveOption(
                                                                                qIndex,
                                                                                optIndex
                                                                            )
                                                                        }
                                                                        type="button"
                                                                        variant="ghost"
                                                                        className="p-1 text-gray-500 hover:text-red-500"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            <div>
                                                                {showErrors &&
                                                                    optErr && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                optErr
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}

                                            {/* Add Option */}
                                            {question.options.length < 7 && (
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name={`correct-answer-${qIndex}`}
                                                        checked={false}
                                                        onChange={() => {}}
                                                        className="mr-1 ml-[0.1rem]"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="link"
                                                        onClick={() => {
                                                            const updated = {
                                                                ...courseData,
                                                            };
                                                            updated.modules[
                                                                mIndex
                                                            ].quiz!.questions[
                                                                qIndex
                                                            ].options.push("");
                                                            setCourseData(
                                                                updated
                                                            );
                                                        }}
                                                        className="pt-0 pb-2 mt-2 text-gray-500"
                                                    >
                                                        {t(
                                                            "stepThree.addOption"
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Add Question */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddQuestion}
                                    className="p-2.5 mt-4 gap-1.5 flex items-center border-blue-500 text-blue-500 
                    hover:border-blue-700 hover:text-blue-700 transition-colors duration-200 rounded-2xl"
                                    disabled={qz.questions.length >= 20}
                                >
                                    <CirclePlus
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                        }}
                                    />
                                    <span className="font-semibold">
                                        {t("stepThree.addQuestion")}
                                    </span>
                                </Button>

                                <div className="ml-2 flex justify-between text-gray-500 text-xs mt-1">
                                    <span>
                                        {t("stepThree.chooseRightAnswer")}
                                    </span>
                                </div>
                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}
