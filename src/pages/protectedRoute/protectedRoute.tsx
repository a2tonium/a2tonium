import React from "react";
// import { Navigate } from "react-router-dom";
import { useTonConnect } from "@/hooks/useTonConnect";
import { MainLayout } from "@/layouts/main.layout";
import { UserNotAuthorized } from "@/pages/error/userNotAuthorized";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isConnected, ready } = useTonConnect();
    if (!ready) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
                    <p className="text-gray-700 font-medium">Please wait</p>
                </div>
            </div>
        );
    }
    if (!isConnected) {
        return (
            <MainLayout>
                <UserNotAuthorized />
            </MainLayout>
        );
    }

    return <>{children}</>;
}
