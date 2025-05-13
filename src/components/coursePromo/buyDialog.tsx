import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { BuyButton } from "@/components/coursePromo/buyButton";
import { CoursePromoInterface } from "@/types/courseData";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { getAttribute } from "@/utils/courseAttributes";

interface BuyLogicProps {
    course: CoursePromoInterface;
}

const buySchema = z.object({
    iic: z.string().regex(/^\d{12}$/, "IIC must be a 12-digit number"),
    email: z
        .string()
        .email("Invalid email address")
        .endsWith("@gmail.com", "Only Gmail is allowed"),
    accepted: z.literal(true, {
        errorMap: () => ({ message: "You must accept the terms." }),
    }),
});

export function BuyDialog({ course }: BuyLogicProps) {
    const [email, setEmail] = useState("");
    const [iic, setIIC] = useState("");
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleBuy = () => {
        const result = buySchema.safeParse({ iic, email, accepted });

        if (!result.success) {
            const firstError =
                result.error.errors[0]?.message || "Invalid input";
            setError(firstError);
            return;
        }

        setError("");

        // ✅ show toast
        toast({
            title: "Purchase successful",
            description: `You've successfully bought the course: ${course.name}`,
            className: "bg-green-500 text-white rounded-[2vw]",
        });
        navigate("/learn");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <BuyButton className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 md:mt-4 font-bold" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Buy Course</DialogTitle>
                </DialogHeader>
                {/* Course Info Summary */}
                <div className="bg-gray-200 p-4 rounded-xl shadow-sm space-y-2 mb-4">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                        {course.name}
                    </h3>
                    <div className="text-sm text-gray-600">
                        <p>
                            <span className="font-medium">Language:</span>{" "}
                            {getAttribute(course, "language")}
                        </p>
                        <p>
                            <span className="font-medium">Modules:</span>{" "}
                            {course.modules.length}
                        </p>
                        <p>
                            <span className="font-medium">Lessons:</span>{" "}
                            {getAttribute(course, "lessons")}
                        </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        {course.cost} TON
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 py-2">
                    <div>
                        <Label htmlFor="iic">
                            IIC (Individual Identity Code)
                        </Label>
                        <Input
                            id="iic"
                            placeholder="031104225930"
                            type="number"
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={12}
                            minLength={12}
                            value={iic}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && value.length <= 12) {
                                  setIIC(value);
                                }
                              }}
                            className="rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email (Gmail only)</Label>
                        <Input
                            id="email"
                            placeholder="student@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
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
                        onClick={handleBuy}
                        className="rounded-2xl bg-blue-500 hover:bg-blue-700 text-white"
                    >
                        Buy Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
