import { useState, useMemo } from "react";
import { CourseCard } from "@/components/catalogCard/courseCard";
import { CourseCardSkeleton } from "@/components/catalogCard/courseCardSkeleton";
import { useCatalogCourses } from "@/hooks/useCatalogCourses";
import { ErrorPage } from "@/pages/error/error";
import { SortButton } from "@/components/catalog/sortButton";
import { FilterCourses } from "@/components/catalog/filterCourses";
import { FilterType } from "@/types/course.types";
import { filterAndSortCourses } from "@/utils/catalog.utils";

export function Catalog() {
    const { data: visibleCourses, isLoading, error } = useCatalogCourses();

    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
    const [selectedRating, setSelectedRating] = useState<number[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState("featured");

    const filteredCourses = useMemo(() => {
        return filterAndSortCourses(
            visibleCourses ?? [],
            selectedCategory,
            selectedDifficulty,
            selectedRating,
            selectedPrice,
            sortBy
        );
    }, [
        visibleCourses,
        selectedCategory,
        selectedDifficulty,
        selectedRating,
        selectedPrice,
        sortBy,
    ]);

    const anyFiltersActive =
        selectedCategory.length > 0 ||
        selectedDifficulty.length > 0 ||
        selectedRating.length > 0 ||
        selectedPrice.length > 0;

    const resetAllFilters = () => {
        setSelectedCategory([]);
        setSelectedDifficulty([]);
        setSelectedRating([]);
        setSelectedPrice([]);
    };

    const handleFilterChange = (type: FilterType, value: string | number) => {
        const toggle = <T,>(prev: T[], v: T): T[] =>
            prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v];

        if (type === "difficulty" && typeof value === "string")
            setSelectedDifficulty((prev) => toggle(prev, value));
        else if (type === "rating" && typeof value === "number")
            setSelectedRating((prev) => toggle(prev, value));
        else if (type === "price" && typeof value === "number")
            setSelectedPrice((prev) => toggle(prev, value));
    };

    if (error && !visibleCourses) {
        return (
            <ErrorPage
                first="Catalog Not Found"
                second="We couldn't find catalog."
                third="Please try again later."
            />
        );
    }

    return (
        <main className="min-h-screen bg-white p-6 rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Online Courses
                    </h2>
                    <SortButton sortBy={sortBy} setSortBy={setSortBy} />
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-56 flex-shrink-0 space-y-4 lg:mt-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Filters
                        </h3>

                        <FilterCourses
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedDifficulty={selectedDifficulty}
                            selectedRating={selectedRating}
                            selectedPrice={selectedPrice}
                            handleFilterChange={handleFilterChange}
                        />
                        {anyFiltersActive && (
                            <button
                                onClick={resetAllFilters}
                                className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition mb-2"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                            {isLoading &&
                                Array.from({ length: 9 }).map((_, idx) => (
                                    <CourseCardSkeleton key={idx} />
                                ))}

                            {filteredCourses.map((course) => (
                                <CourseCard
                                    key={
                                        course.courseAddress +
                                        course.authorAddress
                                    }
                                    {...course}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
