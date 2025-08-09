-- Drop table if it exists to start fresh
DROP TABLE IF EXISTS profiles;

-- Users table for when they upgrade from demo mode
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  location TEXT,
  profession TEXT,
  profile_image_url TEXT, -- Storing as text, can be Base64 for demo or URL for prod
  social_links JSONB DEFAULT '{}',
  portfolio_images JSONB DEFAULT '[]', -- Storing as an array of text (Base64 or URLs)
  skills JSONB DEFAULT '[]',
  pricing TEXT,
  availability TEXT,
  is_public BOOLEAN DEFAULT false,
  subscription_status TEXT DEFAULT 'demo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Good practice for Supabase)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( is_public = true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_profile_update();
