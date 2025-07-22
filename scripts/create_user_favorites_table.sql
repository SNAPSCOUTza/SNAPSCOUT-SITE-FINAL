-- Create user_favorites table for favoriting crew profiles
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    favorited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, favorited_user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_favorited_user_id ON user_favorites(favorited_user_id);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update favorite count
CREATE OR REPLACE FUNCTION update_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_profiles 
        SET favorite_count = (
            SELECT COUNT(*) 
            FROM user_favorites 
            WHERE favorited_user_id = NEW.favorited_user_id
        )
        WHERE user_id = NEW.favorited_user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_profiles 
        SET favorite_count = (
            SELECT COUNT(*) 
            FROM user_favorites 
            WHERE favorited_user_id = OLD.favorited_user_id
        )
        WHERE user_id = OLD.favorited_user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_favorite_count ON user_favorites;
CREATE TRIGGER trigger_update_favorite_count
    AFTER INSERT OR DELETE ON user_favorites
    FOR EACH ROW EXECUTE FUNCTION update_favorite_count();
