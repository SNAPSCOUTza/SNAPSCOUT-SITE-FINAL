"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Search, Building2, ArrowRight, Users, Briefcase } from 'lucide-react'
import type { OnboardingData } from "@/app/onboarding/page"

interface AccountTypeSelectionProps {
  onNext: () => void
  onPrev: () => void
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const accountTypes = [
  {
    id: 'individual',
    title: 'Individual Account',
    icon: Users,
    description: 'Perfect for freelancers and solo creatives',
    features: ['Personal branding', 'Direct bookings', 'Portfolio showcase']
  },
  {
    id: 'business',
    title: 'Business Account',
    icon: Briefcase,
    description: 'Ideal for agencies, studios, and companies',
    features: ['Team management', 'Multiple portfolios', 'Advanced analytics']
  }
]

export default function AccountTypeSelection({ onNext, onPrev, data, updateData }: AccountTypeSelectionProps) {
  const handleAccountTypeSelection = (accountType: string) => {
    updateData({ accountType })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Choose Your Account Type
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Select the account type that best fits your needs and goals
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-8 px-4"
      >
        {accountTypes.map((type, index) => {
          const Icon = type.icon
          const isSelected = data.accountType === type.id
          
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isSelected
                    ? 'border-primary bg-red-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-primary/50'
                }`}
                onClick={() => handleAccountTypeSelection(type.id)}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-primary/10' 
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-10 h-10 transition-all ${
                      isSelected ? 'text-primary' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className={`text-2xl font-semibold transition-all ${
                      isSelected ? 'text-gray-900' : 'text-gray-800'
                    }`}>
                      {type.title}
                    </h3>
                    <p className="text-gray-600 text-base">
                      {type.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {type.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center justify-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-primary' : 'bg-gray-400'
                        }`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {data.accountType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center pt-8 pb-8"
        >
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg"
            size="lg"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
