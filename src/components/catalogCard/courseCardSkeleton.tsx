import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
    return (
        <Card className="w-full h-auto md:h-[200px] border-0 bg-white rounded-lg shadow-inner bg-gray-100 p-4 flex flex-col justify-between">
            {/* Main Content */}
            <div className="flex flex-1">
                {/* Left Section */}
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Title */}
                    <Skeleton className="h-4 w-1/3 rounded-md" /> {/* Author */}
                </div>

                {/* Right Image */}
                <Skeleton className="w-16 h-16 lg:w-24 lg:h-24 rounded-lg ml-4" />
            </div>
            {/* Icons Section */}
            <div className="flex items-center space-x-4 mt-2">
                <Skeleton className="h-4 w-8 rounded-md" /> {/* Rating */}
                <Skeleton className="h-4 w-8 rounded-md" /> {/* Users */}
                <Skeleton className="h-4 w-8 rounded-md" /> {/* Duration */}
            </div>
            {/* Footer Section */}
            <Skeleton className="h-6 w-1/4 rounded-md mt-4" /> {/* Price */}
        </Card>
    );
}
