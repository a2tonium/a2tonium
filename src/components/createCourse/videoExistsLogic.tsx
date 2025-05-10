export async function checkYouTubeVideo(url: string): Promise<boolean> {
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

export function extractYoutubeVideoId(url: string): string | null {
    try {
        const parsed = new URL(url);
        if (parsed.hostname === "youtu.be") {
            return parsed.pathname.slice(1);
        }

        if (
            parsed.hostname.includes("youtube.com") &&
            parsed.searchParams.has("v")
        ) {
            return parsed.searchParams.get("v");
        }

        return null;
    } catch {
        return null;
    }
}