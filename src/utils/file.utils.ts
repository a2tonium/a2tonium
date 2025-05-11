export function base64ToFile(base64: string, filename: string): File {
    let mime = "image/png";
    let ext = "png";
    let data = base64;

    if (base64.includes(",")) {
        const parts = base64.split(",");
        const match = parts[0].match(
            /data:(image\/(png|jpeg|jpg|webp));base64/
        );
        if (match) {
            mime = match[1];
            ext = match[2] === "jpeg" ? "jpg" : match[2];
        }
        data = parts[1];
    }

    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }

    return new File([array], `${filename}.${ext}`, { type: mime });
}

export function formatFilename(courseName: string): string {
    return courseName
        .trim()
        .slice(0, 20)
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
}

export async function getBase64FromImageURL(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Helper function to convert string to Uint8Array
export const stringToUint8Array = (str: string): Uint8Array =>
    new TextEncoder().encode(str);

export const uint8ArrayToBase64 = (arr: Uint8Array): string => {
    return btoa(
        Array.from(arr)
            .map((byte) => String.fromCharCode(byte))
            .join("")
    );
};

export function hexToUint8Array(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        array[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return array;
}

export const uint8ArrayToString = (arr: Uint8Array): string => new TextDecoder().decode(arr);