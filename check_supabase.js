import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iljlpptjtkfiztevvyjb.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsamxwcHRqdGtmaXp0ZXZ2eWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDY2NDAsImV4cCI6MjEwMjI4MjY0MH0.12dcA3OTl8DLSIRcxFl6n-muNyl41lpooNC5FVEMwVI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log("Checking if mbd_data table exists...");
  
  const { data, error } = await supabase
    .from('mbd_data')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error("SUPABASE_ERROR:", error);
    process.exit(1);
  } else {
    console.log("Table exists! Data:", JSON.stringify(data, null, 2));
  }
}

checkDatabase();
