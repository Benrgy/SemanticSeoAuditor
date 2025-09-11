import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using mock mode.');
}

// Create a mock client if environment variables are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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