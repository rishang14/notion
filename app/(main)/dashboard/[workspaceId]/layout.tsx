// import MobileSidebar from '@/components/sidebar/mobile-sidebar';
// import Sidebar from '@/components/sidebar/sidebar';
import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { workspaceId } = await params;
  console.log(workspaceId, "workspace id in layout ");
  return (
    <main
      className="flex overflow-hidden
      h-screen
      w-screen
  "
    >
      <Sidebar workspaceid={workspaceId}/>
      {/* <MobileSidebar> */}
      {/* <Sidebar
        //   params={params}
          className="w-screen inline-block sm:hidden"
        /> */}
      {/* </MobileSidebar> */}
      <div
        className="dark:border-neutral-12/70
        border-l-[1px]
        w-full
        relative
        overflow-scroll
      "
      >
        {children}
      </div>
    </main>
  );
};

export default Layout;
