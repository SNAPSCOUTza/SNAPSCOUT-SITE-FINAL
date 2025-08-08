"use client"

import { useState } from "react"
import Image from "next/image"
import { useOnboarding } from "./onboarding-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

const specializations = [
  "Photography",
  "Videography",
  "Editing",
  "Directing",
  "Lighting",
  "Sound Design",
  "Graphic Design",
  "Web Design",
  "Marketing",
  "Writing",
]

export function SpecializationSelection() {
  const { nextStep, prevStep, currentStep, setSpecializations } =
    useOnboarding()
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([])

  const handleCheckboxChange = (spec: string, checked: boolean) => {
    setSelectedSpecializations((prev) =>
      checked ? [...prev, spec] : prev.filter((s) => s !== spec)
    )
  }

  const handleNext = () => {
    setSpecializations(selectedSpecializations)
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

      <Card className="w-full max-w-2xl bg-card p-8 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-0 text-center">
          <h2 className="mb-8 text-3xl font-bold text-foreground">
            What are your specializations?
          </h2>
          <p className="mb-6 text-muted-foreground">
            Select all that apply to your creative work.
          </p>
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {specializations.map((spec) => (
              <div key={spec} className="flex items-center space-x-2">
                <Checkbox
                  id={spec}
                  checked={selectedSpecializations.includes(spec)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(spec, checked as boolean)
                  }
                />
                <Label htmlFor={spec} className="text-foreground">
                  {spec}
                </Label>
              </div>
            ))}
          </div>
          <Button onClick={handleNext} className="mt-8 w-full max-w-xs">
            Next
          </Button>
          <Button
            onClick={prevStep}
            variant="ghost"
            className="mt-4 w-full max-w-xs"
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
