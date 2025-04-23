# Gratis - Supabase Cloud Sync Integration

This document explains how to set up and use the Supabase cloud sync functionality in the Gratis app.

## Overview

The Gratis app now includes cloud synchronization capabilities using Supabase as the backend. This allows users to:

- Create an account using magic link authentication
- Sync gratitude entries across multiple devices
- Store entries securely in the cloud
- Automatically sync changes between local storage and the cloud

## Setup Instructions

### 1. Supabase Project Setup

The app is configured with a Supabase project. There are three ways to provide your Supabase credentials:

1. **Environment variables (recommended for local development)**:
   - Create a `.env` file in the root of your project with:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

2. **Expo config (app.json) - recommended for production**:
   - The credentials are already in `app.json` under `expo.extra`
   - Update these values if you're using a different Supabase project

3. **Directly in code (not recommended)**:
   - You can hardcode values in `src/services/supabase.ts` if needed
   
Don't forget to set up the database schema by running the SQL script in `supabase/migrations/create_tables.sql`

### 2. Database Schema

The Supabase database requires two main tables:

- `entries`: Stores gratitude journal entries
- `user_settings`: Stores user preferences and settings

The database also needs appropriate Row Level Security (RLS) policies to ensure data privacy. All of this is set up in the migration script.

### 3. Authentication

The app uses Supabase's magic link authentication:

1. Users enter their email address
2. A magic link is sent to their email
3. Clicking the link logs them in securely

### 4. Deep Link Setup (Required for Magic Link Authentication)

For magic link authentication to work properly in a production environment:

1. Add your app's custom URL scheme to handle deep links (e.g., `gratis://`)
2. Update the `emailRedirectTo` property in `src/context/AuthContext.tsx` to match your app's deep link URL
3. Configure deep linking in your Expo config (app.json)

## Usage

### Authentication

1. Tap "Sign In" on the Home screen
2. Enter your email address
3. Check your email for the magic link
4. Tap the link to complete the sign-in process

### Syncing Entries

Once authenticated:

1. **Automatic Sync**: Entries automatically sync in the background
2. **Manual Sync**: Tap "Sync Now" on the Home screen to trigger a manual sync
3. **Sync Status**: The app shows the last sync time on the Home screen

### Working Offline

The app is designed to work offline:

1. Entries are always saved locally first
2. When network connection is available, entries sync to the cloud
3. If an entry fails to sync, it will be marked for syncing later

## Troubleshooting

If you encounter sync issues:

1. Check your internet connection
2. Try manual sync by tapping "Sync Now"
3. Sign out and sign in again to refresh your authentication session
4. If problems persist, check the Supabase dashboard for any service outages

## Technical Implementation

The integration uses several components:

- `AuthContext`: Manages authentication state
- `AuthScreen`: Handles the login UI flow
- `supabaseStorage.ts`: Handles cloud operations
- `localStorage.ts`: Enhanced to integrate with cloud storage
- Background sync process running at regular intervals

## Security Considerations

- All data is secured using Row Level Security in Supabase
- Users can only access their own entries
- Authentication uses secure magic link approach (no passwords to manage)
- All data is encrypted in transit with HTTPS

## Future Enhancements

Potential future improvements:

- Conflict resolution UI for handling sync conflicts
- Selective sync options
- Offline mode toggle
- Data export/import functionality
