import { fromNano } from "@ton/core";
import { Buffer } from "buffer";

export function getEventsUrl(
    contractAddress: string,
    limit: number = 100
): string {
    return `https://testnet.tonapi.io/v2/accounts/${contractAddress}/events?limit=${limit}`;
}

export function getTransaction(txHash: string): string {
    return `https://testnet.tonapi.io/v2/blockchain/transactions/${txHash}`;
}

export const ipfsToHttp = (uri: string) =>
    uri.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${uri.slice(7)}` : uri;

export function hexToUtf8(hex: string): string {
    return Buffer.from(hex, "hex").toString("utf-8");
}

export function hexToDecimalfromNano(hexString: string): string {
    return fromNano(BigInt(hexString).toString());
}

export function getLink(utf8: string): string {
    const ipfsHash = utf8.split("//")[1];
    if (!ipfsHash) {
        throw new Error("Invalid IPFS hash format");
        console.warn("No IPFS hash found in the string:", utf8);
    }
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    return ipfsUrl;
}
