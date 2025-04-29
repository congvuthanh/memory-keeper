"use client";

import { useCallback, useEffect, useState } from 'react';

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type NoteUpdate = Partial<NoteInput>;

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/notes');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch notes');
      }
      
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError((err as Error).message || 'An error occurred while fetching notes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single note
  const fetchNote = useCallback(async (id: string): Promise<Note | null> => {
    try {
      const response = await fetch(`/api/notes/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch note with ID ${id}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error(`Error fetching note ${id}:`, err);
      setError((err as Error).message || 'An error occurred while fetching the note');
      return null;
    }
  }, []);

  // Create a new note
  const createNote = useCallback(async (noteData: NoteInput): Promise<Note | null> => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create note');
      }
      
      const newNote = await response.json();
      setNotes(prevNotes => [...prevNotes, newNote]);
      return newNote;
    } catch (err) {
      console.error('Error creating note:', err);
      setError((err as Error).message || 'An error occurred while creating the note');
      return null;
    }
  }, []);

  // Update a note
  const updateNote = useCallback(async (id: string, updates: NoteUpdate): Promise<Note | null> => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update note with ID ${id}`);
      }
      
      const updatedNote = await response.json();
      
      setNotes(prevNotes => 
        prevNotes.map(note => note.id === id ? updatedNote : note)
      );
      
      return updatedNote;
    } catch (err) {
      console.error(`Error updating note ${id}:`, err);
      setError((err as Error).message || 'An error occurred while updating the note');
      return null;
    }
  }, []);

  // Delete a note
  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok && response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete note with ID ${id}`);
      }
      
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      return true;
    } catch (err) {
      console.error(`Error deleting note ${id}:`, err);
      setError((err as Error).message || 'An error occurred while deleting the note');
      return false;
    }
  }, []);

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
  };
}; 