import {
  createClient,
  type SignInWithOAuthCredentials,
} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signIn = async (credentials: SignInWithOAuthCredentials) => {
  return await supabase.auth.signInWithOAuth(credentials);
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getUserInfo = async () => {
  return await supabase.auth.getUserIdentities();
};
