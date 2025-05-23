import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Copy, Check, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
    ProfileDataInterface,
    ProfileWithWalletDataInterface,
    WalletDataInterface,
} from "@/types/profile.types";
import { CreateProfileDialog } from "@/components/profile/createProfileDialog";
import { Button } from "@/components/ui/button";
import { SocialLinksGroup } from "@/components/profile/socialLinksGroup";
import { Avatar } from "@/components/ui/avatar";
import { EditProfileDialog } from "@/components/profile/editProfileDialog";
import { useTranslation } from "react-i18next";

interface ProfileTableProps {
    isProfile?: boolean;
    walletData?: WalletDataInterface;
    profileData?: ProfileDataInterface;
    isOwnerAddress: boolean;
}

export function ProfileTable({
    walletData,
    profileData,
    isOwnerAddress,
}: ProfileTableProps) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [copied, setCopied] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const isProfile = !!profileData;
    const userData: ProfileWithWalletDataInterface = {
        name: profileData?.name || t("profileTable.wallet"),
        description: profileData?.description || "",
        image: profileData?.image || "",
        address: walletData?.address || "",
        balance: walletData?.balance || "",
        attributes: profileData?.attributes || [],
    };

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
                <div className="space-y-2 text-left w-full md:w-2/3">
                    <Table>
                        <TableBody className="border-0">
                            <TableRow className="border-0">
                                <TableCell className="w-[50px] font-semibold p-0 pr-6 py-2">
                                    <p>{t("profileTable.name")}</p>
                                </TableCell>
                                <TableCell className="py-0">
                                    {userData?.name}
                                </TableCell>
                            </TableRow>
                            <TableRow className="border-0">
                                <TableCell className="font-semibold p-0 py-2">
                                    <p>{t("profileTable.address")}</p>
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
                                    <p>{t("profileTable.balance")}</p>
                                </TableCell>
                                <TableCell className="py-0">
                                    {userData?.balance} TON
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    {isProfile && userData?.description && (
                        <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {userData.description}
                        </div>
                    )}
                    {isProfile && socialLinks.length > 0 && (
                        <div className="">
                            <SocialLinksGroup links={socialLinks} />
                        </div>
                    )}
                </div>

                {isProfile && userData?.image && (
                    <div className="md:flex md:flex-col md:justify-end items-center">
                        <div className="w-full flex md:justify-end">
                            <Avatar className="w-[150px] h-[150px] rounded-2xl">
                                <img
                                    src={`https://moccasin-defeated-vicuna-32.mypinata.cloud/ipfs/${userData.image.substring(
                                        7
                                    )}`}
                                    alt="Profile avatar"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </Avatar>
                        </div>
                        {isOwnerAddress && (
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenDialog(true)}
                                    className="w-[150px] p-2.5 mt-2 gap-1.5 flex items-center border-goluboy text-goluboy 
                                hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 rounded-2xl"
                                >
                                    <span className="m-0 p-0 font-semibold text-xs sm:text-sm flex items-center gap-2">
                                        <span>
                                            {t("profileTable.editProfile")}
                                        </span>
                                        <User className="w-4 h-4" />
                                    </span>
                                </Button>

                                <EditProfileDialog
                                    open={openDialog}
                                    onOpenChange={setOpenDialog}
                                    initialData={userData}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isOwnerAddress && !isProfile ? (
                <div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpenDialog(true)}
                        className="w-[150px] p-2.5 mt-2 gap-1.5 flex items-center border-goluboy text-goluboy 
                                hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 rounded-2xl"
                    >
                        <span className="m-0 p-0 font-semibold text-xs sm:text-sm flex items-center gap-2">
                            <span>{t("profileTable.createProfile")}</span>
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
