"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface ProfileBasicsData {
  firstName: string
  lastName: string
  bio: string
}

interface LocationPreferencesData {
  province: string
  city: string
  radius: number
}

interface ProfileCompletionData {
  profilePicture: File | null
  portfolioLink: string
  socialMediaLink: string
  isPublic: boolean
}

interface OnboardingContextType {
  currentStep: number
  accountType: "creator" | "client" | "studio" | null
  email: string
  profileBasics: ProfileBasicsData
  specializations: string[]
  locationPreferences: LocationPreferencesData
  profileCompletion: ProfileCompletionData
  nextStep: () => void
  prevStep: () => void
  setAccountType: (type: "creator" | "client" | "studio") => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setProfileBasics: (data: ProfileBasicsData) => void
  setSpecializations: (data: string[]) => void
  setLocationPreferences: (data: LocationPreferencesData) => void
  setProfileCompletion: (data: ProfileCompletionData) => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [accountType, setAccountTypeState] = useState<
    "creator" | "client" | "studio" | null
  >(null)
  const [email, setEmailState] = useState("")
  const [password, setPasswordState] = useState("")
  const [profileBasics, setProfileBasicsState] = useState<ProfileBasicsData>({
    firstName: "",
    lastName: "",
    bio: "",
  })
  const [specializations, setSpecializationsState] = useState<string[]>([])
  const [locationPreferences, setLocationPreferencesState] =
    useState<LocationPreferencesData>({
      province: "",
      city: "",
      radius: 50,
    })
  const [profileCompletion, setProfileCompletionState] =
    useState<ProfileCompletionData>({
      profilePicture: null,
      portfolioLink: "",
      socialMediaLink: "",
      isPublic: true,
    })

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const value = {
    currentStep,
    accountType,
    email,
    profileBasics,
    specializations,
    locationPreferences,
    profileCompletion,
    nextStep,
    prevStep,
    setAccountType: setAccountTypeState,
    setEmail: setEmailState,
    setPassword: setPasswordState,
    setProfileBasics: setProfileBasicsState,
    setSpecializations: setSpecializationsState,
    setLocationPreferences: setLocationPreferencesState,
    setProfileCompletion: setProfileCompletionState,
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
