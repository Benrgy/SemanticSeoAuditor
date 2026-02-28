/*
  # Add Webhooks and API Keys Tables

  1. New Tables
    - `webhooks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, webhook name)
      - `type` (text, webhook type: slack, discord, email, custom)
      - `url` (text, webhook URL)
      - `events` (text[], array of event types to trigger on)
      - `enabled` (boolean, whether webhook is active)
      - `created_at` (timestamptz)
      - `last_triggered_at` (timestamptz, nullable)
    
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, API key name/description)
      - `key_hash` (text, hashed API key)
      - `key_prefix` (text, first 8 chars for display)
      - `last_used_at` (timestamptz, nullable)
      - `expires_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `revoked` (boolean, whether key is revoked)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own webhooks and API keys
    - Restrict all operations to authenticated users
    - Enforce proper ownership checks
*/

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('slack', 'discord', 'email', 'custom')),
  url text NOT NULL,
  events text[] NOT NULL DEFAULT '{}',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_triggered_at timestamptz
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  key_prefix text NOT NULL,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  revoked boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Webhooks policies
CREATE POLICY "Users can view their own webhooks"
  ON webhooks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks"
  ON webhooks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks"
  ON webhooks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks"
  ON webhooks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- API Keys policies
CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_enabled ON webhooks(enabled);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_revoked ON api_keys(revoked);
