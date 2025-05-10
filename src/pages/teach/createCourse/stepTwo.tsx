import { useEffect, useState } from "react";
import { z } from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CirclePlus, Check, Search } from "lucide-react";
import { CourseDataInterface, VideoCheckState } from "@/types/courseData";
import {
    checkYouTubeVideo,
    extractYoutubeVideoId,
} from "@/components/createCourse/videoExistsLogic";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { VideoPreviewDialog } from "@/components/createCourse/videoPreviewDialog";

// 1) Валидация урока
const lessonSchema = z.object({
    title: z.string().min(5, "Lesson title must be at least 5 characters"),
    videoId: z
        .string()
        .url("Must be a valid YouTube link")
        .refine(async (url) => await checkYouTubeVideo(url), {
            message: "YouTube video does not exist",
        }),
});

// 2) Валидация модуля
const moduleSchema = z.object({
    title: z.string().min(5, "Module title must be at least 5 characters"),
    lessons: z
        .array(lessonSchema)
        .min(1, "Must have at least 1 lesson")
        .max(10, "Max 10 lessons in one module"),
});

// 3) Валидация шагa Two
const stepTwoSchema = z.object({
    modules: z
        .array(moduleSchema)
        .min(1, "You must have at least 1 module")
        .max(10, "You cannot have more than 10 modules"),
});

// Типы пропсов
interface StepTwoProps {
    courseData: CourseDataInterface;
    setCourseData: React.Dispatch<React.SetStateAction<CourseDataInterface>>;
    setValidationStatus: React.Dispatch<
        React.SetStateAction<{
            stepOne: boolean;
            stepTwo: boolean;
            stepThree: boolean;
            stepFour: boolean;
        }>
    >;
    showErrors: boolean;
    videoCheckState: VideoCheckState;
    setVideoCheckState: React.Dispatch<React.SetStateAction<VideoCheckState>>;

    // Логика табов для модулей
    activeModuleIndex: number;
    setActiveModuleIndex: (index: number) => void;
}

