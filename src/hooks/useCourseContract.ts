import { useTonClient } from "@/hooks/useTonClient";
import { Course } from "@/wrappers/course";
import { useTonConnect } from "@/hooks/useTonConnect";
import {
    Address,
    beginCell,
    fromNano,
    OpenedContract,
    Sender,
    toNano,
} from "@ton/core";
import { encodeOffChainContent } from "@/utils/toncrypt.utils";
import { CustomSender } from "@/types/ton.types";
import { SendTransactionResponse } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { Certificate } from "../wrappers/certificate";
import { CoursePromotionFactory } from "../wrappers/coursePromotionFactory";

export function useCourseContract() {
    const { client } = useTonClient();
    const { address, sender } = useTonConnect();

    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (client) {
            setReady(true);
        }
    }, [client]);

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
        IIC: string,
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
                    .storeStringTail(`${IIC} | ${gmail}`)
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

    const answerQuiz = async (
        certificateAddress: string,
        quizId: bigint,
        encrypted_answers: string,
        encrypted_PublicKey: string
    ) => {
        const certificateContract = client?.open(
            Certificate.fromAddress(Address.parse(certificateAddress))
        ) as OpenedContract<Certificate>;

        if (!certificateContract) {
            console.error("Course contract not found");
            return;
        }

        await certificateContract.send(
            sender,
            {
                value: toNano(0.2),
            },
            {
                $$type: "Quiz",
                quizId: quizId - 1n,
                answers: beginCell()
                    .storeStringTail(
                        `${encrypted_answers} | ${encrypted_PublicKey}`
                    )
                    .endCell(),
            }
        );
    };

    const issueCertificate = async (
        certificateAddress: string,
        quizId: bigint,
        rating: string,
        review: string
    ) => {
        const certificateContract = client?.open(
            Certificate.fromAddress(Address.parse(certificateAddress))
        ) as OpenedContract<Certificate>;

        if (!certificateContract) {
            console.error("Course contract not found");
            return;
        }

        await certificateContract.send(
            sender,
            {
                value: toNano(0.2),
            },
            {
                $$type: "Quiz",
                quizId: quizId,
                answers: beginCell()
                    .storeStringTail(`${rating} | ${review}`)
                    .endCell(),
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

    const getAddressBalance = async (address: string): Promise<string> => {
        try {
            const response = await fetch(
                `https://testnet.tonapi.io/v2/accounts/${Address.parse(
                    address
                ).toRawString()}`
            );
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const tonBalanceNano = data.balance;

            if (typeof tonBalanceNano !== "number") {
                throw new Error("Invalid ton_balance in response");
            }

            // Convert from nanoTON to TON
            return Number(fromNano(tonBalanceNano)).toFixed(2);
        } catch (error) {
            console.error("Failed to get balance:", error);
            return "0"; // Fallback to zero on error
        }
    };

    return {
        createCourseContract,
        enrollToCourseContract,
        getOwnerCourseContractList,
        withdrawCourseContract,
        updateCourseContract,
        answerQuiz,
        promoteCourseContract,
        getAddressBalance,
        issueCertificate,
        ready,
    };
}
