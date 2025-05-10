import YouTube, { YouTubeProps } from "react-youtube";

interface LessonVideoProps {
    video_id: string | undefined;
    opts?: YouTubeProps["opts"];
}

export function LessonVideo({ video_id, opts }: LessonVideoProps) {
    return (
        <div className="w-full">
            <div className="w-full aspect-video ">
                <YouTube
                    videoId={video_id}
                    opts={opts}
                    className="w-full h-full "
                />
            </div>
        </div>
    );
}
