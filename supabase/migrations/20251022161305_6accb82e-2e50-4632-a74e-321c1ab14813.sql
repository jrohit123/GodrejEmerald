-- Create role enum
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Add role column to authorized_users table
ALTER TABLE public.authorized_users 
ADD COLUMN role public.user_role NOT NULL DEFAULT 'user';

-- Create index for better performance on role queries
CREATE INDEX idx_authorized_users_role ON public.authorized_users(role);

-- Drop the old admin_users table
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Update the is_authorized_user function to accept optional role parameter
CREATE OR REPLACE FUNCTION public.is_authorized_user(check_role public.user_role DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.authorized_users
    WHERE email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
    AND (check_role IS NULL OR role = check_role)
  );
$$;

-- Create a helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT is_authorized_user('admin'::public.user_role);
$$;

-- Update RLS policies to use the new functions
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
CREATE POLICY "Admins can insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Authenticated users can update events" ON public.events;
CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (is_admin());

DROP POLICY IF EXISTS "Authenticated users can insert event images" ON public.event_images;
CREATE POLICY "Admins can insert event images"
ON public.event_images
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Authenticated users can update event images" ON public.event_images;
CREATE POLICY "Admins can update event images"
ON public.event_images
FOR UPDATE
TO authenticated
USING (is_admin());

DROP POLICY IF EXISTS "Authenticated users can delete event images" ON public.event_images;
CREATE POLICY "Admins can delete event images"
ON public.event_images
FOR DELETE
TO authenticated
USING (is_admin());