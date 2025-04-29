# Memory Keeper

A simple note-taking application similar to Google Keep, with Supabase integration for data storage.

## Features

- Create, read, update, and delete notes
- Customizable note colors
- User authentication with Google
- Responsive design with dark mode support
- Supabase database integration for persistent storage
- REST API endpoints for note operations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-goes-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-goes-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-goes-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Setting up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (when deployed)
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-production-domain.com/api/auth/callback/google` (when deployed)
9. Click "Create"
10. Copy the Client ID and Client Secret to your `.env.local` file

### Setting up Supabase Database

1. Sign up or log in to [Supabase](https://supabase.com)
2. Create a new project if you don't have one already
3. In your Supabase dashboard, select your project
4. Go to the SQL Editor and click "New Query"
5. Copy and paste the following SQL script:

```sql
-- Create a table for storing notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
CREATE POLICY "Allow all operations for now" ON notes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_notes_updated_at ON notes (updated_at DESC);

-- Add some sample notes (optional)
INSERT INTO notes (id, title, content, color, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Welcome to Memory Keeper', 'This is a simple note-taking app. Create, edit, and delete your notes here!', 'blue', now() - interval '1 day', now() - interval '1 day'),
  ('22222222-2222-2222-2222-222222222222', 'Grocery List', '- Milk\n- Eggs\n- Bread\n- Apples\n- Coffee', 'green', now() - interval '1 day', now()),
  ('33333333-3333-3333-3333-333333333333', 'Project Ideas', '1. Build a personal portfolio website\n2. Create a recipe app\n3. Design a budgeting tool', 'purple', now(), now())
ON CONFLICT (id) DO NOTHING;
```

6. Click "Run" to execute the script
7. Go to "Project Settings" > "API" to find your API keys
8. Copy the Project URL and anon/public key to your `.env.local` file

### Running the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Notes API

The application provides multiple ways to interact with notes:

### 1. Server Actions (`/src/app/notes/actions.ts`)

Server-side functions that interact with Supabase using the JavaScript client:

- `getNotes()` - Fetches all notes
- `getNote(id)` - Fetches a single note
- `createNote(noteData)` - Creates a new note
- `updateNote(id, noteData)` - Updates an existing note
- `deleteNote(id)` - Deletes a note

### 2. REST API Endpoints (`/src/app/api/notes/`)

REST API endpoints that interact with Supabase using direct HTTP requests:

- `GET /api/notes` - Fetches all notes
- `POST /api/notes` - Creates a new note
- `GET /api/notes/[id]` - Fetches a single note
- `PATCH /api/notes/[id]` - Updates an existing note
- `DELETE /api/notes/[id]` - Deletes a note

### 3. React Hook (`/src/app/hooks/useNotes.ts`)

A React hook that provides a convenient interface to interact with the REST API:

```jsx
import { useNotes } from '@/app/hooks/useNotes';

function MyComponent() {
  const { 
    notes, 
    loading, 
    error, 
    fetchNotes, 
    fetchNote, 
    createNote, 
    updateNote, 
    deleteNote 
  } = useNotes();

  // Use the notes and methods as needed
  // ...
}
```

## Example Usage

### Creating a Note

```tsx
const { createNote } = useNotes();

const handleCreateNote = async () => {
  await createNote({
    title: "New Note",
    content: "This is the content of the note",
    color: "blue"
  });
};
```

### Updating a Note

```tsx
const { updateNote } = useNotes();

const handleUpdateNote = async (id: string) => {
  await updateNote(id, {
    title: "Updated Title",
    content: "Updated content"
  });
};
```

### Deleting a Note

```tsx
const { deleteNote } = useNotes();

const handleDeleteNote = async (id: string) => {
  await deleteNote(id);
};
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── db-setup.sql          # SQL script for setting up Supabase table
│   │   └── notes/                # REST API routes
│   │       ├── route.ts          # GET, POST handlers for /api/notes
│   │       └── [id]/
│   │           └── route.ts      # GET, PATCH, DELETE handlers for /api/notes/[id]
│   ├── hooks/
│   │   └── useNotes.ts           # React hook for using the notes API
│   └── notes/
│       ├── actions.ts            # Server actions for notes
│       ├── page.tsx              # Notes page component
│       └── components/           # UI components for notes
│           ├── CreateNoteModal.tsx
│           ├── EditNoteModal.tsx
│           └── NoteCard.tsx
└── lib/
    ├── supabase.ts              # Supabase JavaScript client configuration
    └── supabase-rest.ts         # Utility functions for Supabase REST API
```

## Best Practices

1. Always handle errors properly when making API calls
2. Use optimistic updates for a better user experience
3. Validate inputs before sending them to the API
4. Use TypeScript types to ensure type safety

## License

This project is open source and available under the [MIT License](LICENSE).
