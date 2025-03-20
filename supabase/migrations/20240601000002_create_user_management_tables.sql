-- Create user_mfa_settings table
CREATE TABLE IF NOT EXISTS public.user_mfa_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  secret TEXT,
  backup_codes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_mfa_settings_user_id ON public.user_mfa_settings(user_id);

-- Enable row level security
ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_mfa_settings
DROP POLICY IF EXISTS "Users can view their own MFA settings";
CREATE POLICY "Users can view their own MFA settings"
  ON public.user_mfa_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own MFA settings";
CREATE POLICY "Users can update their own MFA settings"
  ON public.user_mfa_settings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all MFA settings";
CREATE POLICY "Admins can view all MFA settings"
  ON public.user_mfa_settings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role IN ('superAdmin', 'admin')
  ));

DROP POLICY IF EXISTS "Admins can update all MFA settings";
CREATE POLICY "Admins can update all MFA settings"
  ON public.user_mfa_settings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role IN ('superAdmin', 'admin')
  ));

-- Add realtime support
alter publication supabase_realtime add table user_mfa_settings;