import { useTonClient } from "@/hooks/useTonClient";
// import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { Course, UpdateCourse } from "@/wrappers/course";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, OpenedContract, Sender, toNano } from "@ton/core";
import { encodeOffChainContent } from "@/utils/encodeOffChainContent.utils";

export function useCourseContract() {
    const { client } = useTonClient();
    const { address } = useTonConnect();
    // const courseContract = useAsyncInitialize(async () => {
    //     if (!client) return;
    //     let i = 0n;
    //     let course;
    //     for (; i < 3n; i++) {
    //         course = client.open(
    //             await Course.fromInit(Address.parse(address), i)
    //         ) as OpenedContract<Course>;
    //         try {
    //             await client.open(course).getGetCourseData();
    //         } catch (e) {
    //             console.error("Error opening course contract", e);
    //             break;
    //         }
    //     }
    //     return course;
    // }, [client]);

    const getCourseContract = async () => {
        if (!client) return;
        let i = 0n;
        let course;
        for (; i < 3n; i++) {
            course = client.open(
                await Course.fromInit(Address.parse(address), i)
            ) as OpenedContract<Course>;
            try {
                await client.open(course).getGetCourseData();
            } catch (e) {
                console.error("Error opening course contract", e);
                continue;
            }
        }
        return course;
    };

    const createCourseContract = async (sender: Sender, courseURL: string) => {
        console.log("IN CREATE COURSE CONTRACT");
        const courseContract = await getCourseContract();
        const message: UpdateCourse = {
            $$type: "UpdateCourse",
            content: encodeOffChainContent(`ipfs://${courseURL}`),
            cost: toNano("3"),
        };
        console.log("courseContract", courseContract);
        courseContract?.send(
            sender,
            {
                value: toNano("0.3"),
            },
            message
        );
    };

    return {
        createCourseContract,
        withdraw: () => {},
    };
}
