import useSWR from "swr";
import { useProfileContract } from "@/hooks/useProfileContract";
import { ProfileDataInterface } from "@/types/profile.types";
import { fetchProfileData } from "@/services/profile.service";
import { useTonConnect } from "@/hooks/useTonConnect";

export function useClientProfileData() {
    const { address } = useTonConnect();
    const { ready } = useProfileContract();

    const fetcher = async (): Promise<ProfileDataInterface | undefined> => {
        if (!ready || !address) return undefined;
        return await fetchProfileData(address);
    };
    const ready2 = address && ready;
    return useSWR<ProfileDataInterface | undefined>(
        ready2 ? ["owned-courses"] : null,
        fetcher,
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );
}
