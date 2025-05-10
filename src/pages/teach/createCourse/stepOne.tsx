import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CourseDataInterface } from "@/types/courseData";
import { CategorySelect } from "@/components/createCourse/categorySelect";
import { ImageDropzone } from "@/components/createCourse/imageDropzone";
import { checkYouTubeVideo } from "@/components/createCourse/videoExistsLogic";

interface StepOneProps {
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
}

const schema = z.object({
    image: z.string().min(1, "Logo is required"),
    name: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(5, "Description must be at least 5 characters"),
    video: z.preprocess(
        (val) => {
            if (typeof val === "string" && val.trim() === "") return undefined;
            return val;
        },
        z
            .string()
            .url("Must be a valid YouTube link")
            .refine(
                async (url) => {
                    if (!url) return true; // skip if undefined
                    return await checkYouTubeVideo(url);
                },
                { message: "YouTube video does not exist" }
            )
            .optional()
    ),

    attributes: z.object({
        workload: z.string().min(5, "Workload description required"),
        duration: z.string().min(5, "Duration description required"),
        learn: z.string().min(5, "This field is required"),
        about: z.string().min(5, "About section must have details"),
        gains: z.string().min(5, "This field is required"),
        requirements: z.string().min(5, "Specify any requirements"),
        category: z.array(z.string()).min(1, "Select at least one category"),
        level: z.enum(["Beginner", "Intermediate", "Expert"], {
            errorMap: () => ({ message: "Please select a valid level" }),
        }),
        language: z.enum(
            [
                "English",
                "Russian",
                "Kazakh",
                "Spanish",
                "German",
                "French",
                "Chinese",
                "Japanese",
                "Arabic",
                "Turkish",
                "Hindi",
                "Portuguese",
                "Italian",
            ],
            {
                errorMap: () => ({ message: "Please select a language" }),
            }
        ),
    }),
});

