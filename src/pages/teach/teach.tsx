import { TeachCard } from "@/components/teachCard/teachCard"; // Импорт TeachCard
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TeachCardSkeleton } from "@/components/teachCard/teachCardSkeleton";
import useSWR from "swr";
import { fetchTeachCourses, TeachCourseInterface } from "@/lib/teachService";
import { ErrorPage } from "@/pages/error/error";

export const Teach = () => {
    const {
        data: courses,
        error,
        isLoading,
    } = useSWR<TeachCourseInterface[]>("teach-courses", fetchTeachCourses, {
        shouldRetryOnError: false,
    });

    const navigate = useNavigate();

    const handleAddCourse = () => {
        navigate(`create`);
    };

    if (error) {
        return (
            <ErrorPage
                first={"Courses Not Found"}
                second={"We couldn't find your courses."}
                third={"Please try again later."}
            />
        );
    }

    return (
        <main className="p-4 max-w-4xl bg-white p-4 flex flex-col items-center mx-auto pb-10 rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="w-full max-w-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="md:text-2xl sm:text-xl font-bold">
                        Ваши курсы
                    </h2>
                    <Button
                        onClick={handleAddCourse}
                        variant="outline"
                        className="flex items-center border-blue-500 text-blue-500 
                    hover:border-blue-700 hover:text-blue-700 transition-colors duration-200 rounded-2xl"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">New course</span>
                    </Button>
                </div>
                <div className="space-y-4">
                    {/* 3) If still loading initial data (courses is undefined) => skeleton */}
                    {isLoading && !courses && (
                        <>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TeachCardSkeleton key={index} />
                            ))}
                        </>
                    )}

                    {courses && courses.length === 0 && (
                        <div className="flex flex-col items-center space-y-4 mt-8">
                            <img
                                src="/images/coding.svg"
                                alt="No courses"
                                className="w-[180px] h-auto"
                            />
                            <p className="text-gray-700 text-center text-sm md:text-lg">
                                Create your first course or check out{" "}
                                <Link
                                    to="/catalog"
                                    className="text-goluboy hover:text-blue-600 underline"
                                >
                                    our catalog
                                </Link>
                                .
                            </p>
                        </div>
                    )}

                    {/* Otherwise, if we have data, map it */}
                    {courses &&
                        courses.length > 0 &&
                        courses.map((course) => (
                            <TeachCard key={course.courseId} {...course} />
                        ))}
                </div>
            </div>
        </main>
    );
};
