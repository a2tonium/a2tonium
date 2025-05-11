import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface SocialLink {
    type: string;
    value: string;
}

const SOCIAL_OPTIONS = [
    { value: "Telegram", label: "Telegram", prefix: "t.me/" },
    { value: "Youtube", label: "YouTube", prefix: "www.youtube.com/user/" },
    { value: "Instagram", label: "Instagram", prefix: "www.instagram.com/" },
    { value: "X", label: "X", prefix: "x.com/" },
    { value: "Linkedin", label: "LinkedIn", prefix: "www.linkedin.com/in/" },
    { value: "Facebook", label: "Facebook", prefix: "www.facebook.com/" },
    { value: "Email", label: "Email", prefix: "" },
    { value: "Other", label: "Other", prefix: "" },
];

interface SelectSocialLinkProps {
    links: SocialLink[];
    onChange: (updated: SocialLink[]) => void;
}

export function SelectSocialLink({ links, onChange }: SelectSocialLinkProps) {
    const handleUpdate = (
        index: number,
        field: keyof SocialLink,
        value: string
    ) => {
        const updated = [...links];
        updated[index][field] = value;
        onChange(updated);
    };

    const handleAdd = () => {
        onChange([...links, { type: "Telegram", value: "" }]);
    };

    const handleRemove = (index: number) => {
        const updated = [...links];
        updated.splice(index, 1);
        onChange(updated);
    };

    return (
        <div className="space-y-2">
            {links.map((link, index) => (
                <div
                    key={index}
                    className="grid grid-cols-[1fr_auto] items-center gap-2"
                >
                    <div className="flex gap-2 w-full">
                        <Select
                            value={link.type}
                            onValueChange={(val) =>
                                handleUpdate(index, "type", val)
                            }
                        >
                            <SelectTrigger className="w-1/3 rounded-2xl">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Social</SelectLabel>
                                    {SOCIAL_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder={
                                SOCIAL_OPTIONS.find(
                                    (o) => o.value === link.type
                                )?.prefix
                                    ? SOCIAL_OPTIONS.find(
                                          (o) => o.value === link.type
                                      )?.prefix + "username"
                                    : "put any link"
                            }
                            value={link.value}
                            onChange={(e) =>
                                handleUpdate(index, "value", e.target.value)
                            }
                            className="w-full rounded-2xl"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
            {links.length < 7 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAdd}
                    className="w-full mt-2 rounded-2xl border-goluboy text-goluboy hover:border-blue-500 hover:text-blue-500 flex items-center gap-2"
                >
                    Add Link
                </Button>
            )}
        </div>
    );
}
