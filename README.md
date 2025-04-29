# Memory Keeper

A simple note-taking application similar to Google Keep.

## Features

- Create, read, update, and delete notes
- Customizable note colors
- User authentication with Google
- Responsive design with dark mode support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager

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

### Running the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Notes API

The application uses a simple in-memory store for notes in development. In production, you should replace this with a proper database.

## License

This project is open source and available under the [MIT License](LICENSE).
