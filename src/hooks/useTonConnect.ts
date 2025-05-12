import {
    CHAIN,
    useIsConnectionRestored,
    useTonAddress,
    useTonConnectUI,
    useTonWallet,
} from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { Address, SenderArguments, Sender } from "@ton/core";

export const CHAINNET = {
    MAINNET: -239,
    TESTNET: -3,
} as const;

export function useTonConnect(): {
    sender: Sender;
    isConnected: boolean;
    address: string;
    rawAddress: string;
    network: CHAIN | null;
    ready: boolean;
    publicKey: string;
} {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const address = useTonAddress(true);
    const rawAddress = useTonAddress(false);

    const [ready, setReady] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const isConnectionRestored = useIsConnectionRestored();
    // console.log("wallet", wallet,"isConnectionRestored", isConnectionRestored, "isConnected", isConnected);
    useEffect(() => {
        if (isConnectionRestored) {
            setIsConnected(!!wallet);
            setReady(true);
        }
    }, [wallet, isConnectionRestored]);

    return {
        sender: {
            send: async (args: SenderArguments) => {
                tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString("base64"),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
                });
            },
            address: wallet?.account.address
                ? Address.parse(wallet.account.address as string)
                : undefined,
        },
        address: address,
        rawAddress: rawAddress,
        network: wallet?.account.chain || null,
        
        ready,
        isConnected,
        publicKey: wallet?.account.publicKey || ""
    };
}
