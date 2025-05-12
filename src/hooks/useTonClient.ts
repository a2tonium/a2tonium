import { TonClient } from "ton";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useAsyncInitialize } from "@/hooks/useAsyncInitialize";
import { CHAIN } from "@tonconnect/ui-react";
import { getHttpEndpoint } from "@orbs-network/ton-access";

export function useTonClient() {
    const { network } = useTonConnect();

    return {
        client: useAsyncInitialize(async () => {
            if (!network) {
                return ;
            }
            const tonClient = new TonClient({
                endpoint: await getHttpEndpoint({
                    network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
                }),
            });
            console.log("tonClient", tonClient);
            return tonClient;
        }, [network]),
    };
}
