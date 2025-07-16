-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_picture TEXT,
  city TEXT,
  province_country TEXT,
  department TEXT,
  roles TEXT[] DEFAULT '{}',
  experience_level TEXT,
  years_experience TEXT,
  daily_rate TEXT,
  hourly_rate TEXT,
  project_rate TEXT,
  languages_spoken TEXT[] DEFAULT '{}',
  credits_highlights TEXT[] DEFAULT '{}',
  gear_owned TEXT[] DEFAULT '{}',
  special_skills TEXT[] DEFAULT '{}',
  youtube_vimeo TEXT,
  imdb_profile TEXT,
  profession TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  linkedin TEXT,
  youtube TEXT,
  facebook TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  availability_status TEXT,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'booked', 'on_hold')),
  profile_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_profession ON user_profiles(profession);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(location);
CREATE INDEX IF NOT EXISTS idx_user_profiles_availability ON user_profiles(availability);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
