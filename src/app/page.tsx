"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/notes");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <section className="text-center py-12 sm:py-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600 dark:text-blue-400">Memory Keeper</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            A simple and intuitive note-taking application to keep track of your ideas, tasks, and memories.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg font-medium"
            aria-label="Go to notes"
            tabIndex={0}
          >
            Get Started
          </button>
        </section>

        <section className="py-12 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Notes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quickly create and organize your thoughts in clean, simple notes with customizable colors.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Organize Ideas</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Keep all your ideas in one place, easily accessible and neatly organized.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="text-purple-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Editing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Update your notes anytime with our simple and intuitive editing interface.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 text-center border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Memory Keeper - Your personal note-taking solution
          </p>
        </section>
      </div>
    </div>
  );
}
