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
import { CourseDeployedInterface } from "@/types/course.types";
import { CoursePromoteDialog } from "@/components/teachCard/coursePromoteDialog";
import { CourseWithdrawDialog } from "@/components/teachCard/courseWithdrawDialog";
import { ipfsToHttp } from "@/utils/ton.utils";
import { useTranslation } from "react-i18next";

interface TeachCardProps {
    course: CourseDeployedInterface;
    courseAddress: string | undefined;
    cost: string;
}

export function TeachCard({ course, courseAddress, cost }: TeachCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const image = ipfsToHttp(course.image);
    const [isPromoteOpen, setPromoteOpen] = React.useState(false);
    const [isWithdrawOpen, setWithdrawOpen] = React.useState(false);

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.closest("button") ||
            target.closest("svg") ||
            target.closest("[role='dialog']")
        ) {
            return;
        }
        navigate(`/course/${courseAddress}`);
    };

    const handleEditCourse = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/course/${courseAddress}/edit`);
    };

    return (
        <Card
            className="h-auto bg-gray-100 cursor-pointer relative border-0 w-full max-w-4xl p-4 shadow-inner rounded-xl hover:shadow-hover-even transition-shadow duration-150"
            onClick={handleCardClick}
        >
            <div className="absolute top-4 right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="p-2 rounded-md hover:bg-gray-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <EllipsisVertical className="w-5 h-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>
                            <button className="w-full text-left text-gray-800 hover:text-red-500">
                                {t("teachCard.delete")}
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                        src={image}
                        alt={course.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="ml-4 md:pt-3 flex-1 pr-10 overflow-hidden">
                    <CardTitle className="line-clamp-4 text-sm sm:text-sm md:text-base lg:text-base font-semibold break-words">
                        {course.name}
                    </CardTitle>
                    <div className="line-clamp-4 text-sm sm:text-sm md:text-base lg:text-base font-light break-words">
                        {t("teachCard.price")}: {cost}
                    </div>

                    <div className="hidden sm:flex opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="link"
                            type="button"
                            className="text-blue-500"
                            onClick={handleEditCourse}
                        >
                            {t("teachCard.edit")}
                        </Button>
                        <Button
                            variant="link"
                            type="button"
                            className="text-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPromoteOpen(true);
                            }}
                        >
                            {t("teachCard.promote")}
                        </Button>
                        <Button
                            variant="link"
                            type="button"
                            className="text-blue-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setWithdrawOpen(true);
                            }}
                        >
                            {t("teachCard.withdraw")}
                        </Button>
                    </div>
                </div>
            </div>
            <CoursePromoteDialog
                course={course}
                courseAddress={courseAddress}
                isPromoteOpen={isPromoteOpen}
                setPromoteOpen={setPromoteOpen}
            />
            <CourseWithdrawDialog
                course={course}
                courseAddress={courseAddress}
                isWithdrawOpen={isWithdrawOpen}
                setWithdrawOpen={setWithdrawOpen}
            />
        </Card>
    );
}
