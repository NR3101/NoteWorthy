"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import {
  Brain,
  FolderGit2,
  Highlighter,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import Logo from "@/components/dashboard/Logo";

export default function HomePage() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const createUserMutation = useMutation(api.user.createUser);

  const checkIfUserExists = async () => {
    await createUserMutation({
      email: user?.primaryEmailAddress?.emailAddress,
      userName:
        user?.fullName || user?.primaryEmailAddress?.emailAddress.split("@")[0],
      imageUrl: user?.imageUrl,
    });
  };

  useEffect(() => {
    if (user && isSignedIn) {
      checkIfUserExists();
    }
  }, [user, isSignedIn]);

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  const renderButtonContent = () => {
    if (!isLoaded) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return isSignedIn ? "Go to Dashboard" : "Get Started";
  };

  const currentYear = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-gray-900 dark:to-gray-800">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-purple-100 dark:border-purple-900/20 shadow-[0_1px_3px_0_rgb(0,0,0,0.1)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.4)]">
        <Logo />
        <nav className="ml-auto flex gap-2 sm:gap-6 items-center">
          <ModeToggle />
          <Button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 dark:from-purple-500 dark:to-fuchsia-500 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-purple-200 dark:hover:shadow-purple-900/20 hidden sm:block"
          >
            {renderButtonContent()}
          </Button>
          {isSignedIn && <UserButton />}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/90 to-fuchsia-100/90 dark:from-purple-900/90 dark:to-purple-800/90 backdrop-blur-sm" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Make Note-Taking
                <br />
                Effortless with{" "}
                <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                  AI Magic
                </span>
              </h1>
              <p className="max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                Get More from Your PDF Notes: Summaries, Highlights, and Key
                Insights with just a few clicks.
              </p>
              <div className="space-x-4">
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-full px-8 shadow-md hover:shadow-purple-200 dark:hover:shadow-purple-900/20 transition-all duration-200"
                >
                  {renderButtonContent()}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-8 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-50
                  dark:hover:text-purple-900 transition-colors duration-200"
                >
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              What We Offer?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:-translate-y-2 hover:shadow-xl relative overflow-hidden transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-100/50 dark:border-purple-800/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 dark:from-purple-900/20 dark:to-fuchsia-900/20" />
                <CardHeader className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/50 dark:to-fuchsia-900/50 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    Instant Summaries
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative text-gray-600 dark:text-gray-300">
                  Unlock the essence of your PDFs in seconds with AI-generated
                  summaries, saving you valuable time.
                </CardContent>
              </Card>
              <Card className="group hover:-translate-y-2 hover:shadow-xl relative overflow-hidden transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-100/50 dark:border-purple-800/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 dark:from-purple-900/20 dark:to-fuchsia-900/20" />
                <CardHeader className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/50 dark:to-fuchsia-900/50 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Highlighter className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    Intelligent Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative text-gray-600 dark:text-gray-300">
                  Highlight important sections and let AI suggest relevant
                  annotations, streamlining your note-taking.
                </CardContent>
              </Card>
              <Card className="group hover:-translate-y-2 hover:shadow-xl relative overflow-hidden transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-100/50 dark:border-purple-800/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 dark:from-purple-900/20 dark:to-fuchsia-900/20" />
                <CardHeader className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/50 dark:to-fuchsia-900/50 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FolderGit2 className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    Effortless Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative text-gray-600 dark:text-gray-300">
                  Organize your notes and PDFs effortlessly with our intuitive
                  tagging and folder system.
                </CardContent>
              </Card>
              <Card className="group hover:-translate-y-2 hover:shadow-xl relative overflow-hidden transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-100/50 dark:border-purple-800/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 dark:from-purple-900/20 dark:to-fuchsia-900/20" />
                <CardHeader className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/50 dark:to-fuchsia-900/50 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    Powerful Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative text-gray-600 dark:text-gray-300">
                  Discover deep insights and connections across your PDFs with
                  advanced AI analysis, making complex data easy to understand.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-600 to-fuchsia-600 dark:from-purple-500 dark:to-fuchsia-500 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Supercharge Your Note-Taking?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of users and start your journey with NoteWorthy
              today.
            </p>
            <Button
              onClick={handleGetStarted}
              className="bg-white text-purple-600 dark:text-purple-500 rounded-full px-8 hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-purple-500/20"
            >
              {!isLoaded ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignedIn ? (
                "Go to Dashboard"
              ) : (
                "Get Started Now"
              )}
            </Button>
          </div>
        </section>
      </main>
      <footer className="bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-950/50 dark:to-purple-900/50 backdrop-blur-sm border-t border-purple-100 dark:border-purple-900/20 text-gray-600 dark:text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
            © {currentYear} NoteWorthy All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
