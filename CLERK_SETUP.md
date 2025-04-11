# Clerk Authentication Setup

This document provides instructions on how to set up Clerk authentication for the GenInvoice application.

## Prerequisites

- A Clerk account (sign up at [clerk.com](https://clerk.com))
- Your application's environment variables configured

## Setup Steps

1. **Create a Clerk Application**

   - Go to the [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Choose the authentication methods you want to support (Email, OAuth, etc.)

2. **Configure Environment Variables**

   - In your Clerk Dashboard, go to API Keys
   - Copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
   - Add these to your `.env.local` file:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

3. **Customize Authentication Pages (Optional)**

   - You can customize the sign-in and sign-up pages in the Clerk Dashboard
   - The application already includes styled sign-in and sign-up pages

4. **Configure OAuth Providers (Optional)**

   - In the Clerk Dashboard, go to User & Authentication > Social Connections
   - Enable and configure the OAuth providers you want to support
   - Update your environment variables with the provider credentials

5. **Test Authentication**

   - Run your application with `pnpm dev`
   - Navigate to `/sign-in` or `/sign-up`
   - Test the authentication flow

## Authentication Flow

The application uses the following authentication flow:

1. **Middleware Protection**: The `middleware.ts` file protects routes that require authentication
2. **Client-Side Protection**: The `ProtectedRoute` component provides additional client-side protection
3. **Server-Side Protection**: The `requireAuth` function can be used in server components

## Components

- `ClerkAuthProvider`: Wraps the application with Clerk's authentication context
- `UserProfile`: Displays the user's profile and provides sign-out functionality
- `ProtectedRoute`: Ensures that only authenticated users can access protected routes

## Utilities

- `getCurrentUser`: Returns the current user's information
- `requireAuth`: Ensures that the current user is authenticated, redirecting to sign-in if not

## Troubleshooting

If you encounter issues with authentication:

1. Check that your environment variables are correctly set
2. Ensure that your Clerk application is properly configured
3. Check the browser console for any errors
4. Verify that the middleware is correctly configured 