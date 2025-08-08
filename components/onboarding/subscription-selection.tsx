"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Search, Building2, ArrowRight } from 'lucide-react'
import { OnboardingData } from "@/app/onboarding/page"

interface SubscriptionSelectionProps {
  onNext: () => void
  onPrev: () => void
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const plans = {
  client: {
    name: "Scout/Client",
    price: "Free",
    period: "forever",
    icon: Search,
    color: "#8BC34A",
    features: [
      "Browse unlimited creator profiles",
      "View portfolios and rates",
      "Direct messaging with creatives",
      "Basic booking system",
      "Client support"
    ]
  },
  creator: {
    name: "Creator",
    price: "R60",
    period: "month",
    icon: Crown,
    color: "#E63946",
    popular: true,
    features: [
      "Professional profile page",
      "Portfolio showcase",
      "Booking calendar",
      "Direct client messaging",
      "Payment processing",
      "Analytics dashboard",
      "Priority support",
      "Social media integration"
    ]
  },
  studio: {
    name: "Studio",
    price: "R300",
    period: "month",
    icon: Building2,
    color: "#2B2D42",
    features: [
      "Studio/equipment listings",
      "Advanced booking calendar",
      "Multiple location support",
      "Team management",
      "Revenue analytics",
      "Custom branding",
      "Dedicated account manager",
      "API access"
    ]
  }
}

export default function SubscriptionSelection({ onNext, onPrev, data, updateData }: SubscriptionSelectionProps) {
  const handlePlanSelection = (planType: string) => {
    updateData({ selectedPlan: planType })
  }

  const getRecommendedPlan = () => {
    return data.userType || 'creator'
  }

  const recommendedPlan = getRecommendedPlan()

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Choose your plan
          </h1>
          <p className="text-xl text-gray-300">
            Select the plan that fits your needs. Start with a 14-day free trial.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([key, plan]) => {
            const Icon = plan.icon
            const isSelected = data.selectedPlan === key
            const isRecommended = key === recommendedPlan
            const isFree = plan.price === "Free"
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: Object.keys(plans).indexOf(key) * 0.1 }}
                className="relative"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-[#FFCC00] text-black font-semibold px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Recommended Badge */}
                {isRecommended && !plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-[#8BC34A] text-white font-semibold px-4 py-1">
                      Recommended
                    </Badge>
                  </div>
                )}

                <Card
                  className={`glass-card cursor-pointer transition-all duration-300 hover:scale-105 h-full ${
                    isSelected
                      ? `border-[${plan.color}] shadow-[0_0_20px_rgba(230,57,70,0.3)]`
                      : 'border-white/10 hover:border-white/30'
                  } ${plan.popular ? 'border-[#FFCC00] shadow-[0_0_20px_rgba(255,204,0,0.3)]' : ''}`}
                  onClick={() => handlePlanSelection(key)}
                >
                  <CardHeader className="text-center space-y-4 pb-6">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center`}
                         style={{ backgroundColor: `${plan.color}20` }}>
                      <Icon className="w-8 h-8" style={{ color: plan.color }} />
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-2xl text-white">
                        {plan.name}
                      </CardTitle>
                      <div className="space-y-1">
                        <div className="text-4xl font-bold text-white">
                          {plan.price}
                        </div>
                        <p className="text-gray-400">
                          {isFree ? plan.period : `per ${plan.period}`}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features List */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                               style={{ backgroundColor: `${plan.color}20` }}>
                            <Check className="w-3 h-3" style={{ color: plan.color }} />
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full py-3 font-semibold transition-all ${
                        isFree
                          ? 'bg-[#8BC34A] hover:bg-[#8BC34A]/90 text-white'
                          : key === 'creator'
                          ? 'bg-[#E63946] hover:bg-[#E63946]/90 text-white'
                          : 'bg-[#2B2D42] hover:bg-[#2B2D42]/90 text-white'
                      }`}
                      onClick={() => handlePlanSelection(key)}
                    >
                      {isFree ? 'Get Started Free' : 'Start Free Trial'}
                    </Button>

                    {!isFree && (
                      <p className="text-xs text-gray-400 text-center">
                        14-day free trial • No credit card required
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Free Trial Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center space-y-4"
        >
          <div className="p-6 glass-card border-white/10 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">
              14-Day Free Trial
            </h3>
            <p className="text-gray-300 text-sm">
              Try any paid plan free for 14 days. No credit card required. 
              Cancel anytime during the trial period with no charges.
            </p>
          </div>

          {/* Skip Option */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={onNext}
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              Skip for now
            </Button>
            <p className="text-xs text-gray-500">
              You can upgrade your plan anytime from your dashboard
            </p>
          </div>
        </motion.div>

        {/* Continue Button */}
        {data.selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center pt-4"
          >
            <Button
              onClick={onNext}
              className="bg-[#E63946] hover:bg-[#E63946]/90 text-white px-8 py-3"
              size="lg"
            >
              Continue with {plans[data.selectedPlan as keyof typeof plans]?.name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
