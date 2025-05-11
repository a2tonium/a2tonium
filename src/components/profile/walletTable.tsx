import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Copy, Check, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

import { UserDataInterface } from "@/services/user.service";
import { CreateProfileDialog } from "@/components/profile/createProfileDialog";
import { Button } from "@/components/ui/button";

interface WalletTableProps {
    userData?: UserDataInterface;
}

export function WalletTable({ userData }: WalletTableProps) {
    const isMobile = useIsMobile();
    const [copied, setCopied] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

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
                    <div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenDialog(true)}
                            className="p-2.5 mt-2 gap-1.5 flex items-center border-goluboy text-goluboy 
        hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 rounded-2xl"
                        >
                            <span className="m-0 p-0 font-semibold text-xs sm:text-sm flex items-center gap-2">
                                <span>Create Profile</span>
                                <User className="w-4 h-4" />
                            </span>
                        </Button>

                        <CreateProfileDialog
                            open={openDialog}
                            onOpenChange={setOpenDialog}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
