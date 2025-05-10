import { LearnCard } from "@/components/learnCard/learnCard";
import { LearnCardSkeleton } from "@/components/learnCard/learnCardSkeleton";
// import useSWR from "swr";
// import { fetchLearnCourses, LearnCourseInterface } from "@/lib/learnService";
import { ErrorPage } from "@/pages/error/error";
import { Link } from "react-router-dom";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourseList";

export const Learn = () => {
    const { data: courses, isLoading, error } = useEnrolledCourses();
    // const {
    //     data: courses,
    //     error,
    //     isLoading,
    // } = useSWR<LearnCourseInterface[]>("learn-courses", fetchLearnCourses, {
    //     shouldRetryOnError: false,
    // });

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
        <main className="flex flex-col min-h-96 items-center mx-auto max-w-4xl w-full bg-white p-4 pt-6 pb-10 rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="w-full max-w-3xl">
                <div className="mb-6">
                    <h2 className="md:text-2xl sm:text-xl font-bold">
                        Мое обучение
                    </h2>
                </div>
                <div className="w-full space-y-4 flex flex-col items-center">
                    {isLoading && !courses && (
                        <>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <LearnCardSkeleton key={index} />
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
                                Find your first course in{" "}
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

                    {courses &&
                        courses.length > 0 &&
                        courses.map((course) => (
                            <LearnCard key={course.courseAddress} {...course} />
                        ))}
                </div>
            </div>
        </main>
    );
};
