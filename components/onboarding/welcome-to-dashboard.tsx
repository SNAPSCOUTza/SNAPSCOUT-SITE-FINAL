"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Link from "next/link"
import { OnboardingData } from "@/app/onboarding/page"

interface WelcomeToDashboardProps {
  data: OnboardingData
  onComplete: () => void
}

export default function WelcomeToDashboard({ data, onComplete }: WelcomeToDashboardProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const getWelcomeMessage = () => {
    switch (data.userType) {
      case 'creator':
        return {
          title: "Welcome to Your Creative Journey!",
          subtitle: "Your profile is ready - now let's get you discovered",
          description: "You can start using SnapScout immediately. When you're ready to be visible to clients and get booked, simply subscribe to make your profile public."
        }
      case 'client':
        return {
          title: "Welcome to SnapScout!",
          subtitle: "Start discovering amazing creative talent",
          description: "Your account is ready! Browse thousands of verified creatives across South Africa and start your next project today."
        }
      case 'studio':
        return {
          title: "Welcome to the SnapScout Network!",
          subtitle: "Your studio is ready to connect with creatives",
          description: "You can start using SnapScout immediately. When you're ready to list your services publicly, simply subscribe to make your studio visible."
        }
      default:
        return {
          title: "Welcome to SnapScout!",
          subtitle: "Your account is ready",
          description: "Start exploring South Africa's premier creative network."
        }
    }
  }

  const welcomeContent = getWelcomeMessage()

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#E63946] rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="space-y-6"
        >
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-[#8BC34A] rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-2 border-[#E63946] border-dashed rounded-full"
              />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Badge className="bg-[#8BC34A]/20 text-[#8BC34A] border-[#8BC34A]/30 px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Profile Complete!
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              {welcomeContent.title}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-300"
            >
              {welcomeContent.subtitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              {welcomeContent.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="glass-card border-white/10 max-w-2xl mx-auto">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-semibold text-white">Your Profile Summary</h3>
              
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Account Type</p>
                  <p className="text-white font-medium capitalize">{data.userType}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Display Name</p>
                  <p className="text-white font-medium">{data.displayName || 'Not set'}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white font-medium">{data.location || 'Not set'}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Specializations</p>
                  <p className="text-white font-medium">
                    {data.specializations?.length || 0} selected
                  </p>
                </div>
              </div>

              {/* Visibility Status */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <EyeOff className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-400">
                        Private - Only visible to you
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-gray-400 text-gray-400">
                    Private
                  </Badge>
                </div>
                
                {(data.userType === 'creator' || data.userType === 'studio') && (
                  <p className="text-sm text-gray-400 mt-3">
                    💡 Subscribe to make your profile visible to clients and start getting booked!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/dashboard">
            <Button
              onClick={onComplete}
              className="bg-[#E63946] hover:bg-[#E63946]/90 text-white px-8 py-4 text-lg font-semibold shadow-[0_0_20px_rgba(230,57,70,0.3)] hover:shadow-[0_0_30px_rgba(230,57,70,0.5)] transition-all"
              size="lg"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          {(data.userType === 'creator' || data.userType === 'studio') && (
            <Link href="/subscribe">
              <Button
                variant="outline"
                className="border-[#E63946]/30 text-[#E63946] hover:bg-[#E63946]/10 px-8 py-4 text-lg font-semibold"
                size="lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                Make Profile Visible
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center items-center space-x-8 text-sm text-gray-400 pt-8"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#8BC34A] rounded-full" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#8BC34A] rounded-full" />
            <span>No Hidden Fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#8BC34A] rounded-full" />
            <span>Cancel Anytime</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
