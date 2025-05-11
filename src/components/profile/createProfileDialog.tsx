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
import { ImageDropzone } from "@/components/createCourse/imageDropzone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const profileSchema = z.object({
    avatar: z.string().min(1, "Avatar is required"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    telegram: z.string().url("Telegram must be a valid URL").optional(),
    twitter: z.string().url("Twitter must be a valid URL").optional(),
    youtube: z.string().url("YouTube must be a valid URL").optional(),
    email: z.string().email("Invalid email address").optional(),
    description: z
        .string()
        .max(256, "Description cannot exceed 256 characters")
        .optional(),
});

interface CreateProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProfileDialog({
    open,
    onOpenChange,
}: CreateProfileDialogProps) {
    const [form, setForm] = useState({
        avatar: "",
        name: "",
        telegram: "",
        twitter: "",
        youtube: "",
        email: "",
        description: "",
    });

    const [error, setError] = useState("");
    const [created, setCreated] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreate = () => {
        const result = profileSchema.safeParse(form);
        if (!result.success) {
            setError(result.error.errors[0].message);
            return;
        }

        setError("");
        setCreated(true);
        setTimeout(() => {
            setCreated(false);
            onOpenChange(false);
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Profile</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-4">
                    <div className="space-y-4 pb-4">
                        <div>
                            <Label>Avatar</Label>
                            <ImageDropzone
                                value={form.avatar}
                                onChange={(base64) =>
                                    handleChange("avatar", base64)
                                }
                            />
                        </div>
                        <div>
                            <Label>Name</Label>
                            <Input
                                className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                value={form.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>Telegram</Label>
                            <Input
                                className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                value={form.telegram}
                                onChange={(e) =>
                                    handleChange("telegram", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>Twitter</Label>
                            <Input
                                className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                value={form.twitter}
                                onChange={(e) =>
                                    handleChange("twitter", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>YouTube</Label>
                            <Input
                                className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                value={form.youtube}
                                onChange={(e) =>
                                    handleChange("youtube", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                type="email"
                                value={form.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea
                                value={form.description}
                                className="w-full rounded-2xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                maxLength={256}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {form.description.length}/256
                            </p>

                            {error && (
                                <p className="text-red-500 text-xs">{error}</p>
                            )}
                        </div>
                    </div>
                </ScrollArea>
                <Separator />
                <DialogFooter className="pt-4">
                    <Button
                        onClick={handleCreate}
                        className="bg-goluboy hover:border-blue-500 hover:bg-blue-500 transition-colors duration-200 rounded-2xl flex items-center gap-2"
                    >
                        {created ? (
                            <>
                                <Check className="w-4 h-4" /> Created
                            </>
                        ) : (
                            "Create"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
