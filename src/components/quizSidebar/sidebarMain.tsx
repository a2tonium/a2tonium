import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function SidebarMain({
    quizzes,
}: {
    quizzes: {
        id: string;
        title: string;
        completed: boolean;
        score: null | number;
        totalQuestions: number;
    }[];
}) {
    const { t } = useTranslation();

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-base text-black hover:underline">
                <Link to="../syllabus">{t("quizSidebar.syllabus")}</Link>
            </SidebarGroupLabel>
            <SidebarGroupLabel>{t("quizSidebar.quizzes")}</SidebarGroupLabel>
            <SidebarMenu>
                <ScrollArea className="h-[700px]">
                    {quizzes.map((quiz) => (
                        <SidebarMenuItem key={quiz.title}>
                            <SidebarMenuButton asChild>
                                <Link
                                    to={`../quiz/${quiz.id}`}
                                    className="flex items-center w-full py-2 px-3 truncate"
                                    replace
                                >
                                    <p className="line-clamp-1 break-words">
                                        {quiz.id}. {quiz.title}
                                    </p>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </ScrollArea>
            </SidebarMenu>
        </SidebarGroup>
    );
}
