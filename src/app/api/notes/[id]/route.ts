import {
    deleteNoteRest,
    fetchNote,
    updateNoteRest
} from '@/lib/supabase-rest';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/notes/[id] - Get a single note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const note = await fetchNote(id);
    
    // Transform DB format to our API format
    const transformedNote = {
      id: note.id,
      title: note.title,
      content: note.content,
      color: note.color,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    };
    
    return NextResponse.json(transformedNote);
  } catch (error) {
    console.error(`Error fetching note ${params.id}:`, error);
    
    if ((error as Error).message.includes('not found')) {
      return NextResponse.json(
        { error: `Note with ID ${params.id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PATCH /api/notes/[id] - Update a note
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Check if there are any fields to update
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }
    
    // Only allow updating specific fields
    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.content !== undefined) updates.content = body.content;
    if (body.color !== undefined) updates.color = body.color;
    
    const updatedNote = await updateNoteRest(id, updates);
    
    // Transform DB format to our API format
    const transformedNote = {
      id: updatedNote.id,
      title: updatedNote.title,
      content: updatedNote.content,
      color: updatedNote.color,
      createdAt: updatedNote.created_at,
      updatedAt: updatedNote.updated_at
    };
    
    return NextResponse.json(transformedNote);
  } catch (error) {
    console.error(`Error updating note ${params.id}:`, error);
    
    if ((error as Error).message.includes('not found')) {
      return NextResponse.json(
        { error: `Note with ID ${params.id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await deleteNoteRest(id);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting note ${params.id}:`, error);
    
    if ((error as Error).message.includes('not found')) {
      return NextResponse.json(
        { error: `Note with ID ${params.id} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 