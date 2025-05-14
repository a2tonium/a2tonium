import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TeachCardProps {
    courseAddress: string;
    title: string;
    image: string;
}

export const TeachCard: React.FC<TeachCardProps> = ({
    courseAddress,
    title,
    image,
}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/course/${courseAddress}`);
    };
    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/course/${courseAddress}/information`);
    };
    const handleSyllabusClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/course/${courseAddress}/syllabus`);
    };

    return (
        <Card
            className="h-auto bg-gray-100 cursor-pointer relative border-0 w-full max-w-4xl p-4 shadow-inner rounded-xl hover:shadow-hover-even transition-shadow duration-150"
            onClick={handleCardClick}
        >
            {/* Меню справа */}
            <div className="absolute top-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-md hover:bg-gray-100">
                            <EllipsisVertical className="w-5 h-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>
                            <button className="w-full text-left text-gray-800 hover:text-blue-500">
                                Редактировать
                            </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <button className="w-full text-left text-gray-800 hover:text-red-500">
                                Удалить
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Основной контент */}
            <div className="flex items-center">
                {/* Изображение слева */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Текстовый блок */}
                <div className="ml-4 md:pt-3 flex-1 pr-10 overflow-hidden">
                    <CardTitle className="line-clamp-4 text-sm sm:text-sm md:text-base lg:text-base font-semibold break-words">
                        {title}
                    </CardTitle>

                    {/* Кнопки при наведении */}
                    <div className="hidden sm:flex opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="link"
                            className="text-blue-500"
                            onClick={handleInfoClick}
                        >
                            Описание
                        </Button>
                        <Button
                            variant="link"
                            className="text-blue-500"
                            onClick={handleSyllabusClick}
                        >
                            Содержание
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
