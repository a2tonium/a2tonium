import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LessonVideo } from "@/components/lessonVideo/lessonVideo";

interface VideoPreviewDialogProps {
    videoId: string;
    open: boolean;
    onClose: () => void;
}

export function VideoPreviewDialog({ videoId, open, onClose }: VideoPreviewDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-white rounded-2xl">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex justify-between items-center">
                        Video Preview
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
