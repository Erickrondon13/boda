const SUPABASE_URL = 'https://arfksmlkrcqwlyedvuds.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZmtzbWxrcmNxd2x5ZWR2dWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTUzMzcsImV4cCI6MjA5NzczMTMzN30.f7l1oEIv7tqRdzZ0_Ejvz-I0A7FXdVHu-ZPfZ4iN_kw';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const PUBLIC_INVITATION_BASE_URL = window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + 'index.html';
