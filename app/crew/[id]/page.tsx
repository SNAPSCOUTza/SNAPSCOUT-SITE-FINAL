"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InstagramFeed } from "@/components/ui/instagram-feed"
import {
  User,
  MapPin,
  Mail,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Camera,
  MessageCircle,
  ExternalLink,
  Star,
  Calendar,
  DollarSign,
  CheckCircle,
  Heart,
  Share2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/auth"
import { useParams, useRouter } from "next/navigation"

interface CrewProfile {
  id: string
  user_id: string
  display_name: string
  full_name: string
  bio: string
  profile_picture: string
  location: string
  city: string
  province_country: string
  department: string
  roles: string[]
  availability_status: string
  experience_level: string
  years_experience: string
  daily_rate: string
  hourly_rate: string
  project_rate: string
  languages_spoken: string[]
  credits_highlights: string[]
  gear_owned: string[]
  special_skills: string[]
  instagram: string
  linkedin: string
  youtube_vimeo: string
  website: string
  imdb_profile: string
  portfolio_images: string[]
  services_offered: string[]
  rate_card_visible: boolean
  contact_info_visible: boolean
  is_verified: boolean
  rating: number
  total_reviews: number
  profile_views: number
  created_at: string
  updated_at: string
}

export default function CrewProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<CrewProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get profile data with subscription check
        const { data: profileData, error } = await supabase
          .from("user_profiles")
          .select(`
            *,
            user_subscriptions!inner(status)
          `)
          .eq("user_id", params.id)
          .eq("user_subscriptions.status", "active")
          .single()

        if (error || !profileData) {
          console.error("Profile not found or subscription not active")
          setLoading(false)
          return
        }

        setProfile(profileData)

        // Increment profile views
        await supabase
          .from("user_profiles")
          .update({ profile_views: (profileData.profile_views || 0) + 1 })
          .eq("user_id", params.id)

        // Check if current user is the profile owner
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user && user.id === params.id) {
          setIsOwner(true)
        }

        // Check if profile is favorited by current user
        if (user) {
          const { data: favoriteData } = await supabase
            .from("user_favorites")
            .select("id")
            .eq("user_id", user.id)
            .eq("favorited_user_id", params.id)
            .single()

          if (favoriteData) {
            setIsFavorited(true)
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Error loading profile:", err)
        setLoading(false)
      }
    }

    loadProfile()
  }, [params.id])

  const handleFavorite = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    if (isFavorited) {
      await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("favorited_user_id", params.id)
      setIsFavorited(false)
    } else {
      await supabase.from("user_favorites").insert({
        user_id: user.id,
        favorited_user_id: params.id,
      })
      setIsFavorited(true)
    }
  }

  const handleContact = () => {
    setShowContactForm(true)
  }

  const handleBooking = () => {
    // Implement booking functionality
    router.push(`/booking/${params.id}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.display_name} - SnapScout`,
          text: `Check out ${profile?.display_name}'s profile on SnapScout`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">
            This profile doesn't exist or the user doesn't have an active subscription.
          </p>
          <Button asChild>
            <Link href="/find-crew">Browse Crew Members</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/snapscout-new-logo.jpeg"
              alt="SnapScout Logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">SnapScout</span>
              <p className="text-xs text-gray-500 -mt-1">Crew Profile</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Share</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFavorite} className={isFavorited ? "text-red-600" : ""}>
              <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
              <span className="hidden sm:inline ml-1">{isFavorited ? "Favorited" : "Favorite"}</span>
            </Button>
            {isOwner && (
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
            )}
            <Link href="/find-crew" className="text-red-700 hover:text-red-800 text-sm">
              Browse More
            </Link>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0">
                  <AvatarImage src={profile.profile_picture || "/placeholder.svg"} alt={profile.display_name} />
                  <AvatarFallback className="text-2xl sm:text-3xl">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.display_name}</h1>
                    {profile.is_verified && (
                      <Badge className="bg-blue-100 text-blue-800 w-fit mx-auto sm:mx-0 mt-1 sm:mt-0">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-lg sm:text-xl text-red-700 font-semibold mb-2">{profile.roles.join(" • ")}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-4 space-y-1 sm:space-y-0">
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {profile.city}, {profile.province_country}
                      </span>
                    </div>
                    {profile.years_experience && (
                      <>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span>{profile.years_experience} years experience</span>
                      </>
                    )}
                    {profile.rating > 0 && (
                      <>
                        <span className="hidden sm:inline mx-2">•</span>
                        <div className="flex items-center justify-center sm:justify-start">
                          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                          <span>
                            {profile.rating.toFixed(1)} ({profile.total_reviews} reviews)
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
                    {profile.department && <Badge variant="secondary">{profile.department}</Badge>}
                    {profile.experience_level && <Badge variant="secondary">{profile.experience_level}</Badge>}
                    <Badge
                      className={`${
                        profile.availability_status === "available"
                          ? "bg-green-100 text-green-800"
                          : profile.availability_status === "busy"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {profile.availability_status === "available"
                        ? "Available"
                        : profile.availability_status === "busy"
                          ? "Busy"
                          : "Fully Booked"}
                    </Badge>
                  </div>

                  {profile.bio && (
                    <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">{profile.bio}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button className="bg-red-700 hover:bg-red-800 flex-1 sm:flex-none" onClick={handleContact}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Me
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none bg-transparent" onClick={handleBooking}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Me
                    </Button>
                    {profile.website && (
                      <Button variant="outline" asChild className="flex-1 sm:flex-none bg-transparent">
                        <a href={profile.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Portfolio
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Services Offered */}
              {profile.services_offered && profile.services_offered.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Services Offered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.services_offered.map((service, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Portfolio Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.portfolio_images && profile.portfolio_images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.portfolio_images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Portfolio ${index + 1}`}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Portfolio images will be displayed here</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Instagram Feed */}
              {profile.instagram && <InstagramFeed handle={profile.instagram} postCount={6} />}

              {/* Credits & Experience */}
              {profile.credits_highlights && profile.credits_highlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Credits & Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.credits_highlights.map((credit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-700 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{credit}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rate Card */}
              {profile.rate_card_visible && (profile.daily_rate || profile.hourly_rate || profile.project_rate) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Rate Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.daily_rate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Daily Rate</span>
                        <span className="font-semibold">{profile.daily_rate}</span>
                      </div>
                    )}
                    {profile.hourly_rate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Hourly Rate</span>
                        <span className="font-semibold">{profile.hourly_rate}</span>
                      </div>
                    )}
                    {profile.project_rate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Project Rate</span>
                        <span className="font-semibold">{profile.project_rate}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              {profile.contact_info_visible && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Contact via SnapScout</span>
                    </div>
                    {profile.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-3" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-700 hover:text-red-800 flex items-center"
                        >
                          Portfolio Website
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Social Media Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.instagram && (
                    <a
                      href={profile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-red-700 transition-colors"
                    >
                      <Instagram className="h-4 w-4 mr-3" />
                      Instagram
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-red-700 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 mr-3" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                  {profile.youtube_vimeo && (
                    <a
                      href={profile.youtube_vimeo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-red-700 transition-colors"
                    >
                      <Youtube className="h-4 w-4 mr-3" />
                      YouTube/Vimeo
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                  {profile.imdb_profile && (
                    <a
                      href={profile.imdb_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-red-700 transition-colors"
                    >
                      <Star className="h-4 w-4 mr-3" />
                      IMDB
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Languages */}
              {profile.languages_spoken && profile.languages_spoken.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages_spoken.map((language, index) => (
                        <Badge key={index} variant="secondary">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gear & Skills */}
              {(profile.gear_owned?.length > 0 || profile.special_skills?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gear & Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.gear_owned && profile.gear_owned.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Gear Owned:</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.gear_owned.map((gear, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {gear}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.special_skills && profile.special_skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Special Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {profile.special_skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Profile Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="font-semibold">{profile.profile_views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold">{new Date(profile.created_at).getFullYear()}</span>
                  </div>
                  {profile.rating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                        <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Contact {profile.display_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Tell them about your project..."
                />
              </div>
              <div className="flex space-x-3">
                <Button className="flex-1 bg-red-700 hover:bg-red-800">Send Message</Button>
                <Button variant="outline" onClick={() => setShowContactForm(false)} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
