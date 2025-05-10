import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TeachCardSkeleton: React.FC = () => {
    return (
        <Card className="h-auto xs:h-[200px] relative border-0 w-full max-w-4xl p-4 shadow-inner shadow-md">
            {/* Menu Skeleton */}
            <div className="absolute top-4 right-4">
                <Skeleton className="w-5 h-5 rounded-full" />
            </div>

            {/* Main Content Skeleton */}
            <div className="flex items-center">
                {/* Image Skeleton */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-md bg-gray-200 flex-shrink-0">
                    <Skeleton className="w-full h-full" />
                </div>

                {/* Text Block Skeleton */}
                <div className="ml-4 md:pt-3 flex-1 pr-10">
                    {/* Title Skeleton */}
                    <Skeleton className="h-5 w-3/4 mb-3 rounded-md" />

                    {/* Buttons Skeleton */}
                    <div className="hidden sm:flex space-x-2 mt-2">
                        <Skeleton className="h-4 w-20 rounded-md" />
                        <Skeleton className="h-4 w-20 rounded-md" />
                    </div>
                </div>
            </div>
        </Card>
    );
};
