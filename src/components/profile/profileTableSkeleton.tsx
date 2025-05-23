import { Skeleton } from "@/components/ui/skeleton";

export function ProfileTableSkeleton() {
    return (
        <div className="rounded-3xl py-4 px-8 bg-white md:border-[6px] border-gray-200">
            <div className="space-y-4 pt-3 pb-4">
                {/* Name row */}
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>
                {/* Address row */}
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
                {/* Balance row */}
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-4 w-1/4 rounded-md" />
                </div>
            </div>
        </div>
    );
}
