"use client"

import { Camera, Search, Building } from 'lucide-react'
import Image from "next/image"
import { useOnboarding } from "./onboarding-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function AccountTypeSelection() {
  const { nextStep, prevStep, currentStep, setAccountType } = useOnboarding()

  const handleSelectAccountType = (type: "creator" | "client" | "studio") => {
    setAccountType(type)
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

      <Card className="w-full max-w-4xl bg-card p-8 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-0 text-center">
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            What type of account are you creating?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div
              className="flex cursor-pointer flex-col items-center rounded-lg border border-border bg-muted p-6 text-center transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleSelectAccountType("creator")}
            >
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Camera className="size-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                I&apos;m a Creator
              </h3>
              <p className="text-sm text-muted-foreground">
                Photographer, videographer, or creative professional
              </p>
            </div>

            <div
              className="flex cursor-pointer flex-col items-center rounded-lg border border-border bg-muted p-6 text-center transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleSelectAccountType("client")}
            >
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Search className="size-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                I&apos;m a Client/Scout
              </h3>
              <p className="text-sm text-muted-foreground">
                Looking to hire creative professionals
              </p>
            </div>

            <div
              className="flex cursor-pointer flex-col items-center rounded-lg border border-border bg-muted p-6 text-center transition-all hover:border-primary hover:shadow-md"
              onClick={() => handleSelectAccountType("studio")}
            >
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Building className="size-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                I&apos;m a Studio/Store
              </h3>
              <p className="text-sm text-muted-foreground">
                Rent equipment or studio space
              </p>
            </div>
          </div>
          <Button onClick={prevStep} variant="ghost" className="mt-8">
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
