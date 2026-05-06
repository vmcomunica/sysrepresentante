import { createClient } from '@supabase/supabase-js';

const supabaseUrl = https://sxzyogswvfyvsmplytpi.supabase.co;
const supabaseAnonKey = sb_publishable_kv-sKwYEJq3M3GT2o5Bwqw_9BnFgOev;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
