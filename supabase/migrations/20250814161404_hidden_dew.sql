```sql
-- Drop the existing UPDATE policy for audits table
DROP POLICY IF EXISTS "Enable audit updates for owners" ON public.audits;

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
```