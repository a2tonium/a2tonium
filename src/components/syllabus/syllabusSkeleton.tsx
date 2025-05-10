import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { CourseSidebarSkeleton } from "@/components/courseSidebar/couseSidebarSkeleton";

export function SyllabusSkeleton() {
    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] md:border-[6px] border-gray-200">
                {/* Sidebar Skeleton */}
                <CourseSidebarSkeleton />

                {/* Main Content Skeleton */}
                <div className="max-w-4xl flex-grow mx-auto p-0 pt-6 md:pr-6 md:p-6">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <SidebarTrigger className="block min-[1000px]:hidden pl-3" />
                        <Skeleton className="h-6 w-32" />
                    </div>

                    <Separator className="mb-4" />

                    {/* Module List Skeleton */}
                    <div className="space-y-4">
                        {[...Array(3)].map((_, moduleIndex) => (
                            <div
                                key={moduleIndex}
                                className="p-4 border rounded-lg bg-white space-y-3"
                            >
                                {/* Module Title */}
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-4 w-16" />
                                </div>

                                {/* Lessons in module */}
                                <div className="mt-3 space-y-2 ml-4 pl-4 border-l border-gray-200">
                                    {[...Array(3)].map((_, lessonIndex) => (
                                        <div
                                            key={lessonIndex}
                                            className="flex items-center gap-2"
                                        >
                                            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-md flex-shrink-0" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
