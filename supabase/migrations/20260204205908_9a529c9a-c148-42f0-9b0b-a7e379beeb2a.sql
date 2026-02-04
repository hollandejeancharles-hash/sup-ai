-- Add video_url column to items table for YouTube embedding
ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS video_url text;

-- Create storage bucket for article thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for article-images bucket
-- Admins can upload images
CREATE POLICY "Admins can upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Admins can update images
CREATE POLICY "Admins can update article images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'article-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Admins can delete images
CREATE POLICY "Admins can delete article images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'article-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Anyone can view article images (public bucket)
CREATE POLICY "Anyone can view article images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'article-images');