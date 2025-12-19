/*
  # Fix Audit Update Policy

  1. Security Updates
    - Drop existing restrictive UPDATE policy
    - Create new policy allowing authenticated users to update their audits
    - Allow anonymous users to update public audits (user_id IS NULL)

  2. Policy Changes
    - Authenticated users: can update audits where user_id = auth.uid()
    - Anonymous users: can update audits where user_id IS NULL
*/

-- Drop the existing UPDATE policy for audits table
DROP POLICY IF EXISTS "Enable audit updates for owners" ON public.audits;
DROP POLICY IF EXISTS "Allow users to update their own audits" ON public.audits;
DROP POLICY IF EXISTS "Enable audit updates for authenticated and anonymous" ON public.audits;

-- Create a new, more comprehensive UPDATE policy
-- This policy allows:
-- 1. Authenticated users to update their own audits (user_id = auth.uid())
-- 2. Anonymous users to update audits where user_id is NULL (user_id IS NULL AND auth.uid() IS NULL)
CREATE POLICY "Enable audit updates for authenticated and anonymous"
ON public.audits
FOR UPDATE
TO anon, authenticated
USING (
    (user_id = auth.uid()) OR (user_id IS NULL AND auth.uid() IS NULL)
)
WITH CHECK (
    (user_id = auth.uid()) OR (user_id IS NULL AND auth.uid() IS NULL)
);