import useSWR from "swr";
import { fetchUserNFTs } from "@/lib/userService";

export function useUserNFTs(walletAddr?: string) {
    return useSWR(
        walletAddr ? ["nfts", walletAddr] : null,
        ([, addr]) => fetchUserNFTs(addr),
        { shouldRetryOnError: false }
    );
}
