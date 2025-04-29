import { PostgrestError } from '@supabase/postgrest-js';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration
 * This file provides both a Supabase client instance and REST API methods
 * for interacting with Supabase data.
 */

// Environment variables - add fallbacks to prevent errors during build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
}

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API endpoint for the notes table
const NOTES_ENDPOINT = `${supabaseUrl}/rest/v1/notes`;

// Common headers for REST API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'apikey': supabaseAnonKey,
  'Authorization': `Bearer ${supabaseAnonKey}`,
  'Prefer': 'return=representation'
});

// Types
export type UserDetails = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: string;
  created_at?: string;
};

export type DbNote = {
  id: string;
  title: string;
  content: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export type NoteInput = Omit<DbNote, 'id' | 'created_at' | 'updated_at'>;
export type NoteUpdate = Partial<NoteInput>;

/**
 * User-related functions
 */

export const addUserToDatabase = async (user: UserDetails): Promise<
  { error: PostgrestError | Error | null; data?: UserDetails | null } | 
  { error?: null; data: UserDetails }
> => {
  try {
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected for new users
      console.error('Error checking existing user:', fetchError);
      return { error: fetchError };
    }
    
    // If user already exists, no need to add them again
    if (existingUser) {
      return { data: user };
    }
    
    // Ensure provider is set
    const provider = user.provider || 'google';
    
    // User doesn't exist, so add them to the database
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: crypto.randomUUID(),
          email: user.email,
          name: user.name,
          image: user.image,
          provider,
          created_at: new Date().toISOString(),
        }
      ])
      .select();
      
    if (error) {
      console.error('Error adding user to database:', error);
      return { error };
    }
    
    return { data: data?.[0] as UserDetails || user };
  } catch (error) {
    console.error('Unexpected error adding user to database:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

/**
 * Note-related functions (REST API)
 */

/**
 * Fetch all notes
 */
export const fetchNotes = async (): Promise<DbNote[]> => {
  const response = await fetch(`${NOTES_ENDPOINT}?order=updated_at.desc`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch notes: ${JSON.stringify(error)}`);
  }

  return response.json();
};

/**
 * Fetch a single note by ID
 */
export const fetchNote = async (id: string): Promise<DbNote> => {
  const response = await fetch(`${NOTES_ENDPOINT}?id=eq.${id}&limit=1`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch note: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  
  if (!data || data.length === 0) {
    throw new Error(`Note with ID ${id} not found`);
  }
  
  return data[0];
};

/**
 * Create a new note
 */
export const createNoteRest = async (note: NoteInput & { id: string }): Promise<DbNote> => {
  const now = new Date().toISOString();
  
  const payload = {
    ...note,
    created_at: now,
    updated_at: now
  };
  
  const response = await fetch(NOTES_ENDPOINT, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create note: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data[0];
};

/**
 * Update an existing note
 */
export const updateNoteRest = async (id: string, updates: NoteUpdate): Promise<DbNote> => {
  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  const response = await fetch(`${NOTES_ENDPOINT}?id=eq.${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update note: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data[0];
};

/**
 * Delete a note
 */
export const deleteNoteRest = async (id: string): Promise<void> => {
  const response = await fetch(`${NOTES_ENDPOINT}?id=eq.${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to delete note: ${JSON.stringify(error)}`);
  }
}; 