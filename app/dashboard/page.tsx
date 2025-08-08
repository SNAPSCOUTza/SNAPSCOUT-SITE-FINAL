"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings, CreditCard, Eye, EyeOff, CheckCircle, XCircle, Crown, LogOut, Camera, Edit, Calendar, Upload, Globe, Instagram, Linkedin, Youtube, DollarSign, Shield, Bell, Trash2, Save, Star } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser, signOut, updatePassword, supabase } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { provinces, citiesByProvince } from "@/lib/locations"

interface UserProfile {
id: string
display_name: string | null
full_name: string | null
profile_picture: string | null
bio: string | null
phone_number: string | null
website_url: string | null
instagram_url: string | null
facebook_url: string | null
linkedin_url: string | null
youtube_vimeo: string | null
imdb_profile: string | null
province_country: string | null
city: string | null
location: string | null
department: string | null
profession: string | null
roles: string[] | null
availability: string | null
experience_level: string | null
years_experience: string | null
daily_rate: string | null
hourly_rate: string | null
project_rate: string | null
languages_spoken: string[] | null
services_offered: string[] | null
gear_owned: string[] | null
special_skills: string[] | null
rate_card_visible: boolean | null
contact_info_visible: boolean | null
is_profile_visible: boolean
profile_views: number | null
contact_clicks: number | null
booking_requests: number | null
favorite_count: number | null
portfolio_images: string[] | null
}

interface UserSubscription {
id: string
user_id: string
stripe_customer_id: string | null
stripe_subscription_id: string | null
stripe_price_id: string | null
stripe_current_period_end: string | null
status: string | null
}

export default function DashboardPage() {
const router = useRouter()
const [user, setUser] = useState<any>(null)
const [subscription, setSubscription] = useState<UserSubscription | null>(null)
const [profile, setProfile] = useState<UserProfile | null>(null)
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [passwordLoading, setPasswordLoading] = useState(false)
const [newPassword, setNewPassword] = useState("")
const [confirmPassword, setConfirmPassword] = useState("")
const [showPassword, setShowPassword] = useState(false)
const [passwordError, setPasswordError] = useState("")
const [passwordSuccess, setPasswordSuccess] = useState(false)
const [activeTab, setActiveTab] = useState("overview")
const [stats, setStats] = useState({
  profileViews: 0,
  contactClicks: 0,
  bookingRequests: 0,
  favoriteCount: 0,
})

const [profileData, setProfileData] = useState({
  display_name: "",
  full_name: "",
  bio: "",
  profile_picture: "",
  location: "",
  city: "",
  province: "",
  department: "",
  profession: "",
  roles: [] as string[],
  availability: "available",
  experience_level: "",
  years_experience: "",
  daily_rate: "",
  hourly_rate: "",
  project_rate: "",
  languages_spoken: [] as string[],
  services_offered: [] as string[],
  gear_owned: [] as string[],
  special_skills: [] as string[],
  instagram: "",
  linkedin: "",
  youtube_vimeo: "",
  website: "",
  imdb_profile: "",
  phone: "",
  facebook: "",
  youtube: "",
  rate_card_visible: true,
  contact_info_visible: true,
  is_profile_visible: false,
})

const [selectedProvince, setSelectedProvince] = useState<string>("")
const [selectedCity, setSelectedCity] = useState<string>("")

useEffect(() => {
  const checkUserAndSubscription = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)

    const { data: subData } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", currentUser.id)
      .single()

    setSubscription(subData)

    const { data: profileDataDB } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single()

    if (profileDataDB) {
      setProfile(profileDataDB)
      setProfileData({
        display_name: profileDataDB.display_name || "",
        full_name: profileDataDB.full_name || "",
        bio: profileDataDB.bio || "",
        profile_picture: profileDataDB.profile_picture || "",
        location: profileDataDB.location || "",
        city: profileDataDB.city || "",
        province: profileDataDB.province || "",
        department: profileDataDB.department || "",
        profession: profileDataDB.profession || "",
        roles: profileDataDB.roles || [],
        availability: profileDataDB.availability || "available",
        experience_level: profileDataDB.experience_level || "",
        years_experience: profileDataDB.years_experience || "",
        daily_rate: profileDataDB.daily_rate || "",
        hourly_rate: profileDataDB.hourly_rate || "",
        project_rate: profileDataDB.project_rate || "",
        languages_spoken: profileDataDB.languages_spoken || [],
        services_offered: profileDataDB.services_offered || [],
        gear_owned: profileDataDB.gear_owned || [],
        special_skills: profileDataDB.special_skills || [],
        instagram: profileDataDB.instagram_url || "",
        linkedin: profileDataDB.linkedin_url || "",
        youtube_vimeo: profileDataDB.youtube_vimeo || "",
        website: profileDataDB.website_url || "",
        imdb_profile: profileDataDB.imdb_profile || "",
        phone: profileDataDB.phone_number || "",
        facebook: profileDataDB.facebook_url || "",
        youtube: profileDataDB.youtube || "",
        rate_card_visible: profileDataDB.rate_card_visible ?? true,
        contact_info_visible: profileDataDB.contact_info_visible ?? true,
        is_profile_visible: profileDataDB.is_profile_visible ?? false,
      })

      setSelectedProvince(profileDataDB.province || "")
      setSelectedCity(profileDataDB.city || "")

      setStats({
        profileViews: profileDataDB.profile_views || 0,
        contactClicks: profileDataDB.contact_clicks || 0,
        bookingRequests: profileDataDB.booking_requests || 0,
        favoriteCount: profileDataDB.favorite_count || 0,
      })
    }

    setLoading(false)
  }

  checkUserAndSubscription()
}, [router])

