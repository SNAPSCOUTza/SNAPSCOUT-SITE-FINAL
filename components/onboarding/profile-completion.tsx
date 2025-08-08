"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, DollarSign, Briefcase, Star } from 'lucide-react'
import type { OnboardingData } from "@/app/onboarding/page"

interface ProfileCompletionProps {
  onNext: () => void
  onPrev: () => void
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
}

const experienceLevels = [
  { value: 'beginner', label: 'Beginner (0-2 years)' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)' },
  { value: 'experienced', label: 'Experienced (5-10 years)' },
  { value: 'expert', label: 'Expert (10+ years)' }
]

const languages = [
  'English', 'Afrikaans', 'Zulu', 'Xhosa', 'Sotho', 'Tswana', 'Venda', 'Tsonga', 'Ndebele', 'Swati', 'Portuguese', 'French', 'German'
]

const creatorServices = [
  'Portrait Photography', 'Wedding Photography', 'Event Photography', 'Commercial Photography',
  'Product Photography', 'Fashion Photography', 'Landscape Photography', 'Street Photography',
  'Videography', 'Drone Photography', 'Photo Editing', 'Video Editing'
]

const creatorGear = [
  'DSLR Camera', 'Mirrorless Camera', 'Professional Lenses', 'Lighting Equipment',
  'Tripods & Stabilizers', 'Drone', 'Audio Equipment', 'Editing Software'
]

const creatorSkills = [
  'Adobe Photoshop', 'Adobe Lightroom', 'Adobe Premiere Pro', 'Final Cut Pro',
  'Color Grading', 'Retouching', 'Studio Lighting', 'Natural Light Photography'
]

export default function ProfileCompletion({ onNext, onPrev, data, updateData }: ProfileCompletionProps) {
  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    updateData({ [field]: value })
  }

  const handleArrayToggle = (field: keyof OnboardingData, value: string) => {
    const currentArray = (data[field] as string[]) || []
    const isSelected = currentArray.includes(value)
    
    if (isSelected) {
      updateData({
        [field]: currentArray.filter(item => item !== value)
      })
    } else {
      updateData({
        [field]: [...currentArray, value]
      })
    }
  }

  const isCreator = data.userType === 'creator'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Complete Your Professional Profile
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Add professional details to make your profile stand out (all fields are optional)
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-8"
      >
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-primary" />
              Professional Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full legal name"
                  value={data.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="e.g., Cape Town"
                  value={data.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel" className="text-gray-700">Experience Level</Label>
                <Select value={data.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                  <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsExperience" className="text-gray-700">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  placeholder="e.g., 5"
                  value={data.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  className="bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isCreator && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                Pricing Information
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-gray-700">Hourly Rate (ZAR)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="e.g., 500"
                    value={data.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyRate" className="text-gray-700">Daily Rate (ZAR)</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    placeholder="e.g., 3000"
                    value={data.dailyRate}
                    onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectRate" className="text-gray-700">Project Rate (ZAR)</Label>
                  <Input
                    id="projectRate"
                    type="number"
                    placeholder="Starting from..."
                    value={data.projectRate}
                    onChange={(e) => handleInputChange('projectRate', e.target.value)}
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Languages Spoken</h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => {
                const isSelected = data.languagesSpoken?.includes(language) || false
                return (
                  <Badge
                    key={language}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                    }`}
                    onClick={() => handleArrayToggle('languagesSpoken', language)}
                  >
                    {language}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {isCreator && (
          <>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {creatorServices.map((service) => {
                    const isSelected = data.servicesOffered?.includes(service) || false
                    return (
                      <Badge
                        key={service}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                        onClick={() => handleArrayToggle('servicesOffered', service)}
                      >
                        {service}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Equipment & Gear</h2>
                <div className="flex flex-wrap gap-2">
                  {creatorGear.map((gear) => {
                    const isSelected = data.gearOwned?.includes(gear) || false
                    return (
                      <Badge
                        key={gear}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                        onClick={() => handleArrayToggle('gearOwned', gear)}
                      >
                        {gear}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary" />
                  Special Skills & Software
                </h2>
                <div className="flex flex-wrap gap-2">
                  {creatorSkills.map((skill) => {
                    const isSelected = data.specialSkills?.includes(skill) || false
                    return (
                      <Badge
                        key={skill}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                        onClick={() => handleArrayToggle('specialSkills', skill)}
                      >
                        {skill}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Professional Links</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-gray-700">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={data.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      className="bg-gray-50 border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imdbProfile" className="text-gray-700">IMDB Profile</Label>
                    <Input
                      id="imdbProfile"
                      type="url"
                      placeholder="https://imdb.com/name/yourprofile"
                      value={data.imdbProfile}
                      onChange={(e) => handleInputChange('imdbProfile', e.target.value)}
                      className="bg-gray-50 border-gray-300 text-gray-900"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="text-center pt-8 pb-8">
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg"
            size="lg"
          >
            Complete Profile
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
