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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings, CreditCard, Eye, EyeOff, CheckCircle, XCircle, Crown, LogOut, Camera, Edit, Calendar, Upload, Globe, Instagram, Linkedin, Youtube, DollarSign, Shield, Bell, Trash2, Save, Star, BarChart3 } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser, signOut, updatePassword, supabase } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { provinces, citiesByProvince } from "@/lib/locations"
import type { UserProfile, UserSubscription } from "@/lib/supabase/types"

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

  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    display_name: "",
    full_name: "",
    bio: "",
    profile_picture: "",
    provinces: "",
    cities: "",
    location: "",
    department: "",
    profession: "",
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
    software_skills: [],
    technical_skills: [],
    photography_skills: [],
    videography_skills: [],
    instagram: "",
    linkedin: "",
    youtube: "",
    website: "",
    imdb_profile: "",
    phone: "",
    facebook: "",
    rate_card_visible: true,
    contact_info_visible: true,
    is_profile_visible: false,
    portfolio_images: [],
  })

  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])

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
        .eq("user_id", currentUser.id)
        .single()

      if (profileDataDB) {
        setProfile(profileDataDB)
        setProfileData(profileDataDB) // Directly set the fetched data
        
        // Populate multi-select states
        setSelectedProvinces(profileDataDB.provinces?.split(',').map((p: string) => p.trim()).filter(Boolean) || [])
        setSelectedCities(profileDataDB.cities?.split(',').map((c: string) => c.trim()).filter(Boolean) || [])

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

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true)
    try {
      // Construct the location string to prevent null errors
      const locationString = selectedCities.length > 0 
        ? `${selectedCities[0]}, ${selectedProvinces[0]}` 
        : selectedProvinces.length > 0 
        ? selectedProvinces[0] 
        : "South Africa"; // Fallback location

      const dataToSave: Partial<UserProfile> = {
        ...profileData,
        user_id: user.id,
        provinces: selectedProvinces.join(', '),
        cities: selectedCities.join(', '),
        location: locationString,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("user_profiles").upsert(dataToSave, { onConflict: 'user_id' })

      if (error) {
        console.error("Error saving profile:", error)
        alert("Error saving profile: " + error.message)
      } else {
        const { data: updatedProfile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
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

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      alert('Could not manage billing at this time. Please try again later.');
    }
  };

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

  const departmentOptions = ["Camera", "Audio", "Lighting", "Production", "Art", "Hair & Makeup", "Post Production", "Direction"]
  const professionOptions = ["Photographer", "Videographer", "Director", "Producer", "Editor", "Sound Engineer", "Lighting Technician", "Camera Operator", "Makeup Artist", "Art Director"]
  const experienceLevelOptions = ["Entry", "Mid", "Senior", "Expert"]
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
                <Button onClick={() => (window.location.href = "https://buy.stripe.com/test_28o5lq0Hy9Hn6nS4gg")} size="sm" className="ml-4 bg-amber-600 hover:bg-amber-700">
                  <Crown className="h-4 w-4 mr-1" /> Upgrade Now
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Manage your SnapScout account, subscription, and professional profile</p>
            </div>
            <Button onClick={handleSaveProfile} className="bg-red-700 hover:bg-red-800" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save All Changes"}
            </Button>
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
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back, {profileData.display_name || user?.email}!</CardTitle>
                  <CardDescription>Here's a quick look at your profile's performance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <Eye className="mx-auto h-6 w-6 text-red-700 mb-2" />
                      <p className="text-2xl font-bold">{stats.profileViews}</p>
                      <p className="text-sm text-gray-600">Profile Views</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <User className="mx-auto h-6 w-6 text-red-700 mb-2" />
                      <p className="text-2xl font-bold">{stats.contactClicks}</p>
                      <p className="text-sm text-gray-600">Contact Clicks</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <Calendar className="mx-auto h-6 w-6 text-red-700 mb-2" />
                      <p className="text-2xl font-bold">{stats.bookingRequests}</p>
                      <p className="text-sm text-gray-600">Booking Requests</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <Star className="mx-auto h-6 w-6 text-red-700 mb-2" />
                      <p className="text-2xl font-bold">{stats.favoriteCount}</p>
                      <p className="text-sm text-gray-600">Favorites</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button variant="outline" onClick={() => setActiveTab('profile')}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('portfolio')}>
                    <Camera className="h-4 w-4 mr-2" /> Manage Portfolio
                  </Button>
                  <Link href={`/crew/${user?.id}`} passHref>
                    <Button variant="outline" asChild>
                      <a><Eye className="h-4 w-4 mr-2" /> View Public Profile</a>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your core professional details. This information will be public on your profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="display_name">Display Name *</Label>
                      <Input id="display_name" value={profileData.display_name || ''} onChange={(e) => handleInputChange("display_name", e.target.value)} placeholder="How you want to be known professionally" />
                    </div>
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input id="full_name" value={profileData.full_name || ''} onChange={(e) => handleInputChange("full_name", e.target.value)} placeholder="Your full legal name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="profile_picture">Profile Picture URL</Label>
                    <Input id="profile_picture" value={profileData.profile_picture || ''} onChange={(e) => handleInputChange("profile_picture", e.target.value)} placeholder="URL to your profile picture" />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={profileData.bio || ''} onChange={(e) => handleInputChange("bio", e.target.value)} placeholder="Tell clients about yourself..." rows={4} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select value={selectedProvinces[0] || ""} onValueChange={(value) => {
                        setSelectedProvinces([value]);
                        setSelectedCities([]);
                      }}>
                        <SelectTrigger id="province"><SelectValue placeholder="Select Province" /></SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (<SelectItem key={province} value={province}>{province}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Select value={selectedCities[0] || ""} onValueChange={(value) => setSelectedCities([value])} disabled={!selectedProvinces[0]}>
                        <SelectTrigger id="city"><SelectValue placeholder="Select City" /></SelectTrigger>
                        <SelectContent>
                          {citiesByProvince[selectedProvinces[0]]?.map((city) => (<SelectItem key={city} value={city}>{city}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>Help clients understand your expertise.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select value={profileData.department || ''} onValueChange={(value) => handleInputChange("department", value)}>
                        <SelectTrigger id="department"><SelectValue placeholder="Select Department" /></SelectTrigger>
                        <SelectContent>{departmentOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Select value={profileData.profession || ''} onValueChange={(value) => handleInputChange("profession", value)}>
                        <SelectTrigger id="profession"><SelectValue placeholder="Select Profession" /></SelectTrigger>
                        <SelectContent>{professionOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="roles">Roles (comma-separated)</Label>
                    <Input id="roles" value={(profileData.roles || []).join(", ")} onChange={(e) => handleInputChange("roles", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="e.g., Photographer, Videographer" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_level">Experience Level</Label>
                      <Select value={profileData.experience_level || ''} onValueChange={(value) => handleInputChange("experience_level", value)}>
                        <SelectTrigger id="experience_level"><SelectValue placeholder="Select Experience Level" /></SelectTrigger>
                        <SelectContent>{experienceLevelOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="years_experience">Years of Experience</Label>
                      <Input id="years_experience" type="number" value={profileData.years_experience || ''} onChange={(e) => handleInputChange("years_experience", e.target.value)} placeholder="e.g., 5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Management</CardTitle>
                  <CardDescription>Showcase your best work. Add URLs to your images.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(profileData.portfolio_images || []).map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={url} 
                        onChange={(e) => {
                          const newImages = [...(profileData.portfolio_images || [])];
                          newImages[index] = e.target.value;
                          handleInputChange("portfolio_images", newImages);
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button variant="ghost" size="icon" onClick={() => {
                        const newImages = (profileData.portfolio_images || []).filter((_, i) => i !== index);
                        handleInputChange("portfolio_images", newImages);
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => handleInputChange("portfolio_images", [...(profileData.portfolio_images || []), ""])}>
                    <Upload className="h-4 w-4 mr-2" /> Add Image URL
                  </Button>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {(profileData.portfolio_images || []).filter(Boolean).map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image src={url || "/placeholder.svg"} alt={`Portfolio image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social & Professional Links</CardTitle>
                  <CardDescription>Connect your other platforms to build trust and showcase more of your work.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label htmlFor="website">Website</Label><Input id="website" value={profileData.website || ''} onChange={(e) => handleInputChange("website", e.target.value)} placeholder="https://your-portfolio.com" /></div>
                    <div><Label htmlFor="instagram">Instagram</Label><Input id="instagram" value={profileData.instagram || ''} onChange={(e) => handleInputChange("instagram", e.target.value)} placeholder="https://instagram.com/username" /></div>
                    <div><Label htmlFor="linkedin">LinkedIn</Label><Input id="linkedin" value={profileData.linkedin || ''} onChange={(e) => handleInputChange("linkedin", e.target.value)} placeholder="https://linkedin.com/in/username" /></div>
                    <div><Label htmlFor="youtube">YouTube</Label><Input id="youtube" value={profileData.youtube || ''} onChange={(e) => handleInputChange("youtube", e.target.value)} placeholder="https://youtube.com/c/channel" /></div>
                    <div><Label htmlFor="facebook">Facebook</Label><Input id="facebook" value={profileData.facebook || ''} onChange={(e) => handleInputChange("facebook", e.target.value)} placeholder="https://facebook.com/username" /></div>
                    <div><Label htmlFor="imdb_profile">IMDb Profile</Label><Input id="imdb_profile" value={profileData.imdb_profile || ''} onChange={(e) => handleInputChange("imdb_profile", e.target.value)} placeholder="https://imdb.com/name/nm..." /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Visibility</CardTitle>
                  <CardDescription>Control who can see your profile and contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-md border">
                    <div>
                      <Label htmlFor="is_profile_visible">Profile Visibility</Label>
                      <p className="text-sm text-gray-500">Allow your profile to be discovered by clients.</p>
                    </div>
                    <Switch id="is_profile_visible" checked={profileData.is_profile_visible} onCheckedChange={(checked) => handleInputChange("is_profile_visible", !!checked)} disabled={!isSubscribed} />
                  </div>
                  {!isSubscribed && <p className="text-sm text-red-500">You need an active subscription to make your profile visible.</p>}
                  <div className="flex items-center justify-between p-3 rounded-md border">
                    <div>
                      <Label htmlFor="contact_info_visible">Contact Info Visibility</Label>
                      <p className="text-sm text-gray-500">Show your phone number and email on your profile.</p>
                    </div>
                    <Switch id="contact_info_visible" checked={profileData.contact_info_visible ?? true} onCheckedChange={(checked) => handleInputChange("contact_info_visible", !!checked)} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md border">
                    <div>
                      <Label htmlFor="rate_card_visible">Rate Card Visibility</Label>
                      <p className="text-sm text-gray-500">Show your rates on your profile.</p>
                    </div>
                    <Switch id="rate_card_visible" checked={profileData.rate_card_visible ?? true} onCheckedChange={(checked) => handleInputChange("rate_card_visible", !!checked)} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account credentials and actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="relative">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input id="new_password" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
                      <Button type="button" variant="ghost" size="icon" className="absolute bottom-1 right-1 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input id="confirm_password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                    </div>
                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                    {passwordSuccess && <p className="text-sm text-green-500">Password updated successfully!</p>}
                    <Button type="submit" disabled={passwordLoading}>{passwordLoading ? "Updating..." : "Update Password"}</Button>
                  </form>
                  <div className="pt-4 border-t">
                    <Button variant="destructive" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" /> Sign Out</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>Manage your subscription plan and billing information.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubscribed ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <p className="font-semibold text-green-800">Pro Plan Active</p>
                          <p className="text-sm text-green-600">Your subscription renews on {subscription?.stripe_current_period_end ? new Date(subscription.stripe_current_period_end).toLocaleDateString() : ''}.</p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <Button onClick={handleManageBilling}>
                        <CreditCard className="h-4 w-4 mr-2" /> Manage Billing
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-100 border rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">No Active Subscription</p>
                          <p className="text-sm text-gray-600">Upgrade to a Pro plan to unlock all features.</p>
                        </div>
                        <XCircle className="h-6 w-6 text-gray-500" />
                      </div>
                      <Button onClick={() => (window.location.href = "https://buy.stripe.com/test_28o5lq0Hy9Hn6nS4gg")} className="bg-red-700 hover:bg-red-800">
                        <Crown className="h-4 w-4 mr-2" /> Upgrade to Pro
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={handleContactSupport}>Contact Support</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
