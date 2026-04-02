// core/supabase.js

const SUPABASE_URL = "https://whzqcvvclmsaskwhzbcw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoenFjdnZjbG1zYXNrd2h6YmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDY2OTEsImV4cCI6MjA5MDY4MjY5MX0.f_RxH38xH0k5UdFnXMLWa66T2fTQ2QhjL3l0qy7ls0Q";

// cria cliente global SEM declarar variável duplicada
if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}
