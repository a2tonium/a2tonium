import useSWR from "swr";
import { fetchTonWalletData } from "@/lib/userService";

export function useWalletInfo(walletAddr?: string) {
    return useSWR(
        walletAddr ? ["wallet", walletAddr] : null,
        ([, addr]) => fetchTonWalletData(addr),
        { shouldRetryOnError: false }
    );
}
