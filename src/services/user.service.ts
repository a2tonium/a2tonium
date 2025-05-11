// services/walletService.ts
import { getTonWalletRawData, getUserNFTsRaw } from "@/lib/ton.lib";

export interface UserDataInterface {
    name: string;
    address: string;
    balance: string;
}

export async function fetchTonWalletData(
    addr: string
): Promise<UserDataInterface> {
    const data = await getTonWalletRawData(addr);
    return {
        address: addr,
        name: data.name || "Wallet",
        balance: (data.balance / 1e9).toFixed(4),
    };
}

export async function fetchUserNFTs(addr: string) {
    const data = await getUserNFTsRaw(addr);
    return data.nft_items;
}
