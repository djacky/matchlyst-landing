import { createClient } from "@supabase/supabase-js";

/** Public client — respects RLS policies. */
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

/**
 * Admin client — bypasses RLS. Use ONLY in server-side API routes.
 * Falls back to the anon client if the service role key isn't set.
 */
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : supabase;
