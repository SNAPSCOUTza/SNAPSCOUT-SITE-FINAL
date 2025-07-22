"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, User, Filter, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

// Department and role mapping
const departmentRoles = {
  Camera: ["Director of Photography", "Camera Operator", "Focus Puller", "Camera Assistant"],
  Audio: ["Sound Engineer", "Boom Operator", "Sound Mixer", "Audio Post Supervisor"],
  Lighting: ["Gaffer", "Best Boy Electric", "Lighting Technician", "Electrician"],
  Production: ["Script Supervisor", "Assistant Director", "Production Manager", "Location Manager"],
  Art: ["Production Designer", "Art Director", "Set Decorator", "Props Master"],
  "Hair & Makeup": ["Makeup Artist", "Hair Stylist", "Special Effects Makeup", "Wardrobe Stylist"],
  "Post Production": ["Editor", "Colorist", "VFX Artist", "Motion Graphics Designer"],
  Direction: ["Director", "Assistant Director", "Script Supervisor", "Continuity"],
}

const locations = ["Cape Town, SA", "Johannesburg, SA", "Durban, SA", "Pretoria, SA", "Port Elizabeth, SA"]

// Mock data for crew members
const crewMembers = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Director of Photography",
    department: "Camera",
    location: "Cape Town, SA",
    availability: "Available",
    profilePicture: "/images/janelle-hiroshige-gfG_csFvelY-unsplash.jpg",
    experience: "8 years",
    experienceLevel: "Senior",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    role: "Sound Engineer",
    department: "Audio",
    location: "Johannesburg, SA",
    availability: "Booked",
    profilePicture: "/images/kyle-loftus-FtQE89f3EXA-unsplash.jpg",
    experience: "6 years",
    experienceLevel: "Mid",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    role: "Gaffer",
    department: "Lighting",
    location: "Durban, SA",
    availability: "Available",
    profilePicture: "/images/marco-xu-ToUPBCO62Lw-unsplash.jpg",
    experience: "10 years",
    experienceLevel: "Senior",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Emma Chen",
    role: "Script Supervisor",
    department: "Production",
    location: "Cape Town, SA",
    availability: "Available",
    profilePicture: "/images/janelle-hiroshige-gfG_csFvelY-unsplash.jpg",
    experience: "5 years",
    experienceLevel: "Mid",
    rating: 4.7,
  },
  {
    id: 5,
    name: "David Park",
    role: "Focus Puller",
    department: "Camera",
    location: "Johannesburg, SA",
    availability: "Booked",
    profilePicture: "/images/kyle-loftus-FtQE89f3EXA-unsplash.jpg",
    experience: "7 years",
    experienceLevel: "Mid",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Lisa Johnson",
    role: "Production Designer",
    department: "Art",
    location: "Cape Town, SA",
    availability: "Available",
    profilePicture: "/images/marco-xu-ToUPBCO62Lw-unsplash.jpg",
    experience: "12 years",
    experienceLevel: "Senior",
    rating: 4.8,
  },
  {
    id: 7,
    name: "James Wilson",
    role: "Boom Operator",
    department: "Audio",
    location: "Durban, SA",
    availability: "Available",
    profilePicture: "/images/janelle-hiroshige-gfG_csFvelY-unsplash.jpg",
    experience: "4 years",
    experienceLevel: "Mid",
    rating: 4.6,
  },
  {
    id: 8,
    name: "Maria Santos",
    role: "Makeup Artist",
    department: "Hair & Makeup",
    location: "Johannesburg, SA",
    availability: "Booked",
    profilePicture: "/images/kyle-loftus-FtQE89f3EXA-unsplash.jpg",
    experience: "9 years",
    experienceLevel: "Senior",
    rating: 4.9,
  },
  {
    id: 9,
    name: "Tom Anderson",
    role: "Editor",
    department: "Post Production",
    location: "Cape Town, SA",
    availability: "Available",
    profilePicture: "/images/marco-xu-ToUPBCO62Lw-unsplash.jpg",
    experience: "3 years",
    experienceLevel: "Entry-level",
    rating: 4.5,
  },
  {
    id: 10,
    name: "Rachel Green",
    role: "Director",
    department: "Direction",
    location: "Johannesburg, SA",
    availability: "Available",
    profilePicture: "/images/janelle-hiroshige-gfG_csFvelY-unsplash.jpg",
    experience: "15 years",
    experienceLevel: "Senior",
    rating: 4.9,
  },
]

