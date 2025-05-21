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
import { createProfile } from "@/services/profile.service";
import { ProfileDataInterface } from "@/types/profile.types";
import { useProfileContract } from "@/hooks/useProfileContract";
import { useTonConnect } from "@/hooks/useTonConnect";

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
                message: `Link must start with "${requiredPrefix}"`,
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

interface CreateProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProfileDialog({
    open,
    onOpenChange,
}: CreateProfileDialogProps) {
    const { enrollToProfileContract } = useProfileContract();
    const { sender } = useTonConnect();
    const { toast } = useToast();
    const [form, setForm] = useState({
        image: "",
        name: "",
        description: "",
        social_links: [{ type: "Telegram", value: "" }],
        jwt: "",
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [created, setCreated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSocialLinksChange = (links: SocialLink[]) => {
        setForm((prev) => ({ ...prev, social_links: links }));
    };

    const showErrors = (
        result: z.SafeParseReturnType<
            ProfileDataInterface,
            ProfileDataInterface
        >
    ) => {
        const errors: Record<string, string> = {};
        result.error?.errors.forEach((e) => {
            const field = e.path[0];
            if (typeof field === "string") {
                errors[field] = e.message;
            }
        });
        setFormErrors(errors);
        setIsLoading(false);
        return;
    };

    const handleCreate = async () => {
        setIsLoading(true);
        setFormErrors({});

        const result = profileSchema.safeParse(form);
        if (!result.success) showErrors(result);

        const isJwtValid = await checkPinataConnection(form.jwt);
        if (!isJwtValid) {
            setFormErrors({
                jwt: "Invalid JWT or failed connection to Pinata",
            });
            setIsLoading(false);
            return;
        }

        try {
            await createProfile(sender, form, enrollToProfileContract);
            setCreated(true);
            setTimeout(() => {
                setCreated(false);
                setIsLoading(false);
                onOpenChange(false);
            }, 1500);
            toast({
                title: "Profile Created",
                description: `You've created the profile: ${form.name}`,
                className: "bg-green-500 text-white rounded-[2vw] border-none",
            });
        } catch (error) {
            console.error("Error creating profile:", error);
            toast({
                title: "Error",
                description: "Failed to create profile.",
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
                    <DialogTitle>Create Profile</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[71vh] pr-4">
                    <div className="space-y-4 pb-4">
                        <div>
                            <Label>Avatar</Label>
                            <ImageDropzone
                                value={form.image}
                                onChange={(val) => handleChange("image", val)}
                            />
                            {formErrors.image && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.image}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Name</Label>
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
                            <Label>Description</Label>
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
                            <Label>Social Links</Label>
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
                        type="button"
                        onClick={handleCreate}
                        disabled={isLoading}
                        className="rounded-2xl bg-goluboy hover:bg-blue-500 text-white flex items-center gap-2"
                    >
                        {created ? (
                            <>
                                <Check className="w-4 h-4" />
                                Created
                            </>
                        ) : isLoading ? (
                            "Creating..."
                        ) : (
                            "Create"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
