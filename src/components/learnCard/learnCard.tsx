import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface LearnCardProps {
    courseAddress: string;
    title: string;
    image: string;
}

export const LearnCard: React.FC<LearnCardProps> = ({
    courseAddress,
    title,
    image,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleCardClick = () => {
        navigate(`/course/${courseAddress}/syllabus`);
    };

    const handleLessonsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/course/${courseAddress}/syllabus`);
    };

    const handleQuizzesClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/course/${courseAddress}/quizzes`);
    };

    return (
        <Card
            className="h-auto bg-gray-100 cursor-pointer relative border-0 w-full rounded-xl max-w-4xl p-4 shadow-inner hover:shadow-hover-even transition-shadow duration-150"
            onClick={handleCardClick}
        >
            <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="ml-4 md:pt-3 flex-1 pr-10 overflow-hidden">
                    <CardTitle className="line-clamp-4 text-sm sm:text-sm md:text-base lg:text-base font-semibold break-words">
                        {title}
                    </CardTitle>

                    <div className="hidden sm:flex opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="link"
                            className="text-blue-500"
                            onClick={handleLessonsClick}
                        >
                            {t("learn.lessons")}
                        </Button>
                        <Button
                            variant="link"
                            className="text-blue-500"
                            onClick={handleQuizzesClick}
                        >
                            {t("learn.quizzes")}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
