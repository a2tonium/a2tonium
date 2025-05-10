import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function CoursePromoSkeleton() {
    return (
        <div className="w-full bg-white rounded-[2vw] md:border-[6px] border-gray-200 sm:pt-4 md:pt-6 pb-10">
            {/* 1. Background Image */}
            <div className="relative mx-auto h-[120px] sm:h-[160px] md:h-[200px] w-full sm:w-[96%] rounded-[2vw] overflow-hidden">
                <Skeleton className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 scale-125" />
            </div>

            {/* 2. Content */}
            <div className="w-[92%] sm:w-[94%] mx-auto">
                <div className="flex -mt-[43px] sm:-mt-[52px] md:-mt-[58px] relative flex-col sm:flex-row items-start pl-[15px] sm:pl-[20px] md:pl-[25px] lg:pl-[35px]">
                    <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl" />
                </div>

                <div className="mt-4">
                    <Skeleton className="w-3/4 h-8 mb-2" />
                    <Skeleton className="w-1/4 h-4 mb-4" />
                    <Skeleton className="w-full h-20 mb-6" />

                    <div className="flex flex-col sm:flex-row mt-4 space-y-2 sm:space-y-0 sm:space-x-10 text-sm">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-24 h-4" />
                    </div>

                    <Separator className="mt-4 mb-6" />

                    {/* FIX: Wrapping content and sidebar like in final layout */}
                    <div className="flex flex-col md:flex-row justify-between gap-10 mt-4">
                        {/* LEFT Content Area */}
                        <div className="md:pl-5 md:w-[60%] space-y-7">
                            {[...Array(5)].map((_, idx) => (
                                <div key={idx}>
                                    <Skeleton className="w-1/2 h-6 mb-2" />
                                    <Skeleton className="w-full h-16" />
                                </div>
                            ))}

                            <div id="course-content" className="mt-8">
                                <Skeleton className="w-1/2 h-6 mb-4" />
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="mb-4">
                                        <Skeleton className="w-full h-6 mb-2" />
                                        <Skeleton className="w-full h-10" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT BuyPanel Skeleton */}
                        <div
                            className="w-full md:w-[35%] md:sticky md:top-20 h-fit bg-white p-2 md:p-6 
                shadow-[0px_-4px_10px_rgba(0,0,0,0.12)] md:shadow-none"
                            style={{ maxWidth: "100vw", zIndex: "50" }}
                        >
                            <div className="w-[90%] sm:w-[60%] md:w-full mx-auto">
                                <Skeleton className="w-1/3 h-6 mb-4" />
                                <Skeleton className="w-full h-10 mb-4" />

                                <Skeleton className="w-2/3 h-4 mb-2" />
                                <Skeleton className="w-2/3 h-4 mb-4" />

                                <Skeleton className="w-full h-20 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
