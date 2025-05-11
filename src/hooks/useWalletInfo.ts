import useSWR from "swr";
import { fetchTonWalletData } from "@/services/user.service";

export function useWalletInfo(walletAddr?: string) {
    return useSWR(
        walletAddr ? ["wallet", walletAddr] : null,
        ([, addr]) => fetchTonWalletData(addr),
        { shouldRetryOnError: false }
    );
}
