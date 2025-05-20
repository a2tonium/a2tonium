import { useTonClient } from "@/hooks/useTonClient";
// import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { Course } from "@/wrappers/course";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, beginCell, fromNano, OpenedContract, Sender, toNano } from "@ton/core";
import { encodeOffChainContent } from "@/utils/encodeOffChainContent.utils";
import { CustomSender } from "@/types/tonTypes";
import { SendTransactionResponse } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { Certificate } from "../wrappers/certificate";
import { CoursePromotionFactory } from "../wrappers/coursePromotionFactory";
import { encryptCourseAnswers } from "../utils/crypt.utils";

export function useCourseContract() {
    const { client } = useTonClient();
    const { address, publicKey, sender } = useTonConnect();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (client) {
            setReady(true);
        }
    }, [client]);
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

    const updateCourseContract = async (
        sender: Sender,
        courseURL: string,
        courseAddress: string,
        courseCost: string
    ) => {
        const courseContract = client?.open(
            Course.fromAddress(Address.parse(courseAddress))
        ) as OpenedContract<Course>;

        if (!courseContract) {
            console.error("Course contract not found");
            return null;
        }
        const content = encodeOffChainContent(`ipfs://${courseURL}`);
        await courseContract.send(
            sender,
            {
                value: toNano(0.03),
            },
            {
                $$type: "UpdateCourse",
                content: content,
                cost: toNano(courseCost),
            }
        );
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

    const withdrawCourseContract = async (
        sender: Sender,
        courseAddress: string
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
                value: toNano(0.1),
            },

            "Withdraw"
        );
    };

    const asnwerQuiz = async (
        courseAddress: string,
        quizId: bigint,
        answers: string
    ) => {
        // const publicKey = await 
        const certificateContract = client?.open(
            Certificate.fromAddress(Address.parse(courseAddress))
        ) as OpenedContract<Certificate>;

        if (!certificateContract) {
            console.error("Course contract not found");
            return ;
        }
        const encrypted_answers = await encryptCourseAnswers(
            answers,
            publicKey
        );
        await certificateContract.send(
            sender,
            {
                value: toNano(0.2),
            },
            {
                $$type: "Quiz",
                quizId: quizId,
                answers: beginCell().storeStringTail(`${encrypted_answers} | ${publicKey}`).endCell(),
            }
        );
    };

    const promoteCourseContract = async (
        sender: Sender,
        courseAddress: string
    ) => {
        const coursePromotionFactory = client?.open(
            CoursePromotionFactory.fromAddress(
                Address.parse(
                    "kQB0hulzDHUjXXu5CZdc-lZGPUKOfJsrW6iibt6549kveOEI"
                )
            )
        ) as OpenedContract<CoursePromotionFactory>;

        if (!coursePromotionFactory) {
            console.error("Course contract not found");
            return null;
        }
        await coursePromotionFactory.send(
            sender,
            {
                value: toNano(0.3),
            },
            {
                $$type: "Promote",
                course_address: beginCell()
                    .storeAddress(Address.parse(courseAddress))
                    .endCell(),
            }
        );
    };

    const getAddressBalance = async (address: string) => {
        const balance = await client?.getBalance(Address.parse(address));
        return balance !== undefined ? fromNano(balance).toString() : "0";
    };

    return {
        createCourseContract,
        enrollToCourseContract,
        getOwnerCourseContractList,
        withdrawCourseContract,
        updateCourseContract,
        asnwerQuiz,
        promoteCourseContract,
        getAddressBalance,
        ready,
    };
}
