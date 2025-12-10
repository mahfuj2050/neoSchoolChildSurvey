import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION: Enter your Supabase credentials here to enable the DB
// ------------------------------------------------------------------
const SUPABASE_URL: string = 'https://hdwcchjbtqikkmucpyvx.supabase.co'; 
const SUPABASE_ANON_KEY: string = 'sb_publishable_Po8vstrHXT16cx7iXDQTdQ_MTFYcmSN'; 
// ------------------------------------------------------------------

export const isSupabaseConfigured = SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '';

export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;