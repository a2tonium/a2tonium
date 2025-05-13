import { useTonClient } from "@/hooks/useTonClient";
// import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { Course } from "@/wrappers/course";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, beginCell, OpenedContract, toNano } from "@ton/core";
import { encodeOffChainContent } from "@/utils/encodeOffChainContent.utils";
import { CustomSender } from "@/types/tonTypes";
import { SendTransactionResponse } from "@tonconnect/ui-react";

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
        for (; ; i++) {
            course = client.open(
                await Course.fromInit(Address.parse(address), i)
            ) as OpenedContract<Course>;
            try {
                await client.open(course).getGetCourseData();
            } catch (e) {
                console.error("Error opening course contract", e);
                break;
            }
        }
        return course;
    };

    const createCourseContract = async (
        sender: CustomSender,
        courseURL: string,
        coursePrice: string
    ): Promise<SendTransactionResponse | null> => {
        console.log("IN CREATE COURSE CONTRACT");
        const courseContract = await getCourseContract();
        if (!courseContract) {
            console.error("Course contract not found");
            return null;
        }
        const body = beginCell()
            .storeUint(473948970, 32)
            .storeRef(encodeOffChainContent(`ipfs://${courseURL}`))
            .storeCoins(toNano(coursePrice))
            .endCell();

        console.log(courseContract!.address.toString());
        console.log(courseContract!.init);

        console.log("courseContract", courseContract);
        return await sender.send({
            to: courseContract!.address,
            value: toNano("0.05"),
            bounce: false,
            init: courseContract!.init, // 👈 this is what triggers deployment!
            body: body,
        });
    };

    return {
        createCourseContract,
        withdraw: () => {},
    };
}
