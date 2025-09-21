"use server";
import { Subscription } from "@prisma/client";
import prisma from "../prisma";
import { validate } from "uuid";
import { uuid } from "zod";
import { error } from "console";

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
      orderBy:{
        createdAt:'asc'
      }
    });  
    
    return {data:folders,error:null}

  } catch (error:any) { 
    console.log("error in get folder ",error.message);
    return{ data:null,error:"Error"};
  }
};
