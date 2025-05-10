import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";
import { Toaster } from "@/components/ui/toaster";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const location = useLocation();

    const getCustomCSSMain = () => {
        if (location.pathname.includes("/lesson/")) {
            return "max-w-screen-2xl";
        }
        return "max-w-screen-xl sm:px-4";
    };

    const getCustomCSS = () => {
        if (location.pathname.includes("/lesson/")) {
            return "";
        }
        return "";
    };

    return (
        <div
            className={`flex flex-col min-h-screen bg-white ${getCustomCSS()}`}
        >
            {/* Header */}
            <Header className="w-full h-13 bg-white" />

            {/* Main Content */}
            <Toaster />
            <main
                className={`w-full flex-grow pt-[80px] pb-[40px] mx-auto ${getCustomCSSMain()}`}
            >
                {children}
            </main>

            {/* Footer */}
            <Footer className="px-4 max-w-screen-xl" />
        </div>
    );
};
