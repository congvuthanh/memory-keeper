import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AuthProvider from "./components/AuthProvider";
import SignInButton from "./components/SignInButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memory Keeper",
  description: "A simple note-taking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                      Memory Keeper
                    </Link>
                  </div>
                  <div className="ml-6 flex items-center space-x-4">
                    <Link
                      href="/notes"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                      aria-label="Notes"
                      tabIndex={0}
                    >
                      Notes
                    </Link>
                  </div>
                </div>

                <div className="flex items-center">
                  <SignInButton />
                </div>
              </div>
            </nav>
          </header>
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
