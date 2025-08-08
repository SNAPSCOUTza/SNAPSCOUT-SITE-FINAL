"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useOnboarding } from "./onboarding-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function WelcomePage() {
  const router = useRouter()
  const { nextStep, currentStep } = useOnboarding()

  const handleGetStarted = () => {
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

      <Card className="w-full max-w-3xl bg-card p-8 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-0 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Welcome to <span className="snapscout-red">SnapScout</span>
          </h1>
          <p className="mb-2 text-xl font-medium text-foreground">
            Your Creative Playground
          </p>
          <p className="mb-8 text-muted-foreground">
            Connect, Create, and Get Booked in South Africa&apos;s Premier
            Creative Network
          </p>
          <Button onClick={handleGetStarted} className="px-8 py-3 text-lg">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
