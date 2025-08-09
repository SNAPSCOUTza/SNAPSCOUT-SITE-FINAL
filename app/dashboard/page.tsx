"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  CheckCircle,
  LogOut,
  Upload,
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Save,
  Trash2,
  UserPlus,
  Info,
} from "lucide-react"

import { getCurrentUser, signOut, supabase } from "@/lib/auth"
import { useProfileStore } from "@/hooks/use-profile-store"
import { provinces, citiesByProvince } from "@/lib/locations"

// Interfaces (can be moved to a types file)
interface UserProfile {
  id?: string
  display_name: string
  full_name: string
  profile_picture: string
  bio: string
  province: string
  city: string
  department: string
  profession: string
  roles: string[]
  instagram_url: string
  linkedin_url: string
  youtube_vimeo: string
  website_url: string
  portfolio_images: string[]
  is_profile_visible?: boolean
  // Add other fields from original component if needed
}

interface UserSubscription {
  status: string | null
  stripe_current_period_end?: string | null
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
const professionOptions = [
  "Photographer",
  "Videographer",
  "Director",
  "Producer",
  "Editor",
  "Sound Engineer",
  "Lighting Technician",
  "Camera Operator",
  "Makeup Artist",
  "Art Director",
]

export default function UnifiedDashboardPage() {
  const router = useRouter()

  // Global state
  const {
    profile: demoProfile,
    setProfile: setDemoProfile,
    addPortfolioImage,
    removePortfolioImage,
  } = useProfileStore()

  // Component state
  const [user, setUser] = useState<any>(null)
  const [isDemo, setIsDemo] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [profileData, setProfileData] = useState<UserProfile>(demoProfile)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)

  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")

