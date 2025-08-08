"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Video, Users, Palette, Music, Briefcase, ArrowRight } from 'lucide-react'
import { OnboardingData } from "@/app/onboarding/page"

interface SpecializationSelectionProps {
  onNext: () => void
  onPrev: () => void
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const specializationsByType = {
  creator: [
    { id: 'portrait', name: 'Portrait Photography', icon: Camera, color: '#E63946' },
    { id: 'wedding', name: 'Wedding Photography', icon: Camera, color: '#E63946' },
    { id: 'event', name: 'Event Photography', icon: Users, color: '#8BC34A' },
    { id: 'commercial', name: 'Commercial Photography', icon: Briefcase, color: '#2B2D42' },
    { id: 'fashion', name: 'Fashion Photography', icon: Palette, color: '#FFCC00' },
    { id: 'videography', name: 'Videography', icon: Video, color: '#E63946' },
    { id: 'drone', name: 'Drone Photography', icon: Camera, color: '#8BC34A' },
    { id: 'product', name: 'Product Photography', icon: Camera, color: '#2B2D42' }
  ],
  client: [
    { id: 'personal', name: 'Personal Projects', icon: Users, color: '#E63946' },
    { id: 'business', name: 'Business/Corporate', icon: Briefcase, color: '#2B2D42' },
    { id: 'events', name: 'Events & Celebrations', icon: Users, color: '#8BC34A' },
    { id: 'marketing', name: 'Marketing & Advertising', icon: Palette, color: '#FFCC00' },
    { id: 'content', name: 'Content Creation', icon: Video, color: '#E63946' },
    { id: 'social', name: 'Social Media', icon: Camera, color: '#8BC34A' }
  ],
  studio: [
    { id: 'photography-studio', name: 'Photography Studio', icon: Camera, color: '#E63946' },
    { id: 'video-studio', name: 'Video Studio', icon: Video, color: '#E63946' },
    { id: 'equipment-rental', name: 'Equipment Rental', icon: Camera, color: '#2B2D42' },
    { id: 'lighting-rental', name: 'Lighting Equipment', icon: Palette, color: '#FFCC00' },
    { id: 'audio-equipment', name: 'Audio Equipment', icon: Music, color: '#8BC34A' },
    { id: 'backdrop-props', name: 'Backdrops & Props', icon: Palette, color: '#FFCC00' }
  ]
}

export default function SpecializationSelection({ onNext, onPrev, data, updateData }: SpecializationSelectionProps) {
  const currentSpecializations = specializationsByType[data.userType || 'creator']

  const toggleSpecialization = (specializationId: string) => {
    const currentSpecs = data.specializations || []
    const isSelected = currentSpecs.includes(specializationId)
    
    if (isSelected) {
      updateData({
        specializations: currentSpecs.filter(id => id !== specializationId)
      })
    } else {
      updateData({
        specializations: [...currentSpecs, specializationId]
      })
    }
  }

  const getTitle = () => {
    switch (data.userType) {
      case 'creator':
        return 'What are your specializations?'
      case 'client':
        return 'What type of projects do you work on?'
      case 'studio':
        return 'What services do you offer?'
      default:
        return 'Select your areas of interest'
    }
  }

  const getSubtitle = () => {
    switch (data.userType) {
      case 'creator':
        return 'Select all the types of photography and videography you specialize in'
      case 'client':
        return 'Help us understand what kind of creative professionals you typically hire'
      case 'studio':
        return 'Choose the equipment and services you provide to creatives'
      default:
        return 'This helps us personalize your experience'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {getTitle()}
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          {getSubtitle()}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4"
      >
        {currentSpecializations.map((spec, index) => {
          const Icon = spec.icon
          const isSelected = data.specializations?.includes(spec.id) || false
          
          return (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Card
                className={`glass-card cursor-pointer transition-all duration-300 hover:scale-105 relative ${
                  isSelected
                    ? 'border-[#E63946] shadow-[0_0_20px_rgba(230,57,70,0.3)] bg-[#E63946]/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
                onClick={() => toggleSpecialization(spec.id)}
              >
                {/* Selection Highlight Ring */}
                {isSelected && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#E63946] to-[#FFCC00] rounded-lg blur-sm opacity-75" />
                )}
                
                <CardContent className="relative p-6 text-center space-y-4 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-[#E63946]/30 shadow-[0_0_15px_rgba(230,57,70,0.3)]' 
                      : 'bg-white/10'
                  }`}>
                    <Icon 
                      className={`w-6 h-6 transition-all ${
                        isSelected ? 'text-[#E63946] scale-110' : 'text-gray-400'
                      }`} 
                    />
                  </div>
                  
                  <h3 className={`text-sm font-semibold transition-all ${
                    isSelected ? 'text-white' : 'text-gray-300'
                  }`}>
                    {spec.name}
                  </h3>

                  {/* Selection Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-5 h-5 bg-[#E63946] rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Selected Count */}
      {data.specializations && data.specializations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Badge className="bg-[#E63946]/20 text-[#E63946] border-[#E63946]/30 px-4 py-2">
            {data.specializations.length} selected
          </Badge>
        </motion.div>
      )}

      {/* Continue Button */}
      {data.specializations && data.specializations.length > 0 && (
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
