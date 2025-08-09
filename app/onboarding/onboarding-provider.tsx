"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth"
import type { OnboardingData } from "./page"

interface OnboardingContextType {
  currentStep: number
  onboardingData: OnboardingData
  updateOnboardingData: (updates: Partial<OnboardingData>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  saveProfile: () => Promise<void>
  isSaving: boolean
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const TOTAL_STEPS = 8

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: null,
    email: "",
    password: "",
    displayName: "",
    location: "",
    bio: "",
    profilePicture: "",
    specializations: [],
    locationPreferences: [],
    willingToTravel: false,
    socialLinks: { instagram: "", youtube: "", tiktok: "", website: "" },
    imdbProfile: "",
    linkedin: "",
    youtube_vimeo: "",
    fullName: "",
    city: "",
    provinceCountry: "",
    department: "",
    roles: [],
    experienceLevel: "",
    yearsExperience: "",
    dailyRate: "",
    hourlyRate: "",
    projectRate: "",
    languagesSpoken: [],
    servicesOffered: [],
    gearOwned: [],
    specialSkills: [],
  })

  useEffect(() => {
    try {
      const savedState = localStorage.getItem("snapscout-onboarding")
      if (savedState) {
        const { step, data } = JSON.parse(savedState)
        setCurrentStep(step)
        setOnboardingData(data)
      }
    } catch (error) {
      console.error("Failed to parse onboarding state from localStorage", error)
      localStorage.removeItem("snapscout-onboarding")
    }
  }, [])

  useEffect(() => {
    const stateToSave = JSON.stringify({ step: currentStep, data: onboardingData })
    localStorage.setItem("snapscout-onboarding", stateToSave)
  }, [currentStep, onboardingData])

  const updateOnboardingData = useCallback((updates: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...updates }))
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step)
    }
  }, [])

  const saveProfile = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const profileToSave = {
        user_id: user.id,
        id: user.id, // Assuming user_id and profile id are the same
        full_name: onboardingData.fullName,
        display_name: onboardingData.displayName,
        bio: onboardingData.bio,
        profile_picture: onboardingData.profilePicture,
        city: onboardingData.city,
        province_country: onboardingData.provinceCountry,
        location: `${onboardingData.city}, ${onboardingData.provinceCountry}`,
        department: onboardingData.department,
        roles: onboardingData.roles,
        experience_level: onboardingData.experienceLevel,
        years_experience: onboardingData.yearsExperience,
        profession: onboardingData.specializations[0] || "Creative",
        instagram: onboardingData.socialLinks.instagram,
        youtube_vimeo: onboardingData.youtube_vimeo,
        linkedin: onboardingData.linkedin,
        website: onboardingData.socialLinks.website,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("user_profiles").upsert(profileToSave, { onConflict: "user_id" })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      // Optionally show an error to the user
    } finally {
      setIsSaving(false)
    }
  }

  const value = {
    currentStep,
    onboardingData,
    updateOnboardingData,
    nextStep,
    prevStep,
    goToStep,
    saveProfile,
    isSaving,
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
