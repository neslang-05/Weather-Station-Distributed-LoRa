// --- SUPABASE CONFIG ---
const SUPABASE_URL = "https://wpiamopnovthqpesfbuw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWFtb3Bub3Z0aHFwZXNmYnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjI2ODYsImV4cCI6MjA3OTc5ODY4Nn0.cJzs_6F_W971tRs8TkvYHUF_CljQSZ2lqgwsMVLqNwE";
window.client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
