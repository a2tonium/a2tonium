export interface TonTransferAction {
    type: string;
    status: string;
    TonTransfer: {
        comment: string;
        sender: {
            address: string;
        };
    };
}

export interface Event {
    in_progress: boolean;
    actions: TonTransferAction[];
}

export interface EventsResponse {
    events: Event[];
    next_from?: number;
}

export interface ApiResponse {
    events: Event[];
}

import { Address, SenderArguments } from "@ton/core";
import { SendTransactionResponse } from "@tonconnect/ui-react";

export interface CustomSender {
    send: (args: SenderArguments) => Promise<SendTransactionResponse | null>;
    address?: Address;
}