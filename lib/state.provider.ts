import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { File } from "@/prisma/zod";
import { Folder, Workspace } from "@prisma/client";

export type appFoldersType = Folder & { files: File[] | [] };
export type appWorkspacesType = Workspace & {
  folders: appFoldersType[] | [];
};
interface AppState {
  workspaces: appWorkspacesType[];
  folders: appFoldersType[];

  // workspace actions
  setWorkspaces: (workspaces: appWorkspacesType[]) => void;
  addWorkspace: (workspace: appWorkspacesType) => void;
  updateWorkspace: (
    workspaceId: string,
    partial: Partial<appWorkspacesType>
  ) => void;
  deleteWorkspace: (workspaceId: string) => void;

  // folder actions
  setFolders: (workspaceId: string, folders: appFoldersType[]) => void;
  addFolder: (workspaceId: string, folder: appFoldersType) => void;
  updateFolder: (
    workspaceId: string,
    folderId: string,
    partial: Partial<appFoldersType>
  ) => void;
  deleteFolder: (workspaceId: string, folderId: string) => void;

  // file actions
  setFiles: (workspaceId: string, folderId: string, files: File[]) => void;
  addFile: (workspaceId: string, folderId: string, file: File) => void;
  updateFile: (
    workspaceId: string,
    folderId: string,
    fileId: string,
    partial: Partial<File>
  ) => void;
  deleteFile: (workspaceId: string, folderId: string, fileId: string) => void;
}

export const useAppSotre = create<AppState>()(
  devtools((set) => ({
    workspaces: [],
    // workspacess
    addWorkspace: (workspace) => {
      set((state) => ({
        workspaces: [...state.workspaces, { ...workspace, folders: [] }],
      }));
    },
    setWorkspaces: (allworkSpaces) => {
      set(() => ({
        workspaces: allworkSpaces,
      }));
    },
    //folders
    addFolder: (workspaceId, folder) => {
      set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w.id === workspaceId
            ? {
                ...w,
                folders: [...w.folders, folder].sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                ),
              }
            : w
        ),
      }));
    },

    setFolders: (workspaceId, folders) => {
      set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w.id === workspaceId
            ? {
                ...w,
                folders: folders.sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                ),
              }
            : w
        ),
      }));
    },
  }))
);
