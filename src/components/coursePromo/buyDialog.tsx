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
import { CoursePromoInterface } from "@/types/course.types";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { getAttribute } from "@/utils/course.attributes.utils";
import { courseEnroll } from "@/services/course.service";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useCourseContract } from "@/hooks/useCourseContract";
import { useTranslation } from "react-i18next";

interface BuyLogicProps {
    course: CoursePromoInterface;
    courseAddress: string | undefined;
}

export function BuyDialog({ course, courseAddress }: BuyLogicProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [iic, setIIC] = useState("");
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState("");

    const { toast } = useToast();
    const { sender } = useTonConnect();
    const { enrollToCourseContract } = useCourseContract();
    const navigate = useNavigate();

    const buySchema = z.object({
        iic: z.string().regex(/^\d{12}$/, t("buyDialog.invalidIIC")),
        email: z
            .string()
            .email(t("buyDialog.invalidEmail"))
            .endsWith("@gmail.com", t("buyDialog.onlyGmail")),
        accepted: z.literal(true, {
            errorMap: () => ({ message: t("buyDialog.acceptTerms") }),
        }),
    });

    const handleBuy = async () => {
        const result = buySchema.safeParse({ iic, email, accepted });

        if (!result.success) {
            const firstError =
                result.error.errors[0]?.message || t("buyDialog.invalidInput");
            setError(firstError);
            return;
        }

        setError("");

        try {
            await courseEnroll(
                sender,
                courseAddress!,
                iic,
                email,
                course.cost,
                enrollToCourseContract
            );

            navigate("/learn");
            toast({
                title: t("buyDialog.successTitle", { name: course.name }),
                description: t("buyDialog.successDesc"),
                className: "bg-green-500 text-white rounded-[2vw] border-none",
            });
        } catch (error) {
            console.error("Error creating course:", error);
            toast({
                title: t("buyDialog.errorTitle"),
                description: t("buyDialog.errorDesc"),
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <BuyButton className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 md:mt-4 font-bold" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("buyDialog.title")}</DialogTitle>
                </DialogHeader>

                <div className="bg-gray-200 p-4 rounded-xl shadow-sm space-y-2 mb-4">
                    <h3 className="text-md sm:text-lg font-semibold text-gray-800">
                        {course.name}
                    </h3>
                    <div className="text-sm text-gray-600">
                        <p>
                            <span className="font-medium">
                                {t("buyDialog.language")}:
                            </span>{" "}
                            {getAttribute(course.attributes, "language")}
                        </p>
                        <p>
                            <span className="font-medium">
                                {t("buyDialog.modules")}:
                            </span>{" "}
                            {course.modules.length}
                        </p>
                        <p>
                            <span className="font-medium">
                                {t("buyDialog.lessons")}:
                            </span>{" "}
                            {getAttribute(course.attributes, "lessons")}
                        </p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        {course.cost} TON
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 py-2">
                    <div>
                        <Label htmlFor="iic">{t("buyDialog.iicLabel")}</Label>
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
                        <Label htmlFor="email">
                            {t("buyDialog.emailLabel")}
                        </Label>
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
                            {t("buyDialog.accept")}{" "}
                            <Link
                                to="/tearms-conditions"
                                className="text-blue-500 hover:underline underline-offset-2"
                            >
                                {t("buyDialog.terms")}
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
                        {t("buyDialog.buyButton")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
