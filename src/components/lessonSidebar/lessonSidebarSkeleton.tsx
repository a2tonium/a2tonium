import { Skeleton } from "@/components/ui/skeleton";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function LessonSidebarSkeleton() {
    const { isMobile } = useSidebar();
    return (
        <div className="bg-white m-0 rounded-[2vw]">
            <Sidebar
                collapsible={isMobile ? "icon" : "none"}
                className="bg-white rounded-[2vw]"
            >
                {/* Sidebar Header */}
                <SidebarHeader className="flex px-4 pt-6 pb-0 flex-col space-y-3">
                    <Skeleton className="w-[90%] h-4" />
                    <Separator />
                </SidebarHeader>

                {/* Sidebar Content */}
                <SidebarContent>
                    <SidebarGroup className="text-gray-800 pb-5">
                        {/* Section Labels */}
                        <SidebarGroupLabel>
                            <Skeleton className="w-20 h-4" />
                        </SidebarGroupLabel>
                        <SidebarGroupLabel>
                            <Skeleton className="w-24 h-4" />
                        </SidebarGroupLabel>

                        {/* Scrollable Module + Lessons */}
                        <SidebarMenu>
                            <ScrollArea className="h-[700px]">
                                {[...Array(3)].map((_, moduleIndex) => (
                                    <div
                                        key={moduleIndex}
                                        className="mt-4 w-[272px] lg:w-[240px] space-y-2"
                                    >
                                        {/* Module title */}
                                        <SidebarMenuItem>
                                            <Skeleton className="h-4 w-[80%]" />
                                        </SidebarMenuItem>

                                        {/* Lessons */}
                                        {[...Array(4)].map((_, lessonIndex) => (
                                            <SidebarMenuItem
                                                key={lessonIndex}
                                                className="pl-3"
                                            >
                                                <Skeleton className="h-3 w-[90%]" />
                                            </SidebarMenuItem>
                                        ))}
                                    </div>
                                ))}
                            </ScrollArea>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
