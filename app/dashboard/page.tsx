"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
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

      // Check if user has a profile
      if (subData && subData.status === "active") {
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", currentUser.id)
          .single()

        setProfile(profileData)
      }

      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
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
              onClick={() =>
                alert("Subscription is required. Stripe SDK has been removed, so direct payment link is unavailable.")
              }
              size="lg"
              className="bg-red-700 hover:bg-red-800"
              disabled
            >
              Subscribe Now - R60/month (Disabled)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <div>
              <span className="text-xl font-bold text-gray-900">SnapScout</span>
              <p className="text-xs text-gray-500 -mt-1">Dashboard</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/find-crew" className="text-red-700 hover:text-red-800 flex items-center">
              <Camera className="h-4 w-4 mr-1" />
              Find Crew
            </Link>
            {profile && (
              <Link href={`/profile/${user.id}`} className="text-red-700 hover:text-red-800 flex items-center">
                <User className="h-4 w-4 mr-1" />
                My Profile
              </Link>
            )}
            <Button onClick={handleSignOut} variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your SnapScout account, subscription, and professional profile</p>
          </div>

          {/* Profile Setup Alert */}
          {!profile && (
            <Alert className="mb-6">
              <User className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Complete your professional profile to get discovered by clients!</span>
                <Button asChild size="sm" className="ml-4">
                  <Link href="/profile/setup">
                    <Edit className="h-4 w-4 mr-1" />
                    Create Profile
                  </Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subscription Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-red-700" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge className="bg-green-100 text-green-800 mb-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                      <p className="text-sm text-gray-600">Pro Crew Member</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R60/month</p>
                      <p className="text-sm text-gray-600">
                        Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => alert("Billing management is not available as Stripe SDK has been removed.")}
                    variant="outline"
                    className="w-full bg-transparent"
                    disabled
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Billing (Disabled)
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Professional Profile
                  </CardTitle>
                  <CardDescription>Your public profile that clients can discover</CardDescription>
                </CardHeader>
                <CardContent>
                  {profile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{profile.display_name}</p>
                          <p className="text-sm text-gray-600">{profile.profession}</p>
                          <p className="text-sm text-gray-500">{profile.location}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      </div>
                      <div className="flex space-x-3">
                        <Button asChild variant="outline" className="flex-1 bg-transparent">
                          <Link href={`/profile/${user.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                        <Button asChild className="flex-1 bg-red-700 hover:bg-red-800">
                          <Link href="/profile/setup">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">You haven't created your professional profile yet</p>
                      <Button asChild className="bg-red-700 hover:bg-red-800">
                        <Link href="/profile/setup">
                          <Edit className="h-4 w-4 mr-2" />
                          Create Profile Now
                        </Link>
                      </Button>
                    </div>
                  )}
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Account Info
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
                      <Link href={`/profile/${user.id}`}>
                        <User className="h-4 w-4 mr-2" />
                        View My Profile
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full justify-start bg-red-700 hover:bg-red-800">
                      <Link href="/profile/setup">
                        <Edit className="h-4 w-4 mr-2" />
                        Create Profile
                      </Link>
                    </Button>
                  )}
                  <Button
                    onClick={() => alert("Billing portal is not available as Stripe SDK has been removed.")}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    disabled
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing Portal (Disabled)
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Stats */}
              {profile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Views</span>
                      <span className="font-semibold">{profile.profile_views || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Status</span>
                      <Badge
                        className={`text-xs ${
                          profile.availability === "available"
                            ? "bg-green-100 text-green-800"
                            : profile.availability === "busy"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {profile.availability === "available"
                          ? "Available"
                          : profile.availability === "busy"
                            ? "Busy"
                            : "Fully Booked"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Skills Listed</span>
                      <span className="font-semibold">{profile.skills?.length || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
