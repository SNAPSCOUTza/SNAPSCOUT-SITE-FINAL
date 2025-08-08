-- Update user_profiles table to fix column naming and ensure all required columns exist
-- This script standardizes column names and adds missing columns.

-- Standardize 'province' column
DO $$
BEGIN
    -- If 'province_country' exists, rename it to 'province'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'province_country') THEN
        ALTER TABLE user_profiles RENAME COLUMN province_country TO province;
    END IF;
    -- If 'province' does not exist, add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'province') THEN
        ALTER TABLE user_profiles ADD COLUMN province TEXT;
    END IF;
END $$;

-- Standardize 'availability_status' column
DO $$
BEGIN
    -- If 'availability' exists and 'availability_status' does not, rename it
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'availability') AND
       NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'availability_status') THEN
        ALTER TABLE user_profiles RENAME COLUMN availability TO availability_status;
    END IF;

    -- If 'availability_status' still does not exist, add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'availability_status') THEN
        ALTER TABLE user_profiles ADD COLUMN availability_status TEXT;
    END IF;

    -- Ensure the column has a default value
    ALTER TABLE user_profiles ALTER COLUMN availability_status SET DEFAULT 'available';

    -- Drop any old check constraint to avoid conflicts
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_availability_status_check') THEN
        ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_availability_status_check;
    END IF;
    
    -- Add the correct check constraint
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_availability_status_check 
    CHECK (availability_status IN ('available', 'busy', 'booked'));
END $$;


-- Ensure all other columns exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS youtube TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS youtube_vimeo TEXT,
ADD COLUMN IF NOT EXISTS imdb_profile TEXT,
ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS languages_spoken TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS credits_highlights TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gear_owned TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS special_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS services_offered TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('Entry', 'Mid', 'Senior')),
ADD COLUMN IF NOT EXISTS years_experience TEXT,
ADD COLUMN IF NOT EXISTS daily_rate TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate TEXT,
ADD COLUMN IF NOT EXISTS project_rate TEXT,
ADD COLUMN IF NOT EXISTS rate_card_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_info_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS contact_clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_requests INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();


-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_profession ON user_profiles(profession);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(location);
CREATE INDEX IF NOT EXISTS idx_user_profiles_city ON user_profiles(city);
CREATE INDEX IF NOT EXISTS idx_user_profiles_province ON user_profiles(province);
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON user_profiles(department);
CREATE INDEX IF NOT EXISTS idx_user_profiles_availability_status ON user_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_experience_level ON user_profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_rating ON user_profiles(rating);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verified ON user_profiles(is_verified);

-- Add GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_user_profiles_roles_gin ON user_profiles USING GIN(roles);
CREATE INDEX IF NOT EXISTS idx_user_profiles_services_gin ON user_profiles USING GIN(services_offered);
CREATE INDEX IF NOT EXISTS idx_user_profiles_skills_gin ON user_profiles USING GIN(special_skills);
CREATE INDEX IF NOT EXISTS idx_user_profiles_languages_gin ON user_profiles USING GIN(languages_spoken);

-- Ensure RLS is enabled and policies are correct
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON user_profiles;
CREATE POLICY "Users can delete their own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Helper functions for profile stats
CREATE OR REPLACE FUNCTION increment_profile_views(profile_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET profile_views = COALESCE(profile_views, 0) + 1
    WHERE user_id = profile_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_contact_clicks(profile_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET contact_clicks = COALESCE(contact_clicks, 0) + 1
    WHERE user_id = profile_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_booking_requests(profile_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET booking_requests = COALESCE(booking_requests, 0) + 1
    WHERE user_id = profile_user_id;
END;
$$ LANGUAGE plpgsql;
