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

export interface ApiResponse {
    events: Event[];
}
