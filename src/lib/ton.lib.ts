import { getLink, hexToUtf8, hexToDecimal } from "@/utils/ton.utils";
import { Address, Cell, fromNano } from "@ton/core";
import {
    ClassifiedCourses,
    MAX_FAILURES,
    NFTDataResponse,
    NFTItem,
    NFTResponse,
    QuizAnswers,
    RETRY_DELAY,
} from "@/types/course.types";
import { Certificate } from "@/wrappers/certificate";
import { Course } from "@/wrappers/course";
import { EventsResponse } from "../types/ton.types";

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

export async function getCertificateData(certificateAddress: string): Promise<{
    collectionContent: string;
    ownerAddress: string;
    collectionAddress: string;
}> {
    const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${Address.parse(
        certificateAddress
    ).toString()}/methods/get_nft_data`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
            // Extract collection data from the 'decoded' field
            const collectionContent = getLink(
                hexToUtf8(data.decoded.individual_content)
            );
            const ownerAddress = Address.parse(
                data.decoded.owner_address
            ).toString();

            const collectionAddress = Address.parse(
                data.decoded.collection_address
            ).toString();

            return { collectionContent, ownerAddress, collectionAddress };
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
    const profileAddrs = await getProfileItemsAddresses();
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
    const profileAddrs = await getProfileItemsAddresses();
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

export async function getEnrolledCourseAddresses(
    studentAddress: string
): Promise<string[]> {
    const localKey = `enrolledCourses:${studentAddress}`;
    const cached = localStorage.getItem(localKey);

    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (err) {
            console.warn("Failed to parse cached enrolled courses:", err);
        }
    }

    const enrolledCourses: Set<string> = new Set();
    const { notCompleted } = await fetchAndClassifyCourses(studentAddress);

    notCompleted.forEach((nft) => {
        enrolledCourses.add(Address.parse(nft.collection.address).toString());
    });

    const result = Array.from(enrolledCourses);
    localStorage.setItem(localKey, JSON.stringify(result));

    return result;
}

export async function getCompletedCourseAddresses(
    studentAddress: string
): Promise<string[]> {
    const localKey = `completedCourses:${studentAddress}`;
    const cached = localStorage.getItem(localKey);

    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (err) {
            console.warn("Failed to parse cached enrolled courses:", err);
        }
    }

    const enrolledCourses: Set<string> = new Set();
    const { completed } = await fetchAndClassifyCourses(studentAddress);

    completed.forEach((nft) => {
        enrolledCourses.add(Address.parse(nft.collection.address).toString());
    });

    const result = Array.from(enrolledCourses);
    localStorage.setItem(localKey, JSON.stringify(result));

    return result;
}

export async function getOwnedCourseAddresses(
    ownerAddress: string
): Promise<string[]> {
    const localKey = `ownedCourses:${ownerAddress}`;
    const cached = localStorage.getItem(localKey);

    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (err) {
            console.warn("Failed to parse cached owned courses:", err);
        }
    }

    const ownedCoursesSet: Set<string> = new Set();
    let i = 0n;
    let attempts = 0;

    while (attempts < MAX_FAILURES) {
        try {
            const courseContract = (await Course.fromInit(
                Address.parse(ownerAddress),
                i
            )) as Course;

            const url = `https://testnet.tonapi.io/v2/blockchain/accounts/${courseContract.address.toString()}/methods/get_course_data`;

            const response = await fetch(url);

            if (response.status === 429) {
                throw new Error(`Too many requests: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                ownedCoursesSet.add(
                    Address.parse(courseContract.address.toString()).toString()
                );
                i++;
                attempts = 0; // reset after success
            } else {
                const result = Array.from(ownedCoursesSet);
                localStorage.setItem(localKey, JSON.stringify(result));
                return result;
            }
        } catch (error) {
            attempts++;
            console.warn(
                `Failed to fetch NFT data (attempt ${attempts}):`,
                error
            );
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
        }
    }

    const result = Array.from(ownedCoursesSet);
    localStorage.setItem(localKey, JSON.stringify(result));
    return result;
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

export async function getAllGrades(
    certificateAddress: string,
    courseOwnerAddress: string
): Promise<QuizAnswers[]> {
    courseOwnerAddress = Address.parse(courseOwnerAddress).toRawString();
    const baseUrl = `https://testnet.tonapi.io/v2/accounts/${certificateAddress}/events`;
    const allComments: QuizAnswers[] = [];
    let nextFrom: number | undefined = undefined;
    let foundFirstOne = false;

    do {
        const url = new URL(baseUrl);
        url.searchParams.set("limit", "100");
        if (nextFrom !== undefined) {
            url.searchParams.set("before_lt", nextFrom.toString());
        }

        const res = await fetch(url.toString());
        if (!res.ok) {
            throw new Error(
                `Failed to fetch events: ${res.status} ${res.statusText}`
            );
        }
        const data: EventsResponse = (await res.json()) as EventsResponse;
        for (const event of data.events) {
            for (const action of event.actions) {
                if (
                    action.type === "TonTransfer" &&
                    action.TonTransfer &&
                    action.TonTransfer.sender.address === courseOwnerAddress
                ) {
                    const comment = action.TonTransfer.comment;
                    const parts = comment.split(" | ");
                    if (parts.length === 4) {
                        allComments.push({
                            quizId: parts[0],
                            quizGrade: parts[1],
                        });
                        if (parts[0] === "1") {
                            foundFirstOne = true;
                            break; // stop inner loop
                        }
                    }
                }
            }
            if (foundFirstOne) break; // stop outer loop
        }

        if (foundFirstOne) break; // stop fetching more pages

        nextFrom = data.next_from;
        if (!nextFrom || data.events.length === 0) break;
    } while (!foundFirstOne && nextFrom);

    return allComments;
}

async function getCourseNFTs(walletAddress: string): Promise<NFTItem[]> {
    const nfts = await fetchNFTs(walletAddress);
    const result: NFTItem[] = [];
    for (const nft of nfts) {
        if (
            (
                await Certificate.fromInit(
                    Address.parse(nft.collection.address),
                    BigInt(nft.index)
                )
            ).address.toString() == Address.parse(nft.address).toString()
        )
            result.push(nft);
    }

    return result;
}

async function fetchNFTs(walletAddress: string): Promise<NFTItem[]> {
    let attempts = 0;
    while (attempts < MAX_FAILURES) {
        try {
            const url = `https://testnet.tonapi.io/v2/accounts/${walletAddress}/nfts`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`Failed to fetch NFTs: ${response.status}`);
            const data: NFTResponse = (await response.json()) as NFTResponse;
            return data.nft_items;
        } catch (error) {
            attempts++;
            console.warn(`Failed to fetch NFTs (attempt ${attempts}):`, error);
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
        }
    }
    throw new Error(`Failed to fetch NFTs after ${MAX_FAILURES} attempts`);
}

async function fetchNFTData(nftAddress: string): Promise<NFTDataResponse> {
    let attempts = 0;
    while (attempts < MAX_FAILURES) {
        try {
            const response = await fetch(
                `https://testnet.tonapi.io/v2/blockchain/accounts/${nftAddress}/methods/get_nft_data`
            );
            if (!response.ok) {
                attempts++;
                await new Promise((r) => setTimeout(r, RETRY_DELAY));
                continue;
            }
            const data: NFTDataResponse =
                (await response.json()) as NFTDataResponse;
            return data;
        } catch (error) {
            attempts++;
            console.warn(
                `Failed to fetch NFT data (attempt ${attempts}):`,
                error
            );
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
        }
    }
    throw new Error(
        `Failed to fetch NFT data for ${nftAddress} after ${MAX_FAILURES} attempts`
    );
}

async function classifyCoursesWithGlobalRetry(
    courseNFTs: NFTItem[],
    maxGlobalFailures = MAX_FAILURES,
    retryDelay = RETRY_DELAY
): Promise<ClassifiedCourses> {
    const completed: NFTItem[] = [];
    const notCompleted: NFTItem[] = [];

    let globalFailures = 0;
    let pendingNFTs = [...courseNFTs];

    while (pendingNFTs.length > 0) {
        const stillPending: NFTItem[] = [];

        for (const courseNFT of pendingNFTs) {
            if (globalFailures >= maxGlobalFailures) {
                console.warn(
                    `Reached max global failures (${maxGlobalFailures}), stopping.`
                );
                return { completed, notCompleted };
            }

            try {
                const nftData = await fetchNFTData(courseNFT.address);
                if (nftData.success && nftData.decoded) {
                    if (nftData.decoded.init === true) {
                        completed.push(courseNFT);
                    } else {
                        notCompleted.push(courseNFT);
                    }
                } else {
                    notCompleted.push(courseNFT);
                }
            } catch (error) {
                console.error(
                    `Error fetching NFT data for ${courseNFT.address}:`,
                    error
                );
                globalFailures++;
                stillPending.push(courseNFT);
            }
        }

        if (stillPending.length === 0) break;

        if (globalFailures >= maxGlobalFailures) {
            console.warn(
                `Reached max global failures (${maxGlobalFailures}), stopping.`
            );
            break;
        }

        await new Promise((r) => setTimeout(r, retryDelay));
        pendingNFTs = stillPending;
    }

    return { completed, notCompleted };
}

export async function fetchAndClassifyCourses(walletAddress: string) {
    let courseNFTs: NFTItem[] = [];
    let attempts = 0;

    while (attempts < MAX_FAILURES) {
        try {
            courseNFTs = await getCourseNFTs(walletAddress);
            break;
        } catch (error) {
            console.warn(
                `Failed to get course NFTs (attempt ${attempts + 1}):`,
                error
            );
            attempts++;
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
        }
    }

    if (courseNFTs.length === 0) {
        return {
            completed: [],
            notCompleted: [],
        };
    }

    const classified = await classifyCoursesWithGlobalRetry(courseNFTs);
    return classified;
}
