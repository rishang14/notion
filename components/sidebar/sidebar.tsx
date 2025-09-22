import { auth } from "@/auth";
import React from "react";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import {
  getUserSubscriptionStatus,
  getFolders,
  getPersonalWorkSpace,
  getCollboratorWorkspace,
  getsharedWorksace,
} from "@/lib/queries/db.queries";
import { ScrollArea } from "../ui/scroll-area";
import Workspacedropdown from "./workspacedropdown";
import { Workspace } from "@prisma/client";

const Sidebar = async ({ workspaceid }: { workspaceid: string }) => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const { data: subscriptionData, error: subscriptionerror } =
    await getUserSubscriptionStatus(session?.user.id);

  const { data: folderData, error: folderError } = await getFolders(
    workspaceid
  );

  if (subscriptionerror || folderError) {
    redirect("/dashboard");
  }

  const [presonalWokspace, collaboratorWorkspace, sharedWorkSpace] =
    await Promise.all([
      getPersonalWorkSpace(session?.user.id as string),
      getCollboratorWorkspace(session?.user.id as string),
      getsharedWorksace(session?.user.id as string),
    ]);

  const defaultWorkspace = [
    ...presonalWokspace,
    ...collaboratorWorkspace,
    ...sharedWorkSpace,
  ].find((w) => w.id === workspaceid);
  return (
    <aside
      className={twMerge(
        "hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between"
      )}
    >
      <div>
        <Workspacedropdown
          personalWorkspace={presonalWokspace}
          sharedWorkspace={sharedWorkSpace}
          collaboratorWorkspace={collaboratorWorkspace}
          defaultWorkSpace={defaultWorkspace}
        />
        {/* <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        /> */}
        {/* <NativeNavigation myWorkspaceId={params.workspaceId} /> */}
        <ScrollArea
          className="overflow-auto relative
          h-[450px]
        "
        >
          <div
            className="pointer-events-none 
          w-full 
          absolute 
          bottom-0 
          h-20 
          bg-gradient-to-t 
          from-background 
          to-transparent 
          z-40"
          />
          {/* <FoldersDropdownList
            workspaceFolders={workspaceFolderData || []}
            workspaceId={params.workspaceId}
          /> */}
        </ScrollArea>
      </div>
      {/* <UserCard subscription={subscriptionData} /> */}
    </aside>
  );
};

export default Sidebar;
