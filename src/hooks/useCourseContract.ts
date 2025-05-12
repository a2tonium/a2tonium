import { useTonClient } from "@/hooks/useTonClient";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { Course } from "@/wrappers/course";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, OpenedContract } from "@ton/core";

export function useCourseContract() {
    const { client } = useTonClient();
    const { address } = useTonConnect();
    const courseContract = useAsyncInitialize(async () => {
        if (!client) return;
        let i = 0n;
        let course;
        for (;i < 3n ; i++) {
            course = client.open(await Course.fromInit(Address.parse(address), i)) as OpenedContract<Course>;
            try {
                await client.open(course).getGetCourseData();
            } catch (e) { break }
            }
        return course;
    }, []);

    return { courseContract };
}
