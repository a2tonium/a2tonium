import useSWR from "swr";
import { fetchUserCourses } from "@/lib/userService";

export function useUserCourses(walletAddr?: string) {
    return useSWR(
        walletAddr ? ["user-courses", walletAddr] : null,
        ([, addr]) => fetchUserCourses(addr),
        { shouldRetryOnError: false }
    );
}
