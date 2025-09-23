"use server";
import { Subscription, Workspace } from "@prisma/client";
import prisma from "../prisma";
import { validate } from "uuid";
import { User } from "@prisma/client";

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

  return  prisma.user.findMany({
    where: {
      email: {
        startsWith: email, // case-sensitive
        mode: "insensitive", // <-- makes it ILIKE (case-insensitive)
      },
    },
  });
};
