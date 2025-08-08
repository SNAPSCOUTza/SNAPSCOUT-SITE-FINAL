"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Search, Building2, Check, ArrowRight } from 'lucide-react'
import { OnboardingData } from "@/app/onboarding/page"

interface AccountTypeSelectionProps {
  onNext: () => void
  onPrev: () => void
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const userTypeDetails = {
  creator: {
    title: "Creator Account",
    subtitle: "For Photographers & Videographers",
    icon: Camera,
    price: "R60/month",
    description: "Perfect for creative professionals looking to get discovered and booked",
    features: [
      "Professional profile with portfolio showcase",
      "Get discovered by clients and scouts",
      "Direct booking and messaging system",
      "Rate calculator and invoice generation",
      "Analytics and performance tracking",
      "Priority support"
    ],
    color: "#E63946"
  },
  client: {
    title: "Client/Scout Account",
    subtitle: "For Those Hiring Creatives",
    icon: Search,
    price: "Free Forever",
    description: "Find and hire the perfect creative professionals for your projects",
    features: [
      "Browse verified creative professionals",
      "Advanced search and filtering",
      "Direct messaging and booking",
      "Project management tools",
      "Review and rating system",
      "Unlimited searches"
    ],
    color: "#8BC34A"
  },
  studio: {
    title: "Studio/Store Account",
    subtitle: "For Equipment & Space Rental",
    icon: Building2,
    price: "R300/month",
    description: "Rent out your equipment, studio space, or photography services",
    features: [
      "Equipment and space listings",
      "Booking calendar management",
      "Inventory tracking system",
      "Payment processing",
      "Customer management",
      "Business analytics"
    ],
    color: "#2B2D42"
  }
}

export default function AccountTypeSelection({ onNext, onPrev, data, updateData }: AccountTypeSelectionProps) {
  const handleUserTypeSelection = (userType: 'creator' | 'client' | 'studio') => {
    updateData({ userType })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          What brings you to SnapScout?
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Choose the option that best describes you
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 px-4">
        {Object.entries(userTypeDetails).map(([key, details], index) => {
          const Icon = details.icon
          const isSelected = data.userType === key
          const userType = key as 'creator' | 'client' | 'studio'
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`glass-card cursor-pointer transition-all duration-300 hover:scale-105 relative h-full ${
                  isSelected
                    ? `border-[${details.color}] shadow-[0_0_30px_rgba(230,57,70,0.4)] bg-[${details.color}]/10`
                    : 'border-white/10 hover:border-white/30'
                }`}
                onClick={() => handleUserTypeSelection(userType)}
              >
                {/* Selection Highlight Ring */}
                {isSelected && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#E63946] to-[#FFCC00] rounded-lg blur-sm opacity-75" />
                )}
                
                <CardContent className="relative p-8 space-y-6 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all ${
                      isSelected 
                        ? `bg-[${details.color}]/30 shadow-[0_0_20px_rgba(230,57,70,0.3)]` 
                        : `bg-[${details.color}]/20`
                    }`}>
                      <Icon className={`w-8 h-8 transition-all`} style={{ color: details.color }} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">
                        {details.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {details.subtitle}
                      </p>
                      <Badge 
                        className={`text-sm px-3 py-1`}
                        style={{ 
                          backgroundColor: `${details.color}20`, 
                          color: details.color,
                          borderColor: `${details.color}30`
                        }}
                      >
                        {details.price}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-center text-sm">
                    {details.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 flex-grow">
                    {details.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-[#8BC34A] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Selection Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-[#E63946] rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Continue Button */}
      {data.userType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center pt-8 pb-8"
        >
          <Button
            onClick={onNext}
            className="bg-[#E63946] hover:bg-[#E63946]/90 text-white px-8 py-4 text-lg font-semibold shadow-[0_0_20px_rgba(230,57,70,0.3)] hover:shadow-[0_0_30px_rgba(230,57,70,0.5)] transition-all"
            size="lg"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