  // Password change state
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true)
      const currentUser = await getCurrentUser()

      if (currentUser) {
        // AUTHENTICATED MODE
        setIsDemo(false)
        setUser(currentUser)

        const { data: subData } = await supabase
          .from("user_subscriptions")
          .select("status, stripe_current_period_end")
          .eq("user_id", currentUser.id)
          .single()
        setSubscription(subData)

        const { data: profileDataDB } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        if (profileDataDB) {
          const dbProfile = {
            display_name: profileDataDB.display_name || "",
            full_name: profileDataDB.full_name || "",
            profile_picture: profileDataDB.profile_picture || "",
            bio: profileDataDB.bio || "",
            province: profileDataDB.province || "",
            city: profileDataDB.city || "",
            department: profileDataDB.department || "",
            profession: profileDataDB.profession || "",
            roles: profileDataDB.roles || [],
            instagram_url: profileDataDB.instagram_url || "",
            linkedin_url: profileDataDB.linkedin_url || "",
            youtube_vimeo: profileDataDB.youtube_vimeo || "",
            website_url: profileDataDB.website_url || "",
            portfolio_images: profileDataDB.portfolio_images || [],
            is_profile_visible: profileDataDB.is_profile_visible ?? false,
          }
          setProfileData(dbProfile)
          setSelectedProvince(dbProfile.province)
          setSelectedCity(dbProfile.city)
        }
      } else {
        // DEMO MODE
        setIsDemo(true)
        setProfileData(demoProfile)
        setSelectedProvince(demoProfile.province)
        setSelectedCity(demoProfile.city)
      }
      setLoading(false)
    }
    initializeDashboard()
  }, [demoProfile])

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    const updatedProfile = { ...profileData, [field]: value }
    setProfileData(updatedProfile)
    if (isDemo) {
      setDemoProfile({ [field]: value })
    }
  }

  const handleImageUpload = (file: File, field: "profile_picture" | "portfolio_images") => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      if (field === "profile_picture") {
        handleInputChange("profile_picture", base64)
      } else {
        const updatedImages = [...profileData.portfolio_images, base64]
        handleInputChange("portfolio_images", updatedImages)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    if (isDemo) {
      alert("Profile saved to browser! Sign up to publish it.")
      return
    }
    setSaving(true)
    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      ...profileData,
      province: selectedProvince,
      city: selectedCity,
      updated_at: new Date().toISOString(),
    })
    if (error) alert("Error saving profile: " + error.message)
    else alert("Profile saved successfully!")
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isDemo) return
    // ... (password update logic from original component)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    )
  }

  const isSubscribed = subscription?.status === "active"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {isDemo && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="font-bold text-blue-800">You are in Demo Mode</AlertTitle>
            <AlertDescription className="flex items-center justify-between text-blue-800">
              Your changes are saved in your browser. Sign up to save your profile and make it public!
              <Button asChild size="sm" className="ml-4 bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/signup">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up Now
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Professional Profile</h1>
            <p className="text-gray-600">Manage your SnapScout account, subscription, and profile.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
              <TabsTrigger value="settings" disabled={isDemo}>
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your core professional details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={profileData.profile_picture || "/placeholder.svg"}
                        alt={profileData.display_name}
                      />
                      <AvatarFallback>{profileData.display_name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="profile_picture_upload">Profile Picture</Label>
                      <Input
                        id="profile_picture_upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], "profile_picture")}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="display_name">Display Name *</Label>
                      <Input
                        id="display_name"
                        value={profileData.display_name}
                        onChange={(e) => handleInputChange("display_name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                    />
                  </div>
                  {/* Location, Department, etc. */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="province">Province</Label>
                      <Select
                        value={selectedProvince}
                        onValueChange={(value) => {
                          setSelectedProvince(value)
                          setSelectedCity("")
                          handleInputChange("province", value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={selectedCity}
                        onValueChange={(value) => {
                          setSelectedCity(value)
                          handleInputChange("city", value)
                        }}
                        disabled={!selectedProvince}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {citiesByProvince[selectedProvince]?.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select value={profileData.department} onValueChange={(v) => handleInputChange("department", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentOptions.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Select value={profileData.profession} onValueChange={(v) => handleInputChange("profession", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionOptions.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="roles">Roles (comma-separated)</Label>
                    <Input
                      id="roles"
                      value={profileData.roles.join(", ")}
                      onChange={(e) => handleInputChange("roles", e.target.value.split(/,\s*/).filter(Boolean))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="is_profile_visible"
                      checked={profileData.is_profile_visible}
                      onCheckedChange={(c) => handleInputChange("is_profile_visible", c)}
                      disabled={isDemo || !isSubscribed}
                    />
                    <Label htmlFor="is_profile_visible">Make my profile visible to clients</Label>
                  </div>
                  {(isDemo || !isSubscribed) && (
                    <p className="text-sm text-amber-600">
                      You need an active Pro subscription to make your profile visible.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Management</CardTitle>
                  <CardDescription>Showcase your best work. Drag and drop or select files to upload.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Label htmlFor="portfolio_upload" className="cursor-pointer">
                      <p className="text-gray-600 mb-4">Drag & drop images here, or click to select files</p>
                      <Button asChild variant="outline" className="bg-transparent pointer-events-none">
                        <span className="flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="portfolio_upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files &&
                        Array.from(e.target.files).forEach((f) => handleImageUpload(f, "portfolio_images"))
                      }
                    />
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Current Portfolio</h3>
                    {profileData.portfolio_images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {profileData.portfolio_images.map((image, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Portfolio ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover aspect-square rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                              onClick={() =>
                                handleInputChange(
                                  "portfolio_images",
                                  profileData.portfolio_images.filter((_, i) => i !== index),
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No images uploaded yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Links Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media & Links</CardTitle>
                  <CardDescription>Connect your online presence.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Instagram className="h-4 w-4" />
                      </span>
                      <Input
                        id="instagram"
                        value={profileData.instagram_url}
                        onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                        placeholder="https://instagram.com/yourusername"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Linkedin className="h-4 w-4" />
                      </span>
                      <Input
                        id="linkedin"
                        value={profileData.linkedin_url}
                        onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                        placeholder="https://linkedin.com/in/yourusername"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="youtube_vimeo">YouTube/Vimeo</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Youtube className="h-4 w-4" />
                      </span>
                      <Input
                        id="youtube_vimeo"
                        value={profileData.youtube_vimeo}
                        onChange={(e) => handleInputChange("youtube_vimeo", e.target.value)}
                        placeholder="https://youtube.com/@yourusername"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Website/Portfolio</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Globe className="h-4 w-4" />
                      </span>
                      <Input
                        id="website"
                        value={profileData.website_url}
                        onChange={(e) => handleInputChange("website_url", e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              {!isDemo && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Email:</strong> {user?.email}
                      </p>
                      <p>
                        <strong>Member Since:</strong>{" "}
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
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
                          <Label htmlFor="new_password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new_password"
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
                          <Label htmlFor="confirm_password">Confirm New Password</Label>
                          <Input
                            id="confirm_password"
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
                </>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons Footer */}
          <div className="mt-8 flex justify-between items-center">
            <div>
              <Button asChild variant="outline">
                <Link href={isDemo ? "/profile/preview" : `/crew/${user?.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Profile
                </Link>
              </Button>
            </div>
            <div className="flex gap-4">
              {!isDemo && (
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}
              <Button onClick={handleSaveProfile} className="bg-red-700 hover:bg-red-800" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {isDemo ? "Save to Browser" : saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
