import { useUser, useAuth as useClerkAuthHook } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClerkAuth = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, signOut: clerkSignOut } = useClerkAuthHook();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const syncUserWithSupabase = async () => {
      if (!user || !isSignedIn) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Syncing user with Supabase:', user.id);
        
        // Check if user exists in Supabase
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching profile:', fetchError);
          setLoading(false);
          return;
        }

        if (!existingProfile) {
          console.log('Creating new profile for user:', user.id);
          // Create new profile in Supabase
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              full_name: user.fullName || '',
              avatar_url: user.imageUrl || null,
              subscription_status: 'free',
              subscription_plan: 'free'
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
            toast({
              title: "Profile Creation Error",
              description: "Failed to create user profile. Please try again.",
              variant: "destructive"
            });
          } else {
            console.log('Profile created successfully:', newProfile);
            setProfile(newProfile);
          }
        } else {
          console.log('Updating existing profile:', existingProfile);
          // Update existing profile with latest Clerk data
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({
              email: user.primaryEmailAddress?.emailAddress || existingProfile.email,
              full_name: user.fullName || existingProfile.full_name,
              avatar_url: user.imageUrl || existingProfile.avatar_url,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating profile:', updateError);
            setProfile(existingProfile);
          } else {
            console.log('Profile updated successfully:', updatedProfile);
            setProfile(updatedProfile);
          }
        }
      } catch (error) {
        console.error('Error syncing user with Supabase:', error);
        toast({
          title: "Sync Error",
          description: "Failed to sync user data. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (userLoaded) {
      syncUserWithSupabase();
    }
  }, [user, isSignedIn, userLoaded, toast]);

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'No user' };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    profile,
    loading: loading || !userLoaded,
    isSignedIn,
    updateProfile,
    signOut
  };
};