import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LevelIndicator } from "@/components/coursePromo/levelIndicator";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { CourseCreationInterface } from "@/types/courseData";
import { StatBadge } from "@/components/coursePromo/statBadge";
import { useCategoryNamesSample } from "@/hooks/useCategoryNames";
import { LessonVideo } from "@/components/lessonVideo/lessonVideo";

let courseData: CourseCreationInterface;
let coursePrice: number = 0;

const dataString = sessionStorage.getItem("promoData");
if (dataString) {
    try {
        courseData = JSON.parse(dataString);
    } catch (err) {
        console.error("Failed to parse courseData from sessionStorage", err);
    }
}
const priceString = sessionStorage.getItem("priceData");
if (priceString) {
    try {
        coursePrice = JSON.parse(priceString);
    } catch (err) {
        console.error("Failed to parse coursePrice from sessionStorage", err);
    }
}

export function CoursePromoSample() {
    return (
        <div className="w-full bg-white sm:pt-4 md:pt-6 pb-10 rounded-[2vw] md:border-[6px] border-gray-200">
            {/* 1. Background Image */}
            <div className="relative mx-auto h-[120px] sm:h-[160px] md:h-[200px] w-full sm:w-[96%] rounded-[2vw] overflow-hidden">
                {courseData.cover_image ? (
                    <img
                        className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
                        src={courseData.cover_image}
                        alt="Course Background"
                    />
                ) : (
                    <img
                        className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 scale-125 blur-[10px]"
                        src={courseData.image}
                        alt="Course Background"
                    />
                )}
            </div>

            {/* 2. Course Info */}
            <div className="w-[92%] sm:w-[94%] mx-auto break-words">
                <div className="flex -mt-[43px] sm:-mt-[52px] md:-mt-[58px] relative flex-col sm:flex-row items-start pl-[15px] sm:pl-[20px] md:pl-[25px] lg:pl-[35px]">
                    {/* Course Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white-900 shadow-md rounded-xl overflow-hidden border border-[3px]">
                        <img
                            src={courseData.image}
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
                                {courseData.name}
                            </h1>
                            <span className="text-xs sm:text-sm text-gray-500 mt-1 ">
                                Author:{" "}
                                <span className="hover:underline cursor-pointer">
                                    {/* {courseData.authorName} */}
                                    Anton Chigur
                                </span>
                            </span>
                        </div>

                        {/* stats area */}
                        <div className="mt-4 space-y-2">
                            <div className="flex flex-wrap gap-2">
                                <StatBadge>Students: 4566</StatBadge>
                                <StatBadge>
                                    Language: {courseData.attributes.language}
                                </StatBadge>
                                <StatBadge>Rating: 4</StatBadge>
                                <StatBadge>
                                    <LevelIndicator
                                        level={courseData.attributes.level}
                                    />
                                </StatBadge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {useCategoryNamesSample(
                                    courseData.attributes.category
                                ).map((catName, index) => (
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
                            {courseData.video && (
                                <div className="w-full">
                                    <LessonVideo
                                        video_id={courseData.video}
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
                            {/* What You Will Learn */}
                            <div>
                                <h2 className="text-2xl font-normal">
                                    What you will learn
                                </h2>
                                <p className="mt-2 space-y-2">
                                    {courseData.attributes.learn}
                                </p>
                            </div>

                            {/* About this course */}
                            <div>
                                <h2 className="text-2xl font-normal">
                                    About this course
                                </h2>
                                <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                    {courseData.attributes.about}
                                </p>
                            </div>

                            {/* Initial requirements */}
                            <div>
                                <h2 className="text-2xl font-normal">
                                    Initial requirements
                                </h2>
                                <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                    {courseData.attributes.requirements}
                                </p>
                            </div>

                            {/* How you will learn */}
                            {/* <div>
                            <h2 className="text-2xl font-normal">
                                How you will learn
                            </h2>
                            <span className="mt-2 space-y-2">
                                <p>{courseData.whatYouWillLearn}</p>
                            </span>
                        </div> */}

                            {/* Course content */}
                            <div id="course-content">
                                <h2 className="text-2xl font-normal">
                                    Course content
                                </h2>
                                <Accordion
                                    type="multiple"
                                    defaultValue={courseData.modules.map(
                                        (_, i) => `module-${i}`
                                    )}
                                    className="mt-4 space-y-4"
                                >
                                    {courseData.modules.map(
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
                                                                        lessonIndex +
                                                                        1
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
                        <div
                            className="w-full md:w-[35%] md:sticky md:top-20 h-fit bg-white p-2 md:p-6 
                fixed bottom-0 left-0 md:relative shadow-[0px_-4px_10px_rgba(0,0,0,0.12)] md:shadow-none"
                            style={{ maxWidth: "100vw", zIndex: "50" }}
                        >
                            <div className="w-[90%] sm:w-[60%] md:w-full mx-auto">
                                <div className="w-full">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {coursePrice} TON
                                    </h3>

                                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2 md:mt-4 font-bold">
                                        Buy
                                    </Button>

                                    <Separator className="my-2 md:my-4" />

                                    <div className="hidden md:block">
                                        <h3 className="text-md font-semibold text-gray-800">
                                            You can learn right away
                                        </h3>
                                        <p className="text-sm text-gray-800 underline">
                                            {courseData.attributes.workload}
                                        </p>
                                        <p className="text-sm text-gray-800 underline">
                                            {courseData.attributes.duration}
                                        </p>
                                        <Separator className="my-4" />
                                    </div>

                                    {/* Course Includes */}
                                    <div className="bg-gray-50 px-2 md:p-4 rounded-lg">
                                        <h4 className="text-md font-semibold text-gray-800 hidden md:block">
                                            This course includes
                                        </h4>
                                        <p className="text-sm text-gray-700 mt-1">
                                            <strong>
                                                {courseData.modules.reduce(
                                                    (totalLessons, module) =>
                                                        totalLessons +
                                                        module.lessons.length,
                                                    0
                                                )}
                                            </strong>{" "}
                                            lessons
                                        </p>
                                        {/* <p className="text-sm text-gray-700">
                                    <strong>50 mins</strong> of video
                                    </p> */}
                                        <p className="text-sm text-gray-700">
                                            <strong>
                                                {courseData.modules.length}
                                            </strong>{" "}
                                            quizzes
                                        </p>
                                        <a
                                            href="#course-content"
                                            className="text-blue-600 hover:underline mt-2 block text-sm"
                                        >
                                            View course content
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
