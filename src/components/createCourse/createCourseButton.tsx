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
import { Link } from "react-router-dom";
import { sendCourseToPinata } from "@/services/courseCreation.service";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Check } from "lucide-react";
import { Spinner } from "@/components/ui/kibo-ui/spinner";

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
    jwt,
}: CreateCourseLogicProps & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
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
        setIsLoading(true);
        setIsSuccess(false);

        try {
            const courseURL = await sendCourseToPinata(
                course,
                jwt ?? "",
                publicKey
            );
            console.log(courseURL);

            setIsSuccess(true);
            toast({
                title: "Successful Course Creation",
                description: `You've created the course: ${course.name}`,
                className: "bg-green-500 text-white rounded-[2vw]",
            });
        } catch (error) {
            console.error("Error creating course:", error);
            toast({
                title: "Error",
                description: "Failed to create course.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
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
                        className="font-semibold rounded-2xl bg-goluboy hover:bg-blue-500 text-white flex items-center gap-2"
                        disabled={isLoading || !accepted}
                    >
                        Create Course
                        {isLoading ? (
                            <Spinner className="animate-spin w-4 h-4" />
                        ) : isSuccess ? (
                            <Check className="w-4 h-4" />
                        ) : null}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
