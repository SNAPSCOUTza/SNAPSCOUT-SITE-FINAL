-- Add new columns to user_profiles table for enhanced functionality
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS services_offered TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rate_card_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_info_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS contact_clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_requests INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0;

-- Add new columns to user_profiles table for enhanced crew profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province_country TEXT,
ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'booked')),
ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('Entry', 'Mid', 'Senior')),
ADD COLUMN IF NOT EXISTS years_experience TEXT,
ADD COLUMN IF NOT EXISTS daily_rate TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate TEXT,
ADD COLUMN IF NOT EXISTS project_rate TEXT,
ADD COLUMN IF NOT EXISTS languages_spoken TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS credits_highlights TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gear_owned TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS special_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS youtube_vimeo TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS imdb_profile TEXT,
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[] DEFAULT '{}';

-- Create function to update favorite count
CREATE OR REPLACE FUNCTION update_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_profiles 
        SET favorite_count = favorite_count + 1 
        WHERE user_id = NEW.favorited_user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_profiles 
        SET favorite_count = favorite_count - 1 
        WHERE user_id = OLD.favorited_user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update favorite count
CREATE TRIGGER update_user_favorite_count 
    AFTER INSERT OR DELETE ON user_favorites 
    FOR EACH ROW 
    EXECUTE FUNCTION update_favorite_count();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON user_profiles(department);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON user_profiles(location);
CREATE INDEX IF NOT EXISTS idx_user_profiles_city ON user_profiles(city);
CREATE INDEX IF NOT EXISTS idx_user_profiles_availability ON user_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_experience_level ON user_profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_rating ON user_profiles(rating);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verified ON user_profiles(is_verified);

-- Add GIN indexes for array columns for better search performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_roles_gin ON user_profiles USING GIN(roles);
CREATE INDEX IF NOT EXISTS idx_user_profiles_services_gin ON user_profiles USING GIN(services_offered);
CREATE INDEX IF NOT EXISTS idx_user_profiles_skills_gin ON user_profiles USING GIN(special_skills);
CREATE INDEX IF NOT EXISTS idx_user_profiles_languages_gin ON user_profiles USING GIN(languages_spoken);

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_subscriptions 
            WHERE user_subscriptions.user_id = user_profiles.user_id 
            AND user_subscriptions.status = 'active'
        )
    );

-- Function to update profile stats
CREATE OR REPLACE FUNCTION increment_profile_views(profile_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET profile_views = COALESCE(profile_views, 0) + 1
    WHERE user_id = profile_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment contact clicks
CREATE OR REPLACE FUNCTION increment_contact_clicks(profile_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET contact_clicks = COALESCE(contact_clicks, 0) + 1
    WHERE user_id = profile_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment booking requests
CREATE OR REPLACE FUNCTION increment_booking_requests(profile_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET booking_requests = COALESCE(booking_requests, 0) + 1
    WHERE user_id = profile_user_id;
END;
$$ LANGUAGE plpgsql;
