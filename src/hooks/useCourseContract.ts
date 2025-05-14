import { useTonClient } from "@/hooks/useTonClient";
// import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { Course } from "@/wrappers/course";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, beginCell, OpenedContract, Sender, toNano } from "@ton/core";
import { encodeOffChainContent } from "@/utils/encodeOffChainContent.utils";
import { CustomSender } from "@/types/tonTypes";
import { SendTransactionResponse } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export function useCourseContract() {
    const { client } = useTonClient();
    const { address } = useTonConnect();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (client && address) {
            setReady(true);
        }
    }, [client, address]);
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

    const getFirstUninitCourseContract = async () => {
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

    const getOwnerCourseContractList = async (address: string) => {
        if (!client || !ready) return [];

        let i = 0n;
        const courseAddresses: string[] = [];

        while (true) {
            const course = client.open(
                await Course.fromInit(Address.parse(address), i)
            ) as OpenedContract<Course>;
            try {
                const data = await course.getGetCourseData();
                if (data) courseAddresses.push(course.address.toString());
            } catch (e) {
                console.error("Error opening course contract", e);
                break;
            }
            i++;
        }

        return courseAddresses;
    };

    const createCourseContract = async (
        sender: CustomSender,
        courseURL: string,
        coursePrice: string
    ): Promise<SendTransactionResponse | null> => {
        console.log("IN CREATE COURSE CONTRACT");
        const courseContract = await getFirstUninitCourseContract();
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

    const enrollToCourseContract = async (
        sender: Sender,
        courseAddress: string,
        IIN: string,
        gmail: string,
        courseCost: string
    ) => {
        const courseContract = client?.open(
            Course.fromAddress(Address.parse(courseAddress))
        ) as OpenedContract<Course>;

        if (!courseContract) {
            console.error("Course contract not found");
            return null;
        }
        await courseContract.send(
            sender,
            {
                value: toNano(courseCost),
            },
            {
                $$type: "Enrollment",
                student_info: beginCell()
                    .storeStringTail(`${IIN} | ${gmail}`)
                    .endCell(),
            }
        );
    };

    return {
        createCourseContract,
        enrollToCourseContract,
        getOwnerCourseContractList,
        ready,
    };
}
