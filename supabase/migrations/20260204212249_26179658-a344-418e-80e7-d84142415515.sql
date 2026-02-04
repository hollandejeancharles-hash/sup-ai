-- Create table for admin invite codes
CREATE TABLE public.admin_invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_invite_codes ENABLE ROW LEVEL SECURITY;

-- Only admins can create and read invite codes
CREATE POLICY "Admins can manage invite codes"
  ON public.admin_invite_codes
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can verify a code exists (for signup validation)
CREATE POLICY "Anyone can verify valid codes"
  ON public.admin_invite_codes
  FOR SELECT
  TO anon, authenticated
  USING (
    used_by IS NULL 
    AND (expires_at IS NULL OR expires_at > now())
  );

-- Create a function to validate and consume an invite code
CREATE OR REPLACE FUNCTION public.use_admin_invite_code(
  _code text,
  _user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invite_id uuid;
BEGIN
  -- Find valid unused code
  SELECT id INTO _invite_id
  FROM public.admin_invite_codes
  WHERE code = _code
    AND used_by IS NULL
    AND (expires_at IS NULL OR expires_at > now());
  
  IF _invite_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Mark code as used
  UPDATE public.admin_invite_codes
  SET used_by = _user_id, used_at = now()
  WHERE id = _invite_id;
  
  -- Grant admin role to user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

-- Insert a default invite code for initial setup (you should change this!)
INSERT INTO public.admin_invite_codes (code, expires_at)
VALUES ('DAILYDIGEST2024', now() + interval '30 days');