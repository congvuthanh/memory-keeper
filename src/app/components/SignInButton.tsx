"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import SignInModal from "./SignInModal";

export default function SignInButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
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
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        aria-label="Sign in"
        tabIndex={0}
      >
        Sign in
      </button>

      <SignInModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        callbackUrl="/"
      />
    </>
  );
} 