import useSWR from "swr";
import { fetchUserNFTs } from "@/services/user.service";

export function useUserNFTs(walletAddr?: string) {
    return useSWR(
        walletAddr ? ["nfts", walletAddr] : null,
        ([, addr]) => fetchUserNFTs(addr),
        { shouldRetryOnError: false }
    );
}
