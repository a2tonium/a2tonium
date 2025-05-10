import { Link } from "react-router-dom";

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useTranslation } from "react-i18next";
import { TonConnectButton } from "@tonconnect/ui-react";
import { SearchBar } from "@/components/header/searchBar";
import { SettingsPopover } from "@/components/header/settingsPopover";
import { useTonConnect, CHAINNET } from "@/hooks/useTonConnect";

interface HeaderProps {
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
    const { t } = useTranslation();
    const { network } = useTonConnect();
    // TESTNET = -3, MAINNET = -239


    return (
        <header
            className={`
            fixed z-50 inset-x-0 top-0 
            backdrop-blur-lg backdrop-saturate-150
            bg-white/70 dark:bg-black/50
            transition-all duration-300
            ${className}
        `}
        >
            <div className="max-w-screen-xl flex justify-between items-center px-5 mx-auto">
                <div className="flex items-center space-x-3">
                    {/* Logo */}
                    <Link to="/catalog">
                        <div className="flex items-center space-x-2 py-2">
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                className="w-10 h-10"
                            />
                            {/* Hide DLMS Platform text when the width is less than 1024px */}
                            <span className="text-lg font-bold hidden lg:flex">
                                {t("logo-name")}
                            </span>
                        </div>
                    </Link>
                    {/* Navigation */}
                    <NavigationMenu className="hidden md:flex text-base">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/catalog"
                                        className="text-gray-700 hover:text-blue-500 transition duration-200 p-2 m-0"
                                    >
                                        {t("catalog")}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/learn"
                                        className="text-gray-700 hover:text-blue-500 transition duration-200 p-2 m-0"
                                    >
                                        {t("learning")}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to="/teach"
                                        className="text-gray-700 hover:text-blue-500 transition duration-200 p-2 m-0"
                                    >
                                        {t("teaching")}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            {Number(network) === CHAINNET.TESTNET && (
                                <span
                                    className="ml-2 px-1 py-[1px] rounded-full
                               text-[10px] uppercase font-bold tracking-wide
                               bg-goluboy text-white
                               border border-goluboy"
                                >
                                    testnet
                                </span>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right Block (Ton Connect and Wallet) */}
                <div className="flex items-center space-x-1 sm:space-x-3">
                    <SearchBar className="" />
                    <TonConnectButton style={{ boxShadow: "none" }} className="p-0 m-0 !shadow-none" />
                    <SettingsPopover />
                </div>
            </div>
        </header>
    );
};
