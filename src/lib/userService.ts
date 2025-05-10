export interface UserDataInterface {
    name: string;
    address: string;
    balance: string;
}

export async function fetchTonWalletData(
    addr: string
): Promise<UserDataInterface> {
    const apiKey = import.meta.env.VITE_TONAPI;
    if (!apiKey) {
        throw new Error("TON API key is not defined in .env");
    }
    // const rawAddress = Address.parse(addr)

    const url = new URL(`https://testnet.tonapi.io/v2/accounts/${addr}`);
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });

    if (!res.ok) {
        throw new Error(
            `Failed to fetch data from tonapi.io: ${res.status} ${res.statusText}`
        );
    }

    const data = await res.json();

    return {
        address: addr,
        name: data.name || "Wallet",
        balance: (data.balance / 1e9).toFixed(4),
    };
}

export async function fetchUserNFTs(addr: string) {
    const apiKey = import.meta.env.VITE_TONAPI;
    const url = new URL(`https://testnet.tonapi.io/v2/accounts/${addr}/nfts`);
    
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) throw new Error("NFTs fetch failed");
    const data = await res.json();
    return data.nft_items;
}

export async function fetchUserCourses(addr: string) {
    // Replace with real API later
    const mockData = await import("@/data/course.json"); // or copy from the mock you posted
    return [addr,mockData];
  }