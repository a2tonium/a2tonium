import useSWR from "swr";
import { useProfileContract } from "@/hooks/useProfileContract";
import { ProfileDataInterface } from "@/types/profileData";
import { fetchProfileData } from "@/services/profile.service";

export function useProfileData(walletAddr: string) {
    const { ready } = useProfileContract();

    const fetcher = async (): Promise<ProfileDataInterface | undefined> => {
        if (!ready) return undefined;
        return await fetchProfileData(walletAddr);
    };

    return useSWR<ProfileDataInterface | undefined>(
        ready ? ["owned-courses"] : null,
        fetcher,
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );
}
