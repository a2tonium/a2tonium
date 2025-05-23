import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LessonVideo } from "@/components/lessonVideo/lessonVideo";
import { useTranslation } from "react-i18next";

interface VideoPreviewDialogProps {
    videoId: string;
    open: boolean;
    onClose: () => void;
}

export function VideoPreviewDialog({
    videoId,
    open,
    onClose,
}: VideoPreviewDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-white rounded-2xl">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex justify-between items-center">
                        {t("videoPreview.title")}
                    </DialogTitle>
                </DialogHeader>

                <div className="w-full px-4 pb-4">
                    <LessonVideo
                        video_id={videoId}
                        opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: {
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 0,
                                controls: 1,
                                autoplay: 1,
                            },
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
