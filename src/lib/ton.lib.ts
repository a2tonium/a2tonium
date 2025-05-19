import {
    getLink,
    hexToUtf8,
    getEventsUrl,
    hexToDecimal,
} from "@/utils/ton.utils";
import { Address, Cell, fromNano } from "@ton/core";
import { ApiResponse } from "@/types/tonTypes";

export async function getCourseData(contractAddress: string): Promise<{
    collectionContent: string;
    ownerAddress: string;
    cost: string;
    enrolledNumber: string;
}> {
    const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${Address.parse(
        contractAddress
    ).toString()}/methods/get_course_data`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            // Extract collection data from the 'decoded' field
            const enrolledNumber = hexToDecimal(data.stack[1].num);
            const collectionContent = getLink(hexToUtf8(data.stack[2].cell));
            const address = data.stack[3].cell;
            const cell = Cell.fromBoc(Buffer.from(address, "hex"))[0];
            const ownerAddress = cell.beginParse().loadAddress().toString();
            console.log("ownerAddress",ownerAddress);

            const cost = fromNano(hexToDecimal(data.stack[4].num));

            return { collectionContent, ownerAddress, cost, enrolledNumber };
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

export async function getProfileItemsAddresses(): Promise<
    { address: string; owner: string }[]
> {
    const collectionUrl = `https://testnet.tonapi.io/v2/nfts/collections/EQCriJIjnxh2NedMZUiEhV4DT4RIO6_FjQvP5kc3LsqvE7cx/items`;

    try {
        const response = await fetch(collectionUrl);
        const data = await response.json();

        if (!Array.isArray(data.nft_items)) {
            throw new Error("nft_items is not an array");
        }
        console.log("data.nft_items", data.nft_items);
        return data.nft_items.map(
            (item: { address: string; owner: { address: string } }) => ({
                address: item.address,
                owner: item.owner?.address || "",
            })
        );
    } catch (error) {
        console.error("Error fetching NFT addresses:", error);
        throw error;
    }
}

export async function getProfileData(ownerAddress: string) {
    console.log("matched");
    const profileAddrs = await getProfileItemsAddresses();
    console.log("profileAddrs", profileAddrs);
    try {
        const matched = profileAddrs.find(
            (item) =>
                Address.parse(item.owner).toString() ==
                Address.parse(ownerAddress).toString()
        );
        if (!matched) {
            console.warn("No NFT profile found for owner:", ownerAddress);
            return null;
        }

        const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${matched.address}/methods/get_nft_data`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.success || !data.decoded) {
            throw new Error("Failed to decode NFT data");
        }

        const { individual_content } = data.decoded;

        return hexToUtf8(individual_content).slice(13);
    } catch (error) {
        console.error("Error fetching NFT profile data:", error);
        throw error;
    }
}

export async function getProfileAddress(ownerAddress: string) {
    console.log("matched");
    const profileAddrs = await getProfileItemsAddresses();
    console.log("profileAddrs", profileAddrs);
    try {
        const matched = profileAddrs.find(
            (item) =>
                Address.parse(item.owner).toString() ==
                Address.parse(ownerAddress).toString()
        );
        if (!matched) {
            console.warn("No NFT profile found for owner:", ownerAddress);
            return null;
        }

        return matched.address;
    } catch (error) {
        console.error("Error fetching NFT profile data:", error);
        throw error;
    }
}

// export async function getCollectionData(
//     contractAddress: string
// ): Promise<{ collectionContent: string; ownerAddress: string }> {
//     const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${contractAddress}/methods/get_collection_data`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.success) {
//             // Extract collection data from the 'decoded' field
//             let collectionContent = data.decoded.collection_content;
//             const ownerAddress = data.decoded.owner_address;

//             collectionContent = getLink(hexToUtf8(collectionContent));
//             return { collectionContent, ownerAddress };
//         } else {
//             throw new Error(
//                 "Failed to fetch collection data: " + JSON.stringify(data)
//             );
//         }
//     } catch (error) {
//         console.error("Error fetching collection data:", error);
//         throw error; // Re-throw error to be handled by the caller
//     }
// }

const ENROLLED_MESSAGE = "You are successfully enrolled in the course!";
const COURSE_CREATED_MESSAGE = "Course updated successfully";

export async function getEnrolledCourseAddresses(
    studentAddress: string
): Promise<string[]> {
    const enrolledCourses: Set<string> = new Set();
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
                enrolledCourses.add(
                    Address.parse(a.TonTransfer.sender.address).toString()
                );
            }
        });
    });

    return Array.from(enrolledCourses);
}

export async function getOwnedCourseAddresses(
    ownerAddress: string
): Promise<string[]> {
    const ownedCoursesSet: Set<string> = new Set();
    const response = await fetch(getEventsUrl(ownerAddress, 100));

    const { events }: ApiResponse = await response.json();
    events.forEach((e) => {
        if (e.in_progress) {
            return;
        }
        e.actions.forEach((a) => {
            if (!(a.type === "TonTransfer" && a.status === "ok")) {
                return;
            }
            if (a.TonTransfer.comment === COURSE_CREATED_MESSAGE) {
                const courseAddress = Address.parse(a.TonTransfer.sender.address).toString();
                ownedCoursesSet.add(courseAddress);
            }
        });
    });

    return Array.from(ownedCoursesSet);
}

const TON_API_BASE = "https://testnet.tonapi.io/v2";
const API_KEY = import.meta.env.VITE_TONAPI;

// if (!API_KEY) {
//     throw new Error("TON API key is not defined in .env");
// }

export async function getTonWalletData(addr: string) {
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
