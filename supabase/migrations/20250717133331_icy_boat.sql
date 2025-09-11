/*
  # Update RLS policies for audits table

  1. Security
    - Enable RLS on `audits` table
    - Add policy for anonymous users to read public audits (user_id IS NULL)
    - Add policy for authenticated users to read their own audits
    - Add policy for users to create audits
    - Add policy for users to update their own audits
*/

-- Enable RLS on audits table
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anonymous users can view public audits" ON audits;
DROP POLICY IF EXISTS "Users can view their own audits" ON audits;
DROP POLICY IF EXISTS "Anonymous users can create public audits" ON audits;
DROP POLICY IF EXISTS "Users can create audits" ON audits;
DROP POLICY IF EXISTS "Users can update their own audits" ON audits;

-- Allow anonymous users to view public audits (user_id IS NULL)
CREATE POLICY "Anonymous users can view public audits"
  ON audits
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

-- Allow authenticated users to view their own audits
CREATE POLICY "Users can view their own audits"
  ON audits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow anonymous users to create public audits
CREATE POLICY "Anonymous users can create public audits"
  ON audits
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Allow authenticated users to create audits
CREATE POLICY "Users can create audits"
  ON audits
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Allow users to update their own audits
CREATE POLICY "Users can update their own audits"
  ON audits
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());