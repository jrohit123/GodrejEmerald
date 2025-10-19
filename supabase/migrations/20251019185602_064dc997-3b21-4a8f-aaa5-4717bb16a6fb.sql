-- Create a table to track individual user likes
CREATE TABLE public.media_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid NOT NULL REFERENCES public.event_images(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(media_id, user_id)
);

-- Enable RLS
ALTER TABLE public.media_likes ENABLE ROW LEVEL SECURITY;

-- Everyone can view likes
CREATE POLICY "Everyone can view likes"
ON public.media_likes
FOR SELECT
USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Authenticated users can like"
ON public.media_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own likes
CREATE POLICY "Authenticated users can unlike"
ON public.media_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_media_likes_media_id ON public.media_likes(media_id);
CREATE INDEX idx_media_likes_user_id ON public.media_likes(user_id);