import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface ImageDropzoneProps {
    value?: string;
    onChange: (base64: string) => void;
    maxWidth?: string;
    maxHeight?: string;
    maxSizeMb?: number;
    aspectHint?: string;
}

const DEFAULT_ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export const ImageDropzone = ({
    value,
    onChange,
    maxWidth = "180px",
    maxHeight = "180px",
    maxSizeMb = 5,
    aspectHint = "JPG/PNG/WebP only, max 5MB",
}: ImageDropzoneProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [hovered, setHovered] = useState(false);
    const [error, setError] = useState("");

    const validateFile = (file: File): boolean => {
        const isValidType = DEFAULT_ACCEPTED_IMAGE_TYPES.includes(file.type);
        const isValidSize = file.size <= maxSizeMb * 1024 * 1024;

        if (!isValidType) {
            setError("Only JPG, PNG, and WebP images are allowed.");
            return false;
        }

        if (!isValidSize) {
            setError(`Image must be less than ${maxSizeMb}MB.`);
            return false;
        }

        setError("");
        return true;
    };

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !validateFile(file)) return;

        const reader = new FileReader();
        reader.onload = () => {
            onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHovered(false);
        const file = e.dataTransfer.files?.[0];
        if (!file || !validateFile(file)) return;

        const reader = new FileReader();
        reader.onload = () => {
            onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <Card
            className={cn(
                "cursor-pointer flex flex-col hover:border-blue-400 items-center justify-center border-dashed border-2 rounded-lg relative p-4 transition-all",
                hovered ? "border-blue-400 animate-pulse" : "border-gray-300"
            )}
            style={{ width: maxWidth, height: maxHeight }}
            onDragEnter={() => setHovered(true)}
            onDragLeave={() => setHovered(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            {value ? (
                <img
                    src={value}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover rounded-lg"
                />
            ) : (
                <div className="text-center">
                    <ImageIcon className="mx-auto text-gray-500" />
                    <p className="text-gray-500">Upload Image</p>
                    <p
                        className={cn(
                            "text-xs mt-1",
                            error ? "text-red-500" : "text-gray-400"
                        )}
                    >
                        {error || aspectHint}
                    </p>
                </div>
            )}
            <input
                type="file"
                accept={DEFAULT_ACCEPTED_IMAGE_TYPES.join(",")}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleUpload}
                ref={inputRef}
            />
        </Card>
    );
};
