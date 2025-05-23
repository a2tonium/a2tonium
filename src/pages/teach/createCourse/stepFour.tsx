import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { CourseCreationInterface } from "@/types/course.types";
import { ImageDropzone } from "@/components/createCourse/imageDropzone";
import { PriceInput } from "@/components/createCourse/priceInput";

interface StepFourProps {
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
    coursePrice: number;
    setCoursePrice: React.Dispatch<React.SetStateAction<number>>;
}

export function StepFour({
    courseData,
    setCourseData,
    setValidationStatus,
    setCoursePrice,
    coursePrice,
}: StepFourProps) {
    const { t } = useTranslation();

    const schema = z.object({
        price: z
            .number()
            .min(1, t("stepFour.error.priceMin"))
            .max(999999, t("stepFour.error.priceMax")),
        certificate: z.string().min(1, t("stepFour.error.certificate")),
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [preview, setPreview] = useState(
        courseData.courseCompletion[0]?.certificate || ""
    );

    useEffect(() => {
        const validate = () => {
            const result = schema.safeParse({
                price: coursePrice,
                certificate: courseData.courseCompletion[0]?.certificate || "",
            });

            if (!result.success) {
                const fieldErrors: Record<string, string> = {};
                result.error.issues.forEach((issue) => {
                    if (typeof issue.path[0] === "string") {
                        fieldErrors[issue.path[0]] = issue.message;
                    }
                });

                setErrors(fieldErrors);
                setValidationStatus((prev) => ({ ...prev, stepFour: false }));
            } else {
                setErrors({});
                setValidationStatus((prev) => ({ ...prev, stepFour: true }));
            }
        };

        validate();
    }, [coursePrice, courseData, setValidationStatus]);

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    {t("stepFour.title")}
                </h2>

                {/* Course Price */}
                <div className="space-y-3 w-full sm:w-[50%] md:w-[30%]">
                    <Label
                        htmlFor="price"
                        className="block text-sm font-medium"
                    >
                        {t("stepFour.priceLabel")}
                    </Label>
                    <PriceInput value={coursePrice} onChange={setCoursePrice} />
                    {errors.price && (
                        <p className="text-red-500 text-xs mt-1">
                            {t(errors.price)}
                        </p>
                    )}
                </div>
            </div>

            {/* Certificate Upload */}
            <div className="space-y-2">
                <Label
                    htmlFor="certificateFile"
                    className="block text-sm font-medium"
                >
                    {t("stepFour.certificateLabel")}
                </Label>

                <ImageDropzone
                    value={preview}
                    onChange={(base64) => {
                        setPreview(base64);
                        setCourseData((prev) => ({
                            ...prev,
                            courseCompletion: prev.courseCompletion.map(
                                (item, index) =>
                                    index === 0
                                        ? { ...item, certificate: base64 }
                                        : item
                            ),
                        }));
                    }}
                    maxWidth="160px"
                    maxHeight="160px"
                    aspectHint={t("stepFour.certificateHint")}
                />
                {errors.certificate && (
                    <p className="text-red-500 text-xs mt-1">
                        {t(errors.certificate)}
                    </p>
                )}
            </div>
        </div>
    );
}
