"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MapPin, Plane, ArrowRight } from 'lucide-react'
import { OnboardingData } from "@/app/onboarding/page"

interface LocationPreferencesProps {
  onNext: () => void
  onPrev: () => void
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const southAfricanProvinces = [
  { id: 'western-cape', name: 'Western Cape', cities: ['Cape Town', 'Stellenbosch', 'George', 'Hermanus'] },
  { id: 'gauteng', name: 'Gauteng', cities: ['Johannesburg', 'Pretoria', 'Sandton', 'Centurion'] },
  { id: 'kwazulu-natal', name: 'KwaZulu-Natal', cities: ['Durban', 'Pietermaritzburg', 'Newcastle', 'Richards Bay'] },
  { id: 'eastern-cape', name: 'Eastern Cape', cities: ['Port Elizabeth', 'East London', 'Grahamstown', 'Uitenhage'] },
  { id: 'limpopo', name: 'Limpopo', cities: ['Polokwane', 'Tzaneen', 'Mokopane', 'Thohoyandou'] },
  { id: 'mpumalanga', name: 'Mpumalanga', cities: ['Nelspruit', 'Witbank', 'Secunda', 'Standerton'] },
  { id: 'north-west', name: 'North West', cities: ['Rustenburg', 'Klerksdorp', 'Potchefstroom', 'Mahikeng'] },
  { id: 'northern-cape', name: 'Northern Cape', cities: ['Kimberley', 'Upington', 'Springbok', 'De Aar'] },
  { id: 'free-state', name: 'Free State', cities: ['Bloemfontein', 'Welkom', 'Kroonstad', 'Bethlehem'] }
]

export default function LocationPreferences({ onNext, onPrev, data, updateData }: LocationPreferencesProps) {
  const toggleLocationPreference = (locationId: string) => {
    const currentPrefs = data.locationPreferences || []
    const isSelected = currentPrefs.includes(locationId)
    
    if (isSelected) {
      updateData({
        locationPreferences: currentPrefs.filter(id => id !== locationId)
      })
    } else {
      updateData({
        locationPreferences: [...currentPrefs, locationId]
      })
    }
  }

  const handleTravelToggle = (checked: boolean) => {
    updateData({ willingToTravel: checked })
  }

  const getTitle = () => {
    switch (data.userType) {
      case 'creator':
        return 'Where do you work?'
      case 'client':
        return 'Where do you hire creatives?'
      case 'studio':
        return 'Where is your studio/store located?'
      default:
        return 'Location preferences'
    }
  }

  const getSubtitle = () => {
    switch (data.userType) {
      case 'creator':
        return 'Select the provinces where you offer your services'
      case 'client':
        return 'Choose areas where you typically look for creative professionals'
      case 'studio':
        return 'Select your service areas and delivery locations'
      default:
        return 'Help us show you relevant opportunities'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {getTitle()}
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          {getSubtitle()}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Travel Preference */}
        {data.userType === 'creator' && (
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Plane className="w-6 h-6 text-[#E63946]" />
                  <div>
                    <Label htmlFor="travel-toggle" className="text-white font-semibold">
                      Willing to Travel
                    </Label>
                    <p className="text-sm text-gray-300">
                      I'm open to projects outside my local area
                    </p>
                  </div>
                </div>
                <Switch
                  id="travel-toggle"
                  checked={data.willingToTravel}
                  onCheckedChange={handleTravelToggle}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Province Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
          {southAfricanProvinces.map((province, index) => {
            const isSelected = data.locationPreferences?.includes(province.id) || false
            
            return (
              <motion.div
                key={province.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card
                  className={`glass-card cursor-pointer transition-all duration-300 hover:scale-105 relative ${
                    isSelected
                      ? 'border-[#E63946] shadow-[0_0_20px_rgba(230,57,70,0.3)] bg-[#E63946]/10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  onClick={() => toggleLocationPreference(province.id)}
                >
                  {/* Selection Highlight Ring */}
                  {isSelected && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#E63946] to-[#FFCC00] rounded-lg blur-sm opacity-75" />
                  )}
                  
                  <CardContent className="relative p-6 space-y-4 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className={`w-5 h-5 transition-all ${
                            isSelected ? 'text-[#E63946]' : 'text-gray-400'
                          }`} />
                          <h3 className={`font-semibold transition-all ${
                            isSelected ? 'text-white' : 'text-gray-300'
                          }`}>
                            {province.name}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {province.cities.slice(0, 3).map((city) => (
                            <Badge
                              key={city}
                              variant="outline"
                              className={`text-xs transition-all ${
                                isSelected 
                                  ? 'border-[#E63946]/30 text-[#E63946]' 
                                  : 'border-white/20 text-gray-400'
                              }`}
                            >
                              {city}
                            </Badge>
                          ))}
                          {province.cities.length > 3 && (
                            <Badge
                              variant="outline"
                              className={`text-xs transition-all ${
                                isSelected 
                                  ? 'border-[#E63946]/30 text-[#E63946]' 
                                  : 'border-white/20 text-gray-400'
                              }`}
                            >
                              +{province.cities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Selection Checkmark */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-[#E63946] rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Selected Count */}
        {data.locationPreferences && data.locationPreferences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="bg-[#E63946]/20 text-[#E63946] border-[#E63946]/30 px-4 py-2">
              {data.locationPreferences.length} province{data.locationPreferences.length !== 1 ? 's' : ''} selected
            </Badge>
          </motion.div>
        )}

        {/* Continue Button */}
        {data.locationPreferences && data.locationPreferences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center pt-8 pb-8"
          >
            <Button
              onClick={onNext}
              className="bg-[#E63946] hover:bg-[#E63946]/90 text-white px-8 py-4 text-lg font-semibold shadow-[0_0_20px_rgba(230,57,70,0.3)] hover:shadow-[0_0_30px_rgba(230,57,70,0.5)] transition-all"
              size="lg"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
