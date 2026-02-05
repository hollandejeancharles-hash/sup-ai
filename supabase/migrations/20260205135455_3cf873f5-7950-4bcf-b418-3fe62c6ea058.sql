-- Add is_breaking flag to mark articles as breaking news
ALTER TABLE public.items ADD COLUMN is_breaking BOOLEAN NOT NULL DEFAULT false;

-- Add is_published flag for individual article visibility
ALTER TABLE public.items ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT true;

-- Add index for filtering published and breaking items
CREATE INDEX idx_items_published ON public.items(is_published);
CREATE INDEX idx_items_breaking ON public.items(is_breaking);