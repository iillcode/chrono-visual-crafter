import { Clerk } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error('Missing Clerk Publishable Key. Please check your environment variables.');
  console.log('Available env vars:', Object.keys(import.meta.env));
}

export const clerk = clerkPubKey ? new Clerk(clerkPubKey) : null;