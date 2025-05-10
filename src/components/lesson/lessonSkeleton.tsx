import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LessonSidebarSkeleton } from "@/components/lessonSidebar/lessonSidebarSkeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LessonSkeleton() {
    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] xl:border-[6px] border-gray-200">
                {/* Skeleton Sidebar */}
                <div className="">
                    <LessonSidebarSkeleton />
                </div>

                {/* Optional dividing line for large view */}
                <div className="hidden md:block w-[0.1px] bg-gray-200" />

                {/* Main content */}
                <div className="py-6 flex-grow w-full">
                    {/* Lesson Title */}
                    <div className="flex items-center">
                        <SidebarTrigger className="block min-[1000px]:hidden px-3" />
                        <Skeleton className="h-6 sm:h-8 w-[70%] ml-3 rounded-md" />
                    </div>

                    <Separator className="my-4" />

                    {/* Video Placeholder */}
                    <div className="w-full p-2">
                        <Skeleton className="w-full h-[250px] sm:h-[360px] md:h-[420px] rounded-xl" />
                    </div>

                    <Separator className="mt-4" />

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6 mx-6">
                        <Button
                            disabled
                            className="rounded-2xl bg-gray-300 text-gray-500 p-2.5 flex items-center gap-2 cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Back</span>
                        </Button>

                        <Button
                            disabled
                            className="rounded-2xl bg-gray-300 text-gray-500 p-2.5 flex items-center gap-2 cursor-not-allowed"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
