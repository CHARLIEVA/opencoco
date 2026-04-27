import { createBrowserClient } from "@supabase/ssr";
import {
  hasSupabaseBrowserEnv,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase.shared";

export { hasSupabaseBrowserEnv };

export const createSupabaseBrowserClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing public Supabase environment variables.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
