"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Loader, Plus } from "lucide-react";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const UploadDialog = ({ hasReachedLimit }) => {
  const { toast } = useToast();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUser();
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileToDB = useMutation(api.fileStorage.addFileToDB);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embedDocuments = useAction(api.myAction.ingest);

  const onFileSelect = async (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    setIsLoading(true);

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    // Step 3: Add the file to the database
    const fileId = uuid4();
    const fileUrl = await getFileUrl({ storageId });
    await addFileToDB({
      fileId,
      storageId,
      fileName: fileName || file?.name,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      fileUrl,
    });

    // Step 4: Embed the documents in the database (using Langchain and Google Generative AI)
    const apiResponse = await axios.get(`/api/pdf-loader?pdfUrl=${fileUrl}`);
    await embedDocuments({
      splittedText: apiResponse.data.result,
      fileId: fileId,
    });

    toast({
      variant: "default",
      title: "File Uploaded",
      description: "Your file has been uploaded successfully!!",
      className:
        "border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/90 text-green-800 dark:text-green-100",
    });

    setIsLoading(false);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          disabled={hasReachedLimit}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          +Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] min-h-fit max-h-[90vh] overflow-y-auto mx-auto sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Upload File
          </DialogTitle>
          <DialogDescription className="sr-only">
            Upload a PDF file and provide a name for it
          </DialogDescription>
          <div className="space-y-4">
            <div>
              <h2 className="text-sm sm:text-base mt-5 text-gray-700 dark:text-gray-200 font-medium">
                Select a file to upload
              </h2>
              <div className="flex gap-2 p-2 sm:p-4 mt-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <input
                  type="file"
                  onChange={(e) => onFileSelect(e)}
                  accept="application/pdf"
                  className="w-full text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                  dark:file:bg-blue-900/20 dark:file:text-blue-400 dark:hover:file:bg-blue-900/30
                  cursor-pointer text-gray-600 dark:text-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-200 font-medium"
                >
                  File Name (optional)
                </label>
                <Input
                  id="name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="sm:justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onUpload}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600/90 dark:hover:bg-purple-600"
          >
            {isLoading ? <Loader className="animate-spin" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
