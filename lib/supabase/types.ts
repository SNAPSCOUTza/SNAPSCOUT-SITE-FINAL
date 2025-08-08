export interface UserProfile {
  id: string;
  user_id: string;
  updated_at?: string;
  display_name: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  profile_picture: string | null;
  
  // Location
  provinces: string | null; // Comma-separated
  cities: string | null;    // Comma-separated
  location: string | null; // Combined string for display/search
  willing_to_travel: boolean | null;

  // Professional
  user_type: 'creator' | 'studio' | 'store' | null;
  department: string | null;
  profession: string | null;
  specializations: string[] | null; // TEXT[]
  roles: string[] | null;           // TEXT[]
  experience_level: string | null;
  years_experience: string | null;
  availability_status: string | null;

  // Rates
  daily_rate: string | null;
  hourly_rate: string | null;
  project_rate: string | null;
  rate_card_visible: boolean | null;

  // Skills & Gear
  software_skills: string[] | null; // TEXT[]
  technical_skills: string[] | null;// TEXT[]
  photography_skills: string[] | null; // TEXT[]
  videography_skills: string[] | null; // TEXT[]
  gear_owned: string[] | null;      // TEXT[]
  services_offered: string[] | null;// TEXT[]
  languages_spoken: string[] | null;// TEXT[]

  // Social & Portfolio
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  youtube: string | null;
  facebook: string | null;
  imdb_profile: string | null;
  portfolio_images: string[] | null; // TEXT[]

  // Settings & Stats
  is_verified: boolean | null;
  is_profile_visible: boolean;
  contact_info_visible: boolean | null;
  profile_views: number | null;
  contact_clicks: number | null;
  booking_requests: number | null;
  favorite_count: number | null;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: string | null;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | null;
}
