"use client"

import { useState } from "react"
import Image from "next/image"
import { useOnboarding } from "./onboarding-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { signIn, signUp } from "@/lib/auth"

export function AccountCreation() {
  const { nextStep, prevStep, currentStep, setEmail, setPassword } =
    useOnboarding()
  const [emailInput, setEmailInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSigningUp, setIsSigningUp] = useState(false)

  const handleCreateAccount = async () => {
    setError(null)
    if (passwordInput !== confirmPasswordInput) {
      setError("Passwords do not match.")
      return
    }

    setIsSigningUp(true)
    const { data, error: authError } = await signUp(emailInput, passwordInput)
    setIsSigningUp(false)

    if (authError) {
      setError(authError.message)
    } else if (data.user) {
      setEmail(emailInput)
      setPassword(passwordInput)
      nextStep()
    } else {
      setError("An unexpected error occurred during sign up.")
    }
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
            Create Your Account
          </h2>
          <div className="w-full space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-muted text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="bg-muted text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                className="bg-muted text-foreground"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              onClick={handleCreateAccount}
              className="w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? "Creating Account..." : "Create Account"}
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
