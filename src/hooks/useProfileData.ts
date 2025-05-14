import useSWR from "swr";
import { useProfileContract } from "@/hooks/useProfileContract";
import { ProfileDataInterface } from "@/types/profileData";
import { showProfileData } from "@/services/profile.service";

export function useProfileData() {
    const { getProfileData, ready } = useProfileContract();

    const fetcher = async (): Promise<ProfileDataInterface | undefined> => {
        if (!ready) return undefined;
        const profileCell = await getProfileData();
        if (!profileCell || !("toBoc" in profileCell)) return undefined;
        return await showProfileData(profileCell);
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
