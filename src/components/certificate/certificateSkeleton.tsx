import { Skeleton } from "@/components/ui/skeleton";

export function CertificateSkeleton() {
    return (
        <div className="bg-white p-6 w-full mx-auto rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left image placeholder */}
                <div className="w-1/2">
                    <Skeleton className="w-full aspect-[4/4] rounded-xl" />
                </div>

                {/* Right info panel */}
                <div className="flex-1 space-y-4">
                    {/* Title */}
                    <Skeleton className="h-6 sm:h-7 w-2/3 rounded" />

                    {/* Course info */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded object-cover" />
                        <Skeleton className="h-5 w-40 rounded" />
                    </div>

                    {/* Description */}
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-4 w-2/4 rounded" />

                    {/* Owner Info */}
                    <Skeleton className="h-5 w-48 rounded" />

                    {/* Attributes section */}
                    <div className="mt-6 space-y-3">
                        <Skeleton className="h-6 w-32 rounded" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-20 w-full rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
