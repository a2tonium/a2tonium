import React, { useState } from "react";
import { Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { checkPinataConnection } from "@/lib/pinata";
import { CourseDataInterface } from "@/types/courseData";
import { extractYoutubeVideoId } from "@/components/createCourse/youtubeIdExtract";
import { Spinner } from "@/components/ui/kibo-ui/spinner";

interface StepFiveProps {
    courseData: CourseDataInterface;
    validationStatus: {
        stepOne: boolean;
        stepTwo: boolean;
        stepThree: boolean;
        stepFour: boolean;
    };
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    jwt: string;
    setJwt: React.Dispatch<React.SetStateAction<string>>;
    setIsValidJwt: React.Dispatch<React.SetStateAction<boolean>>;
    isValidJwt: boolean;
    coursePrice: number;
}

export function StepFive({
    courseData,
    validationStatus,
    setCurrentStep,
    jwt,
    setJwt,
    setIsValidJwt,
    isValidJwt,
    coursePrice,
}: StepFiveProps) {
    const jwtSchema = z.string().min(10, "JWT слишком короткий");
    const [jwtError, setJwtError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePromoPage = () => {
        const videoUrl = courseData.video;
        const courseDataTemp = { ...courseData };

        if (videoUrl) {
            const extractedVideoId = extractYoutubeVideoId(videoUrl);
            if (extractedVideoId) {
                courseDataTemp.video = extractedVideoId;
            }
        }
        // 1) Сохраняем courseData (например, в sessionStorage)
        sessionStorage.setItem("promoData", JSON.stringify(courseDataTemp));
        sessionStorage.setItem("priceData", JSON.stringify(coursePrice));

        // 2) Открываем новую вкладку на URL /teach/courses/create/coursePromo
        window.open("/teach/create/coursePromo", "_blank");
    };

    const handlePinataConnection = async () => {
        setIsLoading(true);
        setJwtError(null);
        setIsValidJwt(false);

        const validation = jwtSchema.safeParse(jwt);
        if (!validation.success) {
            setJwtError(validation.error.errors[0].message);
            setIsLoading(false);
            return;
        }

        const isConnected = await checkPinataConnection(jwt);
        if (!isConnected) {
            setJwtError(
                "Ошибка: JWT недействителен или нет соединения с Pinata"
            );
            setIsLoading(false);
            return;
        }

        setIsValidJwt(true);
        setIsLoading(false);
    };

    return (
        <div className="space-y-2">
            <div>
                <div className="bg-gray-100 p-4 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold">Checklist</h3>
                    <ul className="mt-3 space-y-2 text-md font-medium">
                        <li
                            onClick={() => setCurrentStep(1)}
                            className="flex items-center cursor-pointer hover:underline"
                        >
                            {validationStatus.stepOne ? (
                                <Check className="text-green-500 w-5 h-5 mr-2" />
                            ) : (
                                <X className="text-red-500 w-5 h-5 mr-2" />
                            )}
                            Course Information
                        </li>
                        <li
                            onClick={() => setCurrentStep(2)}
                            className="flex items-center cursor-pointer hover:underline"
                        >
                            {validationStatus.stepTwo ? (
                                <Check className="text-green-500 w-5 h-5 mr-2" />
                            ) : (
                                <X className="text-red-500 w-5 h-5 mr-2" />
                            )}
                            Lessons
                        </li>
                        <li
                            onClick={() => setCurrentStep(3)}
                            className="flex items-center cursor-pointer hover:underline"
                        >
                            {validationStatus.stepThree ? (
                                <Check className="text-green-500 w-5 h-5 mr-2" />
                            ) : (
                                <X className="text-red-500 w-5 h-5 mr-2" />
                            )}
                            Quizzes
                        </li>
                        <li
                            onClick={() => setCurrentStep(4)}
                            className="flex items-center cursor-pointer hover:underline"
                        >
                            {validationStatus.stepFour ? (
                                <Check className="text-green-500 w-5 h-5 mr-2" />
                            ) : (
                                <X className="text-red-500 w-5 h-5 mr-2" />
                            )}
                            Price & Certificate
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex space-x-1 sm:space-x-3">
                <div className="">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePromoPage}
                        className=" p-2.5 mt-4 gap-1.5 flex items-center border-blue-500 text-blue-500 
                     hover:border-blue-700 hover:text-blue-700 transition-colors duration-200 rounded-2xl"
                        disabled={
                            (validationStatus.stepOne &&
                                validationStatus.stepTwo &&
                                validationStatus.stepThree &&
                                validationStatus.stepFour) === false
                        }
                    >
                        <span className="m-0 p-0 font-semibold text-xs sm:text-sm">
                            Promo Page
                        </span>
                    </Button>
                </div>
            </div>
            <div className="pt-4">
                <h1 className="text-lg mb-5 md:text-xl font-bold">
                    Pinata Cloud Information
                </h1>

                <div className="space-y-4">
                    {/* JWT */}
                    <div>
                        <Label
                            htmlFor="jwt"
                            className="block text-sm font-medium text-gray-700"
                        >
                            JWT
                        </Label>
                        <Input
                            id="jwt"
                            name="jwt"
                            type="text"
                            required
                            value={jwt}
                            onChange={(e) => {
                                setJwt(e.target.value);
                                setJwtError(null);
                                setIsValidJwt(false);
                            }}
                            className={`mt-1 block w-full rounded-2xl border p-2 shadow-sm sm:text-sm ${
                                jwtError ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Введите ваш JWT"
                        />
                        {jwtError && (
                            <p className="text-red-500 text-xs mt-1">
                                {jwtError}
                            </p>
                        )}
                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePinataConnection}
                                className="p-2.5 mt-4 gap-1.5 flex items-center border-blue-500 text-blue-500 
                                hover:border-blue-700 hover:text-blue-700 transition-colors duration-200 rounded-2xl"
                                disabled={jwt === ""}
                            >
                                <span className="m-0 p-0 font-semibold text-xs sm:text-sm flex items-center gap-2">
                                    Check JWT
                                    {isLoading ? (
                                        <Spinner className="w-4 h-4 text-blue-500"/>
                                    ) : isValidJwt ? (
                                        <Check className="w-4 h-4 text-blue-500" />
                                    ) : (
                                        <Search className="w-4 h-4" />
                                    )}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between text-gray-500 text-xs mt-4">
                    <span>
                        More about creating a course in our{" "}
                        <a
                            href="/cources/tutorial"
                            className="text-blue-500 hover:underline"
                        >
                            Help Center
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}
