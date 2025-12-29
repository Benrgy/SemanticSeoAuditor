import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Please ensure the following environment variables are set:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  throw new Error('Supabase configuration is required. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('audits').select('count').limit(0).maybeSingle();

    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      console.error('❌ Database tables not found. Please run migrations.');
      return {
        connected: false,
        error: 'Database tables need to be created. Please run the Supabase migrations.',
        needsMigration: true
      };
    }

    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return {
        connected: false,
        error: error.message,
        needsMigration: false
      };
    }

    console.log('✅ Supabase connected successfully');
    return {
      connected: true,
      error: null,
      needsMigration: false
    };
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return {
      connected: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      needsMigration: false
    };
  }
}

// Database types
export interface User {
  id: string
  email: string
  created_at: string
  updated_at?: string
}

export interface Audit {
  id: string
  user_id?: string
  url: string
  status: 'pending' | 'completed' | 'failed'
  result_json?: any
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  message: string
  read: boolean
  created_at: string
}

export interface UsageAnalytics {
  id: string
  user_id?: string
  event_type: string
  metadata?: any
  timestamp: string
}