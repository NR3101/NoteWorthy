"use client";

import { EditorContent } from "@tiptap/react";
import EditorExtensions from "./EditorExtensions";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { useEditor } from "@/context/EditorContext";

const TextEditor = ({ fileId }) => {
  const editor = useEditor();
  const notes = useQuery(api.notes.getNotes, {
    fileId,
  });

  useEffect(() => {
    if (notes && editor) {
      editor.commands.setContent(notes);
    }
  }, [notes, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative h-full">
      <EditorExtensions editor={editor} />
      <div className="h-[calc(100vh-8rem)] overflow-y-scroll scrollbar-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEditor;
