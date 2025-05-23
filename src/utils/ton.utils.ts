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
    uri.startsWith("ipfs://")
        ? `https://moccasin-defeated-vicuna-32.mypinata.cloud/ipfs/${uri.slice(
              7
          )}`
        : uri;

export function hexToUtf8(hex: string): string {
    return Buffer.from(hex, "hex").toString("utf-8");
}

export function hexToDecimal(hexString: string): string {
    return BigInt(hexString).toString();
}

export function getLink(utf8: string): string {
    let ipfsHash: string | undefined;

    if (utf8.startsWith("ipfs://")) {
        ipfsHash = utf8.replace("ipfs://", "");
    } else if (utf8.startsWith("ipfs.io/ipfs/")) {
        ipfsHash = utf8.replace("ipfs.io/ipfs/", "");
    } else if (utf8.includes("//")) {
        ipfsHash = utf8.split("//")[1];
    } else {
        ipfsHash = utf8;
    }

    const ipfsUrl = `https://moccasin-defeated-vicuna-32.mypinata.cloud/ipfs/${ipfsHash}`;
    return ipfsUrl;
}