export function StepOne({
    courseData,
    setCourseData,
    setValidationStatus,
    showErrors,
}: StepOneProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const validate = async () => {
            const result = await schema.safeParseAsync(courseData);
            if (!result.success) {
                const errorMessages: Record<string, string> = {};

                result.error.issues.forEach((issue) => {
                    if (
                        issue.path[0] === "attributes" &&
                        typeof issue.path[1] === "string"
                    ) {
                        // Ошибки внутри attributes
                        errorMessages[issue.path[1]] = issue.message;
                    } else if (typeof issue.path[0] === "string") {
                        // Ошибки на первом уровне
                        errorMessages[issue.path[0]] = issue.message;
                    }
                });

                setErrors(errorMessages);
                setValidationStatus((prev) => ({ ...prev, stepOne: false }));
            } else {
                setErrors({});
                setValidationStatus((prev) => ({ ...prev, stepOne: true }));
            }
        };
        validate();
    }, [courseData, setValidationStatus]);

    const handleInputChange = (field: string, value: string) => {
        setCourseData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAttributeInputChange = (field: string, value: string) => {
        setCourseData((prev) => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [field]: value,
            },
        }));
    };

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Course Information
            </h2>
            {/* Logo Upload */}
            <div>
                <div className="flex items-center mb-4 gap-5">
                    <div>
                        <Label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium"
                        >
                            Course Logo
                        </Label>
                        <ImageDropzone
                            value={courseData.image}
                            onChange={(base64) =>
                                setCourseData((prev) => ({
                                    ...prev,
                                    image: base64,
                                }))
                            }
                        />
                    </div>
                    {/* Cover Image Upload */}
                    <div>
                        <Label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium"
                        >
                            Cover Image (optional)
                        </Label>
                        <ImageDropzone
                            value={courseData.cover_image}
                            onChange={(base64) =>
                                setCourseData((prev) => ({
                                    ...prev,
                                    cover_image: base64,
                                }))
                            }
                        />
                        {showErrors && errors.image && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.cover_image}
                            </p>
                        )}
                    </div>
                </div>
                {showErrors && errors.image && (
                    <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
            </div>

            {/* Title */}
            <div className="pt-3">
                <Label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium"
                >
                    Title
                </Label>
                <Input
                    id="title"
                    className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter course title"
                    value={courseData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    maxLength={64}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.name && (
                            <p className="text-red-500 text-xs">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.name.length}/64</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <Label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium"
                >
                    Description
                </Label>
                <Textarea
                    id="description"
                    className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter a short description of the course"
                    value={courseData.description}
                    onChange={(e) =>
                        handleInputChange("description", e.target.value)
                    }
                    maxLength={512}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.description && (
                            <p className="text-red-500 text-xs">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.description.length}/512</span>
                    </div>
                </div>
            </div>
            <div>
                <Label
                    htmlFor="promo-video"
                    className="mb-2 block text-sm font-medium"
                >
                    Promo Video URL(optional)
                </Label>
                <Input
                    value={courseData.video}
                    onChange={(e) => handleInputChange("video", e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="rounded-2xl mt-1"
                />
                {showErrors && errors.video && (
                    <p className="text-red-500 text-xs">{errors.video}</p>
                )}
            </div>
            {/* Course Category */}
            <div className="pb-4 space-y-1">
                <Label>Course Category</Label>
                <CategorySelect
                    selected={courseData.attributes.category}
                    setSelected={(newCategories) =>
                        setCourseData((prev) => ({
                            ...prev,
                            attributes: {
                                ...prev.attributes,
                                category: newCategories,
                            },
                        }))
                    }
                />
                {showErrors && errors.category && (
                    <p className="text-red-500 text-xs">{errors.category}</p>
                )}
            </div>
            {/* Course Level */}
            <div className="pb-4 w-[80%] sm:w-[30%] md:w-[20%]">
                <Label>Course Level</Label>
                <Select
                    value={courseData.attributes.level}
                    onValueChange={(val) =>
                        handleAttributeInputChange("level", val)
                    }
                >
                    <SelectTrigger className="mt-1 rounded-2xl">
                        <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                            Intermediate
                        </SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                </Select>
                {showErrors && !courseData.attributes.level && (
                    <p className="text-red-500 text-sm mt-1">
                        Level is required
                    </p>
                )}
            </div>

            {/* Course Language */}
            <div className="pb-4 w-[80%] sm:w-[30%] md:w-[20%]">
                <Label>Course Language</Label>
                <Select
                    value={courseData.attributes.language}
                    onValueChange={(val) =>
                        handleAttributeInputChange("language", val)
                    }
                >
                    <SelectTrigger className="mt-1 rounded-2xl">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {[
                            "English",
                            "Russian",
                            "Kazakh",
                            "Spanish",
                            "German",
                            "French",
                            "Chinese",
                            "Japanese",
                            "Arabic",
                            "Turkish",
                            "Hindi",
                            "Portuguese",
                            "Italian",
                        ].map((lang) => (
                            <SelectItem key={lang} value={lang}>
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {showErrors && !courseData.attributes.language && (
                    <p className="text-red-500 text-sm mt-1">
                        Language is required
                    </p>
                )}
            </div>
            {/* Recommended Workload */}
            <div>
                <Label
                    htmlFor="workload"
                    className="mb-2 block text-sm font-medium"
                >
                    Recommended Workload
                </Label>
                <Input
                    id="workload"
                    className="w-full rounded-2xl"
                    placeholder="e.g., 10 hours per week"
                    value={courseData.attributes.workload}
                    onChange={(e) =>
                        handleAttributeInputChange("workload", e.target.value)
                    }
                    maxLength={24}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.workload && (
                            <p className="text-red-500 text-xs">
                                {errors.workload}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.attributes.workload.length}/24</span>
                    </div>
                </div>
            </div>
            {/* Duration */}
            <div>
                <Label
                    htmlFor="workload"
                    className="mb-2 block text-sm font-medium"
                >
                    Duration
                </Label>
                <Input
                    id="duration"
                    className="w-full rounded-2xl"
                    placeholder="e.g., 56 hours"
                    value={courseData.attributes.duration}
                    onChange={(e) =>
                        handleAttributeInputChange("duration", e.target.value)
                    }
                    maxLength={24}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.duration && (
                            <p className="text-red-500 text-xs">
                                {errors.duration}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.attributes.duration.length}/24</span>
                    </div>
                </div>
            </div>

            {/* What You Will Learn */}
            <div>
                <Label
                    htmlFor="learning"
                    className="mb-2 block text-sm font-medium"
                >
                    What You Will Learn
                </Label>
                <Textarea
                    id="learning"
                    className="w-full rounded-2xl"
                    placeholder="List key learnings from this course"
                    value={courseData.attributes.learn}
                    onChange={(e) =>
                        handleAttributeInputChange("learn", e.target.value)
                    }
                    maxLength={512}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.learn && (
                            <p className="text-red-500 text-xs">
                                {errors.learn}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.attributes.learn.length}/512</span>
                    </div>
                </div>
            </div>

            {/* About the Course */}
            <div>
                <Label
                    htmlFor="about"
                    className="mb-2 block text-sm font-medium"
                >
                    About the Course
                </Label>
                <Textarea
                    id="about"
                    className="w-full rounded-2xl"
                    placeholder="Enter detailed information about the course"
                    value={courseData.attributes.about}
                    onChange={(e) =>
                        handleAttributeInputChange("about", e.target.value)
                    }
                    maxLength={512}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.about && (
                            <p className="text-red-500 text-xs">
                                {errors.about}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.attributes.about.length}/512</span>
                    </div>
                </div>
            </div>

            {/* What You Will Gain */}
            <div>
                <Label
                    htmlFor="gains"
                    className="mb-2 block text-sm font-medium"
                >
                    What You Will Gain
                </Label>
                <Textarea
                    id="gains"
                    className="w-full rounded-2xl"
                    placeholder="List benefits and skills gained from this course"
                    value={courseData.attributes.gains}
                    onChange={(e) =>
                        handleAttributeInputChange("gains", e.target.value)
                    }
                    maxLength={512}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.gains && (
                            <p className="text-red-500 text-xs">
                                {errors.gains}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.attributes.gains.length}/512</span>
                    </div>
                </div>
            </div>

            {/* Initial Requirements */}
            <div>
                <Label
                    htmlFor="requirements"
                    className="mb-2 block text-sm font-medium"
                >
                    Initial Requirements
                </Label>
                <Textarea
                    id="requirements"
                    className="w-full rounded-2xl"
                    placeholder="Specify prerequisites for enrolling in this course"
                    value={courseData.attributes.requirements}
                    onChange={(e) =>
                        handleAttributeInputChange(
                            "requirements",
                            e.target.value
                        )
                    }
                    maxLength={512}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.requirements && (
                            <p className="text-red-500 text-xs">
                                {errors.requirements}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>
                            {courseData.attributes.requirements.length}/512
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
