import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { CourseDataInterface } from "@/types/courseData";
import { useToast } from "@/hooks/use-toast";
import { Link} from "react-router-dom";
import { sendCourseToPinata } from "@/lib/pinata";
import { useTonConnect } from "@/hooks/useTonConnect";

interface CreateCourseLogicProps {
    course: CourseDataInterface;
    jwt: string | null;
}

const buySchema = z.object({
    accepted: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms." }),
    }),
});

export function CreateCourseButton({
    course,
    open,
    onOpenChange,
    jwt
}: CreateCourseLogicProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState("");
    const { toast } = useToast();
    const { publicKey } = useTonConnect();
    // const navigate = useNavigate();

    const handleCreateCourse = async (publicKey: string) => {
        const result = buySchema.safeParse({ accepted });

        if (!result.success) {
            const firstError =
                result.error.errors[0]?.message || "Invalid input";
            setError(firstError);
            return;
        }

        setError("");
        
        const courseURL = await sendCourseToPinata(course, jwt ?? "", publicKey);
        console.log(courseURL);
        // const courseJSON = JSON.stringify(finalCourse);

        // Save the JSON file
        // const blob = new Blob([courseJSON], { type: "application/json" });
        // const url = URL.createObjectURL(blob);
        // const link = document.createElement("a");
        // link.href = url;
        // link.download = `${course.name.replace(/\s+/g, "_")}_course.json`;
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // URL.revokeObjectURL(url);

        // show toast
        toast({
            title: "Successful Course Creation",
            description: `You've created the course: ${course.name}`,
            className: "bg-green-500 text-white rounded-[2vw]",
        });
        // navigate("/teach");
    };

    return (
        <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Course</DialogTitle>
                </DialogHeader>
                {/* Course Info Summary */}
                <div className="bg-gray-200 p-4 rounded-xl shadow-sm space-y-2 mb-4">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                        {course.name}
                    </h3>
                    <div className="text-sm text-gray-600">
                        <p>
                            <span className="font-medium">Language:</span>{" "}
                            {course.attributes.language}
                        </p>
                        <p>
                            <span className="font-medium">Modules:</span>{" "}
                            {course.modules.length}
                        </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        100 TON
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 py-2">
                    <div className="flex items-center gap-2 mt-2">
                        <Checkbox
                            id="accept"
                            checked={accepted}
                            onCheckedChange={() => setAccepted(!accepted)}
                        />
                        <Label htmlFor="accept" className="text-sm">
                            I accept the{" "}
                            <Link
                                to="/tearms-conditions"
                                className="text-blue-500 hover:underline underline-offset-2"
                            >
                                terms and conditions
                            </Link>
                        </Label>
                    </div>

                    <p className="text-red-500 text-xs mt-1">{error}</p>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => handleCreateCourse(publicKey)}
                        className="font-semibold rounded-2xl bg-goluboy hover:bg-blue-500 text-white"
                    >
                        Create Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
