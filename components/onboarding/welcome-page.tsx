"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Search, Building2, ArrowRight } from 'lucide-react'
import { OnboardingData } from "@/app/onboarding/page"

interface WelcomePageProps {
  onNext: () => void
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const userTypes = [
  {
    id: 'creator',
    title: "I'm a Creator",
    icon: Camera,
    description: "Photographer, videographer, or creative professional"
  },
  {
    id: 'client',
    title: "I'm a Client/Scout",
    icon: Search,
    description: "Looking to hire creative professionals"
  },
  {
    id: 'studio',
    title: "I'm a Studio/Store",
    icon: Building2,
    description: "Rent equipment or studio space"
  }
]

export default function WelcomePage({ onNext, data, updateData }: WelcomePageProps) {
  const handleUserTypeSelection = (userType: 'creator' | 'client' | 'studio') => {
    updateData({ userType })
  }

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to{" "}
              <span className="text-[#E63946]">Snap</span>
              <span className="text-white">Scout</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-200">
              Your Creative Playground
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Connect, Create, and Get Booked in South Africa's Premier Creative Network
            </p>
          </div>
        </div>

        {/* User Type Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 px-4">
          {userTypes.map((type, index) => {
            const Icon = type.icon
            const isSelected = data.userType === type.id
            
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`glass-card cursor-pointer transition-all duration-300 hover:scale-105 relative ${
                    isSelected
                      ? 'border-[#E63946] shadow-[0_0_30px_rgba(230,57,70,0.4)] bg-[#E63946]/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => handleUserTypeSelection(type.id as 'creator' | 'client' | 'studio')}
                >
                  {/* Selection Highlight Ring */}
                  {isSelected && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#E63946] to-[#FFCC00] rounded-lg blur-sm opacity-75" />
                  )}
                  
                  <CardContent className="relative p-8 text-center space-y-4 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-[#E63946]/30 shadow-[0_0_20px_rgba(230,57,70,0.3)]' 
                        : 'bg-[#E63946]/20'
                    }`}>
                      <Icon className={`w-8 h-8 transition-all ${
                        isSelected ? 'text-[#E63946] scale-110' : 'text-[#E63946]'
                      }`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className={`text-xl font-semibold transition-all ${
                        isSelected ? 'text-white' : 'text-white'
                      }`}>
                        {type.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {type.description}
                      </p>
                    </div>
                    
                    {/* Selection Checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-6 h-6 bg-[#E63946] rounded-full flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Get Started Button */}
        {data.userType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-8 pb-8"
          >
            <Button
              onClick={onNext}
              className="bg-[#E63946] hover:bg-[#E63946]/90 text-white px-8 py-4 text-lg font-semibold shadow-[0_0_20px_rgba(230,57,70,0.3)] hover:shadow-[0_0_30px_rgba(230,57,70,0.5)] transition-all"
              size="lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
