import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iljlpptjtkfiztevvyjb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsamxwcHRqdGtmaXp0ZXZ2eWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDY2NDAsImV4cCI6MjEwMjI4MjY0MH0.12dcA3OTl8DLSIRcxFl6n-muNyl41lpooNC5FVEMwVI';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
