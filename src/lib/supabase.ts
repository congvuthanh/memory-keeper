import { PostgrestError } from '@supabase/postgrest-js';
import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserDetails = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: string;
  created_at?: string;
};

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