"use server";

import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import type { Note } from "./page";

// Define the database note structure 
type DbNote = {
  id: string;
  title: string;
  content: string;
  color: string;
  created_at: string;
  updated_at: string;
};

/**
 * Get all notes
 */
export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes');
  }
  
  // Transform database column names to camelCase for frontend
  return data.map((note: DbNote) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    color: note.color,
    createdAt: new Date(note.created_at),
    updatedAt: new Date(note.updated_at),
  }));
}

/**
 * Get a single note by ID
 */
export async function getNote(id: string): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching note with ID ${id}:`, error);
    throw new Error(`Note with ID ${id} not found`);
  }
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    color: data.color,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Create a new note
 */
export async function createNote(
  noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const now = new Date();
  const id = uuidv4();
  
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        id,
        title: noteData.title,
        content: noteData.content,
        color: noteData.color,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note');
  }
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    color: data.color,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Update an existing note
 */
export async function updateNote(
  id: string,
  noteData: Partial<Omit<Note, "id" | "createdAt" | "updatedAt">>
): Promise<Note> {
  const now = new Date();
  
  // Prepare the data for Supabase (converting camelCase to snake_case)
  const updateData: Record<string, unknown> = {
    updated_at: now.toISOString()
  };
  
  if (noteData.title !== undefined) updateData.title = noteData.title;
  if (noteData.content !== undefined) updateData.content = noteData.content;
  if (noteData.color !== undefined) updateData.color = noteData.color;
  
  const { data, error } = await supabase
    .from('notes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating note with ID ${id}:`, error);
    throw new Error(`Failed to update note with ID ${id}`);
  }
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    color: data.color,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting note with ID ${id}:`, error);
    throw new Error(`Failed to delete note with ID ${id}`);
  }
} 