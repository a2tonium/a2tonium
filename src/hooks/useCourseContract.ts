import { useTonClient } from "@/hooks/useTonClient";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { Course } from "@/wrappers/course";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, OpenedContract } from "@ton/core";

export function useCourseContract() {
    const { client } = useTonClient();
    const { address } = useTonConnect();
    console.log("client", client);
    console.log("address", address);
    const courseContract = useAsyncInitialize(async () => {
        if (!client) return;
        const i = 0n;
        // for (i; ; i++) {
            const contract = await Course.fromInit(Address.parse(address), i);
            console.log("contract: ", contract.address.toString());
            const course = client.open(
                contract
            ) as OpenedContract<Course>;


            console.log("type: ", course);
            console.log("i: ", i);
        // }

        // const contract = await Course.fromInit(Address.parse(address), i);
        // return client.open(contract as Contract) as OpenedContract<Course>;
    }, [client]);

    return { courseContract };
}
