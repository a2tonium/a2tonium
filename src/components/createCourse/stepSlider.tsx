import React from "react";
import { Progress } from "@/components/ui/progress";

interface StepSliderProps {
    currentStep: number;
    totalSteps: number;
    onStepClick: (index: number) => void; // изменено
}

export const StepSlider: React.FC<StepSliderProps> = ({
    currentStep,
    totalSteps,
    onStepClick,
}) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full p-4">
            {/* Шкала прогресса */}
            <Progress
                value={progressPercentage}
                className="h-4 rounded-full bg-gray-200 text-blue-500"
            />

            {/* Индикатор шагов */}
            <div className="flex justify-between mt-4">
                {[...Array(totalSteps)].map((_, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                            currentStep === index + 1
                                ? "bg-stone-900 text-white border-dark-500"
                                : "bg-white text-gray-500 border-gray-300"
                        }`}
                        onClick={() => onStepClick(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};
