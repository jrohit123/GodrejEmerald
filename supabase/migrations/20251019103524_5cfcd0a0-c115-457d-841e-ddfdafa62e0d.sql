-- Add caption and likes_count columns to event_images table
ALTER TABLE public.event_images 
ADD COLUMN caption text,
ADD COLUMN likes_count integer DEFAULT 0 NOT NULL;