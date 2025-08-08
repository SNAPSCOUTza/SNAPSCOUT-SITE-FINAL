"use client"

import { useState } from "react"
import Image from "next/image"
import { useOnboarding } from "./onboarding-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

export function ProfileBasics() {
  const { nextStep, prevStep, currentStep, setProfileBasics } = useOnboarding()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [bio, setBio] = useState("")

  const handleNext = () => {
    setProfileBasics({ firstName, lastName, bio })
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
            Tell us about yourself
          </h2>
          <div className="w-full space-y-4">
            <div>
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-muted text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-muted text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="bg-muted text-foreground"
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
