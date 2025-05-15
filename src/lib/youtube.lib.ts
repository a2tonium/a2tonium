import { extractYoutubeVideoId } from "@/utils/youtube.utils";

export async function isYouTubeVideoAccessible(url: string): Promise<[boolean, boolean]> {
    try {
        const videoId = extractYoutubeVideoId(url);
        if (!videoId) return [false, false];

        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`;

        const res = await fetch(oembedUrl, { method: "GET" });

        // Первый boolean — существует ли видео, второй — публично ли оно
        if (res.status === 200) {
            return [true, false]; // существует и публично
        }
        if (res.status === 403) {
            return [true, true]; // существует, но не публично
        }

        return [false, false]; // не существует
    } catch {
        return [false, false];
    }
}
