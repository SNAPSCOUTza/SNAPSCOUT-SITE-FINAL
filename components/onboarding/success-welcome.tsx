"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Sparkles, Camera, Search, Building2 } from 'lucide-react'
import { OnboardingData } from "@/app/onboarding/page"
import Confetti from 'react-confetti'

interface SuccessWelcomeProps {
  data: OnboardingData
  onComplete: () => void
}

export default function SuccessWelcome({ data, onComplete }: SuccessWelcomeProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    updateWindowDimensions()
    window.addEventListener('resize', updateWindowDimensions)

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)

    return () => {
      window.removeEventListener('resize', updateWindowDimensions)
      clearTimeout(timer)
    }
  }, [])

  const getUserTypeIcon = () => {
    switch (data.userType) {
      case 'creator': return Camera
      case 'client': return Search
      case 'studio': return Building2
      default: return Camera
    }
  }

  const getUserTypeLabel = () => {
    switch (data.userType) {
      case 'creator': return 'Creative Professional'
      case 'client': return 'Client/Scout'
      case 'studio': return 'Studio Owner'
      default: return 'User'
    }
  }

  const getWelcomeMessage = () => {
    switch (data.userType) {
      case 'creator': return "You're ready to get discovered and booked!"
      case 'client': return "You're ready to find amazing creative talent!"
      case 'studio': return "You're ready to showcase your studio and equipment!"
      default: return "You're ready to explore SnapScout!"
    }
  }

  const getQuickWins = () => {
    switch (data.userType) {
      case 'creator': return [
        "Your professional profile is live",
        "Start getting discovered by clients",
        "Upload your portfolio",
        "Set your availability calendar"
      ]
      case 'client': return [
        "Browse thousands of verified creatives",
        "Filter by location and specialty",
        "View portfolios and rates",
        "Start booking talent"
      ]
      case 'studio': return [
        "Your studio listing is active",
        "Showcase your equipment",
        "Manage bookings and availability",
        "Connect with local creatives"
      ]
      default: return [
        "Your profile is set up",
        "Explore the platform",
        "Connect with others",
        "Start creating"
      ]
    }
  }

  const Icon = getUserTypeIcon()

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#E63946', '#FFCC00', '#8BC34A', '#2B2D42', '#F8F9FA']}
        />
      )}

      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#E63946] to-[#FFCC00] rounded-full flex items-center justify-center relative">
            <Icon className="w-16 h-16 text-white" />
            
            {/* Sparkle Effects */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#FFCC00]" />
              <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-[#8BC34A]" />
              <Sparkles className="absolute top-1/2 -left-4 w-5 h-5 text-[#E63946]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-white">
              🔥 You're in!
            </h1>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#E63946] to-[#FFCC00] bg-clip-text text-transparent">
              Welcome to SnapScout, {data.displayName}!
            </h2>
          </div>
          
          <p className="text-xl text-gray-300">
            {getWelcomeMessage()}
          </p>

          <Badge className="bg-[#8BC34A]/20 text-[#8BC34A] border-[#8BC34A]/30 px-4 py-2">
            {getUserTypeLabel()}
          </Badge>
        </motion.div>

        {/* Quick Wins */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="glass-card border-white/10">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-xl font-semibold text-white">
                Here's what you can do next:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getQuickWins().map((win, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5"
                  >
                    <CheckCircle className="w-5 h-5 text-[#8BC34A] flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{win}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="space-y-4"
        >
          <Button
            onClick={onComplete}
            className="bg-[#E63946] hover:bg-[#E63946]/90 text-white px-8 py-4 text-lg font-semibold"
            size="lg"
          >
            Explore Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => {
              // Complete profile later logic
              onComplete()
            }}
          >
            Complete Profile Later
          </Button>
        </motion.div>

        {/* Social Sharing (Optional) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="pt-8 border-t border-white/10"
        >
          <p className="text-sm text-gray-400 mb-4">
            Share your SnapScout journey:
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-gray-300 hover:bg-white/5"
              onClick={() => {
                const text = `Just joined SnapScout as a ${getUserTypeLabel()}! 🔥 #SnapScout #CreativeNetwork`
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
              }}
            >
              Share on Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-gray-300 hover:bg-white/5"
              onClick={() => {
                const text = `Just joined SnapScout - South Africa's premier creative network! 🎬📸`
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://snapscout.co.za')}&summary=${encodeURIComponent(text)}`, '_blank')
              }}
            >
              Share on LinkedIn
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
