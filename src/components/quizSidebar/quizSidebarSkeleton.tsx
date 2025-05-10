import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function QuizSidebarSkeleton() {
    const { isMobile } = useSidebar();
    return (
        <div className="bg-white m-0 rounded-[2vw]">
            <Sidebar
                collapsible={isMobile ? "icon" : "none"}
                className="bg-white rounded-[2vw]"
            >
                {/* Header with course title skeleton */}
                <SidebarHeader className="flex px-4 pt-6 pb-0">
                    <div className="w-full">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                    </div>
                </SidebarHeader>

                <Separator className="my-3" />

                {/* Content: Syllabus link + Quizzes list */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            <Skeleton className="h-4 w-1/3 mb-1" />
                        </SidebarGroupLabel>
                        <SidebarGroupLabel>
                            <Skeleton className="h-4 w-1/4 mb-3" />
                        </SidebarGroupLabel>

                        <SidebarMenu>
                            <ScrollArea className="h-[700px] space-y-2 pr-2">
                                {[...Array(8)].map((_, i) => (
                                    <SidebarMenuItem key={i}>
                                        <Skeleton className="h-4 w-full mb-2" />
                                    </SidebarMenuItem>
                                ))}
                            </ScrollArea>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