export default function FindFilmCrew() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter states
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedAvailability, setSelectedAvailability] = useState("")
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("")

  // Get available roles based on selected departments
  const availableRoles = useMemo(() => {
    if (selectedDepartments.length === 0) {
      return Object.values(departmentRoles).flat()
    }
    return selectedDepartments.flatMap((dept) => departmentRoles[dept as keyof typeof departmentRoles] || [])
  }, [selectedDepartments])

  // Filter crew members
  const filteredCrew = useMemo(() => {
    return crewMembers.filter((member) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.location.toLowerCase().includes(searchTerm.toLowerCase())

      // Department filter
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(member.department)

      // Role filter
      const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(member.role)

      // Location filter
      const matchesLocation = selectedLocation === "" || member.location === selectedLocation

      // Availability filter
      const matchesAvailability = selectedAvailability === "" || member.availability === selectedAvailability

      // Experience level filter
      const matchesExperience = selectedExperienceLevel === "" || member.experienceLevel === selectedExperienceLevel

      return (
        matchesSearch && matchesDepartment && matchesRole && matchesLocation && matchesAvailability && matchesExperience
      )
    })
  }, [searchTerm, selectedDepartments, selectedRoles, selectedLocation, selectedAvailability, selectedExperienceLevel])

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(department) ? prev.filter((d) => d !== department) : [...prev, department],
    )
    // Clear role selection when departments change
    setSelectedRoles([])
  }

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const clearAllFilters = () => {
    setSelectedDepartments([])
    setSelectedRoles([])
    setSelectedLocation("")
    setSelectedAvailability("")
    setSelectedExperienceLevel("")
    setSearchTerm("")
  }

  const activeFiltersCount = [
    selectedDepartments.length > 0,
    selectedRoles.length > 0,
    selectedLocation !== "",
    selectedAvailability !== "",
    selectedExperienceLevel !== "",
  ].filter(Boolean).length

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-red-600 hover:text-red-700">
            Clear All
          </Button>
        )}
      </div>

      {/* Department Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Department {selectedDepartments.length > 0 && `(${selectedDepartments.length})`}
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {Object.keys(departmentRoles).map((department) => (
            <label key={department} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDepartments.includes(department)}
                onChange={() => handleDepartmentChange(department)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{department}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Role Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role {selectedRoles.length > 0 && `(${selectedRoles.length})`}
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableRoles.map((role) => (
            <label key={role} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => handleRoleChange(role)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{role}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value=""
              checked={selectedAvailability === ""}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">All</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="Available"
              checked={selectedAvailability === "Available"}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Available</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="Booked"
              checked={selectedAvailability === "Booked"}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="text-red-600 focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">Booked</span>
          </label>
        </div>
      </div>

      {/* Experience Level Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
        <select
          value={selectedExperienceLevel}
          onChange={(e) => setSelectedExperienceLevel(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
        >
          <option value="">All Levels</option>
          <option value="Entry-level">Entry-level</option>
          <option value="Mid">Mid-level</option>
          <option value="Senior">Senior</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/snapscout-new-logo.jpeg"
                alt="SnapScout Logo: People Create Utility Tools"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full bg-white border border-gray-200"
              />
              <div>
                <span className="text-xl font-bold text-gray-900">SnapScout</span>
                <p className="text-xs text-gray-500 -mt-1">Your Local Companion</p>
              </div>
            </Link>

            <nav className="flex items-center">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Link
                  href="/find-crew"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white text-red-700 shadow-sm"
                >
                  Find Crew
                </Link>
                <Link
                  href="/studios"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-700 transition-colors"
                >
                  Studios
                </Link>
                <Link
                  href="/stores"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-700 transition-colors"
                >
                  Stores
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">Find Film Crew</h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with talented film crew members in your area. From directors of photography to sound engineers,
              find the perfect team for your next production.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, role, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-lg p-6">
                <FilterSidebar />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Button onClick={() => setShowMobileFilters(true)} variant="outline" className="mb-4 w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            {/* Mobile Filter Overlay */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
                <div className="fixed right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <FilterSidebar />
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Available Crew Members ({filteredCrew.length})
                </h2>
                <p className="text-gray-600">Browse through our verified film crew professionals</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCrew.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3 mb-3">
                          <Image
                            src={member.profilePicture || "/placeholder.svg"}
                            alt={`${member.name} profile picture`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900">{member.name}</CardTitle>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {member.department}
                            </Badge>
                            <Badge
                              className={`text-xs ${
                                member.availability === "Available"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }`}
                            >
                              {member.availability}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {member.experienceLevel}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {member.location}
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {member.experience} experience
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="text-yellow-500 mr-1">★</span>
                              {member.rating}
                            </div>
                            <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white" disabled>
                              <User className="h-4 w-4 mr-1" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredCrew.length === 0 && (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="max-w-md mx-auto">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No crew members found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search terms or filters to find more results.
                    </p>
                    <Button onClick={clearAllFilters} className="bg-red-700 hover:bg-red-800">
                      Clear All Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-red-700 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Dream Team?</h2>
            <p className="text-red-100 mb-6">
              Join SnapScout to connect with verified film crew professionals and bring your creative vision to life.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-red-700 hover:bg-gray-100" disabled>
              Join SnapScout
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
