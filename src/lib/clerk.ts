
import { useClerk } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error('Missing Clerk Publishable Key. Please check your environment variables.');
  console.log('Available env vars:', Object.keys(import.meta.env));
}

// Export the publishable key for use in ClerkProvider
export const clerkPublishableKey = clerkPubKey;

// Export a hook to get the clerk instance
export const useClerkInstance = () => {
  return useClerk();
};
