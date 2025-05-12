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
                console.log("dsahfoihjioawjefoijoisaj");
                const data = await client.open(course).getGetCourseData();
                console.log(data);
        }
        console.log("CHetam1: ", (await Course.fromInit(Address.parse(address), i)).address.toString());
        console.log("CHetam2: ", i, course!!.address.toString());
        return course;
    }, [client]);

    return { courseContract };
}
