"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Video, Users, Palette, Music, Briefcase, ArrowRight } from 'lucide-react'
import type { OnboardingData } from "@/app/onboarding/page"

interface SpecializationSelectionProps {
  onNext: () => void
  onPrev: () => void
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const specializationsByType = {
  creator: [
    { id: 'portrait', name: 'Portrait Photography', icon: Camera },
    { id: 'wedding', name: 'Wedding Photography', icon: Camera },
    { id: 'event', name: 'Event Photography', icon: Users },
    { id: 'commercial', name: 'Commercial Photography', icon: Briefcase },
    { id: 'fashion', name: 'Fashion Photography', icon: Palette },
    { id: 'videography', name: 'Videography', icon: Video },
    { id: 'drone', name: 'Drone Photography', icon: Camera },
    { id: 'product', name: 'Product Photography', icon: Camera }
  ],
  client: [
    { id: 'personal', name: 'Personal Projects', icon: Users },
    { id: 'business', name: 'Business/Corporate', icon: Briefcase },
    { id: 'events', name: 'Events & Celebrations', icon: Users },
    { id: 'marketing', name: 'Marketing & Advertising', icon: Palette },
    { id: 'content', name: 'Content Creation', icon: Video },
    { id: 'social', name: 'Social Media', icon: Camera }
  ],
  studio: [
    { id: 'photography-studio', name: 'Photography Studio', icon: Camera },
    { id: 'video-studio', name: 'Video Studio', icon: Video },
    { id: 'equipment-rental', name: 'Equipment Rental', icon: Camera },
    { id: 'lighting-rental', name: 'Lighting Equipment', icon: Palette },
    { id: 'audio-equipment', name: 'Audio Equipment', icon: Music },
    { id: 'backdrop-props', name: 'Backdrops & Props', icon: Palette }
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
      case 'creator': return 'What are your specializations?'
      case 'client': return 'What type of projects do you work on?'
      case 'studio': return 'What services do you offer?'
      default: return 'Select your areas of interest'
    }
  }

  const getSubtitle = () => {
    switch (data.userType) {
      case 'creator': return 'Select all the types of photography and videography you specialize in'
      case 'client': return 'Help us understand what kind of creative professionals you typically hire'
      case 'studio': return 'Choose the equipment and services you provide to creatives'
      default: return 'This helps us personalize your experience'
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {getTitle()}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isSelected
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 bg-white hover:border-primary/50'
                }`}
                onClick={() => toggleSpecialization(spec.id)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-primary/10' 
                      : 'bg-gray-100'
                  }`}>
                    <Icon 
                      className={`w-6 h-6 transition-all ${
                        isSelected ? 'text-primary' : 'text-gray-500'
                      }`} 
                    />
                  </div>
                  
                  <h3 className={`text-sm font-semibold transition-all ${
                    isSelected ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {spec.name}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {data.specializations && data.specializations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
            {data.specializations.length} selected
          </Badge>
        </motion.div>
      )}

      {data.specializations && data.specializations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center pt-8 pb-8"
        >
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg"
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
