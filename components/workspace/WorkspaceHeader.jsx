"use client";

import { UserButton } from "@clerk/nextjs";
import Logo from "../dashboard/Logo";
import { ModeToggle } from "../ModeToggle";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useEditor } from "@/context/EditorContext";
import { Save } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const WorkspaceHeader = ({ fileName }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const { fileId } = useParams();
  const saveNotes = useMutation(api.notes.addNotes);
  const editor = useEditor();
  const [isSaving, setIsSaving] = useState(false);

  // Save notes to the database
  const handleSaveNotes = async () => {
    if (!editor) return;
    setIsSaving(true);

    try {
      await saveNotes({
        fileId: fileId,
        notes: editor.getHTML(),
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      toast({
        variant: "default",
        title: "Success! 🎉",
        description: "Notes saved successfully",
        className:
          "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/90 text-green-800 dark:text-green-100",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving notes",
        description: error.message,
        className:
          "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/90 text-red-800 dark:text-red-100",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sticky top-0 z-[100] flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 transition-all duration-200 shadow-sm">
      <div className="hover:scale-[1.02] transition-transform duration-200">
        <Logo />
      </div>
      <h1 className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-lg font-bold text-gray-700 dark:text-gray-200 truncate max-w-[40%]">
        {fileName}
      </h1>
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSaveNotes}
          disabled={isSaving}
          size="default"
          className="lg:w-auto w-10 min-w-10"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4 " />
              <span className="hidden lg:inline">Save Notes</span>
            </>
          )}
        </Button>
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
};

export default WorkspaceHeader;
