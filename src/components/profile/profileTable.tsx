import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Copy, Check, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { ProfileWithWalletDataInterface } from "@/types/profileData";
import { CreateProfileDialog } from "@/components/profile/createProfileDialog";
import { Button } from "@/components/ui/button";
import { SocialLinksGroup } from "@/components/profile/socialLinksGroup";
import { Avatar } from "@/components/ui/avatar";
import { EditProfileDialog } from "@/components/profile/editProfileDialog";

interface ProfileTableProps {
    userData?: ProfileWithWalletDataInterface;
    isProfile?: boolean;
}

export function ProfileTable({
    userData,
    isProfile = false,
}: ProfileTableProps) {
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

    const socialLinks =
        userData?.attributes?.filter((a) => a.trait_type && a.value) || [];

    return (
        <div className="py-4 px-8 bg-white rounded-3xl md:border-[6px] border-gray-200">
            <div className="flex flex-col-reverse md:flex-row justify-between items-start md:gap-8 gap-2">
                {/* Left: Table */}
                <div className="space-y-2 text-left w-full md:w-2/3">
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

                    {/* Description */}
                    {isProfile && userData?.description && (
                        <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {userData.description}
                        </div>
                    )}
                    {/* Social Links */}
                    {isProfile && socialLinks.length > 0 && (
                        <div className="">
                            <SocialLinksGroup links={socialLinks} />
                        </div>
                    )}
                </div>

                {/* Right: Avatar */}
                {isProfile && userData?.image && (
                    <div className="md:flex md:flex-col md:justify-end items-center">
                        <div className="w-full flex md:justify-end">
                            <Avatar className="w-[150px] h-[150px] rounded-2xl">
                                <img
                                    src={`https://ipfs.io/ipfs/${userData.image}`}
                                    alt="Profile avatar"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </Avatar>
                        </div>
                        {/* Create/Edit Profile Button */}
                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenDialog(true)}
                                className="w-[150px] p-2.5 mt-2 gap-1.5 flex items-center border-goluboy text-goluboy 
                                hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 rounded-2xl"
                            >
                                <span className="m-0 p-0 font-semibold text-xs sm:text-sm flex items-center gap-2">
                                    <span>{"Edit Profile"}</span>
                                    <User className="w-4 h-4" />
                                </span>
                            </Button>

                            <EditProfileDialog
                                open={openDialog}
                                onOpenChange={setOpenDialog}
                                initialData={userData}
                            />
                        </div>
                    </div>
                )}
            </div>
            {!isProfile ? (
                <div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpenDialog(true)}
                        className="w-[150px] p-2.5 mt-2 gap-1.5 flex items-center border-goluboy text-goluboy 
                                hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 rounded-2xl"
                    >
                        <span className="m-0 p-0 font-semibold text-xs sm:text-sm flex items-center gap-2">
                            <span>{"Create Profile"}</span>
                            <User className="w-4 h-4" />
                        </span>
                    </Button>
                    <CreateProfileDialog
                        open={openDialog}
                        onOpenChange={setOpenDialog}
                    />
                </div>
            ) : null}
        </div>
    );
}
