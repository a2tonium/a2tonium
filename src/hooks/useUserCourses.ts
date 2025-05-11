import useSWR from "swr";
import { fetchUserCourses } from "@/services/user.service";

export function useUserCourses(walletAddr?: string) {
    return useSWR(
        walletAddr ? ["user-courses", walletAddr] : null,
        ([, addr]) => fetchUserCourses(addr),
        { shouldRetryOnError: false }
    );
}
