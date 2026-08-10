import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// A dummy client that mimics the real Supabase client for the methods we use.
const createDummyClient = () => {
  const dummy = {
    from: (table: string) => ({
      select: (columns?: string) => ({
        order: (column: string, options?: any) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
        }),
        // Add other chain methods if needed
      }),
      insert: (values: any) => Promise.resolve({ data: null, error: null }),
      upsert: (values: any, options?: any) => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: (credentials: any) => Promise.resolve({ data: null, error: null }),
      signUp: (credentials: any) => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  };
  return dummy;
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClientComponentClient()
    : createDummyClient();