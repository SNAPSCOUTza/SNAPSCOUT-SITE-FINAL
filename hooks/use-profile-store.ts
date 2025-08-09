import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface SocialLinks {
  website: string
  instagram: string
  twitter: string
  linkedin: string
  youtube: string
  tiktok: string
}

export interface ProfileState {
  fullName: string
  profession: string
  location: string
  availability: string
  pricing: string
  bio: string
  profileImageUrl: string
  skills: string[]
  socialLinks: SocialLinks
  portfolioImages: string[]
  setProfileState: (newState: Partial<ProfileState>) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  addPortfolioImage: (imageUrl: string) => void
  removePortfolioImage: (index: number) => void
  resetProfile: () => void
}

const initialState = {
  fullName: "Alex Doe",
  profession: "Photographer & Videographer",
  location: "Cape Town, South Africa",
  availability: "Available for new projects",
  pricing: "Starting from $500/day",
  bio: "Passionate visual storyteller with over 5 years of experience capturing moments that matter. Specializing in commercial and event photography.",
  profileImageUrl: "",
  skills: ["Photography", "Videography", "Color Grading", "Drone Operation"],
  socialLinks: {
    website: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
  },
  portfolioImages: [],
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setProfileState: (newState) => set(newState),
      addSkill: (skill) => {
        if (skill && !get().skills.includes(skill)) {
          set((state) => ({ skills: [...state.skills, skill] }))
        }
      },
      removeSkill: (skill) => {
        set((state) => ({
          skills: state.skills.filter((s) => s !== skill),
        }))
      },
      addPortfolioImage: (imageUrl) => {
        set((state) => ({
          portfolioImages: [...state.portfolioImages, imageUrl],
        }))
      },
      removePortfolioImage: (index) => {
        set((state) => ({
          portfolioImages: state.portfolioImages.filter((_, i) => i !== index),
        }))
      },
      resetProfile: () => set(initialState),
    }),
    {
      name: "snapscout-demo-profile", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
