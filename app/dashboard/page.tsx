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
import {
  User,
  Settings,
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Crown,
  LogOut,
  Camera,
  Edit,
  Calendar,
  Upload,
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  DollarSign,
  Shield,
  Bell,
  Trash2,
  Save,
  Star,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser, signOut, updatePassword } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
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
  const router = useRouter()

  // Profile form data
  const [profileData, setProfileData] = useState({
    display_name: "",
    bio: "",
    profile_picture: "",
    location: "",
    city: "",
    province_country: "",
    department: "",
    roles: [],
    availability_status: "available",
    experience_level: "",
    years_experience: "",
    daily_rate: "",
    hourly_rate: "",
    project_rate: "",
    languages_spoken: [],
    services_offered: [],
    gear_owned: [],
    special_skills: [],
    instagram: "",
    linkedin: "",
    youtube_vimeo: "",
    website: "",
    imdb_profile: "",
    rate_card_visible: true,
    contact_info_visible: true,
  })

  useEffect(() => {
    const checkUserAndSubscription = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      setUser(currentUser)

      // Check subscription status
      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", currentUser.id)
        .single()

      setSubscription(subData)

      // Load existing profile data if it exists
      if (subData && subData.status === "active") {
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", currentUser.id)
          .single()

        if (profileData) {
          setProfile(profileData)
          setProfileData({
            display_name: profileData.display_name || "",
            bio: profileData.bio || "",
            profile_picture: profileData.profile_picture || "",
            location: profileData.location || "",
            city: profileData.city || "",
            province_country: profileData.province_country || "",
            department: profileData.department || "",
            roles: profileData.roles || [],
            availability_status: profileData.availability_status || "available",
            experience_level: profileData.experience_level || "",
            years_experience: profileData.years_experience || "",
            daily_rate: profileData.daily_rate || "",
            hourly_rate: profileData.hourly_rate || "",
            project_rate: profileData.project_rate || "",
            languages_spoken: profileData.languages_spoken || [],
            services_offered: profileData.services_offered || [],
            gear_owned: profileData.gear_owned || [],
            special_skills: profileData.special_skills || [],
            instagram: profileData.instagram || "",
            linkedin: profileData.linkedin || "",
            youtube_vimeo: profileData.youtube_vimeo || "",
            website: profileData.website || "",
            imdb_profile: profileData.imdb_profile || "",
            rate_card_visible: profileData.rate_card_visible ?? true,
            contact_info_visible: profileData.contact_info_visible ?? true,
          })

          // Load stats
          setStats({
            profileViews: profileData.profile_views || 0,
            contactClicks: profileData.contact_clicks || 0,
            bookingRequests: profileData.booking_requests || 0,
            favoriteCount: profileData.favorite_count || 0,
          })
        }
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
      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving profile:", error)
      } else {
        // Refresh profile data
        const { data: updatedProfile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (updatedProfile) {
          setProfile(updatedProfile)
        }
      }
    } catch (err) {
      console.error("Error saving profile:", err)
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

  // If user doesn't have active subscription, redirect to subscribe page
  if (!subscription || subscription.status !== "active") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/snapscout-new-logo.jpeg"
                alt="SnapScout Logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full"
              />
              <span className="text-xl font-bold text-gray-900">SnapScout</span>
            </Link>
            <Button onClick={handleSignOut} variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Crown className="h-16 w-16 text-red-700 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to Create Your Professional Profile</h1>
            <p className="text-lg text-gray-600 mb-8">
              You need an active Pro Crew Member subscription to create your professional profile and get discovered by
              clients.
            </p>
            <Button
              onClick={() => (window.location.href = "https://buy.stripe.com/test_28o5lq0Hy9Hn6nS4gg")}
              size="lg"
              className="bg-red-700 hover:bg-red-800"
            >
              Subscribe Now - R60/month
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const departmentOptions = [
    "Camera",
    "Audio",
    "Lighting",
    "Production",
    "Art",
    "Hair & Makeup",
    "Post Production",
    "Direction",
  ]
  const experienceLevelOptions = ["Entry", "Mid", "Senior"]

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
              <p className="text-xs text-gray-500 -mt-1">Dashboard</p>
            </div>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/find-crew" className="text-red-700 hover:text-red-800 flex items-center text-sm">
              <Camera className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Find Crew</span>
            </Link>
            {profile && (
              <Link href={`/crew/${user.id}`} className="text-red-700 hover:text-red-800 flex items-center text-sm">
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">My Profile</span>
              </Link>
            )}
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your SnapScout account, subscription, and professional profile</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm">
                Profile
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="text-xs sm:text-sm">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs sm:text-sm">
                Social
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                Settings
              </TabsTrigger>
              <TabsTrigger value="billing" className="text-xs sm:text-sm">
                Billing
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Profile Setup Alert */}
              {!profile && (
                <Alert className="border-red-200 bg-red-50">
                  <User className="h-4 w-4 text-red-600" />
                  <AlertDescription className="flex items-center justify-between text-red-800">
                    <span>Complete your professional profile to get discovered by clients!</span>
                    <Button
                      size="sm"
                      className="ml-4 bg-red-700 hover:bg-red-800"
                      onClick={() => setActiveTab("profile")}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Create Profile
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
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

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                      <Link href="/find-crew">
                        <Camera className="h-4 w-4 mr-2" />
                        Browse Film Crew
                      </Link>
                    </Button>
                    {profile ? (
                      <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                        <Link href={`/crew/${user.id}`}>
                          <User className="h-4 w-4 mr-2" />
                          View My Profile
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        className="w-full justify-start bg-red-700 hover:bg-red-800"
                        onClick={() => setActiveTab("profile")}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Create Profile
                      </Button>
                    )}
                    <Button
                      onClick={handleContactSupport}
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-red-700" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <Badge className="bg-green-100 text-green-800 mb-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                      <p className="text-sm text-gray-600">Pro Crew Member</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">R60/month</p>
                      <p className="text-sm text-gray-600">
                        Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Status */}
              {profile && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Professional Profile
                    </CardTitle>
                    <CardDescription>Your public profile that clients can discover</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile.profile_picture || "/placeholder.svg"} alt={profile.display_name} />
                          <AvatarFallback>{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{profile.display_name}</p>
                          <p className="text-sm text-gray-600">{profile.roles?.join(" • ")}</p>
                          <p className="text-sm text-gray-500">
                            {profile.city}, {profile.province_country}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button asChild variant="outline" className="bg-transparent">
                          <Link href={`/crew/${user.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                        <Button className="bg-red-700 hover:bg-red-800" onClick={() => setActiveTab("profile")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your core professional details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
                      <Input
                        value={profileData.display_name}
                        onChange={(e) => handleInputChange("display_name", e.target.value)}
                        placeholder="How you want to be known professionally"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                      <Input
                        value={profileData.profile_picture}
                        onChange={(e) => handleInputChange("profile_picture", e.target.value)}
                        placeholder="URL to your profile picture"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell clients about yourself, your style, and what makes you unique..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <Input
                        value={profileData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province/Country</label>
                      <Input
                        value={profileData.province_country}
                        onChange={(e) => handleInputChange("province_country", e.target.value)}
                        placeholder="Province/Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        value={profileData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                      >
                        <option value="">Select Department</option>
                        {departmentOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roles (comma-separated)</label>
                      <Input
                        value={profileData.roles.join(", ")}
                        onChange={(e) => handleInputChange("roles", e.target.value.split(", ").filter(Boolean))}
                        placeholder="e.g., Photographer, Videographer, Editor"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                      <select
                        value={profileData.experience_level}
                        onChange={(e) => handleInputChange("experience_level", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                      >
                        <option value="">Select Experience Level</option>
                        {experienceLevelOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                      <Input
                        value={profileData.years_experience}
                        onChange={(e) => handleInputChange("years_experience", e.target.value)}
                        placeholder="e.g., 5"
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                      <select
                        value={profileData.availability_status}
                        onChange={(e) => handleInputChange("availability_status", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="booked">Fully Booked</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Services Offered (comma-separated)
                    </label>
                    <Textarea
                      value={profileData.services_offered.join(", ")}
                      onChange={(e) =>
                        handleInputChange("services_offered", e.target.value.split(", ").filter(Boolean))
                      }
                      placeholder="e.g., Wedding Photography, Corporate Videos, Portrait Sessions"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Languages Spoken (comma-separated)
                      </label>
                      <Input
                        value={profileData.languages_spoken.join(", ")}
                        onChange={(e) =>
                          handleInputChange("languages_spoken", e.target.value.split(", ").filter(Boolean))
                        }
                        placeholder="e.g., English, Spanish, French"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Skills (comma-separated)
                      </label>
                      <Input
                        value={profileData.special_skills.join(", ")}
                        onChange={(e) =>
                          handleInputChange("special_skills", e.target.value.split(", ").filter(Boolean))
                        }
                        placeholder="e.g., Drone Operation, Color Grading"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gear Owned (comma-separated)</label>
                    <Textarea
                      value={profileData.gear_owned.join(", ")}
                      onChange={(e) => handleInputChange("gear_owned", e.target.value.split(", ").filter(Boolean))}
                      placeholder="List your equipment"
                      rows={2}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} className="bg-red-700 hover:bg-red-800" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                </CardContent>
              </Card>

              {/* Rate Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Rate Card
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Visible to clients</label>
                      <Switch
                        checked={profileData.rate_card_visible}
                        onCheckedChange={(checked) => handleInputChange("rate_card_visible", checked)}
                      />
                    </div>
                  </CardTitle>
                  <CardDescription>Set your rates for different types of work</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate</label>
                      <Input
                        value={profileData.daily_rate}
                        onChange={(e) => handleInputChange("daily_rate", e.target.value)}
                        placeholder="e.g., $500/day"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                      <Input
                        value={profileData.hourly_rate}
                        onChange={(e) => handleInputChange("hourly_rate", e.target.value)}
                        placeholder="e.g., $50/hour"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Rate</label>
                      <Input
                        value={profileData.project_rate}
                        onChange={(e) => handleInputChange("project_rate", e.target.value)}
                        placeholder="e.g., $5000/project"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} className="bg-red-700 hover:bg-red-800" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Rate Card"}
                  </Button>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>Control what information is visible to clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Contact Information</p>
                      <p className="text-sm text-gray-600">Show contact details to potential clients</p>
                    </div>
                    <Switch
                      checked={profileData.contact_info_visible}
                      onCheckedChange={(checked) => handleInputChange("contact_info_visible", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rate Card</p>
                      <p className="text-sm text-gray-600">Display your rates publicly</p>
                    </div>
                    <Switch
                      checked={profileData.rate_card_visible}
                      onCheckedChange={(checked) => handleInputChange("rate_card_visible", checked)}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="bg-red-700 hover:bg-red-800" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Privacy Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Portfolio Management
                  </CardTitle>
                  <CardDescription>Upload and manage your portfolio images</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Drag and drop images here, or click to select files</p>
                    <Button variant="outline" className="bg-transparent">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Supported formats: JPG, PNG, GIF. Max file size: 10MB per image.
                  </p>
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
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Portfolio ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Social Media & Portfolio Links
                  </CardTitle>
                  <CardDescription>Connect your social media profiles and portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Instagram className="h-4 w-4" />
                      </span>
                      <Input
                        value={profileData.instagram}
                        onChange={(e) => handleInputChange("instagram", e.target.value)}
                        placeholder="https://instagram.com/yourusername"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Linkedin className="h-4 w-4" />
                      </span>
                      <Input
                        value={profileData.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        placeholder="https://linkedin.com/in/yourusername"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube/Vimeo</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Youtube className="h-4 w-4" />
                      </span>
                      <Input
                        value={profileData.youtube_vimeo}
                        onChange={(e) => handleInputChange("youtube_vimeo", e.target.value)}
                        placeholder="https://youtube.com/@yourusername"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website/Portfolio</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Globe className="h-4 w-4" />
                      </span>
                      <Input
                        value={profileData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IMDB Profile</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Star className="h-4 w-4" />
                      </span>
                      <Input
                        value={profileData.imdb_profile}
                        onChange={(e) => handleInputChange("imdb_profile", e.target.value)}
                        placeholder="https://imdb.com/name/nm1234567/"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} className="bg-red-700 hover:bg-red-800" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Social Links"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Member Since</p>
                    <p className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Verified</p>
                    <div className="flex items-center">
                      {user.email_confirmed_at ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className="text-sm text-gray-600">
                        {user.email_confirmed_at ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    {passwordError && (
                      <Alert variant="destructive">
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}

                    {passwordSuccess && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>Password updated successfully!</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">New Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <Button type="submit" className="bg-red-700 hover:bg-red-800" disabled={passwordLoading}>
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Manage your email notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Views</p>
                      <p className="text-sm text-gray-600">Get notified when someone views your profile</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Messages</p>
                      <p className="text-sm text-gray-600">Get notified when you receive new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Booking Requests</p>
                      <p className="text-sm text-gray-600">Get notified about new booking requests</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-600">Receive updates about new features and tips</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <Badge className="bg-green-100 text-green-800 mb-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                      <p className="text-lg font-semibold">Pro Crew Member</p>
                      <p className="text-sm text-gray-600">Full access to all features</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold">R60</p>
                      <p className="text-sm text-gray-600">per month</p>
                      <p className="text-sm text-gray-500">
                        Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">What's included:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Professional profile page
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Portfolio showcase
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Instagram feed integration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Client messaging system
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Booking management
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Analytics and insights
                      </li>
                    </ul>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <Button onClick={handleContactSupport} variant="outline" className="w-full bg-transparent">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Billing & Payment
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Contact support to update payment methods or cancel subscription
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Your recent payments and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">Pro Crew Member</p>
                        <p className="text-sm text-gray-600">
                          {new Date(subscription.current_period_start).toLocaleDateString()} -{" "}
                          {new Date(subscription.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R60.00</p>
                        <Badge className="bg-green-100 text-green-800 text-xs">Paid</Badge>
                      </div>
                    </div>
                    <div className="text-center py-8">
                      <p className="text-gray-500">No additional billing history available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
