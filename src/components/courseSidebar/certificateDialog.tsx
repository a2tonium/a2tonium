import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CertificateDialog({
    trigger,
    onSubmit,
}: {
    trigger: React.ReactNode;
    onSubmit?: (rating: number, comment: string) => Promise<void> | void;
}) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleGetCertificate = async () => {
        if (rating === 0) {
            setError("Please provide a rating.");
            return;
        }
        if (comment.length > 512) {
            setError("Comment cannot exceed 512 characters.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            await onSubmit?.(rating, comment);
            setSuccess(true);
            toast({
                title: "Certificate Granted",
                description: "Thank you for your feedback!",
                className: "bg-green-500 text-white rounded-[2vw]",
            });
            setTimeout(() => {
                setSuccess(false);
                setOpen(false);
                setSubmitting(false);
            }, 1500);
        } catch (e) {
            setError("Something went wrong. Try again.");
            setSubmitting(false);
            console.error("Error submitting certificate:", e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Get Certificate</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label id="rating-label">Rate this course</Label>
                        <div className="flex justify-center">
                            <Rating
                                value={rating}
                                onChange={setRating}
                                style={{ maxWidth: 180 }}
                                visibleLabelId="rating-label"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Comment</Label>
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={512}
                            className="rounded-2xl"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {comment.length}/512
                        </p>
                    </div>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>
                <DialogFooter className="pt-4">
                    <Button
                        onClick={handleGetCertificate}
                        disabled={submitting}
                        className="rounded-2xl bg-goluboy hover:bg-blue-500 text-white flex items-center gap-2"
                    >
                        {success ? (
                            <>
                                <Check className="w-4 h-4" />
                                Submitted
                            </>
                        ) : submitting ? (
                            "Submitting..."
                        ) : (
                            "Get Certificate"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
