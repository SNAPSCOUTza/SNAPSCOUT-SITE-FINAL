"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Crown, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

// Using your actual Stripe product ID
const STRIPE_PRODUCT_ID = "prod_Sgth8qTGYJJojz"

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
      } else {
        setUser(currentUser)
      }
    }
    checkUser()
  }, [router])

  const handleSubscribe = async () => {
    // Redirect to signup instead of Stripe
    router.push("/auth/signup")
  }

  if (!user) {
    return <div>Loading...</div>
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
              <p className="text-xs text-gray-500 -mt-1">Your Local Companion</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <Link href="/dashboard" className="text-red-700 hover:text-red-800">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Crown className="h-16 w-16 text-red-700 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Unlock Your Professional Profile</h1>
              <p className="text-lg text-gray-600">
                Get discovered by clients with your own professional profile page showcasing your work, social media,
                and expertise
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-8">
              <Lock className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Active subscription required to create and display your professional profile
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-red-200 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-red-700 text-white">Pro Crew Member</Badge>
              </div>

              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl">Monthly Subscription</CardTitle>
                <CardDescription>Get your professional profile page and get discovered</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R60</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Product ID: {STRIPE_PRODUCT_ID}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Professional profile page (yourname.snapscout.com)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Showcase your portfolio and work samples</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Link all your social media profiles</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Get discovered by clients searching for talent</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Direct client contact and messaging</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Analytics on profile views and engagement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Priority support and profile optimization</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-red-700 hover:bg-red-800 text-lg py-6"
                  disabled={loading}
                >
                  Coming Soon
                  {/* {loading ? "Subscribe Now" : "Create My Profile - R60/month"}
                  <ArrowRight className="ml-2 h-5 w-5" /> */}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Secure payment powered by Stripe. Cancel anytime from your dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profile Preview Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Your Professional Profile Will Include
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-red-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Portfolio Showcase</h3>
                <p className="text-gray-600">
                  Display your best work with high-quality images and project descriptions
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-red-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Social Media Integration</h3>
                <p className="text-gray-600">
                  Connect all your social platforms - Instagram, LinkedIn, YouTube, and more
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-6 w-6 text-red-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Professional Information</h3>
                <p className="text-gray-600">
                  Share your experience, skills, location, and availability with potential clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
