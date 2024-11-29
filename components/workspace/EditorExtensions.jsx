"use client";

import { chatSession } from "@/config/aiModel";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading3,
  Highlighter,
  Underline,
  Sparkle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

const EditorExtensions = ({ editor }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const searchAI = useAction(api.myAction.search);
  const saveNotes = useMutation(api.notes.addNotes);
  const { fileId } = useParams();

  if (!editor) {
    return null;
  }

  // function to ask a question to the AI
  const onAskQuestion = async () => {
    try {
      // Get the selected text from the editor
      const selectedText = editor.state.doc
        .textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          "\n"
        )
        .trim();

      if (!selectedText) {
        toast({
          variant: "destructive",
          title: "Selection Required",
          description: "Please select some text to ask a question about.",
          className:
            "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/90 text-red-800 dark:text-red-100",
        });
        return;
      }

      toast({
        variant: "default",
        title: "AI Processing",
        description: "Analyzing your question...",
        className:
          "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/90 text-blue-800 dark:text-blue-100",
      });

      // Search the AI for the selected text
      const searchResults = await searchAI({
        query: selectedText,
        fileId: fileId,
      });

      const contextData = JSON.parse(searchResults);

      // Extract the context from the search results
      const context = contextData
        ?.map((item) => item.pageContent)
        .filter(Boolean)
        .join("\n\n");

      if (!context) {
        toast({
          variant: "destructive",
          title: "No Context Found",
          description: "Unable to find relevant information for your question.",
          className:
            "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/90 text-red-800 dark:text-red-100",
        });
        return;
      }

      const PROMPT = `
        Question: ${selectedText}
        
        Context: ${context}
        
        Instructions:
        1. The above context contains relevant information to answer the question
        2. Synthesize ALL the information provided in the context to give a complete answer
        3. Include ALL relevant details from the context, even if they appear in different sections
        4. If information appears fragmented, connect related pieces to form a coherent answer
        5. Format the response in clean HTML with appropriate semantic tags
        6. Use <p>, <ul>, <li>, <code>, <strong>, and other relevant HTML tags for structure without any tags such as <Doctype>, <html>, <head>, <title>, <body> or any meta tags or any heading tags taht lead to extra space in the editor.Just provide the answer in the editor.
        7. Do not state that information is missing if it can be found anywhere in the context
      `;

      // Send the prompt to the AI and get the formatted response
      const aiModelResult = await chatSession.sendMessage(PROMPT);
      let finalAnswer = aiModelResult.response.text();

      // Clean the AI response
      finalAnswer = finalAnswer
        .replace(/```html/gi, "")
        .replace(/```/g, "")
        .trim();

      // Add the AI response to the editor
      editor.commands.setContent(
        `${editor.getHTML()}
          <strong>AI Response:</strong>
          ${finalAnswer}`
      );

      // Save the AI response to the database
      await saveNotes({
        fileId: fileId,
        notes: editor.getHTML(),
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      // Show success toast
      toast({
        variant: "default",
        title: "Success! 🎉",
        description: "Answer generated and saved successfully",
        className:
          "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/90 text-green-800 dark:text-green-100",
      });
    } catch (error) {
      console.error("Error in onAskQuestion:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message,
        className:
          "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/90 text-red-800 dark:text-red-100",
      });
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/80 backdrop-blur-lg border-y border-gray-200 dark:border-gray-700 w-full shadow-md">
      <div className="p-2 flex flex-wrap items-center gap-1 md:gap-2 w-full">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("bold")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Bold"
          >
            <Bold size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("italic")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Italic"
          >
            <Italic size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("strike")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("code")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Code"
          >
            <Code size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("underline")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Underline"
          >
            <Underline size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("highlight")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Highlight"
          >
            <Highlighter size={18} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("bulletList")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Bullet List"
          >
            <List size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("orderedList")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
        </div>

        {/* Headings & Quote */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive("blockquote")
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Quote"
          >
            <Quote size={18} />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: "left" })
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: "center" })
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: "right" })
                ? "text-purple-500 bg-purple-100 dark:bg-purple-900/50"
                : ""
            }`}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
        </div>

        {/* History */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            title="Undo"
          >
            <Undo size={18} />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            title="Redo"
          >
            <Redo size={18} />
          </button>
        </div>

        {/* AI Button */}
        <button
          onClick={() => onAskQuestion()}
          className="p-1.5 rounded transition-all duration-200 ease-in-out hover:scale-105 bg-gradient-to-r from-purple-500/80 to-indigo-500/80 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm"
          title="Ask Question"
        >
          <Sparkle size={18} className="drop-shadow-sm" />
        </button>
      </div>
    </div>
  );
};

export default EditorExtensions;
