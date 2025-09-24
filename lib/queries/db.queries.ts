"use server";
import { Folder, Subscription, Workspace, User, File } from "@prisma/client";
import prisma from "../prisma";
import { validate } from "uuid";
import { FolderCreateInputSchema } from "@/prisma/zod";
import { error } from "console";
import { date } from "zod";

export const getUserSubscriptionStatus = async (userid: string) => {
  try {
    const data = await prisma.subscription.findFirst({
      where: {
        userId: userid,
      },
    });

    if (data) {
      return { data: data as Subscription, error: null };
    } else {
      return { data: null, error: null };
    }
  } catch (error) {
    console.log("Error while fetching the subscription status", error);
    return { data: null, error: `Error : ${error}` };
  }
};

export const createWorkSpace = async (values: any) => {
  try {
    const createdWorkspace = await prisma.workspace.create({
      data: {
        workspaceOwner: values.workspaceOwner,
        title: values.title,
        iconId: values.iconId,
        logo: values?.logo ?? null,
      },
    });

    return createdWorkspace;
  } catch (error) {
    console.log(error, "while creating the workspace ");
  }
};

export const getFolders = async (wId: string) => {
  const valid = validate(wId);
  if (!valid) {
    return { data: null, error: "Error" };
  }
  try {
    const folders = await prisma.folder.findMany({
      where: {
        workspaceId: wId,
      }, 
      include:{
        files:true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { data: folders, error: null };
  } catch (error: any) {
    console.log("error in get folder ", error.message);
    return { data: null, error: "Error" };
  }
};

export const getPersonalWorkSpace = async (userid: string) => {
  if (!userid) return [];

  const privateWorkSpace: Workspace[] = await prisma.workspace.findMany({
    where: {
      workspaceOwner: userid,
      collaborators: {
        none: {},
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return privateWorkSpace;
};

export const getFiles = async (workspaceId: string, folderId: string) => {
  try {
    if (!workspaceId || !folderId) {
      return { data: null, error: null };
    }

    const allfiles = await prisma.file.findMany({
      where: {
        folderId: folderId,
        workspaceId: workspaceId,
      },
    });

    if (!allfiles) {
      return { data: [], error: null };
    }

    return { data: allfiles, error: null };
  } catch (error) {
    console.log("got error while retriving the file");
    return { data: null, error: "Error" };
  }
};

export const getCollboratorWorkspace = async (userid: string) => {
  if (!userid) return [];

  const collaboratorworkspace: Workspace[] = await prisma.workspace.findMany({
    where: {
      collaborators: {
        some: { userId: userid },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return collaboratorworkspace;
};

export const getsharedWorksace = async (userid: string) => {
  if (!userid) return [];

  const sharedWorksace: Workspace[] = await prisma.workspace.findMany({
    where: {
      workspaceOwner: userid,
      collaborators: {
        some: {},
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return sharedWorksace;
};

export const addCollaborator = async (users: User[], workspaceId: string) => {
  await prisma.collaborator.createMany({
    data: users.map((user) => ({
      workspaceId,
      userId: user.id as string,
    })),
    skipDuplicates: true,
  });
};

export const getAllUsersFromSeacrh = async (email: string) => {
  if (!email) return [];

  return prisma.user.findMany({
    where: {
      email: {
        startsWith: email, // case-sensitive
        mode: "insensitive", // <-- makes it ILIKE (case-insensitive)
      },
    },
  });
};

export const createFolder = async (values: Partial<File>) => {
  try {
    if (!values) return { data: null, error: null };

    const createdFolder = await prisma.folder.create({
      data: {
        title: values.title as string,
        iconId: values.iconId as string,
        workspaceId: values.workspaceId as string,
      },
    });

    if (!createdFolder) {
      return { data: null, error: "Not able to created" };
    }
    return { data: createdFolder, error: null };
  } catch (error) {
    console.log("while creating folder error", error);
    return { data: null, error: "error" };
  }
};

export const updateFolder = async (values: Partial<Folder>, fid: string) => {
  console.log(fid);
  try {
    const updateFolder = await prisma.folder.update({
      where: {
        id: fid,
      },
      data: {
        ...values,
      },
    });

    if (!updateFolder) {
      return { data: null, error: "something went wrong" };
    }

    return { data: updateFolder, error: null };
  } catch (error) {
    console.log("while updating the folder got error :", error);
    return { data: null, error: "Error" };
  }
};

export const updateFiles = async (values: Partial<File>, fileid: string) => {
  try {
    const updatedFile = await prisma.file.update({
      where: {
        id: fileid,
      },
      data: {
        ...values,
      },
    });

    if (!updatedFile) {
      return { data: null, error: "error" };
    }

    return { data: updatedFile, error: null };
  } catch (error) {
    console.log("error while updating file ", error);
    return { date: null, error: "error" };
  }
};

export const createFile = async (values: Partial<File>) => {
  try {
    const createdFile = await prisma.file.create({
      data: {
        title: values.title as string,
        workspaceId: values.workspaceId as string,
        iconId: values.iconId as string,
        folderId: values.folderId as string,
      },
    });

    if (!createdFile) {
      return { data: null, error: "Error" };
    }
    return { data: createdFile, error: null };
  } catch (error) {
    console.log("error while creating file ", error);
    return { data: null, error: "Error" };
  }
};
