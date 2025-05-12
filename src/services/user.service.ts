// services/walletService.ts
import { getTonWalletRawData, getUserNFTsRaw } from "@/lib/ton.lib";
import { ProfileWithWalletDataInterface } from "@/types/profileData";

// export interface UserDataInterface {
//     name: string;
//     address: string;
//     balance: string;
// }

export async function fetchTonWalletData(
    addr: string
): Promise<ProfileWithWalletDataInterface> {
    const data = await getTonWalletRawData(addr);
    return {
        address: addr,
        name: "Amandyk",
        balance: (data.balance / 1e9).toFixed(4),
        description:
            "DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION",
        image: "bafybeie74p4z242aeohi2i3cahrc2l7fsfyonxnujfnyvbpjvsnpmpqsgu",
        attributes: [
            {
                trait_type: "Telegram",
                value: "https://t.me/surname",
            },
            {
                trait_type: "Youtube",
                value: "https://www.youtube.com/user/qydnama",
            },
            {
                trait_type: "Instagram",
                value: "https://www.instagram.com/qydnama",
            },
            {
                trait_type: "X",
                value: "https://x.com/qydnama",
            },
            {
                trait_type: "Linkedin",
                value: "https://www.linkedin.com/in/qydnama",
            },
            {
                trait_type: "Facebook",
                value: "https://www.facebook.com/qydnama",
            },
            {
                trait_type: "Email",
                value: "amangikbaktibaiuli@gmail.com",
            },
            {
                trait_type: "Other",
                value: "http://localhost:5173/user/0QA8-SVqn4H2dew-CzMrfzpqg2ReIQSYCFxkzpr4ZnwcunaS",
            },
            {
                trait_type: "Other",
                value: "http://localhost:5173/user/0QA8-SVqn4H2dew-CzMrfzpqg2ReIQSYCFxkzpr4ZnwcunaS",
            },
        ],
    };
}

// export async function fetchTonWalletData(
//     addr: string
// ): Promise<UserDataInterface> {
//     const data = await getTonWalletRawData(addr);
//     return {
//         address: addr,
//         name: data.name || "Wallet",
//         balance: (data.balance / 1e9).toFixed(4),
//     };
// }

export async function fetchUserNFTs(addr: string) {
    const data = await getUserNFTsRaw(addr);
    return data.nft_items;
}
