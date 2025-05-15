import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAttribute } from "@/utils/courseAttributes";
import { CourseDeployedInterface } from "@/types/courseData";
import { useToast } from "@/hooks/use-toast";
import { promoteCourse } from "@/services/course.service";
import { useCourseContract } from "@/hooks/useCourseContract";
import { useTonConnect } from "@/hooks/useTonConnect";
import React from "react";

interface CoursePromoteDialogProps {
    course: CourseDeployedInterface;
    courseAddress: string | undefined;
    isPromoteOpen: boolean;
    setPromoteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CoursePromoteDialog({
    course,
    courseAddress,
    isPromoteOpen,
    setPromoteOpen,
}: CoursePromoteDialogProps) {
    const { toast } = useToast();
    const { promoteCourseContract } = useCourseContract();
    const { sender } = useTonConnect();

    const handlePromote = async (courseAddress: string) => {
        try {
            await promoteCourse(sender, courseAddress, promoteCourseContract);
            setPromoteOpen(false); // Close the dialog
            toast({
                title: "Course Promoted",
                description: `The course '${course.name}' is now visible in the catalog.`,
                className: "bg-green-500 text-white rounded-[2vw] border-none",
            });
        } catch (error) {
            console.error("Error promoting course:", error);
            toast({
                title: "Error",
                description: "Failed to promote course.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isPromoteOpen} onOpenChange={setPromoteOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Promote Course</DialogTitle>
                </DialogHeader>
                {/* Course Info Summary */}
                <div className="bg-gray-200 p-4 rounded-xl shadow-sm space-y-2 mb-4">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                        {course.name}
                    </h3>
                    <div className="text-sm text-gray-600">
                        <p>
                            <span className="font-medium">Language:</span>{" "}
                            {getAttribute(course.attributes, "language")}
                        </p>
                        <p>
                            <span className="font-medium">Modules:</span>{" "}
                            {course.modules.length}
                        </p>
                        <p>
                            <span className="font-medium">Lessons:</span>{" "}
                            {getAttribute(course.attributes, "lessons")}
                        </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        Promotion Cost: 5 TON
                    </div>
                </div>

                <Separator />
                <p className="text-sm text-gray-700 my-4">
                    Do you really want to promote this course? This course will
                    appear in the catalog page.
                </p>

                <DialogFooter>
                    <Button
                        onClick={() => handlePromote(courseAddress || "")}
                        className="rounded-2xl bg-blue-500 hover:bg-blue-700 text-white"
                    >
                        Promote Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
