"use client";

import { useState } from "react";
import type { Note } from "../page";

type CreateNoteModalProps = {
  onClose: () => void;
  onCreate: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<void>;
};

const COLORS = [
  { name: "gray", value: "gray", hex: "#6B7280" },
  { name: "red", value: "red", hex: "#EF4444" },
  { name: "orange", value: "orange", hex: "#F97316" },
  { name: "yellow", value: "yellow", hex: "#EAB308" },
  { name: "green", value: "green", hex: "#22C55E" },
  { name: "blue", value: "blue", hex: "#3B82F6" },
  { name: "indigo", value: "indigo", hex: "#6366F1" },
  { name: "purple", value: "purple", hex: "#A855F7" },
  { name: "pink", value: "pink", hex: "#EC4899" },
];

const CreateNoteModal = ({ onClose, onCreate }: CreateNoteModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("gray");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({ title, content, color });
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Note</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300"
                }`}
              placeholder="Note title"
              disabled={isSubmitting}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors({ ...errors, content: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.content ? "border-red-500 dark:border-red-500" : "border-gray-300"
                }`}
              rows={5}
              placeholder="Note content"
              disabled={isSubmitting}
              aria-invalid={!!errors.content}
              aria-describedby={errors.content ? "content-error" : undefined}
            />
            {errors.content && (
              <p id="content-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.content}
              </p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  className={`w-8 h-8 rounded-full border-2 ${color === colorOption.value
                    ? `border-${colorOption.value}-600 ring-2 ring-${colorOption.value}-400`
                    : "border-transparent"
                    }`}
                  style={{ backgroundColor: colorOption.hex }}
                  aria-label={`Select ${colorOption.name} color`}
                  aria-pressed={color === colorOption.value}
                  tabIndex={0}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isSubmitting}
              aria-label="Cancel"
              tabIndex={0}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              disabled={isSubmitting}
              aria-label="Create note"
              tabIndex={0}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal; 