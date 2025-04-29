"use client";

import { useEffect, useState } from "react";
import { createNote, deleteNote, getNotes, updateNote } from "./actions";
import CreateNoteModal from "./components/CreateNoteModal";
import EditNoteModal from "./components/EditNoteModal";
import NoteCard from "./components/NoteCard";

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreateNote = async (newNote: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createNote(newNote);
      setIsCreateModalOpen(false);
      loadNotes();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleUpdateNote = async (id: string, updatedFields: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>) => {
    try {
      await updateNote(id, updatedFields);
      setSelectedNote(null);
      loadNotes();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      loadNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Notes</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Create new note"
          >
            Create Note
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
              />
            ))}
          </div>
        )}

        {isCreateModalOpen && (
          <CreateNoteModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreateNote}
          />
        )}

        {selectedNote && (
          <EditNoteModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
          />
        )}
      </div>
    </div>
  );
} 