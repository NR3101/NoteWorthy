"use client";

import PdfViewer from "@/components/workspace/PdfViewer";
import TextEditor from "@/components/workspace/TextEditor";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { EditorProvider } from "@/context/EditorContext";

export default function WorkspacePage() {
  const { fileId } = useParams();
  const fileInfo = useQuery(api.fileStorage.getFileInfo, {
    fileId,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start taking your notes here..." }),
      Underline,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[calc(100vh-8rem)] p-5",
      },
    },
    immediatelyRender: false
  }, [/* dependency array */]);

  return (
    <EditorProvider value={editor}>
      <div className="flex flex-col h-screen">
        <WorkspaceHeader fileName={fileInfo?.fileName} />
        <div className="flex-1 grid grid-cols-2 overflow-hidden">
          {/* Text Editor */}
          <div className="overflow-y-auto border-r border-gray-200 dark:border-gray-800 scrollbar-none">
            <TextEditor fileId={fileId} />
          </div>
          {/* PDF Viewer */}
          <div className="overflow-y-auto">
            <PdfViewer fileUrl={fileInfo?.fileUrl} />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}
