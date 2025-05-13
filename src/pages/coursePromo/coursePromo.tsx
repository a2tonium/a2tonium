import { Separator } from "@/components/ui/separator";
import { LevelIndicator } from "@/components/coursePromo/levelIndicator";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { BuyPanel } from "@/components/coursePromo/buyPanel";
import { CoursePromoSkeleton } from "@/components/coursePromo/coursePromoSkeleton";
import { ErrorPage } from "@/pages/error/error";
import { useParams } from "react-router-dom";
import { useCourseDataPromo } from "@/hooks/useCourseDataPromo";
import { StatBadge } from "@/components/coursePromo/statBadge";
import { useCategoryNames } from "@/hooks/useCategoryNames";
import { LessonVideo } from "@/components/lessonVideo/lessonVideo";

// Example course object with the required fields

export function CoursePromo() {
    const { courseAddress } = useParams();
    const {
        data: course,
        error,
        isLoading,
    } = useCourseDataPromo(courseAddress);
    const categoryNames = useCategoryNames(course?.attributes?.category ?? []);

    // 1) If error
    if (error) {
        return (
            <ErrorPage
                first={"Course Not Found"}
                second={"We couldn't find your course."}
                third={"Please try again later."}
            />
        );
    }

    // 2) If loading or no data yet => skeleton
    if (isLoading || !course) {
        return <CoursePromoSkeleton />;
    }

    return (
        <div className="w-full bg-white sm:pt-4 md:pt-6 rounded-[2vw] md:border-[6px] border-gray-200">
            {/* 1. Background Image */}
            <div className="relative mx-auto h-[120px] sm:h-[160px] md:h-[200px] w-full sm:w-[96%] rounded-[2vw] overflow-hidden">
                {course.cover_image ? (
                    <img
                        className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
                        src={`https://ipfs.io/ipfs/${course.cover_image.substring(7)}`}
                        alt="Course Background"
                    />
                ) : (
                    <img
                        className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 scale-125 blur-[10px]"
                        src={`https://ipfs.io/ipfs/${course.image.substring(7)}`}
                        alt="Course Background"
                    />
                )}
            </div>

            {/* 2. Course Info */}
            <div className="w-[92%] sm:w-[94%] mx-auto">
                <div className="flex -mt-[43px] sm:-mt-[52px] md:-mt-[58px] relative flex-col sm:flex-row items-start pl-[15px] sm:pl-[20px] md:pl-[25px] lg:pl-[35px]">
                    {/* Course Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white-900 shadow-md rounded-xl overflow-hidden border border-[3px]">
                        <img
                            src={`https://ipfs.io/ipfs/${course.image.substring(
                                7
                            )}`}
                            alt="Course"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Course Description, Stats, etc. */}
                <div className="">
                    <div className="bg-white mt-2">
                        {/* Course Text Info */}
                        <div className="mt-3 sm:mt-0">
                            <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                {course.name}
                            </h1>
                            <span className="text-xs sm:text-sm text-gray-500 mt-1 ">
                                Author:{" "}
                                <span className="hover:underline cursor-pointer">
                                    {course.social_links[0]}
                                </span>
                            </span>
                        </div>
                        <p className=" mt-4 leading-relaxed">
                            {course.attributes.summary}
                        </p>

                        {/* stats area */}
                        <div className="mt-4 space-y-2">
                            <div className="flex flex-wrap gap-2">
                                <StatBadge>
                                    <LevelIndicator
                                        level={course.attributes.level}
                                    />
                                </StatBadge>
                                <StatBadge>
                                    Language: {course.attributes.language}
                                </StatBadge>
                                <StatBadge>Rating: 4</StatBadge>

                                <StatBadge>Students: 4566</StatBadge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categoryNames.map((catName, index) => (
                                    <StatBadge key={index} filled>
                                        {catName}
                                    </StatBadge>
                                ))}
                            </div>
                        </div>
                        <Separator className="mt-2 mb-3" />
                    </div>
                    <div className="flex justify-between mt-4">
                        <div className="md:pl-5 md:w-[60%] space-y-7">
                            {course.video && (
                                <div className="w-full">
                                    <LessonVideo
                                        video_id={course.video}
                                        opts={{
                                            width: "100%", // Делаем видео адаптивным
                                            height: "100%", // Делаем видео адаптивным
                                            playerVars: {
                                                modestbranding: 1, // Убираем логотип YouTube
                                                rel: 0, // Убираем рекомендации в конце видео
                                                showinfo: 0, // Убираем заголовок видео
                                                controls: 1, // Показываем только минимальные контроллы
                                                autoplay: 1,
                                            },
                                        }}
                                    />
                                </div>
                            )}
                            {/* Course Duration */}
                            {/* What You Will Learn */}
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    What you will learn
                                </h2>
                                <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                    {course.attributes.learn}
                                </p>
                            </div>

                            {/* About this course */}
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    About this course
                                </h2>
                                <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                    {course.attributes.about}
                                </p>
                            </div>

                            {/* What You Will Gain */}
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    What You Will Gain
                                </h2>
                                <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                    {course.attributes.gains}
                                </p>
                            </div>

                            {/* Initial requirements */}
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Initial requirements
                                </h2>
                                <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                    {course.attributes.requirements}
                                </p>
                            </div>

                            {/* Course content */}
                            <div id="course-content">
                                <h2 className="text-2xl font-semibold">
                                    Course content
                                </h2>
                                <Accordion
                                    type="multiple"
                                    defaultValue={course.modules.map(
                                        (_, i) => `module-${i}`
                                    )}
                                    className="mt-4 space-y-4"
                                >
                                    {course.modules.map(
                                        (module, moduleIndex) => (
                                            <AccordionItem
                                                key={moduleIndex}
                                                value={`module-${moduleIndex}`}
                                                className="border-b"
                                            >
                                                <AccordionTrigger className="text-lg pb-3 pt-0">
                                                    {module.title}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <ul className="mt-1 space-y-2">
                                                        {module.lessons.map(
                                                            (
                                                                lesson,
                                                                lessonIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        lesson.id
                                                                    }
                                                                    className="text-base flex space-x-2"
                                                                >
                                                                    <p>
                                                                        {lessonIndex +
                                                                            1}
                                                                        .
                                                                    </p>
                                                                    <p>
                                                                        {
                                                                            lesson.title
                                                                        }
                                                                    </p>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    )}
                                </Accordion>
                            </div>
                        </div>

                        {/* Right Panel */}
                        <BuyPanel course={course} />
                    </div>
                </div>
            </div>
        </div>
    );
}
