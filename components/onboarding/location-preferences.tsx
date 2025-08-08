"use client"

import { useState } from "react"
import Image from "next/image"
import { useOnboarding } from "./onboarding-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { citiesByProvince } from "@/lib/locations"

export default function LocationPreferences() {
  const { nextStep, prevStep, currentStep, setLocationPreferences } =
    useOnboarding()
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [radius, setRadius] = useState<number[]>([50]) // Default to 50km

  const handleNext = () => {
    setLocationPreferences({ province, city, radius: radius[0] })
    nextStep()
  }

  const citiesInProvince = province ? citiesByProvince[province] : []

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
            Where are you located?
          </h2>
          <p className="mb-6 text-muted-foreground">
            Help us connect you with local opportunities.
          </p>
          <div className="w-full space-y-4">
            <div>
              <Label htmlFor="province">Province</Label>
              <Select onValueChange={setProvince} value={province}>
                <SelectTrigger className="w-full bg-muted text-foreground">
                  <SelectValue placeholder="Select a province" />
                </SelectTrigger>
                <SelectContent className="bg-card text-foreground">
                  {Object.keys(citiesByProvince).map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Select onValueChange={setCity} value={city} disabled={!province}>
                <SelectTrigger className="w-full bg-muted text-foreground">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent className="bg-card text-foreground">
                  {citiesInProvince.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="radius">
                Search Radius: {radius[0]} km
              </Label>
              <Slider
                id="radius"
                min={10}
                max={500}
                step={10}
                value={radius}
                onValueChange={setRadius}
                className="mt-2"
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
