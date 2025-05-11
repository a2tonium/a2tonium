import { getLink, hexToUtf8, getEventsUrl } from "@/utils/ton.utils";
import { ApiResponse } from "@/types/tonTypes";

export async function getCollectionData(
    contractAddress: string
): Promise<{ collectionContent: string; ownerAddress: string }> {
    const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${contractAddress}/methods/get_collection_data`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            // Extract collection data from the 'decoded' field
            let collectionContent = data.decoded.collection_content;
            const ownerAddress = data.decoded.owner_address;

            collectionContent = getLink(hexToUtf8(collectionContent));
            return { collectionContent, ownerAddress };
        } else {
            throw new Error(
                "Failed to fetch collection data: " + JSON.stringify(data)
            );
        }
    } catch (error) {
        console.error("Error fetching collection data:", error);
        throw error; // Re-throw error to be handled by the caller
    }
}

const ENROLLED_MESSAGE = "You have successfully enrolled to the course!";

export async function getEnrolledCourseAddresses(
    studentAddress: string
): Promise<string[]> {
    const enrolledCourses: string[] = [];
    const response = await fetch(getEventsUrl(studentAddress, 100));

    const { events }: ApiResponse = await response.json();
    events.forEach((e) => {
        if (e.in_progress) {
            return;
        }
        e.actions.forEach((a) => {
            if (!(a.type === "TonTransfer" && a.status === "ok")) {
                return;
            }
            if (a.TonTransfer.comment === ENROLLED_MESSAGE) {
                enrolledCourses.push(a.TonTransfer.sender.address);
            }
        });
    });

    return enrolledCourses;
}

const TON_API_BASE = "https://testnet.tonapi.io/v2";
const API_KEY = import.meta.env.VITE_TONAPI;

if (!API_KEY) {
    throw new Error("TON API key is not defined in .env");
}

export async function getTonWalletRawData(addr: string) {
    const res = await fetch(`${TON_API_BASE}/accounts/${addr}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch wallet: ${res.statusText}`);
    }
    return await res.json();
}

export async function getUserNFTsRaw(addr: string) {
    const res = await fetch(`${TON_API_BASE}/accounts/${addr}/nfts`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) {
        throw new Error("NFTs fetch failed");
    }
    return await res.json();
}
