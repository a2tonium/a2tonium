import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { CHAIN } from "@tonconnect/ui-react";
import { getHttpEndpoint } from "@orbs-network/ton-access";

export function useTonClient() {
    const network = CHAIN.TESTNET

    return {
        client: useAsyncInitialize(async () => {
            if (!network) {
                return ;
            }
            console.log("tonClient");

            const tonClient = new TonClient({
                endpoint: await getHttpEndpoint({
                    network: "testnet",
                }),
            });
            console.log("tonClient", tonClient);
            return tonClient;
        }, [network]),
    };
}
