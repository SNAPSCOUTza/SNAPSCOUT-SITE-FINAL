-- This script unifies the user_profiles schema to be consistent across the application.
-- It adds columns if they don't exist and standardizes naming conventions.

-- Add standardized columns if they don't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS provinces TEXT, -- For comma-separated list of provinces
ADD COLUMN IF NOT EXISTS cities TEXT,    -- For comma-separated list of cities
ADD COLUMN IF NOT EXISTS willing_to_travel BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user_type TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS profession TEXT,
ADD COLUMN IF NOT EXISTS specializations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_level TEXT,
ADD COLUMN IF NOT EXISTS years_experience TEXT,
ADD COLUMN IF NOT EXISTS availability_status TEXT,
ADD COLUMN IF NOT EXISTS daily_rate TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate TEXT,
ADD COLUMN IF NOT EXISTS project_rate TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS youtube TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS imdb_profile TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS software_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS technical_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS photography_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS videography_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS special_skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gear_owned TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS services_offered TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS languages_spoken TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS credits_highlights TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_profile_visible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS rate_card_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_info_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS contact_clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_requests INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0;

-- Note: This script does not delete old, inconsistently named columns to prevent data loss.
-- You may want to manually migrate data from old columns (e.g., 'phone_number' to 'phone')
-- and then drop them later.

-- Ensure RLS policies are up-to-date
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (is_profile_visible = true AND EXISTS (
        SELECT 1 FROM user_subscriptions s
        WHERE s.user_id = user_profiles.user_id AND s.status = 'active'
    ));

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- After running this script, please refresh your Supabase schema cache
-- by going to API settings in your Supabase dashboard and clicking "Reload schema".
