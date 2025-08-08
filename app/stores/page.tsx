"use client"

import { useState } from "react"
import { Search, MapPin, Star, Camera, ShoppingBag, Filter, Instagram } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InstagramFeed } from "@/components/ui/instagram-feed"

// Mock data for camera stores
const stores = [
  {
    id: 1,
    name: "Kameraz",
    location: "New York, NY",
    rating: 4.9,
    reviews: 1247,
    specialties: ["Vintage Cameras", "Film Photography", "Rare Lenses", "Camera Restoration"],
    description:
      "Premier destination for vintage and rare camera equipment. Established in 1995, we specialize in classic film cameras, rare lenses, and professional restoration services.",
    image: "/images/photography-workspace.jpg",
    verified: true,
    featured: true,
    instagram: "@kameraz",
    website: "https://kameraz.com",
    established: "1995",
    inventory: "5000+ items",
  },
  {
    id: 2,
    name: "Digital Dreams Camera Store",
    location: "Los Angeles, CA",
    rating: 4.7,
    reviews: 892,
    specialties: ["Digital Cameras", "Mirrorless Systems", "Video Equipment", "Accessories"],
    description:
      "Modern camera store specializing in the latest digital photography and videography equipment. From DSLRs to mirrorless systems and professional video gear.",
    image: "/images/videography-camera.jpg",
    verified: true,
    featured: false,
    instagram: "@digitaldreamscameras",
    website: "https://digitaldreams.com",
    established: "2010",
    inventory: "3000+ items",
  },
  {
    id: 3,
    name: "Lens & Light Photography",
    location: "Chicago, IL",
    rating: 4.8,
    reviews: 654,
    specialties: ["Professional Lenses", "Lighting Equipment", "Studio Gear", "Rentals"],
    description:
      "Professional photography equipment store with extensive rental services. Specializing in high-end lenses, studio lighting, and professional accessories.",
    image: "/images/film-clapperboard.jpg",
    verified: true,
    featured: false,
    instagram: "@lensandlight",
    website: "https://lensandlight.com",
    established: "2008",
    inventory: "2500+ items",
  },
  {
    id: 4,
    name: "Retro Camera Collective",
    location: "Portland, OR",
    rating: 4.6,
    reviews: 423,
    specialties: ["Film Cameras", "Instant Photography", "Vintage Accessories", "Repairs"],
    description:
      "Curated collection of vintage and retro camera equipment. We focus on film photography, instant cameras, and maintaining the art of analog photography.",
    image: "/images/camera-viewfinder.jpg",
    verified: false,
    featured: false,
    instagram: "@retrocameracollective",
    website: "https://retrocamera.com",
    established: "2015",
    inventory: "1800+ items",
  },
]

export default function StoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStore, setSelectedStore] = useState<(typeof stores)[0] | null>(null)
  const [filterSpecialty, setFilterSpecialty] = useState("")

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = !filterSpecialty || store.specialties.includes(filterSpecialty)
    return matchesSearch && matchesFilter
  })

  const allSpecialties = Array.from(new Set(stores.flatMap((store) => store.specialties)))

  if (selectedStore) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => setSelectedStore(null)} className="mb-6">
            ← Back to Stores
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Store Profile */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center">
                        {selectedStore.name}
                        {selectedStore.verified && (
                          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                            Verified
                          </Badge>
                        )}
                        {selectedStore.featured && (
                          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                            Featured
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center mt-2 text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedStore.location}
                      </div>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{selectedStore.rating}</span>
                        <span className="ml-1 text-gray-600">({selectedStore.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Established {selectedStore.established}</p>
                      <p className="text-sm text-gray-600">{selectedStore.inventory}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <img
                    src={selectedStore.image || "/placeholder.svg"}
                    alt={selectedStore.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-700 mb-4">{selectedStore.description}</p>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStore.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button asChild>
                      <a href={selectedStore.website} target="_blank" rel="noopener noreferrer">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Visit Store
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={`https://instagram.com/${selectedStore.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        {selectedStore.instagram}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instagram Feed */}
            <div className="lg:col-span-1">
              <InstagramFeed handle={selectedStore.instagram} className="sticky top-8" postCount={6} />
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Camera Stores</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the best camera stores and equipment retailers. From vintage film cameras to cutting-edge digital
            gear.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search stores, locations, or specialties..."
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

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {store.name}
                      {store.verified && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
                          Verified
                        </Badge>
                      )}
                      {store.featured && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 text-xs">
                          Featured
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center mt-1 text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {store.location}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{store.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <img
                  src={store.image || "/placeholder.svg"}
                  alt={store.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{store.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {store.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {store.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{store.specialties.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{store.reviews} reviews</span>
                  <Button size="sm" onClick={() => setSelectedStore(store)}>
                    View Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