const handleSignOut = async () => {
  await signOut()
  router.push("/")
}

const handleInputChange = (field: string, value: any) => {
  setProfileData((prev) => ({
    ...prev,
    [field]: value,
  }))
}

const handleSaveProfile = async () => {
  setSaving(true)
  try {
    const dataToSave = {
      id: user.id,
      display_name: profileData.display_name,
      full_name: profileData.full_name,
      bio: profileData.bio,
      profile_picture: profileData.profile_picture,
      location: profileData.location,
      city: selectedCity,
      province: selectedProvince,
      department: profileData.department,
      profession: profileData.profession,
      roles: profileData.roles,
      availability: profileData.availability,
      experience_level: profileData.experience_level,
      years_experience: profileData.years_experience,
      daily_rate: profileData.daily_rate,
      hourly_rate: profileData.hourly_rate,
      project_rate: profileData.project_rate,
      languages_spoken: profileData.languages_spoken,
      services_offered: profileData.services_offered,
      gear_owned: profileData.gear_owned,
      special_skills: profileData.special_skills,
      instagram_url: profileData.instagram,
      linkedin_url: profileData.linkedin,
      youtube_vimeo: profileData.youtube_vimeo,
      website_url: profileData.website,
      imdb_profile: profileData.imdb_profile,
      phone_number: profileData.phone,
      facebook_url: profileData.facebook,
      youtube: profileData.youtube,
      rate_card_visible: profileData.rate_card_visible,
      contact_info_visible: profileData.contact_info_visible,
      is_profile_visible: profileData.is_profile_visible,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("user_profiles").upsert(dataToSave, { onConflict: 'id' })

    if (error) {
      console.error("Error saving profile:", error)
      alert("Error saving profile: " + error.message)
    } else {
      const { data: updatedProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (updatedProfile) {
        setProfile(updatedProfile)
      }
      alert("Profile saved successfully!")
    }
  } catch (err) {
    console.error("Error saving profile:", err)
    alert("An unexpected error occurred while saving your profile.")
  } finally {
    setSaving(false)
  }
}

const handlePasswordUpdate = async (e: React.FormEvent) => {
  e.preventDefault()
  setPasswordError("")
  setPasswordSuccess(false)
  setPasswordLoading(true)

  if (newPassword !== confirmPassword) {
    setPasswordError("Passwords don't match")
    setPasswordLoading(false)
    return
  }

  if (newPassword.length < 6) {
    setPasswordError("Password must be at least 6 characters")
    setPasswordLoading(false)
    return
  }

  try {
    const { error } = await updatePassword(newPassword)

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setNewPassword("")
      setConfirmPassword("")
    }
  } catch (err) {
    setPasswordError("An unexpected error occurred")
  } finally {
    setPasswordLoading(false)
  }
}

const handleContactSupport = () => {
  window.location.href = "mailto:support@snapscout.com"
}

if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  )
}

