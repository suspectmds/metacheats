import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder') && supabaseAnonKey && !supabaseAnonKey.includes('placeholder');

if (!isConfigured) {
    console.error("SUPABASE CONFIG ERROR: Environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing or set to placeholders.");
} else {
    console.log("Supabase Connection Initialized. Target:", supabaseUrl.substring(0, 15) + "...");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

export const checkConfig = () => ({
    url: supabaseUrl ? (supabaseUrl.substring(0, 8) + '...' + supabaseUrl.slice(-5)) : 'MISSING',
    key: supabaseAnonKey ? (supabaseAnonKey.substring(0, 5) + '...') : 'MISSING',
    isConfigured
});
