import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepSlider } from "@/components/createCourse/stepSlider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { StepOne } from "@/pages/teach/createCourse/stepOne";
import { StepTwo } from "@/pages/teach/createCourse/stepTwo";
import { StepThree } from "@/pages/teach/createCourse/stepThree";
import { StepFour } from "@/pages/teach/createCourse/stepFour";
import { StepFive } from "@/pages/teach/createCourse/stepFive";
import { CourseCreationInterface, VideoCheckState } from "@/types/courseData";
import { EditCourseButton } from "@/components/createCourse/editCourseButton";
import { isYouTubeVideoAccessible } from "@/lib/youtube.lib";
import { useCourseDataIfEnrolled } from "@/hooks/useCourseDataIfEnrolled";
import { useParams } from "react-router-dom";
import { ErrorPage } from "@/pages/error/error";
import { reformatToCourseCreation } from "@/utils/file.utils";

export function EditCourse() {
    const { courseAddress } = useParams();
    const {
        data,
        error,
        isLoading,
    } = useCourseDataIfEnrolled(courseAddress);

    const [isDirty, setIsDirty] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showDialog, setShowDialog] = useState(false);

    const totalSteps = 5;

    const [showErrors, setShowErrors] = useState({
        stepOne: false,
        stepTwo: false,
        stepThree: false,
    });

    const [validationStatus, setValidationStatus] = useState({
        stepOne: false,
        stepTwo: false,
        stepThree: false,
        stepFour: false,
    });

    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [activeQuizIndex, setActiveQuizIndex] = useState(0);

    const [videoCheckState, setVideoCheckState] = useState<VideoCheckState>({});

    // Единое состояние courseData

    const [courseData, setCourseData] = useState<CourseCreationInterface>({
        name: "",
        description: "",
        image: "",
        social_links: [],
        attributes: {
            category: [],
            duration: "",
            level: "Beginner",
            lessons: 0,
            language: "English",
            summary: "",
            workload: "",
            learn: "",
            about: "",
            gains: "",
            requirements: "",
        },
        modules: [
            {
                id: "1",
                title: "Module 1",
                lessons: [
                    {
                        id: "m1-l1",
                        title: "",
                        videoId: "",
                    },
                ],
                quiz: {
                    correct_answers: "aaaaa",
                    questions: Array(5)
                        .fill(null)
                        .map((_, index) => ({
                            id: index.toString(),
                            text: "",
                            options: ["", ""],
                        })),
                },
            },
        ],
        courseCompletion: [
            {
                gradeHighThan: "90",
                certificate: "/images/cards/1.png",
            },
        ],
    });
    const [coursePrice, setcoursePrice] = useState(1);
    const limitedVideos: string[] =[] 

    // При монтировании считаем форму «грязной»
    useEffect(() => {
        setIsDirty(true);
    }, []);

    // Предупреждение при покидании/перезагрузке вкладки
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        if (isDirty) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        }
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    const [jwt, setJwt] = useState("");
    const [isValidJwt, setIsValidJwt] = useState(false);

    const [promoVideoValid, setPromoVideoValid] = useState<boolean>(true);

    useEffect(() => {
        const check = async () => {
            if (!courseData.video?.trim()) {
                setPromoVideoValid(true); // optional field
                return;
            }

            const [isValid] = await isYouTubeVideoAccessible(courseData.video);
            setPromoVideoValid(isValid);
        };

        check();
    }, [courseData.video]);

    const [initialized, setInitialized] = useState(false);
    const [courseDataLoaded, setCourseDataLoaded] = useState(false);

    useEffect(() => {
        const formatCourse = async () => {
            if (!isLoading && data && !error && !initialized) {
                const formatted = await reformatToCourseCreation(data.data!);
                console.log("formatted", formatted);
                setCourseData(formatted);
                setcoursePrice(parseFloat(data.cost));
                setInitialized(true);
                setCourseDataLoaded(true); // 👈 устанавливаем как загруженные
            }
        };

        formatCourse();
    }, [isLoading, data, error, initialized]);

    if (isLoading || !data || !courseDataLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                    <p className="text-gray-700 font-medium">Please wait</p>
                </div>
            </div>
        );
    }

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

    // Навигация по шагам
    const handleNextStep = () => {
        if (currentStep === 1) {
            setShowErrors((prev) => ({ ...prev, stepOne: true }));
        }
        if (currentStep === 2) {
            setShowErrors((prev) => ({ ...prev, stepTwo: true }));
        }
        if (currentStep === 3) {
            setShowErrors((prev) => ({ ...prev, stepThree: true }));
        }
        if (currentStep === 4) {
            setShowErrors((prev) => ({ ...prev, stepFour: true }));
        }
        if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
    };

    const handleStepClick = (targetStep: number) => {
        if (currentStep === 1 && !validationStatus.stepOne) {
            setShowErrors((prev) => ({ ...prev, stepOne: true }));
        }
        if (currentStep === 2 && !validationStatus.stepTwo) {
            setShowErrors((prev) => ({ ...prev, stepTwo: true }));
        }
        if (currentStep === 3 && !validationStatus.stepThree) {
            setShowErrors((prev) => ({ ...prev, stepThree: true }));
        }

        setCurrentStep(targetStep);
    };

    const handlePrevStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const isFormValid =
        validationStatus.stepOne &&
        validationStatus.stepTwo &&
        validationStatus.stepThree &&
        validationStatus.stepFour &&
        isValidJwt &&
        promoVideoValid;

    const handleCreateCourse = () => {
        setShowDialog(true);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-3xl rounded-[2vw] md:border-[6px] border-gray-200">
            <StepSlider
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepClick={handleStepClick}
            />
            <Separator className="mt-3 mb-6" />

            <form className="space-y-5 w-full">
                {/* Step 1 */}
                {currentStep === 1 && (
                    <StepOne
                        courseData={courseData}
                        setCourseData={setCourseData}
                        setValidationStatus={setValidationStatus}
                        showErrors={showErrors.stepOne}
                        promoVideoValid={promoVideoValid}
                    />
                )}

                {/* Step 2 (Modules & Lessons, hasQuiz) */}
                {currentStep === 2 && (
                    <StepTwo
                        courseData={courseData}
                        setCourseData={setCourseData}
                        setValidationStatus={setValidationStatus}
                        showErrors={showErrors.stepTwo}
                        setActiveModuleIndex={setActiveModuleIndex}
                        activeModuleIndex={activeModuleIndex}
                        videoCheckState={videoCheckState}
                        setVideoCheckState={setVideoCheckState}
                        limitedVideos={limitedVideos}
                    />
                )}

                {/* Step 3 (Quiz builder) */}
                {currentStep === 3 && (
                    <StepThree
                        courseData={courseData}
                        setCourseData={setCourseData}
                        activeQuizIndex={activeQuizIndex}
                        setActiveQuizIndex={setActiveQuizIndex}
                        setValidationStatus={setValidationStatus}
                        showErrors={showErrors.stepThree}
                    />
                )}

                {/* Step 4 (Review & Submit) */}
                {currentStep === 4 && (
                    <StepFour
                        courseData={courseData}
                        setCourseData={setCourseData}
                        setValidationStatus={setValidationStatus}
                        coursePrice={coursePrice}
                        setCoursePrice={setcoursePrice}
                    />
                )}

                {currentStep === 5 && (
                    <StepFive
                        courseData={courseData}
                        validationStatus={validationStatus}
                        setCurrentStep={setCurrentStep}
                        jwt={jwt}
                        setJwt={setJwt}
                        setIsValidJwt={setIsValidJwt}
                        isValidJwt={isValidJwt}
                        coursePrice={coursePrice}
                    />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <Button
                        onClick={handlePrevStep}
                        type="button"
                        className={`rounded-2xl bg-goluboy p-2.5 gap-0 flex justify-center items-center ${
                            currentStep === 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "border-goluboy hover:border-blue-500 hover:bg-blue-500 transition-colors duration-200"
                        }`}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft
                            className="flex justify-center items-center"
                            style={{ width: "18px", height: "18px" }}
                        />
                        <span className="m-0 p-0 font-semibold">Previous</span>
                    </Button>

                    <Button
                        onClick={
                            currentStep !== totalSteps
                                ? handleNextStep
                                : handleCreateCourse
                        }
                        type="button"
                        className={`rounded-2xl bg-goluboy p-2.5 gap-0 flex justify-center items-center ${
                            !isFormValid && currentStep === totalSteps
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "border-goluboy hover:border-blue-500 hover:bg-blue-500 transition-colors duration-200"
                        }`}
                        disabled={!isFormValid && currentStep === totalSteps}
                    >
                        <span className="font-semibold">
                            {currentStep !== totalSteps
                                ? "Next"
                                : "Create Course"}
                        </span>
                        <ChevronRight
                            className="flex justify-center items-center"
                            style={{ width: "18px", height: "18px" }}
                        />
                    </Button>
                </div>
            </form>
            <EditCourseButton
                course={courseData}
                jwt={jwt}
                open={showDialog}
                onOpenChange={setShowDialog}
                coursePrice={coursePrice.toString()}
                limitedVideos={limitedVideos}
                courseAddress={courseAddress!}
            />
        </div>
    );
}
