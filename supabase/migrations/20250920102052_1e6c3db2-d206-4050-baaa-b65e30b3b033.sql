-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('event-videos', 'event-videos', true);

-- Create storage policies for event videos
CREATE POLICY "Event videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-videos');

CREATE POLICY "Authenticated users can upload event videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'event-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'event-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'event-videos' AND auth.role() = 'authenticated');

-- Add video support to event_images table (rename it to event_media)
ALTER TABLE public.event_images ADD COLUMN media_type TEXT DEFAULT 'image';
UPDATE public.event_images SET media_type = 'image' WHERE media_type IS NULL;