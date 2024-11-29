import Providers from "@/components/Providers";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Fira_Code } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "NoteWorthy",
  description: "An AI-powered note-taking app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${firaCode.className} antialiased`}>
          <Providers>{children}</Providers>
          <Toaster duration={2000} />
        </body>
      </html>
    </ClerkProvider>
  );
}
