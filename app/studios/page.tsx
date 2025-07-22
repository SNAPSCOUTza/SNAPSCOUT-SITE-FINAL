"use client"

import { useState } from "react"
import { Search, MapPin, Star, Camera, Calendar, Filter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InstagramFeed } from "@/components/ui/instagram-feed"

// Mock data for studios
const studios = [
  {
    id: 1,
    name: "Lumina Studios",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 234,
    specialties: ["Portrait Photography", "Commercial Shoots", "Fashion Photography"],
    description:
      "Premier photography studio in the heart of LA. State-of-the-art equipment and professional lighting setups for all your creative needs.",
    image: "/images/photography-workspace.jpg",
    hourlyRate: "$150-300",
    availability: "Available",
    verified: true,
    featured: true,
    instagram: "@luminastudios",
    website: "https://luminastudios.com",
  },
  {
    id: 2,
    name: "Creative Space NYC",
    location: "New York, NY",
    rating: 4.7,
    reviews: 189,
    specialties: ["Video Production", "Live Streaming", "Podcast Recording"],
    description:
      "Modern studio space perfect for video content creation, live streaming, and podcast recording. Professional audio and video equipment included.",
    image: "/images/videography-camera.jpg",
    hourlyRate: "$200-400",
    availability: "Booked until next week",
    verified: true,
    featured: false,
    instagram: "@creativespace_nyc",
    website: "https://creativespace.nyc",
  },
  {
    id: 3,
    name: "Film House Studio",
    location: "Atlanta, GA",
    rating: 4.8,
    reviews: 156,
    specialties: ["Film Production", "Music Videos", "Documentary"],
    description:
      "Full-service film studio with multiple sets, green screen capabilities, and professional film equipment. Perfect for indie films and music videos.",
    image: "/images/film-clapperboard.jpg",
    hourlyRate: "$300-500",
    availability: "Available",
    verified: false,
    featured: false,
    instagram: "@filmhousestudio",
    website: "https://filmhouse.studio",
  },
  {
    id: 4,
    name: "Viewfinder Studios",
    location: "Chicago, IL",
    rating: 4.6,
    reviews: 98,
    specialties: ["Product Photography", "E-commerce", "Lifestyle Shoots"],
    description:
      "Specialized studio for product photography and e-commerce shoots. Clean, minimalist setup with professional lighting for stunning product images.",
    image: "/images/camera-viewfinder.jpg",
    hourlyRate: "$100-250",
    availability: "Available",
    verified: true,
    featured: false,
    instagram: "@viewfinderstudios",
    website: "https://viewfinder.studio",
  },
]

export default function StudiosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudio, setSelectedStudio] = useState<(typeof studios)[0] | null>(null)
  const [filterSpecialty, setFilterSpecialty] = useState("")

  const filteredStudios = studios.filter((studio) => {
    const matchesSearch =
      studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = !filterSpecialty || studio.specialties.includes(filterSpecialty)
    return matchesSearch && matchesFilter
  })

  const allSpecialties = Array.from(new Set(studios.flatMap((studio) => studio.specialties)))

  if (selectedStudio) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => setSelectedStudio(null)} className="mb-6">
            ← Back to Studios
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Studio Profile */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center">
                        {selectedStudio.name}
                        {selectedStudio.verified && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                        {selectedStudio.featured && (
                          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                            Featured
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center mt-2 text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedStudio.location}
                      </div>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{selectedStudio.rating}</span>
                        <span className="ml-1 text-gray-600">({selectedStudio.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{selectedStudio.hourlyRate}/hr</p>
                      <p className="text-sm text-gray-600">{selectedStudio.availability}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <img
                    src={selectedStudio.image || "/placeholder.svg"}
                    alt={selectedStudio.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-700 mb-4">{selectedStudio.description}</p>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudio.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Studio
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={selectedStudio.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={`https://instagram.com/${selectedStudio.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        {selectedStudio.instagram}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Feed */}
            <div className="lg:col-span-1">
              <InstagramFeed handle={selectedStudio.instagram} className="sticky top-8" postCount={6} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photography Studios</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect studio space for your next shoot. From portrait sessions to commercial productions.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search studios, locations, or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specialties</option>
              {allSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudios.map((studio) => (
            <Card key={studio.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {studio.name}
                      {studio.verified && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                          Verified
                        </Badge>
                      )}
                      {studio.featured && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 text-xs">
                          Featured
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center mt-1 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {studio.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{studio.rating}</span>
                    </div>
                    <p className="text-sm font-semibold text-green-600">{studio.hourlyRate}/hr</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <img
                  src={studio.image || "/placeholder.svg"}
                  alt={studio.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{studio.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {studio.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {studio.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{studio.specialties.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{studio.availability}</span>
                  <Button size="sm" onClick={() => setSelectedStudio(studio)}>
                    View Studio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudios.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No studios found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
