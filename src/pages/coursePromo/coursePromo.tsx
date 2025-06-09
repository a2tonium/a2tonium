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
import { Link, useParams } from "react-router-dom";
import { useCourseDataPromo } from "@/hooks/useCourseDataPromo";
import { StatBadge } from "@/components/coursePromo/statBadge";
import { useCategoryNames } from "@/hooks/useCategoryNames";
import { LessonVideo } from "@/components/lessonVideo/lessonVideo";
import { getAttribute } from "@/utils/course.attributes.utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { getLink } from "@/utils/ton.utils";

export function CoursePromo() {
    const { t } = useTranslation();
    const { courseAddress } = useParams();
    const { data, error, isLoading } = useCourseDataPromo(courseAddress);

    const course = data?.course;
    const profileData = data?.profile;

    const categoryNames = useCategoryNames(
        getAttribute(course?.attributes, "category")
    );

    if (error) {
        return (
            <ErrorPage
                first={t("promo.error.title")}
                second={t("promo.error.message")}
                third={t("promo.error.retry")}
            />
        );
    }

    if (isLoading || !course) {
        return <CoursePromoSkeleton />;
    }
    console.log("Course data:", course.cover_image?.trim());
    return (
        <div className="w-full bg-white sm:pt-4 md:pt-6 rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="relative mx-auto h-[120px] sm:h-[160px] md:h-[200px] w-full sm:w-[96%] rounded-[2vw] overflow-hidden">
                <img
                    className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
                    src={getLink(course.cover_image && course.cover_image.trim() !== "ipfs://" ? course.cover_image : "bafkreidl5rgcmin5pvwkp3uazeyouev6f3sqs5zcpdgxjxhololwj7rs3u")}
                    alt={t("promo.courseBackgroundAlt")}
                />
            </div>

            <div className="w-[92%] sm:w-[94%] mx-auto">
                <div className="flex -mt-[43px] sm:-mt-[52px] md:-mt-[58px] relative flex-col sm:flex-row items-start pl-[15px] sm:pl-[20px] md:pl-[25px] lg:pl-[35px]">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white-900 shadow-md rounded-xl overflow-hidden border border-[3px]">
                        <img
                            src={getLink(course.image)}
                            alt={t("promo.courseImageAlt")}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="bg-white mt-2">
                    <div className="mt-3 sm:mt-0">
                        <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            {course.name}
                        </h1>
                        <span className="text-xs sm:text-sm text-gray-500 font-semibold mt-1 ">
                            {t("promo.author")}{" "}
                            <span className="hover:underline cursor-pointer">
                                <Link to={`/user/${course.ownerAddress}`}>
                                    {profileData?.name}
                                </Link>
                            </span>
                        </span>
                    </div>

                    <p className="mt-4 leading-relaxed">
                        {getAttribute(course.attributes, "description")}
                    </p>

                    <div className="mt-4 space-y-2">
                        <div className="flex flex-wrap gap-2">
                            <StatBadge>
                                <LevelIndicator
                                    level={getAttribute(
                                        course.attributes,
                                        "level"
                                    )}
                                />
                            </StatBadge>
                            <StatBadge>
                                {t("promo.language")}:{" "}
                                {getAttribute(course.attributes, "language")}
                            </StatBadge>
                            <StatBadge>{t("promo.rating")}: 4</StatBadge>
                            <StatBadge>
                                {t("promo.students")}: {course.enrolledNumber}
                            </StatBadge>
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
                                        width: "100%",
                                        height: "100%",
                                        playerVars: {
                                            modestbranding: 1,
                                            rel: 0,
                                            showinfo: 0,
                                            controls: 1,
                                            autoplay: 1,
                                        },
                                    }}
                                />
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-semibold mb-3">
                                {t("promo.aboutAuthor")}
                            </h2>
                            <Link to={`/user/${course.ownerAddress}`}>
                                <Card className="hover:border-blue-500 transition-all duration-200 cursor-pointer">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        {profileData?.image ? (
                                            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
                                                <img
                                                    src={getLink(profileData.image)}
                                                    alt="Author Avatar"
                                                    className="object-cover w-full h-full"
                                                />
                                            </Avatar>
                                        ) : (
                                            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-200" />
                                        )}
                                        <div className="flex flex-col justify-center text-left">
                                            <p className="text-lg font-semibold text-gray-800">
                                                {profileData?.name || "Unnamed"}
                                            </p>
                                            {profileData?.description && (
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-3 whitespace-pre-wrap">
                                                    {profileData.description}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {t("promo.learn")}
                            </h2>
                            <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                {getAttribute(course.attributes, "learn")}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {t("promo.aboutCourse")}
                            </h2>
                            <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                {getAttribute(course.attributes, "about")}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {t("promo.gains")}
                            </h2>
                            <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                {getAttribute(course.attributes, "gains")}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {t("promo.requirements")}
                            </h2>
                            <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                                {getAttribute(
                                    course.attributes,
                                    "requirements"
                                )}
                            </p>
                        </div>

                        <div id="course-content">
                            <h2 className="text-2xl font-semibold">
                                {t("promo.courseContent")}
                            </h2>
                            <Accordion
                                type="multiple"
                                defaultValue={course.modules.map(
                                    (_, i) => `module-${i}`
                                )}
                                className="mt-4 space-y-4"
                            >
                                {course.modules.map((module, moduleIndex) => (
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
                                                    (lesson, lessonIndex) => (
                                                        <li
                                                            key={lesson.id}
                                                            className="text-base flex space-x-2"
                                                        >
                                                            <p>
                                                                {lessonIndex +
                                                                    1}
                                                                .
                                                            </p>
                                                            <p>
                                                                {lesson.title}
                                                            </p>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>

                    <BuyPanel courseAddress={courseAddress} course={course} />
                </div>
            </div>
        </div>
    );
}
