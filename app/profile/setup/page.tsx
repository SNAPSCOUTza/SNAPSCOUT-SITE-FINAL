"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Camera, Globe, Save, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function ProfileSetupPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Profile form data
  const [profileData, setProfileData] = useState({
    // Basic Info
    full_name: "",
    display_name: "",
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

    // Professional Info
    bio: "",
    credits_highlights: [],
    gear_owned: [],
    special_skills: [],

    // Social & Portfolio Links
    instagram: "",
    linkedin: "",
    youtube_vimeo: "",
    website: "",
    imdb_profile: "",
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

      if (!subData || subData.status !== "active") {
        router.push("/subscribe")
        return
      }

      setSubscription(subData)

      // Load existing profile data if it exists
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .single()

      if (profileData) {
        setProfileData({
          full_name: profileData.full_name || "",
          display_name: profileData.display_name || "",
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
          bio: profileData.bio || "",
          credits_highlights: profileData.credits_highlights || [],
          gear_owned: profileData.gear_owned || [],
          special_skills: profileData.special_skills || [],
          instagram: profileData.instagram || "",
          linkedin: profileData.linkedin || "",
          youtube_vimeo: profileData.youtube_vimeo || "",
          website: profileData.website || "",
          imdb_profile: profileData.imdb_profile || "",
        })
      }

      setLoading(false)
    }

    checkUserAndSubscription()
  }, [router])

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/profile/${user.id}`)
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile setup...</p>
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
      <header className="bg-white border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <Image
              src="/images/snapscout-new-logo.jpeg"
              alt="SnapScout Logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <span className="text-xl font-bold text-gray-900">SnapScout</span>
              <p className="text-xs text-gray-500 -mt-1">Profile Setup</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Pro Member
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Professional Profile</h1>
            <p className="text-gray-600">
              Set up your profile to get discovered by clients. All fields help improve your visibility.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Profile saved successfully! Redirecting to your profile page...</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription>Your core professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <Input
                  value={profileData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Your full legal name"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  value={profileData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Country"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roles (comma-separated)</label>
                <Input
                  value={profileData.roles.join(", ")}
                  onChange={(e) => handleInputChange("roles", e.target.value.split(", ").filter(Boolean))}
                  placeholder="e.g., Photographer, Videographer, Editor"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages Spoken (comma-separated)
                </label>
                <Input
                  value={profileData.languages_spoken.join(", ")}
                  onChange={(e) => handleInputChange("languages_spoken", e.target.value.split(", ").filter(Boolean))}
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Professional Information
              </CardTitle>
              <CardDescription>Details about your skills and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell clients about yourself, your style, and what makes you unique..."
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits & Highlights (comma-separated)
                </label>
                <Textarea
                  value={profileData.credits_highlights.join(", ")}
                  onChange={(e) => handleInputChange("credits_highlights", e.target.value.split(", ").filter(Boolean))}
                  placeholder="List your notable projects and achievements"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gear Owned (comma-separated)</label>
                <Textarea
                  value={profileData.gear_owned.join(", ")}
                  onChange={(e) => handleInputChange("gear_owned", e.target.value.split(", ").filter(Boolean))}
                  placeholder="List your equipment"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Skills (comma-separated)</label>
                <Textarea
                  value={profileData.special_skills.join(", ")}
                  onChange={(e) => handleInputChange("special_skills", e.target.value.split(", ").filter(Boolean))}
                  placeholder="List your special skills"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social & Portfolio Links */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Social & Portfolio Links
              </CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                <Input
                  value={profileData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <Input
                  value={profileData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube/Vimeo</label>
                <Input
                  value={profileData.youtube_vimeo}
                  onChange={(e) => handleInputChange("youtube_vimeo", e.target.value)}
                  placeholder="https://youtube.com/@yourusername or https://vimeo.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <Input
                  value={profileData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IMDB Profile</label>
                <Input
                  value={profileData.imdb_profile}
                  onChange={(e) => handleInputChange("imdb_profile", e.target.value)}
                  placeholder="https://imdb.com/name/nm1234567/"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSaveProfile}
              className="bg-red-700 hover:bg-red-800 px-8 py-3 text-lg"
              disabled={saving || !profileData.full_name || !profileData.display_name}
            >
              <Save className="h-5 w-5 mr-2" />
              {saving ? "Saving Profile..." : "Save & Create Profile"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            * Required fields. Your profile will be live immediately after saving.
          </p>
        </div>
      </div>
    </div>
  )
}
