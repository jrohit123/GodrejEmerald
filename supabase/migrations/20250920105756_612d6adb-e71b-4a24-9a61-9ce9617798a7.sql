-- Update RLS policies to allow public access to view events and event images
-- This will allow the gallery to work without authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can view event images" ON public.event_images;

-- Create new public read policies
CREATE POLICY "Everyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Everyone can view event images" 
ON public.event_images 
FOR SELECT 
USING (true);