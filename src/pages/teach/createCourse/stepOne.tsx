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
import { CourseCreationInterface } from "@/types/course.types";
import { CategorySelect } from "@/components/createCourse/categorySelect";
import { ImageDropzone } from "@/components/createCourse/imageDropzone";
import { useTranslation } from "react-i18next";

interface StepOneProps {
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
    promoVideoValid: boolean;
}

const schema = z.object({
    image: z.string().min(1, "stepOne.error.required"), // "Logo is required"
    name: z.string().min(5, "stepOne.error.name"),
    description: z.string().min(5, "stepOne.error.description"),
    video: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        return val;
    }, z.string().url("stepOne.error.video").optional()),

    attributes: z.object({
        workload: z.string().min(5, "stepOne.error.workload"),
        duration: z.string().min(5, "stepOne.error.duration"),
        learn: z.string().min(5, "stepOne.error.required"),
        about: z.string().min(5, "stepOne.error.about"),
        gains: z.string().min(5, "stepOne.error.required"),
        requirements: z.string().min(5, "stepOne.error.requirements"),
        category: z.array(z.string()).min(1, "stepOne.error.category"),
        level: z.enum(["Beginner", "Intermediate", "Expert"], {
            errorMap: () => ({ message: "stepOne.error.level" }),
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
                errorMap: () => ({ message: "stepOne.error.language" }),
            }
        ),
    }),
});

export function StepOne({
    courseData,
    setCourseData,
    setValidationStatus,
    showErrors,
    promoVideoValid,
}: StepOneProps) {
    const { t } = useTranslation();
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
                        errorMessages[issue.path[1]] = t(issue.message);
                    } else if (typeof issue.path[0] === "string") {
                        errorMessages[issue.path[0]] = t(issue.message);
                    }
                });

                if (!promoVideoValid) {
                    errorMessages.video = t("stepOne.error.video");
                }

                setErrors(errorMessages);
                setValidationStatus((prev) => ({ ...prev, stepOne: false }));
            } else {
                if (!promoVideoValid) {
                    const errorMessages: Record<string, string> = {};
                    errorMessages.video = t("stepOne.error.video");
                    setErrors(errorMessages);
                    setValidationStatus((prev) => ({
                        ...prev,
                        stepOne: false,
                    }));
                } else {
                    setErrors({});
                    setValidationStatus((prev) => ({ ...prev, stepOne: true }));
                }
            }
        };
        validate();
    }, [courseData, promoVideoValid, setValidationStatus, t]);

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
                {t("stepOne.title")}
            </h2>

            <div>
                <div className="flex sm:flex-row flex-col sm:items-center mb-4 gap-5">
                    <div>
                        <Label className="mb-2 block text-sm font-medium">
                            {t("stepOne.logo")}
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

                    <div>
                        <Label className="mb-2 block text-sm font-medium">
                            {t("stepOne.coverImage")}
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
                        {showErrors && errors.cover_image && (
                            <p className="text-red-500 text-xs mt-1">
                                {t(errors.cover_image)}
                            </p>
                        )}
                    </div>
                </div>
                {showErrors && errors.image && (
                    <p className="text-red-500 text-xs mt-1">
                        {t(errors.image)}
                    </p>
                )}
            </div>

            <div className="pt-3">
                <Label className="mb-2 block text-sm font-medium">
                    {t("stepOne.name")}
                </Label>
                <Input
                    id="title"
                    className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t("stepOne.enterTitle")}
                    value={courseData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    maxLength={64}
                />
                <div className="flex justify-between">
                    <div>
                        {showErrors && errors.name && (
                            <p className="text-red-500 text-xs">
                                {t(errors.name)}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.name.length}/64</span>
                    </div>
                </div>
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    {t("stepOne.description")}
                </Label>
                <Textarea
                    id="description"
                    className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t("stepOne.enterDescription")}
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
                                {t(errors.description)}
                            </p>
                        )}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 text-right">
                        <span>{courseData.description.length}/512</span>
                    </div>
                </div>
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    {t("stepOne.video")}
                </Label>
                <Input
                    id="promoVideo"
                    value={courseData.video}
                    onChange={(e) => handleInputChange("video", e.target.value)}
                    placeholder={t("stepOne.enterVideo")}
                    className="rounded-2xl mt-1"
                />
                {showErrors && errors.video && (
                    <p className="text-red-500 text-xs">{t(errors.video)}</p>
                )}
            </div>
            {/* Course Category */}
            <div className="pb-4 space-y-1">
                <Label>{t("stepOne.category")}</Label>
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
                    <p className="text-red-500 text-xs">{t(errors.category)}</p>
                )}
            </div>

            {/* Course Level */}
            <div className="pb-4 w-[80%] sm:w-[30%] md:w-[20%]">
                <Label>{t("stepOne.level")}</Label>
                <Select
                    value={courseData.attributes.level}
                    onValueChange={(val) =>
                        handleAttributeInputChange("level", val)
                    }
                >
                    <SelectTrigger className="mt-1 rounded-2xl">
                        <SelectValue placeholder={t("stepOne.selectLevel")} />
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
                        {t("stepOne.error.level")}
                    </p>
                )}
            </div>

            {/* Course Language */}
            <div className="pb-4 w-[80%] sm:w-[30%] md:w-[20%]">
                <Label>{t("stepOne.language")}</Label>
                <Select
                    value={courseData.attributes.language}
                    onValueChange={(val) =>
                        handleAttributeInputChange("language", val)
                    }
                >
                    <SelectTrigger className="mt-1 rounded-2xl">
                        <SelectValue
                            placeholder={t("stepOne.selectLanguage")}
                        />
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
                        {t("stepOne.error.language")}
                    </p>
                )}
            </div>

            {/* Recommended Workload */}
            <div>
                <Label
                    htmlFor="workload"
                    className="mb-2 block text-sm font-medium"
                >
                    {t("stepOne.workload")}
                </Label>
                <Input
                    id="workload"
                    className="w-full rounded-2xl"
                    placeholder={t("stepOne.enterWorkload")}
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
                                {t(errors.workload)}
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
                    htmlFor="duration"
                    className="mb-2 block text-sm font-medium"
                >
                    {t("stepOne.duration")}
                </Label>
                <Input
                    id="duration"
                    className="w-full rounded-2xl"
                    placeholder={t("stepOne.enterDuration")}
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
                                {t(errors.duration)}
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
                    {t("stepOne.learn")}
                </Label>
                <Textarea
                    id="learning"
                    className="w-full rounded-2xl"
                    placeholder={t("stepOne.enterLearn")}
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
                                {t(errors.learn)}
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
                    {t("stepOne.about")}
                </Label>
                <Textarea
                    id="about"
                    className="w-full rounded-2xl"
                    placeholder={t("stepOne.enterAbout")}
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
                                {t(errors.about)}
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
                    {t("stepOne.gains")}
                </Label>
                <Textarea
                    id="gains"
                    className="w-full rounded-2xl"
                    placeholder={t("stepOne.enterGains")}
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
                                {t(errors.gains)}
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
                    {t("stepOne.requirements")}
                </Label>
                <Textarea
                    id="requirements"
                    className="w-full rounded-2xl"
                    placeholder={t("stepOne.enterRequirements")}
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
                                {t(errors.requirements)}
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