const departmentOptions = [
  "Camera", "Audio", "Lighting", "Production", "Art", "Hair & Makeup", "Post Production", "Direction",
]

const professionOptions = [
  "Photographer", "Videographer", "Director", "Producer", "Editor", "Sound Engineer", "Lighting Technician", "Camera Operator", "Makeup Artist", "Art Director",
]

const experienceLevelOptions = ["Entry", "Mid", "Senior"]

const isSubscribed = subscription && subscription.status === "active"

return (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {!isSubscribed && (
        <div className="mb-6">
          <Alert className="border-amber-200 bg-amber-50">
            <Crown className="h-4 w-4 text-amber-600" />
            <AlertDescription className="flex items-center justify-between text-amber-800">
              <div>
                <p className="font-medium">Upgrade to Pro to make your profile visible to clients</p>
                <p className="text-sm mt-1">You can create and edit your profile, but it won't be discoverable until you subscribe.</p>
              </div>
              <Button
                onClick={() => (window.location.href = "https://buy.stripe.com/test_28o5lq0Hy9Hn6nS4gg")}
                size="sm"
                className="ml-4 bg-amber-600 hover:bg-amber-700"
              >
                <Crown className="h-4 w-4 mr-1" />
                Upgrade Now
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your SnapScout account, subscription, and professional profile</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs sm:text-sm">Portfolio</TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm">Social</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {!profile && (
              <Alert className="border-red-200 bg-red-50">
                <User className="h-4 w-4 text-red-600" />
                <AlertDescription className="flex items-center justify-between text-red-800">
                  <span>Complete your professional profile to get discovered by clients!</span>
                  <Button size="sm" className="ml-4 bg-red-700 hover:bg-red-800" onClick={() => setActiveTab("profile")}>
                    <Edit className="h-4 w-4 mr-1" />
                    Create Profile
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                    <p className="text-sm text-gray-600">Profile Views</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{stats.bookingRequests}</p>
                    <p className="text-sm text-gray-600">Bookings</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{stats.contactClicks}</p>
                    <p className="text-sm text-gray-600">Contacts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{stats.favoriteCount}</p>
                    <p className="text-sm text-gray-600">Favorites</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/find-crew"><Camera className="h-4 w-4 mr-2" />Browse Film Crew</Link>
                  </Button>
                  {profile ? (
                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                      <Link href={`/crew/${user.id}`}><User className="h-4 w-4 mr-2" />View My Profile</Link>
                    </Button>
                  ) : (
                    <Button className="w-full justify-start bg-red-700 hover:bg-red-800" onClick={() => setActiveTab("profile")}>
                      <Edit className="h-4 w-4 mr-2" />Create Profile
                    </Button>
                  )}
                  <Button onClick={handleContactSupport} variant="outline" className="w-full justify-start bg-transparent">
                    <CreditCard className="h-4 w-4 mr-2" />Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Crown className="h-5 w-5 mr-2 text-red-700" />Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubscribed ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <Badge className="bg-green-100 text-green-800 mb-2"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                      <p className="text-sm text-gray-600">Pro Crew Member</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">R60/month</p>
                      <p className="text-sm text-gray-600">Next billing: {subscription?.stripe_current_period_end ? new Date(subscription.stripe_current_period_end).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <Badge className="bg-gray-100 text-gray-800 mb-2"><XCircle className="h-3 w-3 mr-1" />Free Account</Badge>
                        <p className="text-sm text-gray-600">Profile not visible to clients</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-gray-500">R0/month</p>
                        <p className="text-sm text-gray-600">Limited features</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-3">Upgrade to Pro to:</p>
                      <ul className="text-sm text-gray-600 space-y-1 mb-4">
                        <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-600 mr-2" />Make your profile discoverable</li>
                        <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-600 mr-2" />Receive client inquiries</li>
                        <li className="flex items-center"><CheckCircle className="h-3 w-3 text-green-600 mr-2" />Access booking system</li>
                      </ul>
                      <Button onClick={() => (window.location.href = "https://buy.stripe.com/test_28o5lq0Hy9Hn6nS4gg")} className="w-full bg-red-700 hover:bg-red-800">
                        <Crown className="h-4 w-4 mr-2" />Upgrade to Pro - R60/month
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />Professional Profile
                    {!isSubscribed && <Badge className="ml-2 bg-amber-100 text-amber-800"><EyeOff className="h-3 w-3 mr-1" />Hidden</Badge>}
                  </CardTitle>
                  <CardDescription>{isSubscribed ? "Your public profile that clients can discover" : "Your profile is ready but not visible to clients until you upgrade"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profile.profile_picture || "/placeholder.svg"} alt={profile.display_name || "User"} />
                        <AvatarFallback>{profile.display_name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{profile.display_name}</p>
                        <p className="text-sm text-gray-600">{profile.roles?.join(" • ")}</p>
                        <p className="text-sm text-gray-500">{profile.city}, {profile.province_country}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button asChild variant="outline" className="bg-transparent"><Link href={`/crew/${user.id}`}><Eye className="h-4 w-4 mr-2" />Preview Profile</Link></Button>
                      <Button className="bg-red-700 hover:bg-red-800" onClick={() => setActiveTab("profile")}><Edit className="h-4 w-4 mr-2" />Edit Profile</Button>
                    </div>
                  </div>
                  {!isSubscribed && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800"><EyeOff className="h-4 w-4 inline mr-1" />Your profile is complete but not visible in search results. Upgrade to Pro to make it discoverable by clients.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your core professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_name">Display Name *</Label>
                    <Input id="display_name" value={profileData.display_name} onChange={(e) => handleInputChange("display_name", e.target.value)} placeholder="How you want to be known professionally" />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" value={profileData.full_name} onChange={(e) => handleInputChange("full_name", e.target.value)} placeholder="Your full legal name" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="profile_picture">Profile Picture URL</Label>
                  <Input id="profile_picture" value={profileData.profile_picture} onChange={(e) => handleInputChange("profile_picture", e.target.value)} placeholder="URL to your profile picture" />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={profileData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} placeholder="Tell clients about yourself, your style, and what makes you unique..." rows={4} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Select value={selectedProvince} onValueChange={(value) => {
                      setSelectedProvince(value);
                      setSelectedCity(""); // Reset city when province changes
                    }}>
                      <SelectTrigger id="province"><SelectValue placeholder="Select Province" /></SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (<SelectItem key={province} value={province}>{province}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedProvince}>
                      <SelectTrigger id="city"><SelectValue placeholder="Select City" /></SelectTrigger>
                      <SelectContent>
                        {citiesByProvince[selectedProvince]?.map((city) => (<SelectItem key={city} value={city}>{city}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={profileData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger id="department"><SelectValue placeholder="Select Department" /></SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Select value={profileData.profession} onValueChange={(value) => handleInputChange("profession", value)}>
                      <SelectTrigger id="profession"><SelectValue placeholder="Select Profession" /></SelectTrigger>
                      <SelectContent>
                        {professionOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="roles">Roles (comma-separated)</Label>
                  <Input id="roles" value={profileData.roles.join(", ")} onChange={(e) => handleInputChange("roles", e.target.value.split(", ").filter(Boolean))} placeholder="e.g., Photographer, Videographer, Editor" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="is_profile_visible" checked={profileData.is_profile_visible} onCheckedChange={(checked) => handleInputChange("is_profile_visible", checked)} disabled={!isSubscribed} />
                  <Label htmlFor="is_profile_visible">Make my profile visible to clients</Label>
                </div>
                {!isSubscribed && <p className="text-sm text-red-500">You need an active subscription to make your profile visible.</p>}
                <Button onClick={handleSaveProfile} className="bg-red-700 hover:bg-red-800" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Camera className="h-5 w-5 mr-2" />Portfolio Management</CardTitle>
                <CardDescription>Upload and manage your portfolio images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Drag and drop images here, or click to select files</p>
                  <Button variant="outline" className="bg-transparent"><Upload className="h-4 w-4 mr-2" />Choose Files</Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">Supported formats: JPG, PNG, GIF. Max file size: 10MB per image.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Current Portfolio</CardTitle>
                <CardDescription>Your uploaded portfolio images</CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.portfolio_images && profile.portfolio_images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {profile.portfolio_images.map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                          <Image src={image || "/placeholder.svg"} alt={`Portfolio ${index + 1}`} width={200} height={200} className="w-full h-full object-cover" />
                        </div>
                        <Button variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No portfolio images uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-2">Upload your best work to showcase your skills</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Globe className="h-5 w-5 mr-2" />Social Media & Portfolio Links</CardTitle>
                <CardDescription>Connect your social media profiles and portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"><Instagram className="h-4 w-4" /></span>
                    <Input id="instagram" value={profileData.instagram} onChange={(e) => handleInputChange("instagram", e.target.value)} placeholder="https://instagram.com/yourusername" className="rounded-l-none" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"><Linkedin className="h-4 w-4" /></span>
                    <Input id="linkedin" value={profileData.linkedin} onChange={(e) => handleInputChange("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourusername" className="rounded-l-none" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="youtube_vimeo">YouTube/Vimeo</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"><Youtube className="h-4 w-4" /></span>
                    <Input id="youtube_vimeo" value={profileData.youtube_vimeo} onChange={(e) => handleInputChange("youtube_vimeo", e.target.value)} placeholder="https://youtube.com/@yourusername" className="rounded-l-none" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"><Globe className="h-4 w-4" /></span>
                    <Input id="website" value={profileData.website} onChange={(e) => handleInputChange("website", e.target.value)} placeholder="https://yourwebsite.com" className="rounded-l-none" />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="bg-red-700 hover:bg-red-800" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Social Links"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><User className="h-5 w-5 mr-2" />Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Member Since</p>
                  <p className="text-sm text-gray-600">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Settings className="h-5 w-5 mr-2" />Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  {passwordError && <Alert variant="destructive"><AlertDescription>{passwordError}</AlertDescription></Alert>}
                  {passwordSuccess && <Alert><CheckCircle className="h-4 w-4" /><AlertDescription>Password updated successfully!</AlertDescription></Alert>}
                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <div className="relative">
                      <Input id="new_password" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input id="confirm_password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                  </div>
                  <Button type="submit" className="bg-red-700 hover:bg-red-800" disabled={passwordLoading}>{passwordLoading ? "Updating..." : "Update Password"}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CreditCard className="h-5 w-5 mr-2" />Subscription Details</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubscribed ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <div>
                        <Badge className="bg-green-100 text-green-800 mb-2"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                        <p className="text-lg font-semibold">Pro Crew Member</p>
                        <p className="text-sm text-gray-600">Full access to all features</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold">R60</p>
                        <p className="text-sm text-gray-600">per month</p>
                        <p className="text-sm text-gray-500">Next billing: {subscription?.stripe_current_period_end ? new Date(subscription.stripe_current_period_end).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="border-t pt-6 mt-6">
                      <Button onClick={handleContactSupport} variant="outline" className="w-full bg-transparent"><CreditCard className="h-4 w-4 mr-2" />Manage Billing & Payment</Button>
                      <p className="text-xs text-gray-500 text-center mt-2">Contact support to update payment methods or cancel subscription</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                    <p className="text-gray-600 mb-6">Upgrade to Pro to unlock all features and make your profile visible to clients.</p>
                    <Button onClick={() => (window.location.href = "https://buy.stripe.com/test_28o5lq0Hy9Hn6nS4gg")} className="bg-red-700 hover:bg-red-800">
                      <Crown className="h-4 w-4 mr-2" />Subscribe to Pro - R60/month
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
)
}