export function StepTwo({
    courseData,
    setCourseData,
    setValidationStatus,
    showErrors,
    activeModuleIndex,
    setActiveModuleIndex,
    videoCheckState,
    setVideoCheckState
}: StepTwoProps) {
    // Ошибки вида errors[moduleIndex][lessonIndex] = { title?: string; videoUrl?: string }
    const [errors, setErrors] = useState<
        Record<
            number,
            {
                moduleTitle?: string;
                lessons?: Record<number, { title?: string; videoUrl?: string }>;
            }
        >
    >({});

    const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);

    useEffect(() => {
        const validate = async () => {
            const result = await stepTwoSchema.safeParseAsync({
                modules: courseData.modules,
            });

            if (!result.success) {
                const tempErrors: Record<
                    number,
                    {
                        moduleTitle?: string;
                        lessons?: Record<
                            number,
                            { title?: string; videoUrl?: string }
                        >;
                    }
                > = {};

                for (const issue of result.error.issues) {
                    if (issue.path[0] === "modules") {
                        const moduleIndex = Number(issue.path[1]);
                        if (Number.isNaN(moduleIndex)) continue;

                        if (!tempErrors[moduleIndex]) {
                            tempErrors[moduleIndex] = { lessons: {} };
                        }

                        if (issue.path[2] === "title") {
                            tempErrors[moduleIndex].moduleTitle = issue.message;
                        }

                        if (issue.path[2] === "lessons") {
                            const lessonIndex = Number(issue.path[3]);
                            if (!tempErrors[moduleIndex].lessons) {
                                tempErrors[moduleIndex].lessons = {};
                            }
                            if (
                                !tempErrors[moduleIndex].lessons![lessonIndex]
                            ) {
                                tempErrors[moduleIndex].lessons![lessonIndex] =
                                    {};
                            }

                            if (issue.path[4] === "title") {
                                tempErrors[moduleIndex].lessons![
                                    lessonIndex
                                ].title = issue.message;
                            } else if (issue.path[4] === "videoId") {
                                tempErrors[moduleIndex].lessons![
                                    lessonIndex
                                ].videoUrl = issue.message;
                            }
                        }
                    }
                }

                setErrors(tempErrors);
                setValidationStatus((prev) => ({ ...prev, stepTwo: false }));
            } else {
                setErrors({});
                setValidationStatus((prev) => ({ ...prev, stepTwo: true }));
            }
        };

        (async () => {
            await validate();
        })();
    }, [courseData, setValidationStatus]);

    const openDialogWithVideo = (videoId: string) => {
        const id = extractYoutubeVideoId(videoId);
        setPreviewVideoId(id);
    };

    // Добавить модуль
    const handleAddModule = () => {
        if (courseData.modules.length >= 10) return;
        setCourseData((prev) => ({
            ...prev,
            modules: [
                ...prev.modules,
                {
                    id: "",
                    title: `Module ${prev.modules.length + 1}`,
                    lessons: [{ id: "", title: "", videoId: "" }],
                    quiz: {
                        correct_answers: "aaaaa",
                        questions: Array(5)
                            .fill(null)
                            .map(() => ({
                                id: "",
                                text: "",
                                options: ["", ""],
                            })) as Array<{
                            id: string;
                            text: string;
                            options: string[];
                        }>,
                    },
                },
            ],
        }));
        setActiveModuleIndex(courseData.modules.length); // переходим на новую вкладку
    };

    const handleRemoveModule = (index: number) => {
        const updated = [...courseData.modules];
        updated.splice(index, 1);
        setCourseData((prev) => ({
            ...prev,
            modules: updated,
        }));
        setActiveModuleIndex(Math.max(0, index - 1));
    };

    const handleModuleTitleChange = (index: number, value: string) => {
        const updated = [...courseData.modules];
        updated[index].title = value;
        setCourseData((prev) => ({ ...prev, modules: updated }));
    };

    // Добавить/удалить урок
    const handleAddLesson = (moduleIndex: number) => {
        const updated = [...courseData.modules];
        if (updated[moduleIndex].lessons.length >= 10) return;
        updated[moduleIndex].lessons.push({ id: "", title: "", videoId: "" });
        setCourseData((prev) => ({ ...prev, modules: updated }));
    };

    const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
        const updated = [...courseData.modules];
        updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter(
            (_, i) => i !== lessonIndex
        );
        setCourseData((prev) => ({ ...prev, modules: updated }));
    };

    const handleLessonFieldChange = async (
        moduleIndex: number,
        lessonIndex: number,
        field: "title" | "videoId",
        value: string
    ) => {
        const updated = [...courseData.modules];
        updated[moduleIndex].lessons[lessonIndex] = {
            ...updated[moduleIndex].lessons[lessonIndex],
            [field]: value,
        };
        setCourseData((prev) => ({ ...prev, modules: updated }));

        if (field === "videoId") {
            const current = videoCheckState?.[moduleIndex]?.[lessonIndex];
            if (current?.lastChecked === value) return;

            setVideoCheckState((prev) => ({
                ...prev,
                [moduleIndex]: {
                    ...prev[moduleIndex],
                    [lessonIndex]: {
                        isChecking: true,
                        isValid: false,
                        lastChecked: value,
                    },
                },
            }));

            // Проверка только одного видео
            const isValid = await checkYouTubeVideo(value);
            setVideoCheckState((prev) => ({
                ...prev,
                [moduleIndex]: {
                    ...prev[moduleIndex],
                    [lessonIndex]: {
                        isChecking: false,
                        isValid,
                        lastChecked: value,
                    },
                },
            }));

            // Обновление ошибок по видео
            setErrors((prev) => ({
                ...prev,
                [moduleIndex]: {
                    ...prev[moduleIndex],
                    lessons: {
                        ...prev[moduleIndex]?.lessons,
                        [lessonIndex]: {
                            ...prev[moduleIndex]?.lessons?.[lessonIndex],
                            videoUrl: isValid
                                ? undefined
                                : "YouTube video does not exist",
                        },
                    },
                },
            }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Course Modules</h2>
                <Button
                    onClick={handleAddModule}
                    type="button"
                    variant="outline"
                    className="gap-1.5 p-2.5 flex items-center border-blue-500 text-blue-500 
          hover:border-blue-700 hover:text-blue-700 transition-colors duration-200 rounded-2xl"
                    disabled={courseData.modules.length >= 10}
                >
                    <CirclePlus style={{ width: "20px", height: "20px" }} />
                    <span className="font-semibold">Add Module</span>
                </Button>
            </div>

            {/* Tabs для переключения между модулями */}
            <Tabs
                defaultValue="module-0"
                value={`module-${activeModuleIndex}`}
                onValueChange={(val) => {
                    const i = parseInt(val.split("-")[1], 10);
                    setActiveModuleIndex(i);
                }}
            >
                <TabsList className="py-4 bg-white w-full flex justify-start">
                    <ScrollArea>
                        <div className="flex space-x-0">
                            {courseData.modules.map((_, index) => {
                                const moduleHasError = !!errors[index];

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center border rounded-t-2xl"
                                    >
                                        <TabsTrigger
                                            className={`rounded-t-2xl transition-colors duration-200 px-3 py-1 ${
                                                moduleHasError && showErrors
                                                    ? "text-red-500 border-red-500"
                                                    : "text-gray-900 border-gray-300"
                                            }`}
                                            value={`module-${index}`}
                                        >
                                            <span className="mr-1">
                                                {`Module ${index + 1}`}
                                            </span>

                                            {courseData.modules.length > 1 && (
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // чтобы не переключить вкладку при удалении
                                                        handleRemoveModule(
                                                            index
                                                        );
                                                    }}
                                                    variant="ghost"
                                                    className="w-5 h-5 p-0"
                                                    type="button"
                                                >
                                                    <X className="w-4 h-4 text-red-500" />
                                                </Button>
                                            )}
                                        </TabsTrigger>
                                    </div>
                                );
                            })}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </TabsList>

                {courseData.modules.map((mod, modIndex) => (
                    <TabsContent key={modIndex} value={`module-${modIndex}`}>
                        <div className="space-y-4 p-4 rounded-xl relative">
                            {/* Название модуля */}
                            <div className="mb-2">
                                <Label>Module Title</Label>
                                <Input
                                    value={mod.title}
                                    onChange={(e) =>
                                        handleModuleTitleChange(
                                            modIndex,
                                            e.target.value
                                        )
                                    }
                                    maxLength={64}
                                    className={`rounded-2xl mt-1 ${
                                        showErrors &&
                                        errors[modIndex]?.moduleTitle
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {showErrors &&
                                    errors[modIndex]?.moduleTitle && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors[modIndex]?.moduleTitle}
                                        </p>
                                    )}
                                <div className="text-right text-gray-400 text-xs">
                                    {mod.title.length}/64
                                </div>
                            </div>

                            {/* Уроки */}
                            <div className="mt-4 space-y-3">
                                <h3 className="font-medium">
                                    Lessons in this Module
                                </h3>
                                {mod.lessons.map((lesson, lessonIndex) => (
                                    <div
                                        key={lessonIndex}
                                        className="p-3 border rounded-xl bg-gray-50 relative"
                                    >
                                        {/* Кнопка удаления урока */}
                                        {mod.lessons.length > 1 && (
                                            <Button
                                                onClick={() =>
                                                    handleRemoveLesson(
                                                        modIndex,
                                                        lessonIndex
                                                    )
                                                }
                                                type="button"
                                                variant="ghost"
                                                className="w-6 h-6 p-1 absolute top-2 right-2 text-gray-500 hover:bg-white-500 hover:text-red-500 bg-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}

                                        {/* Lesson Title */}
                                        <div className="mb-2">
                                            <Label>
                                                Lesson Title {lessonIndex + 1}
                                            </Label>
                                            <Input
                                                value={lesson.title}
                                                onChange={(e) =>
                                                    handleLessonFieldChange(
                                                        modIndex,
                                                        lessonIndex,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter lesson title"
                                                maxLength={120}
                                                className="rounded-2xl mt-1"
                                            />
                                            {showErrors &&
                                                errors[modIndex]?.lessons?.[
                                                    lessonIndex
                                                ]?.title && (
                                                    <p className="text-red-500 text-xs">
                                                        {errors[modIndex]
                                                            ?.lessons?.[
                                                            lessonIndex
                                                        ]?.title || ""}
                                                    </p>
                                                )}
                                            <div className="text-right text-gray-400 text-xs">
                                                {lesson.title.length}/120
                                            </div>
                                        </div>

                                        {/* Lesson Video URL */}
                                        <div>
                                            <Label>YouTube URL</Label>
                                            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 space-y-2 md:space-y-0">
                                                <Input
                                                    value={lesson.videoId}
                                                    onChange={(e) =>
                                                        handleLessonFieldChange(
                                                            modIndex,
                                                            lessonIndex,
                                                            "videoId",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="https://youtube.com/..."
                                                    className="rounded-2xl mt-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        openDialogWithVideo(
                                                            lesson.videoId
                                                        )
                                                    }
                                                    className="gap-1.5 flex items-center border-blue-500 text-blue-500 
        hover:border-blue-700 hover:text-blue-700 transition-colors duration-200 rounded-2xl"
                                                    disabled={
                                                        !lesson.videoId ||
                                                        videoCheckState?.[
                                                            modIndex
                                                        ]?.[lessonIndex]
                                                            ?.isChecking ||
                                                        !videoCheckState?.[
                                                            modIndex
                                                        ]?.[lessonIndex]
                                                            ?.isValid
                                                    }
                                                >
                                                    <span className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                                                        Preview
                                                        {videoCheckState?.[
                                                            modIndex
                                                        ]?.[lessonIndex]
                                                            ?.isChecking ? (
                                                            <Spinner className="w-4 h-4 text-blue-500" />
                                                        ) : !lesson.videoId ? (
                                                            <Search className="w-4 h-4 text-blue-500" />
                                                        ) : videoCheckState?.[
                                                              modIndex
                                                          ]?.[lessonIndex]
                                                              ?.isValid ? (
                                                            <Check className="w-4 h-4 text-blue-500" />
                                                        ) : (
                                                            <X className="w-4 h-4 text-blue-500" />
                                                        )}
                                                    </span>
                                                </Button>
                                            </div>
                                            {showErrors &&
                                                errors[modIndex]?.lessons?.[
                                                    lessonIndex
                                                ]?.videoUrl && (
                                                    <p className="text-red-500 text-xs">
                                                        {
                                                            errors[modIndex]
                                                                ?.lessons?.[
                                                                lessonIndex
                                                            ].videoUrl
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                ))}

                                {/* Кнопка добавления урока */}
                                <Button
                                    onClick={() => handleAddLesson(modIndex)}
                                    variant="outline"
                                    type="button"
                                    className="gap-1.5 p-2.5 flex font-semibold items-center border-blue-500 text-blue-500 
                    hover:border-blue-700 hover:text-blue-700 transition-colors duration-200 rounded-2xl"
                                    disabled={mod.lessons.length >= 10}
                                >
                                    <CirclePlus
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                        }}
                                    />
                                    <span>Add Lesson</span>
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
            <VideoPreviewDialog
                videoId={previewVideoId ?? ""}
                open={!!previewVideoId}
                onClose={() => setPreviewVideoId(null)}
            />
        </div>
    );
}
