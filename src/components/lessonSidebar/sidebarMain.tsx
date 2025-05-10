import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

export function SidebarMain({
    modules,
    activeLessonId,
}: {
    modules: {
        moduleTitle: string;
        lessons: {
            id: string;
            title: string;
            videoId: string;
        }[];
    }[];
    activeLessonId: string | undefined;
}) {
    return (
        <SidebarGroup className="text-gray-800 pb-5">
            <SidebarGroupLabel className="text-base text-black hover:underline">
                <Link to="../quizzes">Quizzes</Link>
            </SidebarGroupLabel>
            <SidebarGroupLabel>Lessons</SidebarGroupLabel>

            <SidebarMenu className="">
                {/* Ограничение ширины прокручиваемого контейнера */}
                <ScrollArea className="h-[700px]">
                    {modules.map((module, moduleIndex) => (
                        <div
                            key={moduleIndex}
                            className="mt-2 w-[272px] lg:w-[240px]"
                        >
                            {/* Module Title */}
                            <SidebarMenuItem className="text-gray-700 font-bold text-[15px] px-2 truncate">
                                {`${moduleIndex + 1}. ${module.moduleTitle}`}
                            </SidebarMenuItem>

                            {/* Lessons */}
                            {module.lessons.map((lesson, lessonIndex) => {
                                const isActive = lesson.id === activeLessonId;

                                return (
                                    <SidebarMenuItem
                                        key={lesson.id}
                                        className={`pl-3 text-sm group truncate ${
                                            isActive
                                                ? "underline underline-offset-[3px] rounded-lg"
                                                : "text-gray-600 hover:text-black"
                                        }`}
                                    >
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={`../lesson/${lesson.id}`}
                                                className="flex items-center w-full py-2 px-3 truncate"
                                                replace // опционально: не засорять history
                                            >
                                                {isActive && (
                                                    <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-[8px] h-[8px] bg-green-400 rounded-full" />
                                                )}
                                                <span className="text-sm truncate">
                                                    {`${moduleIndex + 1}.${
                                                        lessonIndex + 1
                                                    } ${lesson.title}`}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </div>
                    ))}
                </ScrollArea>
            </SidebarMenu>
        </SidebarGroup>
    );
}
