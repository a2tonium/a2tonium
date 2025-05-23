import { Skeleton } from "@/components/ui/skeleton";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";

export function CourseSidebarSkeleton() {
    const { isMobile } = useSidebar();

    return (
        <div className="bg-white rounded-l-2xl m-0 sm:mt-5 sm:ml-5">
            <Sidebar
                collapsible={isMobile ? "icon" : "none"}
                className="bg-white rounded-l-2xl h-[calc(100vh-64px)] sticky top-[64px] left-0"
            >
                {/* Header */}
                <SidebarHeader className="flex p-4 items-start">
                    <Skeleton className="w-24 h-24 rounded-lg" />
                    <Skeleton className="w-full m-0 h-6" />
                    <Skeleton className="w-full m-0 h-6" />
                    <div className="flex-1">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-3/4 h-4" />
                    </div>
                </SidebarHeader>

                {/* Sidebar Nav Items */}
                <SidebarContent className="px-4 space-y-6 mt-2">
                    {/* Section Title */}
                    <div className="space-y-2">
                        <Skeleton className="w-24 h-4 mb-2" />
                        <div className="pl-2 space-y-2">
                            <Skeleton className="w-20 h-3" />
                            <Skeleton className="w-16 h-3" />
                        </div>
                    </div>

                </SidebarContent>
            </Sidebar>
        </div>
    );
}
