import { SidebarMain } from "@/components/quizSidebar/sidebarMain";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface QuizSidebarProps extends React.ComponentProps<typeof Sidebar> {
    data: {
        course: { courseId: string; courseTitle: string };
        quizzes: {
            id: string;
            title: string;
            completed: boolean;
            score: null | number;
            totalQuestions: number;
        }[];
    };
}

export function QuizSidebar({ data, ...props }: QuizSidebarProps) {
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
                    <SidebarMain quizzes={data.quizzes} />
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
