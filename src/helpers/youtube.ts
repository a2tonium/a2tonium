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
