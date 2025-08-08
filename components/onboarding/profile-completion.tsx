"use client"

import { useState } from "react"
import Image from "next/image"
import { useOnboarding } from "./onboarding-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

export function ProfileCompletion() {
  const { nextStep, prevStep, currentStep, setProfileCompletion } =
    useOnboarding()
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [portfolioLink, setPortfolioLink] = useState("")
  const [socialMediaLink, setSocialMediaLink] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0])
    }
  }

  const handleNext = () => {
    setProfileCompletion({
      profilePicture,
      portfolioLink,
      socialMediaLink,
      isPublic,
    })
    nextStep()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <Image
          src="/images/snapscout-circular-logo.png"
          alt="SnapScout Logo"
          width={32}
          height={32}
        />
        <span className="text-lg font-semibold">SnapScout</span>
      </div>
      <div className="absolute right-4 top-4 flex items-center gap-2 text-sm text-muted-foreground">
        Step {currentStep} of 8
        <Progress value={(currentStep / 8) * 100} className="w-24" />
      </div>

      <Card className="w-full max-w-md bg-card p-8 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-0 text-center">
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            Complete Your Profile
          </h2>
          <p className="mb-6 text-muted-foreground">
            Add a profile picture, portfolio, and social media links.
          </p>
          <div className="w-full space-y-4">
            <div>
              <Label htmlFor="profile-picture">Profile Picture (Optional)</Label>
              <Input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-muted text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="portfolio-link">Portfolio Link (Optional)</Label>
              <Input
                id="portfolio-link"
                type="url"
                placeholder="https://yourportfolio.com"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                className="bg-muted text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="social-media-link">
                Social Media Link (Optional)
              </Label>
              <Input
                id="social-media-link"
                type="url"
                placeholder="https://instagram.com/yourhandle"
                value={socialMediaLink}
                onChange={(e) => setSocialMediaLink(e.target.value)}
                className="bg-muted text-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="public-profile" className="text-foreground">
                Make Profile Public
              </Label>
              <Switch
                id="public-profile"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <Button onClick={handleNext} className="w-full">
              Next
            </Button>
            <Button onClick={prevStep} variant="ghost" className="w-full">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
