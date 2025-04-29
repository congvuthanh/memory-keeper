"use server";

import { v4 as uuidv4 } from "uuid";
import type { Note } from "./page";

// In a real app, this would be a database. For simplicity, we're using localStorage.
// Since this is a server component, we're simulating localStorage with a global variable.
let notes: Note[] = [];

// Helper function to simulate async API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all notes
 */
export async function getNotes(): Promise<Note[]> {
  // Simulate API delay
  await delay(500);
  
  // Sort notes by updatedAt, most recent first
  return [...notes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Get a single note by ID
 */
export async function getNote(id: string): Promise<Note> {
  await delay(300);
  
  const note = notes.find(note => note.id === id);
  
  if (!note) {
    throw new Error(`Note with ID ${id} not found`);
  }
  
  return note;
}

/**
 * Create a new note
 */
export async function createNote(
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  await delay(500);
  
  const now = new Date();
  
  const newNote: Note = {
    id: uuidv4(),
    ...noteData,
    createdAt: now,
    updatedAt: now,
  };
  
  notes.push(newNote);
  
  return newNote;
}

/**
 * Update an existing note
 */
export async function updateNote(
  id: string,
  noteData: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>
): Promise<Note> {
  await delay(500);
  
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    throw new Error(`Note with ID ${id} not found`);
  }
  
  const updatedNote: Note = {
    ...notes[noteIndex],
    ...noteData,
    updatedAt: new Date(),
  };
  
  notes[noteIndex] = updatedNote;
  
  return updatedNote;
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  await delay(500);
  
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) {
    throw new Error(`Note with ID ${id} not found`);
  }
  
  notes.splice(noteIndex, 1);
}

// Initialize with some sample notes for demo purposes
if (notes.length === 0) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  notes = [
    {
      id: "1",
      title: "Welcome to Memory Keeper",
      content: "This is a simple note-taking app. Create, edit, and delete your notes here!",
      color: "blue",
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: "2",
      title: "Grocery List",
      content: "- Milk\n- Eggs\n- Bread\n- Apples\n- Coffee",
      color: "green",
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: "3",
      title: "Project Ideas",
      content: "1. Build a personal portfolio website\n2. Create a recipe app\n3. Design a budgeting tool",
      color: "purple",
      createdAt: now,
      updatedAt: now,
    },
  ];
} 