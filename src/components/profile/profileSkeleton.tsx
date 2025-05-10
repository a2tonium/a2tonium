// ProfileSkeleton.tsx
import React from "react";
import { WalletTableSkeleton } from "@/components/profile/walletTableSkeleton";
import { CoursesSectionSkeleton } from "@/components/profile/coursesSectionSkeleton";
import { CertificatesSectionSkeleton } from "@/components/profile/certificatesSectionSkeleton";

export const ProfileSkeleton: React.FC = () => {
    return (
        <div className="mt-8 mx-auto space-y-3">
            {/* Card 1 */}
            <WalletTableSkeleton />

            {/* Card 2 (Tabs skeleton) */}
            <div className="bg-white py-4 px-8 rounded-3xl md:border-[6px] border-gray-200">
                <CoursesSectionSkeleton />
                <CertificatesSectionSkeleton />
            </div>
        </div>
    );
};
