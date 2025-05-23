import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { useState } from "react";
import { ImageDropzone } from "@/components/createCourse/imageDropzone";
import {
    SelectSocialLink,
    SocialLink,
} from "@/components/profile/selectSocialLinks";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { checkPinataConnection } from "@/lib/pinata/pinata.client.lib";
import { updateProfile } from "@/services/profile.service";
import { ProfileWithWalletDataInterface } from "@/types/profile.types";
import { useProfileContract } from "@/hooks/useProfileContract";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useTranslation } from "react-i18next";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: ProfileWithWalletDataInterface;
}

export function EditProfileDialog({
    open,
    onOpenChange,
    initialData,
}: EditProfileDialogProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { updateProfileContract } = useProfileContract();
    const { sender } = useTonConnect();
    const [form, setForm] = useState({
        image: initialData.image || "",
        name: initialData.name || "",
        description: initialData.description || "",
        social_links:
            initialData.attributes?.map((a) => ({
                type: a.trait_type,
                value: a.value,
            })) || [],
        jwt: "",
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [updated, setUpdated] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSocialLinksChange = (links: SocialLink[]) => {
        setForm((prev) => ({ ...prev, social_links: links }));
    };

    const SOCIAL_PREFIX_MAP: Record<string, string> = {
        Telegram: "t.me/",
        Youtube: "www.youtube.com/user/",
        Instagram: "www.instagram.com/",
        X: "x.com/",
        Linkedin: "www.linkedin.com/in/",
        Facebook: "www.facebook.com/",
    };

    const socialLinkSchema = z
        .object({
            type: z.string().min(1),
            value: z.string().min(1),
        })
        .superRefine((data, ctx) => {
            const { type, value } = data;
            if (type === "Email" || type === "Other") return;
            const requiredPrefix = SOCIAL_PREFIX_MAP[type];
            const normalized = value.replace(/^https?:\/\//, "");
            if (!normalized.startsWith(requiredPrefix)) {
                ctx.addIssue({
                    path: ["value"],
                    message: t("editProfileDialog.invalidLink", {
                        prefix: requiredPrefix,
                    }),
                    code: z.ZodIssueCode.custom,
                });
            }
        });

    const profileSchema = z.object({
        image: z.string().min(1, "Avatar is required"),
        name: z.string().min(2, "Name must be at least 2 characters"),
        description: z
            .string()
            .min(1, "Description is required")
            .max(256, "Description too long")
            .optional(),
        social_links: z.array(socialLinkSchema).max(10),
        jwt: z.string().min(10, "JWT is too short"),
    });

    const handleUpdate = async () => {
        setIsLoading(true);
        setFormErrors({});

        const result = profileSchema.safeParse(form);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach((e) => {
                const field = e.path[0];
                if (typeof field === "string") {
                    errors[field] = e.message;
                }
            });
            setFormErrors(errors);
            setIsLoading(false);
            return;
        }

        const isJwtValid = await checkPinataConnection(form.jwt);
        if (!isJwtValid) {
            setFormErrors({ jwt: t("editProfileDialog.jwtInvalid") });
            setIsLoading(false);
            return;
        }

        try {
            await updateProfile(sender, form, updateProfileContract);
            setUpdated(true);
            setTimeout(() => {
                setUpdated(false);
                onOpenChange(false);
                setIsLoading(false);
            }, 1500);
            toast({
                title: t("editProfileDialog.successTitle"),
                description: t("editProfileDialog.successDesc"),
                className: "bg-green-500 text-white border-none rounded-[2vw]",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: t("editProfileDialog.errorTitle"),
                description: t("editProfileDialog.errorDesc"),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("editProfileDialog.title")}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[71vh] pr-4">
                    <div className="space-y-4 pb-4">
                        <div>
                            <Label>{t("editProfileDialog.avatar")}</Label>
                            <ImageDropzone
                                value={
                                    form.image.startsWith("data:image")
                                        ? form.image
                                        : form.image
                                        ? `https://ipfs.io/ipfs/${form.image.substring(
                                              7
                                          )}`
                                        : ""
                                }
                                onChange={(val) =>
                                    handleChange(
                                        "image",
                                        val.startsWith("data:image")
                                            ? val
                                            : val.replace(
                                                  "https://ipfs.io/ipfs/",
                                                  ""
                                              )
                                    )
                                }
                            />
                            {formErrors.image && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.image}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>{t("editProfileDialog.name")}</Label>
                            <Input
                                value={form.name}
                                className="rounded-2xl"
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>{t("editProfileDialog.description")}</Label>
                            <Textarea
                                value={form.description}
                                maxLength={256}
                                className="rounded-2xl"
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {form.description.length}/256
                            </p>
                            {formErrors.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.description}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>{t("editProfileDialog.socialLinks")}</Label>
                            <SelectSocialLink
                                links={form.social_links}
                                onChange={handleSocialLinksChange}
                            />
                            {formErrors.social_links && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.social_links}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>JWT</Label>
                            <Input
                                value={form.jwt}
                                onChange={(e) =>
                                    handleChange("jwt", e.target.value)
                                }
                                className="rounded-2xl"
                                placeholder="Your Pinata JWT"
                            />
                            {formErrors.jwt && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.jwt}
                                </p>
                            )}
                        </div>
                    </div>
                </ScrollArea>
                <Separator />
                <DialogFooter className="pt-4">
                    <Button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="rounded-2xl bg-goluboy hover:bg-blue-500 text-white flex items-center gap-2"
                    >
                        {updated ? (
                            <>
                                <Check className="w-4 h-4" />
                                {t("editProfileDialog.updated")}
                            </>
                        ) : isLoading ? (
                            t("editProfileDialog.saving")
                        ) : (
                            t("editProfileDialog.save")
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
