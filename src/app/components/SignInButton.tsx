"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function SignInButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setError(null);
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading || isSigningIn) {
    return (
      <button
        disabled
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-400 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600"
      >
        Loading...
      </button>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={`${session.user.name || 'User'}'s profile`}
              className="h-8 w-8 rounded-full"
              width={32}
              height={32}
            />
          )}
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
            {session.user.name || session.user.email}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          aria-label="Sign out"
          tabIndex={0}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {error && (
        <div className="text-sm text-red-600 mb-2">{error}</div>
      )}
      <button
        onClick={handleSignIn}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        aria-label="Sign in with Google"
        tabIndex={0}
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
          </g>
        </svg>
        Sign in with Google
      </button>
    </div>
  );
} 