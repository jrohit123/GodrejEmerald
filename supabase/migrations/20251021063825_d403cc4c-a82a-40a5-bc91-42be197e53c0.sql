-- Create authorized_users table to store pre-authorized email addresses
CREATE TABLE public.authorized_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on authorized_users
ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view the authorized users list
CREATE POLICY "Authenticated users can view authorized users"
ON public.authorized_users
FOR SELECT
USING (auth.role() = 'authenticated');

-- Add is_public column to event_images to control visibility
ALTER TABLE public.event_images
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Create a security definer function to check if user is authorized
CREATE OR REPLACE FUNCTION public.is_authorized_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.authorized_users
    WHERE email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );
$$;

-- Update RLS policy for event_images to allow authorized users to see all images
-- and everyone to see public images
DROP POLICY IF EXISTS "Everyone can view event images" ON public.event_images;

CREATE POLICY "Public images visible to everyone"
ON public.event_images
FOR SELECT
USING (is_public = true);

CREATE POLICY "All images visible to authorized users"
ON public.event_images
FOR SELECT
USING (
  auth.role() = 'authenticated' 
  AND public.is_authorized_user()
);

-- Insert the pre-authorized users
INSERT INTO public.authorized_users (email) VALUES
  ('jrohit123@gmail.com'),
  ('godrejemerald.chsl@gmail.com')
ON CONFLICT (email) DO NOTHING;