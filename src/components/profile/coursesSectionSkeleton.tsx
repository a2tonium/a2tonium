import { Skeleton } from "@/components/ui/skeleton";

export function CoursesSectionSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl shadow-md overflow-hidden">
                    <Skeleton className="w-full aspect-square" />
                    <div className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
