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
import { withdrawCourse } from "@/services/course.service";
import { useCourseContract } from "@/hooks/useCourseContract";
import { useTonConnect } from "@/hooks/useTonConnect";
import React from "react";

interface CourseWithdrawDialogProps {
    course: CourseDeployedInterface;
    courseAddress: string | undefined;
    isWithdrawOpen: boolean;
    setWithdrawOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CourseWithdrawDialog({
    course,
    courseAddress,
    isWithdrawOpen,
    setWithdrawOpen,
}: CourseWithdrawDialogProps) {
    const { toast } = useToast();
    const { withdrawCourseContract, getAddressBalance } = useCourseContract();
    const { sender } = useTonConnect();
    const [balance, setBalance] = React.useState<string>("0");

    const handleWithdraw = async (courseAddress: string) => {
        try {
            await withdrawCourse(sender, courseAddress, withdrawCourseContract);
            setWithdrawOpen(false); // Close the dialog
            toast({
                title: "Course Withdraw successful",
                description: `Please check your wallet balance.`,
                className: "bg-green-500 text-white rounded-[2vw] border-none",
            });
        } catch (error) {
            console.error("Error withdrawing course:", error);
            toast({
                title: "Error",
                description: "Failed to withdraw course.",
                variant: "destructive",
            });
        }
    };

    const handleCheckBalance = async (address: string) => {
        setBalance(await getAddressBalance(address) || "0")
    };

    return (
        <Dialog open={isWithdrawOpen} onOpenChange={setWithdrawOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Withdraw Course</DialogTitle>
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
                        Balance: {balance} TON
                    </div>
                    <Button
                        onClick={() => handleCheckBalance(courseAddress || "")}
                        className="rounded-2xl bg-blue-500 hover:bg-blue-700 text-white"
                        value={balance}
                    >
                        Check Balance
                    </Button>
                </div>

                <Separator />
                <p className="text-sm text-gray-700 my-4">
                    Do you really want to Withdraw balance from this course?
                </p>

                <DialogFooter>
                    <Button
                        onClick={() => handleWithdraw(courseAddress || "")}
                        className="rounded-2xl bg-blue-500 hover:bg-blue-700 text-white"
                    >
                        Withdraw Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
