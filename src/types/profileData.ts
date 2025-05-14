export interface ProfileDataInterface {
    name: string;
    description: string;
    image: string;
    content_url: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
    
}

export interface ProfileWithWalletDataInterface {
    name: string;
    description: string;
    image: string;
    address: string;
    balance: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
    
}

export interface WalletDataInterface {
    address: string;
    balance: string;
}