"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Search, Building2, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getCurrentUser } from "@/lib/auth"

// Onboarding steps
import WelcomePage from "@/components/onboarding/welcome-page"
import AccountTypeSelection from "@/components/onboarding/account-type-selection"
import AccountCreation from "@/components/onboarding/account-creation"
import ProfileBasics from "@/components/onboarding/profile-basics"
import SpecializationSelection from "@/components/onboarding/specialization-selection"
import LocationPreferences from "@/components/onboarding/location-preferences"
import ProfileCompletion from "@/components/onboarding/profile-completion"
import WelcomeToDashboard from "@/components/onboarding/welcome-to-dashboard"

export interface OnboardingData {
  userType: 'creator' | 'client' | 'studio' | null
  email: string
  password: string
  displayName: string
  location: string
  bio: string
  profilePicture: string
  specializations: string[]
  locationPreferences: string[]
  willingToTravel: boolean
  socialLinks: {
    instagram: string
    youtube: string // This will be used for YouTube/Vimeo
    tiktok: string
    website: string
  }
  // New fields for social/professional links
  imdbProfile: string
  linkedin: string
  youtube_vimeo: string // Added this field for consistency with dashboard

  // Profile completion fields
  fullName: string
  city: string
  provinceCountry: string
  department: string
  roles: string[]
  experienceLevel: string
  yearsExperience: string
  dailyRate: string
  hourlyRate: string
  projectRate: string
  languagesSpoken: string[]
  servicesOffered: string[]
  gearOwned: string[]
  specialSkills: string[]
}

const TOTAL_STEPS = 8

function OnboardingFlow({ initialStep }: { initialStep: number }) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: null,
    email: '',
    password: '',
    displayName: '',
    location: '',
    bio: '',
    profilePicture: '',
    specializations: [],
    locationPreferences: [],
    willingToTravel: false,
    socialLinks: {
      instagram: '',
      youtube: '',
      tiktok: '',
      website: ''
    },
    imdbProfile: '', // Initialized
    linkedin: '', // Initialized
    youtube_vimeo: '', // Initialized

    fullName: '',
    city: '',
    provinceCountry: '',
    department: '',
    roles: [],
    experienceLevel: '',
    yearsExperience: '',
    dailyRate: '',
    hourlyRate: '',
    projectRate: '',
    languagesSpoken: [],
    servicesOffered: [],
    gearOwned: [],
    specialSkills: [],
  })

  // Auto-save progress to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('snapscout-onboarding')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setOnboardingData(parsed.data)
      setCurrentStep(parsed.step)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('snapscout-onboarding', JSON.stringify({
      data: onboardingData,
      step: currentStep
    }))
  }, [onboardingData, currentStep])

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomePage
            onNext={nextStep}
            data={onboardingData}
            updateData={updateOnboardingData}
          />
        )
      case 2:
        return (
          <AccountTypeSelection
            onNext={nextStep}
            onPrev={prevStep}
            data={onboardingData}
            updateData={updateOnboardingData}
          />
        )
      case 3:
        return (
          <AccountCreation
            onNext={nextStep}
            onPrev={prevStep}
            data={onboardingData}
            updateData={updateOnboardingData}
          />
        )
      case 4:
        return (
          <ProfileBasics
            onNext={nextStep}
            onPrev={prevStep}
            data={onboardingData}
            updateData={updateOnboardingData}
          />
        )
      case 5:
        return (
          <SpecializationSelection
            onNext={nextStep}
            onPrev={prevStep}
            data={onboardingData}
            updateData={updateOnboardingData}
          />
        )
      case 6:
        return (
          <LocationPreferences
            onNext={nextStep}
            onPrev={prevStep}
            data={onboardingData}
            updateData={updateOnboardingData}
          />
        )
      case 7:
        return (
          <ProfileCompletion
            onNext={nextStep}
            onPrev={prevStep}
            data={onboardingData}
            updateData={updateOnboardingData}
          />
        )
      case 8:
        return (
          <WelcomeToDashboard
            data={onboardingData}
            onComplete={() => {
              localStorage.removeItem('snapscout-onboarding')
              // Redirect to dashboard
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen overflow-x-hidden">
      {/* Progress Bar */}
      {currentStep < 8 && (
        <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/snapscout-new-logo.jpeg"
                  alt="SnapScout Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm font-medium">SnapScout</span>
              </div>
              <div className="text-sm text-gray-600">
                Step {currentStep} of {TOTAL_STEPS}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-[#E63946] to-[#FFCC00] h-1 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Fixed scrolling issues */}
      <div className={`${currentStep < 8 ? 'pt-8' : ''} min-h-screen pb-32`}>
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl mx-auto"
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation (for steps 2-7) */}
      {currentStep > 1 && currentStep < 8 && (
        <div className="bg-white/80 backdrop-blur-sm border-t fixed bottom-0 left-0 right-0 p-4 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevStep}
              className="text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex space-x-2">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i + 1)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i + 1 === currentStep
                      ? 'bg-[#E63946] w-6'
                      : i + 1 < currentStep
                      ? 'bg-[#8BC34A]'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function OnboardingPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }

  const onboardingStep = cookies().get("onboarding_step")?.value || "1"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <OnboardingFlow initialStep={parseInt(onboardingStep)} />
    </div>
  )
}
