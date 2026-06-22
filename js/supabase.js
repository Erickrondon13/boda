const SUPABASE_URL = 'sb_publishable_uOkx4yC8BQMKREvoNpTcMg_W83eCvYb';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZmtzbWxrcmNxd2x5ZWR2dWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTUzMzcsImV4cCI6MjA5NzczMTMzN30.f7l1oEIv7tqRdzZ0_Ejvz-I0A7FXdVHu-ZPfZ4iN_kw';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// URL base de tu invitación pública en GitHub Pages.
// Ejemplo:
// https://erickrondon.github.io/boda-erick-telma/
const PUBLIC_INVITATION_BASE_URL = 'https://Erickrondon13.github.io/boda/';