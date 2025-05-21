import { SidebarMain } from "@/components/lessonSidebar/sidebarMain";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { LessonInterface } from "@/types/course.types";

interface LessonSidebarProps extends React.ComponentProps<typeof Sidebar> {
    data: {
        course: { courseId: string; courseTitle: string };
        modules: {
            moduleTitle: string;
            lessons: LessonInterface[];
        }[];
    };
    activeLessonId: string | undefined;
}

export function LessonSidebar({
    data,
    activeLessonId,
    ...props
}: LessonSidebarProps) {
    const navigate = useNavigate();
    const { isMobile } = useSidebar();

    const handleTitleClick = () => {
        navigate(`../syllabus`);
    };

    return (
        <div className="bg-white m-0 rounded-[2vw]">
            {isMobile}
            <Sidebar
                collapsible={isMobile ? "icon" : "none"}
                {...props}
                className="bg-white rounded-[2vw]"
            >
                <SidebarHeader className="flex px-4 pt-6 pb-0">
                    <div>
                        <p
                            onClick={handleTitleClick}
                            className="cursor-pointer line-clamp-5 hover:underline text-md font-semibold break-words"
                        >
                            {data.course.courseTitle}
                        </p>
                    </div>
                    <Separator className="" />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMain
                        modules={data.modules}
                        activeLessonId={activeLessonId}
                    />
                </SidebarContent>
                {/* <SidebarFooter>
                <NavUser user={data.user} />
                </SidebarFooter> */}
            </Sidebar>
        </div>
    );
}
