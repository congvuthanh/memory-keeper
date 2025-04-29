"use client";

import { useState } from "react";
import type { Note } from "../page";

type NoteCardProps = {
  note: Note;
  onDelete: (id: string) => Promise<void>;
  onEdit: (note: Note) => void;
};

const NoteCard = ({ note, onDelete, onEdit }: NoteCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the edit modal

    if (confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);
      try {
        await onDelete(note.id);
      } catch (error) {
        console.error("Error deleting note:", error);
        setIsDeleting(false);
      }
    }
  };

  const handleClick = () => {
    onEdit(note);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEdit(note);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncate content if it's too long
  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  // Define color border classes mapping
  const colorBorderClasses = {
    gray: "border-gray-500",
    red: "border-red-500",
    orange: "border-orange-500",
    yellow: "border-yellow-500",
    green: "border-green-500",
    blue: "border-blue-500",
    indigo: "border-indigo-500",
    purple: "border-purple-500",
    pink: "border-pink-500"
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer ${note.color ? `border-l-4 ${colorBorderClasses[note.color as keyof typeof colorBorderClasses]}` : ''}`}
      style={{ opacity: isDeleting ? 0.6 : 1 }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Edit note: ${note.title}`}
    >
      <div className="p-4 h-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{note.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
          {truncateContent(note.content)}
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
          {formatDate(note.updatedAt)}
        </div>
      </div>

      <div className="absolute top-2 right-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Delete note"
          tabIndex={0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NoteCard; 