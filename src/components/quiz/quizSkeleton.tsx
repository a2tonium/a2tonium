import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QuizSidebarSkeleton } from "@/components/quizSidebar/quizSidebarSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function QuizSkeleton() {
    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] md:border-[6px] border-gray-200">
                {/* Sidebar Skeleton */}
                <div>
                    <QuizSidebarSkeleton />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-[0.1px] bg-gray-200" />

                {/* Main Quiz Content Skeleton */}
                <div className="py-6 flex-grow space-y-20">
                    {/* Header row: title + sidebar trigger */}
                    <div className="flex items-center mx-4">
                        <SidebarTrigger className="block min-[1000px]:hidden px-3" />
                        <Skeleton className="h-6 sm:h-8 w-3/4 ml-3" />
                    </div>

                    <div className="w-[95%] md:w-[80%] mx-auto">
                        {/* Assignment Details */}
                        <div className="bg-blue-50 p-4 rounded-lg flex flex-col space-y-4">
                            <Skeleton className="h-5 w-1/3" />
                            <div className="flex justify-between items-center">
                                <div className="space-y-2 w-1/2">
                                    <Skeleton className="h-4 w-[80%]" />
                                    <Skeleton className="h-4 w-[60%]" />
                                </div>
                                <Skeleton className="h-10 w-24 rounded-sm" />
                            </div>
                        </div>

                        {/* Grade Section */}
                        <div className="border p-4 rounded-lg flex flex-col space-y-2 mt-6">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-4 w-[60%]" />
                            <Skeleton className="h-8 w-24 mt-2" />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6 mx-6">
                            <Button
                                disabled
                                className="rounded-2xl bg-gray-300 text-gray-500 p-2.5 flex items-center gap-2 cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span>Previous</span>
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
            </div>
        </SidebarProvider>
    );
}
