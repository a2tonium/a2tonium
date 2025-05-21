import { BookCheck, ChevronRight, type LucideIcon } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CertificateDialog } from "@/components/courseSidebar/certificateDialog";
import { CourseDeployedInterface, QuizAnswers } from "@/types/course.types";

export function SidebarMain({
    items,
    courseData,
    grades,
}: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
    courseData: CourseDeployedInterface;
    grades: QuizAnswers[];
}) {
    const isCertValid = grades.length === courseData.modules.length;
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                <Link to={subItem.url}>
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>

                            {/* Get Certificate Button with Dialog */}
                            <div className="flex items-center justify-start mt-2 pl-2">
                                <BookCheck className="w-4 h-4" />
                                <CertificateDialog
                                    quizId={courseData.modules.at(-1)!.id}
                                    trigger={
                                        <Button
                                            type="button"
                                            variant={"link"}
                                            className={`rounded-2xl gap-0 flex justify-center items-center p-1.5 ${
                                                !isCertValid
                                                    ? "text-gray-500 cursor-not-allowed"
                                                    : "hover:border-blue-500 text-gray-500 hover:text-goluboy transition-colors duration-200"
                                            }`}
                                            disabled={!isCertValid}
                                        >
                                            <span className="font-semibold">
                                                Get Certificate
                                            </span>
                                            <ChevronRight
                                                className="flex justify-center items-center"
                                                style={{
                                                    width: "18px",
                                                    height: "18px",
                                                }}
                                            />
                                        </Button>
                                    }
                                />
                            </div>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
