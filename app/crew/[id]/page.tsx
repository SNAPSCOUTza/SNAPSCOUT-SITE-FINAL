"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InstagramFeed } from "@/components/ui/instagram-feed"
import { User, MapPin, Mail, Instagram, Linkedin, Youtube, Globe, Camera, MessageCircle, ExternalLink, Star, Calendar, DollarSign, CheckCircle, Heart, Share2, Briefcase, Languages, Zap } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/auth"
import { useParams, useRouter } from "next/navigation"
import type { UserProfile } from "@/lib/supabase/types"

export default function CrewProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    if (!params.id) return;

    const loadProfile = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from("user_profiles")
          .select(`*, user_subscriptions(status)`)
          .eq("user_id", params.id)
          .single()

        if (error || !profileData) {
          console.error("Error loading profile:", error?.message)
          setLoading(false)
          return
        }
        
        // @ts-ignore
        const subscription = profileData.user_subscriptions[0];
        if (subscription?.status !== 'active') {
            console.log("User does not have an active subscription.");
            setProfile(null);
            setLoading(false);
            return;
        }

        setProfile(profileData as UserProfile)

        // Increment profile views
        await supabase.rpc('increment_profile_views', { profile_id: profileData.id })

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          if (user.id === params.id) setIsOwner(true)
          
          const { data: favoriteData } = await supabase
            .from("user_favorites")
            .select("id")
            .eq("user_id", user.id)
            .eq("favorited_user_id", params.id)
            .single()
          if (favoriteData) setIsFavorited(true)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error in loadProfile:", err)
        setLoading(false)
      }
    }

    loadProfile()
  }, [params.id])

  const handleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (isFavorited) {
      await supabase.from("user_favorites").delete().match({ user_id: user.id, favorited_user_id: params.id })
      setIsFavorited(false)
    } else {
      await supabase.from("user_favorites").insert({ user_id: user.id, favorited_user_id: params.id })
      setIsFavorited(true)
    }
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
      navigator.clipboard.writeText(window.location.href)
      alert("Profile URL copied to clipboard!")
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
            This profile may not exist, or the user might not have an active subscription.
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
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0">
                  <AvatarImage src={profile.profile_picture || "/placeholder.svg"} alt={profile.display_name || 'User'} />
                  <AvatarFallback className="text-2xl sm:text-3xl">
                    {profile.display_name?.charAt(0).toUpperCase()}
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

                  <p className="text-lg sm:text-xl text-red-700 font-semibold mb-2">{profile.roles?.join(" • ")}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-4 space-y-1 sm:space-y-0">
                    <div className="flex items-center justify-center sm:justify-start">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profile.location}</span>
                    </div>
                    {profile.years_experience && (
                      <>
                        <span className="hidden sm:inline mx-2">•</span>
                        <span>{profile.years_experience} years experience</span>
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
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {profile.availability_status}
                    </Badge>
                  </div>

                  {profile.bio && (
                    <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">{profile.bio}</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button className="bg-red-700 hover:bg-red-800 flex-1 sm:flex-none" onClick={() => setShowContactForm(true)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Me
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
                     <Button variant="ghost" size="icon" onClick={handleFavorite}>
                        <Heart className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                        <Share2 className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {profile.portfolio_images && profile.portfolio_images.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Camera className="h-5 w-5 mr-2" />Portfolio</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.portfolio_images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <Image src={image || "/placeholder.svg"} alt={`Portfolio ${index + 1}`} width={400} height={400} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {profile.instagram && <InstagramFeed handle={profile.instagram} postCount={6} />}

              {profile.specializations && profile.specializations.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Star className="h-5 w-5 mr-2" />Specializations</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                      {profile.specializations.map((spec, index) => <Badge key={index} variant="outline">{spec}</Badge>)}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {profile.rate_card_visible && (profile.daily_rate || profile.hourly_rate || profile.project_rate) && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><DollarSign className="h-5 w-5 mr-2" />Rate Card</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {profile.daily_rate && <div className="flex justify-between"><span>Daily Rate</span><span className="font-semibold">{profile.daily_rate}</span></div>}
                    {profile.hourly_rate && <div className="flex justify-between"><span>Hourly Rate</span><span className="font-semibold">{profile.hourly_rate}</span></div>}
                    {profile.project_rate && <div className="flex justify-between"><span>Project Rate</span><span className="font-semibold">{profile.project_rate}</span></div>}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle>Social Media</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {profile.instagram && <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-red-700"><Instagram className="h-4 w-4 mr-3" />Instagram<ExternalLink className="h-3 w-3 ml-auto" /></a>}
                  {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-red-700"><Linkedin className="h-4 w-4 mr-3" />LinkedIn<ExternalLink className="h-3 w-3 ml-auto" /></a>}
                  {profile.youtube && <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-red-700"><Youtube className="h-4 w-4 mr-3" />YouTube/Vimeo<ExternalLink className="h-3 w-3 ml-auto" /></a>}
                  {profile.imdb_profile && <a href={profile.imdb_profile} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-red-700"><Star className="h-4 w-4 mr-3" />IMDB<ExternalLink className="h-3 w-3 ml-auto" /></a>}
                </CardContent>
              </Card>

              {(profile.gear_owned?.length > 0 || profile.technical_skills?.length > 0 || profile.photography_skills?.length > 0 || profile.videography_skills?.length > 0) && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><Zap className="h-5 w-5 mr-2" />Skills & Gear</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {profile.technical_skills && profile.technical_skills.length > 0 && <div><h4 className="font-semibold mb-2">Technical Skills:</h4><div className="flex flex-wrap gap-1">{profile.technical_skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}</div></div>}
                    {profile.photography_skills && profile.photography_skills.length > 0 && <div><h4 className="font-semibold mb-2">Photography Skills:</h4><div className="flex flex-wrap gap-1">{profile.photography_skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}</div></div>}
                    {profile.videography_skills && profile.videography_skills.length > 0 && <div><h4 className="font-semibold mb-2">Videography Skills:</h4><div className="flex flex-wrap gap-1">{profile.videography_skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}</div></div>}
                    {profile.gear_owned && profile.gear_owned.length > 0 && <div><h4 className="font-semibold mb-2">Gear Owned:</h4><div className="flex flex-wrap gap-1">{profile.gear_owned.map((gear, i) => <Badge key={i} variant="outline">{gear}</Badge>)}</div></div>}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader><CardTitle>Contact {profile.display_name}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Form Implementation */}
              <p>Contact form placeholder</p>
              <Button variant="outline" onClick={() => setShowContactForm(false)}>Cancel</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
