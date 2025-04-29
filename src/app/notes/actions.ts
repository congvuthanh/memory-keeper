"use client";

import type { Note } from "./page";

// Define API response note structure
type ApiNote = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Get all notes
 */
export async function getNotes(): Promise<Note[]> {
  const response = await fetch(`/api/notes`, {
    method: 'GET',
    cache: 'no-store'
  });
  
  if (!response.ok) {
    console.error('Error fetching notes:', response.statusText);
    throw new Error('Failed to fetch notes');
  }
  
  const data = await response.json();
  
  // API already returns in camelCase format, but the dates are strings so we convert them
  return data.map((note: ApiNote) => ({
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
  }));
}

/**
 * Get a single note by ID
 */
export async function getNote(id: string): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'GET',
    cache: 'no-store'
  });
  
  if (!response.ok) {
    console.error(`Error fetching note with ID ${id}:`, response.statusText);
    throw new Error(`Note with ID ${id} not found`);
  }
  
  const data = await response.json();
  
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

/**
 * Create a new note
 */
export async function createNote(
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const response = await fetch(`/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: noteData.title,
      content: noteData.content,
      color: noteData.color
    })
  });
  
  if (!response.ok) {
    console.error('Error creating note:', response.statusText);
    throw new Error('Failed to create note');
  }
  
  const data = await response.json();
  
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

/**
 * Update an existing note
 */
export async function updateNote(
  id: string,
  noteData: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>
): Promise<Note> {
  // Prepare the data for the API
  const updateData: Record<string, unknown> = {};
  
  if (noteData.title !== undefined) updateData.title = noteData.title;
  if (noteData.content !== undefined) updateData.content = noteData.content;
  if (noteData.color !== undefined) updateData.color = noteData.color;
  
  const response = await fetch(`/api/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  if (!response.ok) {
    console.error(`Error updating note with ID ${id}:`, response.statusText);
    throw new Error(`Failed to update note with ID ${id}`);
  }
  
  const data = await response.json();
  
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    console.error(`Error deleting note with ID ${id}:`, response.statusText);
    throw new Error(`Failed to delete note with ID ${id}`);
  }
} 