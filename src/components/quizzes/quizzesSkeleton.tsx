import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CourseSidebarSkeleton } from "@/components/courseSidebar/couseSidebarSkeleton";

export function QuizzesSkeleton() {
    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] md:border-[6px] border-gray-200">
                {/* Sidebar Skeleton */}
                <CourseSidebarSkeleton />

                {/* Main Content Skeleton */}
                <div className="flex-row max-w-4xl mx-auto p-0 pt-6 md:pr-6 md:p-6 w-full">
                    {/* Sidebar Trigger + Title */}
                    <div className="flex items-center gap-2 mb-4">
                        <SidebarTrigger className="block min-[1000px]:hidden pl-3" />
                        <Skeleton className="h-6 w-28" />
                    </div>

                    <Separator className="mb-4" />

                    <div className="w-full">
                        {[...Array(6)].map((_, index) => {
                            const borderRadiusClass =
                                index === 0
                                    ? "rounded-none sm:rounded-t-lg"
                                    : index === 5
                                    ? "rounded-none sm:rounded-b-lg"
                                    : "rounded-none";

                            return (
                                <div
                                    key={index}
                                    className={`flex items-center p-2 sm:p-3 md:p-4 border ${borderRadiusClass}`}
                                >
                                    {/* Quiz Title */}
                                    <div className="ml-2 sm:ml-4 flex-1 min-w-0 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>

                                    {/* Right Panel */}
                                    <div className="pl-2 flex flex-col items-end space-y-2">
                                        <Skeleton className="h-4 w-20 sm:w-24" />
                                        <Skeleton className="h-4 w-24 sm:w-28" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
