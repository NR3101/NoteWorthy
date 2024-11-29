"use client";

import Image from "next/image";
import Link from "next/link";
import { Original_Surfer } from "next/font/google";
import { useUser } from "@clerk/nextjs";

const originalSurfer = Original_Surfer({
  subsets: ["latin"],
  weight: ["400"],
});

const Logo = () => {
  const { isSignedIn } = useUser();

  return (
    <Link
      href={isSignedIn ? "/dashboard" : "/"}
      className={`flex items-center transition-all duration-200 cursor-pointer ${originalSurfer.className}`}
    >
      <Image
        src={"/logo.png"}
        alt="logo"
        width={40}
        height={40}
        className="dark:brightness-110"
      />
      <h1 className="text-[22px] md:text-[25px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400 tracking-tight">
        NoteWorthy
      </h1>
    </Link>
  );
};
export default Logo;
