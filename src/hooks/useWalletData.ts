import useSWR from "swr";
import { fetchTonWalletData } from "@/services/profile.service";

export function useWalletData(walletAddr?: string) {
    return useSWR(
        walletAddr ? ["wallet", walletAddr] : null,
        ([, addr]) => fetchTonWalletData(addr),
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );
}
