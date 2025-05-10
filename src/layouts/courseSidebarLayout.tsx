import { SidebarProvider } from "@/components/ui/sidebar";
// import { CourseSidebar } from "@/components/courseSidebar/courseSidebar"

export function CourseSidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] shadow-md">
                {/* Sidebar */}
                {/* <CourseSidebar /> */}
                {/* Divider */}
                {/* <div className="hidden md:block w-[0.1px] bg-gray-300" /> */}

                {/* Main Content */}
                <main className="flex-grow">{children}</main>
            </div>
        </SidebarProvider>
    );
}
