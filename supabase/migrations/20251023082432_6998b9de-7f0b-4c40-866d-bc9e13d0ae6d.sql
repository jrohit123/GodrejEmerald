-- Fix RLS policy on authorized_users to allow unauthenticated users to check if email is authorized
-- This is needed for the signup flow to work properly

-- Drop the existing policy that only allows authenticated users
DROP POLICY IF EXISTS "Authenticated users can view authorized users" ON public.authorized_users;

-- Create a new policy that allows both authenticated and anonymous users to view authorized emails
-- This is safe because:
-- 1. Only email addresses are exposed (no sensitive data)
-- 2. It's necessary for the signup authorization check
-- 3. Anonymous users can only SELECT, not INSERT/UPDATE/DELETE
CREATE POLICY "Anyone can view authorized users for signup check"
ON public.authorized_users
FOR SELECT
TO authenticated, anon
USING (true);