import { Subscription } from "@prisma/client";
import prisma from "../prisma";

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
