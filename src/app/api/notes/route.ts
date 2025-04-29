import {
  createNoteRest,
  fetchNotes
} from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// GET /api/notes - Get all notes
export async function GET() {
  try {
    const notes = await fetchNotes();
    
    // Transform DB format to our API format
    const transformedNotes = notes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      color: note.color,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    }));
    
    return NextResponse.json(transformedNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.title || !body.content || !body.color) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, color' },
        { status: 400 }
      );
    }
    
    // Create a new note
    const newNote = await createNoteRest({
      id: uuidv4(),
      title: body.title,
      content: body.content,
      color: body.color
    });
    
    // Transform DB format to our API format
    const transformedNote = {
      id: newNote.id,
      title: newNote.title,
      content: newNote.content,
      color: newNote.color,
      createdAt: newNote.created_at,
      updatedAt: newNote.updated_at
    };
    
    return NextResponse.json(transformedNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
} 