"use client";

import { FileCardSkeleton } from "@/components/dashboard/FileCardSkeleton";
import { NoFilesMessage } from "@/components/dashboard/NoFilesMessage";
import { api } from "@/convex/_generated/api";
import { formatDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardContent() {
  const { user } = useUser();
  const fileList = useQuery(api.fileStorage.getAllFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-300 dark:to-purple-500 bg-clip-text text-transparent">
        Your Files
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-8">
        {!fileList ? (
          // Loading state
          [...Array(5)].map((_, index) => <FileCardSkeleton key={index} />)
        ) : fileList.length === 0 ? (
          // Empty state
          <NoFilesMessage />
        ) : (
          // File list
          fileList.map((file) => (
            <Link href={`/workspace/${file.fileId}`} key={file._id}>
              <div className="flex p-4 flex-col items-center justify-between rounded-xl shadow-md border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white dark:bg-gray-900 group w-full h-[200px]">
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={"/pdf.png"}
                    alt={file.fileName}
                    width={70}
                    height={70}
                    className="drop-shadow-md"
                  />
                </div>
                <div className="w-full space-y-1">
                  <h2 className="text-xs sm:text-sm lg:text-base font-semibold capitalize text-gray-800 dark:text-gray-200 text-center line-clamp-2 min-h-[2.5em]">
                    {file.fileName}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-center text-gray-500 dark:text-gray-400">
                    Created: {formatDate(file._creationTime)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
