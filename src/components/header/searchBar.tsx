import React, { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MAX_FAILURES, RETRY_DELAY } from "@/types/course.types";
import { hexToDecimal } from "@/utils/ton.utils";
import { Address, Cell } from "@ton/core";
import { Course } from "@/wrappers/course";
import { Certificate } from "@/wrappers/certificate";

interface SearchBarProps {
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = async (
        e: React.KeyboardEvent<HTMLInputElement>,
        searchQuery: string,
        navigate: ReturnType<typeof useNavigate>
    ) => {
        if (e.key !== "Enter" || !searchQuery.trim()) return;

        const query = searchQuery.trim();
        const isTonDomain = query.endsWith(".ton");

        let address = query

        if (isTonDomain) {
            const dnsUrl = `https://testnet.tonapi.io/v2/dns/${query}/resolve`;

            let retries = 0;
            while (retries < MAX_FAILURES) {
                try {
                    const dnsRes = await fetch(dnsUrl);
                    if (dnsRes.status === 400) return navigate("/404");
                    if (dnsRes.status === 429) throw new Error("Rate limited");

                    const dnsData = await dnsRes.json();
                    address = dnsData.wallet?.address;

                    // Важно: если адрес отсутствует — 404, но не важно, is_wallet true/false
                    if (!address) return navigate("/404");
                    break;
                } catch (err) {
                    console.warn("DNS resolve retry:", err);
                    retries++;
                    await new Promise((r) => setTimeout(r, RETRY_DELAY));
                }
            }
        }
        address = Address.parse(address).toString();
        let retries = 0;
        while (retries < MAX_FAILURES) {
            try {
                const accRes = await fetch(
                    `https://testnet.tonapi.io/v2/accounts/${address}`
                );
                if (accRes.status === 400) return navigate("/404");

                const accData = await accRes.json();
                const interfaces: string[] = accData.interfaces ?? [];
                console.log("Account interfaces:", interfaces);
                if (interfaces.some((i) => i.startsWith("wallet"))) {
                    return navigate(`/user/${address}`);
                }

                if (interfaces.includes("nft_collection")) {
                    const courseRes = await fetch(
                        `https://testnet.tonapi.io/v2/blockchain/accounts/${address}/methods/get_course_data`
                    );

                    if (courseRes.status === 400) return navigate("/404");

                    const { stack } = await courseRes.json();
                    const courseIndexHex = stack[0]?.num;
                    const ownerCellHex = stack[3]?.cell;

                    const courseIndex = hexToDecimal(courseIndexHex);
                    const cell = Cell.fromBoc(
                        Buffer.from(ownerCellHex, "hex")
                    )[0];
                    const ownerAddress = cell
                        .beginParse()
                        .loadAddress()
                        .toString();

                    const course = await Course.fromInit(
                        Address.parse(ownerAddress),
                        BigInt(courseIndex)
                    );
                    if (course.address.toString() === address) {
                        return navigate(`/course/${address}/promo`);
                    }
                }

                if (interfaces.includes("nft_item")) {
                    const nftRes = await fetch(
                        `https://testnet.tonapi.io/v2/blockchain/accounts/${address}/methods/get_nft_data`
                    );
                    if (nftRes.status === 400) return navigate("/404");

                    const { decoded } = await nftRes.json();
                    const index = decoded.index;
                    const collectionAddress = decoded.collection_address;

                    const certificate = await Certificate.fromInit(
                        Address.parse(collectionAddress),
                        BigInt(index)
                    );

                    if (certificate.address.toString() === address) {
                        return navigate(`/certificate/${address}`);
                    }
                }

                return navigate("/404");
            } catch (err) {
                console.warn("Account fetch retry:", err);
                retries++;
                await new Promise((r) => setTimeout(r, RETRY_DELAY));
            }
        }

        return navigate("/404");
    };

    return (
        <Popover>
            <PopoverTrigger>
                <div
                    className={`${className} flex items-center space-x-2 px-4 py-2 border rounded-xl cursor-pointer`}
                >
                    <Search className="h-5 w-5 text-gray-500" />
                    <span className="hidden sm:inline text-sm text-gray-500">
                        {t("searchBar.search")}
                    </span>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 shadow-xl rounded-xl border-0 p-0"
                sideOffset={14}
            >
                <div className="flex flex-col px-3 py-2">
                    <Input
                        type="search"
                        placeholder={t("searchBar.placeholder")}
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                            handleKeyDown(e, searchQuery, navigate)
                        }
                        className="w-full border-0 p-0"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};
