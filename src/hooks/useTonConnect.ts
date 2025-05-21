import {
    CHAIN,
    SendTransactionResponse,
    useIsConnectionRestored,
    useTonAddress,
    useTonConnectUI,
    useTonWallet,
} from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import {
    Address,
    Sender,
    SenderArguments,
    beginCell,
    storeStateInit,
} from "@ton/core";
import { CustomSender } from "@/types/ton.types";

export const CHAINNET = {
    MAINNET: -239,
    TESTNET: -3,
} as const;

export function useTonConnect(): {
    sender: Sender;
    customSender: CustomSender;
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
        customSender: {
            send: async (
                args: SenderArguments
            ): Promise<SendTransactionResponse | null> => {
                return await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString("base64"),
                            stateInit: args.init
                                ? beginCell()
                                      .store(storeStateInit(args.init))
                                      .endCell()
                                      .toBoc()
                                      .toString("base64")
                                : undefined,
                        },
                    ],
                    validUntil: Math.floor(Date.now() / 1000) + 300, // 5 минут
                });
            },
            address: wallet?.account.address
                ? Address.parse(wallet.account.address as string)
                : undefined,
        },
        sender: {
            send: async (args: SenderArguments) => {
                await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString("base64"),
                            stateInit: args.init
                                ? beginCell()
                                      .store(storeStateInit(args.init))
                                      .endCell()
                                      .toBoc()
                                      .toString("base64")
                                : undefined,
                        },
                    ],
                    validUntil: Math.floor(Date.now() / 1000) + 300, // 5 минут
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
        publicKey: wallet?.account.publicKey || "",
    };
}
