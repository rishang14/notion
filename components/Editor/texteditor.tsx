"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Folder, File, Workspace } from "@prisma/client";
import type QuillType from "quill";
import "quill/dist/quill.snow.css";
import { useAppSotre } from "@/lib/state.provider";
import { Button } from "../ui/button";

type props = {
  dirType: "workspace" | "folder" | "file";
  fileId: string;
  data: File | Folder | Workspace;
};
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];
const Texteditor = ({ dirType, fileId, data }: props) => {
  const [quill, setQuill] = useState<QuillType | null>();
  const { workSpaceId, workspaces, folderId } = useAppSotre();
  const wrapperref = useCallback((wrapper: HTMLDivElement | null) => {
    if (typeof window === undefined || wrapper === null) return;
    (async () => {
      wrapper.innerHTML = " ";
      const editor = document.createElement("div");
      wrapper.append(editor);

      const Quill = (await import("quill")).default;

      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });
      setQuill(q);
    })();
  }, []);

  const details = useMemo(() => {
    let selectedDir;
    if (dirType === "file") {
      selectedDir = workspaces
        .find((w) => w.id === workSpaceId)
        ?.folders.find((f) => f.id === folderId)
        ?.files.find((f) => f.id === fileId);
    }
    if (dirType === "folder") {
      selectedDir = workspaces
        .find((w) => w.id === workSpaceId)
        ?.folders.find((f) => f.id === fileId);
    }
    if (dirType === "workspace") {
      selectedDir = workspaces.find((w) => w.id === fileId);
    }

    if (selectedDir) {
      return selectedDir;
    }

    return {
      title: data.title as string,
      iconId: data.iconId,
      createdAt: data.createdAt,
      data: data.data,
      inTrash: data.inTrash,
      bannerUrl: data.bannerUrl,
    } as Workspace | Folder | File;
  }, [workSpaceId, workspaces, fileId]);   

  const restoreHandler=()=>{

  } 

  const deleteHandler=()=>{

  }

  return (
    <>
      <div className="relative">
        {details.inTrash && (
          <article
            className="py-2 
          z-40 
          bg-[#EB5757] 
          flex  
          md:flex-row 
          flex-col 
          justify-center 
          items-center 
          gap-4 
          flex-wrap"
          >
            <div
              className="flex 
            flex-col 
            md:flex-row 
            gap-2 
            justify-center 
            items-center"
            >
              <span className="text-white">
                This {dirType} is in the trash.
              </span>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent
                border-white
                text-white
                hover:bg-white
                hover:text-[#EB5757]
                "
                onClick={restoreHandler}
              >
                Restore
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-transparent
                border-white
                text-white
                hover:bg-white
                hover:text-[#EB5757]
                "
                onClick={deleteHandler}
              >
                Delete
              </Button>
            </div>
            <span className="text-sm text-white">{details.inTrash}</span>
          </article>
        )}
      </div>
      <div className="flex w-full items-center flex-col justify-center mt-10">
        <div id="container" className="max-w-[800px]" ref={wrapperref}></div>
      </div>
    </>
  );
};

export default Texteditor;
