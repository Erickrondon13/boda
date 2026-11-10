
const SUPABASE_URL = 'https://arfksmlkrcqwlyedvuds.supabase.co';

const SUPABASE_ANON_KEY = 'TU_ANON_KEY_ACTUAL';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const PUBLIC_INVITATION_BASE_URL =
    window.location.origin +
    window.location.pathname.replace(/[^/]*$/, '') +
    'index.html';
