import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Copy, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

import { UserDataInterface } from "@/lib/userService";

interface WalletTableProps {
    userData?: UserDataInterface;
}

export function WalletTable({ userData }: WalletTableProps) {
    const isMobile = useIsMobile();
    const [copied, setCopied] = useState(false);

    const truncateAddress = (address?: string) => {
        if ((address ?? "").length <= 16) return address;
        return isMobile
            ? `${address?.slice(0, 8)}...${address?.slice(-8)}`
            : address;
    };
    const handleCopy = () => {
        if (!userData?.address) return;
        navigator.clipboard.writeText(userData.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <div className="py-4 px-8 bg-white rounded-3xl md:border-[6px] border-gray-200">
            <div className="flex flex-row justify-between items-center">
                <div className="space-y-2 text-left">
                    <Table>
                        <TableBody className="border-0">
                            <TableRow className="border-0">
                                <TableCell className="w-[50px] font-semibold p-0 pr-6 py-2">
                                    <p>Name</p>
                                </TableCell>
                                <TableCell className="py-0">
                                    {userData?.name}
                                </TableCell>
                            </TableRow>
                            <TableRow className="border-0">
                                <TableCell className="font-semibold p-0 py-2">
                                    <p>Address</p>
                                </TableCell>
                                <TableCell
                                    onClick={handleCopy}
                                    className="py-2 flex items-center space-x-2 w-full group relative"
                                >
                                    <p className="truncate max-w-full">
                                        {truncateAddress(userData?.address)}
                                    </p>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white-500 duration-200">
                                        {copied ? (
                                            <Check className="w-[13px] h-[13px] text-blue-500" />
                                        ) : (
                                            <Copy className="w-[13px] h-[13px]" />
                                        )}
                                    </button>
                                </TableCell>
                            </TableRow>
                            <TableRow className="border-0">
                                <TableCell className="font-semibold p-0 py-2">
                                    <p>Balance</p>
                                </TableCell>
                                <TableCell className="py-0">
                                    {userData?.balance} TON
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
