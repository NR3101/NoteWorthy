"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import { Layout, ShieldPlus } from "lucide-react";
import { Progress } from "../ui/progress";
import UploadDialog from "./UploadDialog";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "./Logo";

const MobileNav = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const fileList = useQuery(api.fileStorage.getAllFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });
  const userInfo = useQuery(api.user.getUserInfo, {
    email: user?.primaryEmailAddress?.emailAddress,
  });

  const isLoading = userInfo === undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="h-6 w-6 md:hidden cursor-pointer text-gray-700 dark:text-gray-200" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-72 bg-white dark:bg-gray-900 p-6 flex flex-col"
      >
        <SheetTitle>
          <Logo />
        </SheetTitle>
        <SheetDescription className="sr-only">
          Navigation menu for mobile devices
        </SheetDescription>
        <div className="flex-1">
          <div className="mt-8">
            <SheetClose asChild>
              <Link href="/dashboard">
                <div
                  className={cn(
                    "flex items-center gap-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-all",
                    pathname === "/dashboard" &&
                      "bg-purple-200 dark:bg-purple-900/50"
                  )}
                >
                  <Layout className="w-5 h-5" />
                  <h2 className="font-medium">Workspace</h2>
                </div>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/dashboard/upgrade" className="mt-4 block">
                <div
                  className={cn(
                    "flex items-center gap-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-all",
                    pathname === "/dashboard/upgrade" &&
                      "bg-purple-200 dark:bg-purple-900/50"
                  )}
                >
                  <ShieldPlus className="w-5 h-5" />
                  <h2 className="font-medium">Upgrade</h2>
                </div>
              </Link>
            </SheetClose>
          </div>

          <div className="mt-6">
            <UploadDialog
              hasReachedLimit={!userInfo?.isPro && fileList?.length >= 5}
            />
          </div>
        </div>

        {!isLoading && !userInfo?.isPro && (
          <div className="mt-auto mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80 shadow-sm">
            <div className="space-y-3">
              <div>
                <Progress
                  value={(fileList?.length / 5) * 100}
                  className="h-2 bg-gray-200 dark:bg-gray-700"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
                  {fileList?.length} out of 5 files uploaded
                </p>
              </div>

              {fileList?.length >= 5 && (
                <div className="pt-2 border-t border-gray-300/70 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    File limit reached
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Upgrade to unlock unlimited uploads
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
