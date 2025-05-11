import { extractYoutubeVideoId } from "@/utils/youtube.utils";

export async function isYouTubeVideoAccessible(url: string): Promise<boolean> {
    try {
        const videoId = extractYoutubeVideoId(url);
        if (!videoId) return false;

        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`;

        const res = await fetch(oembedUrl, { method: "GET" });

        // - статус 200 — видео существует и публично
        // - статус 403 — видео существует, но доступ ограничен (например, приватное)
        if (res.status === 200 || res.status === 403) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}
