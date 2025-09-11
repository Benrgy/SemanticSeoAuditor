/*
  # Fix RLS Policies for Audit System

  1. Security Updates
    - Drop and recreate RLS policies with proper permissions
    - Allow anonymous users to create and view public audits
    - Allow authenticated users to manage their own audits
    - Fix analytics table permissions

  2. Policy Changes
    - Public audits: user_id IS NULL
    - Private audits: user_id = auth.uid()
    - Analytics: proper user tracking
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anonymous users can create public audits" ON audits;
DROP POLICY IF EXISTS "Anonymous users can view public audits" ON audits;
DROP POLICY IF EXISTS "Users can create audits" ON audits;
DROP POLICY IF EXISTS "Users can update their own audits" ON audits;
DROP POLICY IF EXISTS "Users can view their own audits" ON audits;

-- Recreate audit policies
CREATE POLICY "Enable public audit creation"
  ON audits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable public audit viewing"
  ON audits
  FOR SELECT
  TO anon, authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Enable audit updates for owners"
  ON audits
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Fix analytics policies
DROP POLICY IF EXISTS "Anyone can create analytics events" ON usage_analytics;
DROP POLICY IF EXISTS "Users can view their own analytics" ON usage_analytics;

CREATE POLICY "Enable analytics creation"
  ON usage_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable analytics viewing"
  ON usage_analytics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Ensure RLS is enabled
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;