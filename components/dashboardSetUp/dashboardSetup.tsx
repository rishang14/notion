"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Session } from "next-auth";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import Loader from "../global/Loader";
import EmojiPicker from "../global/emojiPicker";
import { Subscription } from "@prisma/client";
import { CreateWorkspaceFormSchema } from "@/lib/types";
import { ImgFormats } from "@/lib/constants";
import z, { any, unknown } from "zod";
import { HandleUploadImg } from "@/lib/uploadImg";
import { toast } from "sonner";
interface prop {
  user: Session;
  subscription: Subscription | null;
}

const DashboardSetup = ({ user, subscription }: prop) => {
  const [selectedEmoji, setSelectedEmoji] = useState("💼");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isLoading, errors, isSubmitting },
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      logo: "",
      workspaceName: "",
    },
  });

  console.log("errors", errors);
  const onsubmit: SubmitHandler<
    z.infer<typeof CreateWorkspaceFormSchema>
  > = async (values) => {
    try {
      const workspaceName = values.workspaceName;
      const file = values.logo[0];
      let imgUrl = "";

      if (file) {
        console.log("i am inside the file section");
        try {
          const fileType = file.name.split(".");
          console.log(fileType, "type of  file");
          const type = ImgFormats.find(
            (i: string) => i == (fileType[1] as string)
          );
          if (!type) {
            setError("logo", {
              message: "Please upload Img at valid format",
            });
            return;
          }

          const { data, error } = await HandleUploadImg(
            file,
            "workspace-logos"
          );

          if (error) {
            toast.error(error, { duration: 3000 });
            return;
          }

          imgUrl = data as string;
        } catch (error: any) {
          toast.error(error.message, { duration: 3000 });
          return;
        }
      }
    } catch (error) {
      toast.error("Unexpected Error  Pls try again", { duration: 3000 });
    } finally {
      reset();
    }
  };
  return (
    <Card
      className="w-[800px]
      h-screen
      sm:h-auto
  "
    >
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          Lets create a private workspace to get you started.You can add
          collaborators later from the workspace settings tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="flex flex-col gap-4">
            <div
              className="flex
            items-center
            gap-4"
            >
              <div className="text-5xl">
                <EmojiPicker getvalues={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPicker>
              </div>
              <div className="w-full ">
                <Label
                  htmlFor="workspaceName"
                  className="text-sm
                  text-muted-foreground
                "
                >
                  Name
                </Label>
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  disabled={isLoading}
                  {...register("workspaceName", {
                    required: "Workspace name is required",
                  })}
                />
                <small className="text-red-600">
                  {errors?.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <div>
              <Label
                htmlFor="logo"
                className="text-sm
                  text-muted-foreground
                "
              >
                Workspace Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                placeholder="Workspace Name"
                // disabled={isLoading || subscription?.status !== 'active'}
                {...register("logo", {
                  required: false,
                })}
              />
              <small className="text-red-600">
                {errors?.logo?.message?.toString()}
              </small>
              {subscription?.status !== "active" && (
                <small
                  className="
                  text-muted-foreground
                  block
              "
                >
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )}
            </div>
            <div className="self-end">
              <Button
                disabled={isLoading}
                type="submit"
                className="cursor-pointer"
              >
                {!isLoading ? "Create Workspace" : <Loader />}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardSetup;
