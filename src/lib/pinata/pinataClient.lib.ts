import { PinataSDK } from "pinata";

export const createPinataInstance = (jwt: string, gateway: string) => {
    return new PinataSDK({
        pinataJwt: jwt,
        pinataGateway: gateway,
    });
};

export const checkPinataConnection = async (jwt: string): Promise<boolean> => {
    try {
        const res = await fetch(
            "https://api.pinata.cloud/data/testAuthentication",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        return res.ok;
    } catch (error) {
        console.error("Ошибка при проверке Pinata:", error);
        return false;
    }
};

export const findPinataGateway = async (jwt: string): Promise<string> => {
    try {
        const res = await fetch("https://api.pinata.cloud/v3/ipfs/gateways", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch gateways");
        }

        const data = await res.json();
        const gateway = data?.data?.rows?.[0]?.domain;
        if (!gateway) throw new Error("No available gateways");
        return gateway;
    } catch (error) {
        console.error("Ошибка при получении шлюза:", error);
        throw error;
    }
};
