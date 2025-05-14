import { useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ErrorPage } from "@/pages/error/error";
import { ProfileTable } from "@/components/profile/profileTable";
import { ProfileTableSkeleton } from "@/components/profile/profileTableSkeleton";
import { CoursesSectionSkeleton } from "@/components/profile/coursesSectionSkeleton";
import { CertificatesSectionSkeleton } from "@/components/profile/certificatesSectionSkeleton";
import { ProfileSkeleton } from "@/components/profile/profileSkeleton";
import { useWalletData } from "@/hooks/useWalletData";
import { useUserNFTs } from "@/hooks/useUserNFTs";
import { CoursesSection } from "@/components/profile/coursesSection";
import { CertificatesSection } from "@/components/profile/certificatesSection";
import { CertificateInterface } from "@/types/courseData";
import { useOwnerCoursesList } from "@/hooks/useOwnerCoursesList";
import { useProfileData } from "@/hooks/useProfileData";

export function UserProfile() {
    const { walletAddr } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const section = searchParams.get("section") ?? "courses";
    const {
        data: walletData,
        error: walletError,
        isLoading: isWalletLoading,
    } = useWalletData(walletAddr);

    const {
        data: profileData,
        error: profileError,
        isLoading: isProfileLoading,
    } = useProfileData();

    const {
        data: courseList,
        error: courseError,
        isLoading: isCoursesLoading,
    } = useOwnerCoursesList(walletAddr);

    const {
        // data: nftList,
        error: nftError,
        isLoading: isNFTLoading,
    } = useUserNFTs(walletAddr);

    const nftList2: CertificateInterface[] = [
        {
            certificateAddress: "1",
            title: "Certificate 1awdddddddawdawdawdwad",
            image: "/images/cards/1.png",
        },
        {
            certificateAddress: "2",
            title: "Certificate 2",
            image: "/images/cards/1.png",
        },
        {
            certificateAddress: "1",
            title: "Certificate 1awdddddddawdawdawdwad",
            image: "/images/cards/1.png",
        },
        {
            certificateAddress: "1",
            title: "Certificate 1awdddddddawdawdawdwad",
            image: "/images/cards/1.png",
        },
        {
            certificateAddress: "1",
            title: "Certificate 1awdddddddawdawdawdwad",
            image: "/images/cards/1.png",
        },
        {
            certificateAddress: "1",
            title: "Certificate 1awdddddddawdawdawdwad",
            image: "/images/cards/1.png",
        },
        {
            certificateAddress: "1",
            title: "Certificawdwad 1awdddddddawdawdawdwad awdawdawdawd wdadwawdawdawd awdadwawdadw awdawdawd",
            image: "/images/cards/1.png",
        },
        {
            certificateAddress: "1",
            title: "Certificate 1awdddddddawdawdawdwad",
            image: "/images/cards/1.png",
        },
    ];

    const isLoading = isWalletLoading && isNFTLoading && isCoursesLoading;
    // Loading state
    if (isLoading) {
        return <ProfileSkeleton />;
    }

    // Error state
    if (walletError || nftError || courseError || profileError) {
        return (
            <ErrorPage
                first={"Wallet Not Found"}
                second={"We couldn't find a user with this wallet."}
                third={"Please double-check the address and try again."}
            />
        );
    }

    // Null fallback (just in case)
    if (!walletData && !isWalletLoading) {
        return (
            <ErrorPage
                first={"Wallet doesn't exist"}
                second={"We couldn't find a user with this wallet."}
                third={"Please double-check the address and try again."}
            />
        );
    }
    
    // Rendered profile
    return (
        <div className="mt-8 mx-auto space-y-3 ">
            {(isWalletLoading || isProfileLoading) ? (
                <ProfileTableSkeleton />
            ) : (
                <ProfileTable walletData={walletData} profileData={profileData}/>
            )}

            {/* Tabs Section */}
            <div className="bg-white py-4 px-8 rounded-3xl md:border-[6px] border-gray-200">
                <Tabs
                    value={section}
                    onValueChange={(val) => {
                        setSearchParams({ section: val });
                    }}
                >
                    <TabsList className="w-full flex justify-start bg-white p-0 space-x-5">
                        <TabsTrigger
                            value="courses"
                            className="text-md data-[state=active]:underline underline-offset-8 px-0 py-2"
                        >
                            <span className="font-semibold">Courses</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="certificates"
                            className="text-md data-[state=active]:underline underline-offset-8 px-0 py-2"
                        >
                            <span className="font-semibold">Certificates</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="courses">
                        <div className="mt-4 space-y-4">
                            {isCoursesLoading ? (
                                <CoursesSectionSkeleton />
                            ) : (
                                <CoursesSection courses={courseList || []} />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="certificates">
                        <div className="mt-4 space-y-4">
                            {isNFTLoading ? (
                                <CertificatesSectionSkeleton />
                            ) : (
                                <CertificatesSection
                                    certificates={nftList2 || []}
                                />
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
