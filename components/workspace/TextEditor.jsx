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
    <div className="relative h-full bg-white dark:bg-gray-900 transition-colors duration-200">
      <EditorExtensions editor={editor} />
      <div className="h-[calc(100vh-8rem)] overflow-y-scroll scrollbar-none">
        <div className="prose prose-sm md:prose-base max-w-none px-8 py-6 dark:prose-invert prose-headings:font-semibold prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-sm prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-blockquote:border-l-purple-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-1 prose-blockquote:px-4">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
