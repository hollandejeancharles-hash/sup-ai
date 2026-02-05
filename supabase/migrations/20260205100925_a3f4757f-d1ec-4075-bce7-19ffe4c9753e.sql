-- Create table for article reactions
CREATE TABLE public.article_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emoji text NOT NULL CHECK (emoji IN ('👍', '🔥', '💡', '❤️', '🎯')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(item_id, user_id, emoji)
);

-- Enable RLS
ALTER TABLE public.article_reactions ENABLE ROW LEVEL SECURITY;

-- Anyone can read reactions (public counts)
CREATE POLICY "Anyone can read reactions"
ON public.article_reactions FOR SELECT
USING (true);

-- Users can add their own reactions
CREATE POLICY "Users can add own reactions"
ON public.article_reactions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can remove their own reactions
CREATE POLICY "Users can remove own reactions"
ON public.article_reactions FOR DELETE
USING (user_id = auth.uid());

-- Create index for fast lookups
CREATE INDEX idx_reactions_item ON public.article_reactions(item_id);
CREATE INDEX idx_reactions_user ON public.article_reactions(user_id);