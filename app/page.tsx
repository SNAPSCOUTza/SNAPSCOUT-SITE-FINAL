"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Star,
  Search,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Instagram,
  Linkedin,
  Heart,
  Eye,
  Award,
  Youtube,
  Camera,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Facebook } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beams" // Import the BackgroundBeams component
import { PreviewButtonWithRedHover } from "@/components/ui/preview-button-with-red-hover" // Import the new button
import { useState, useEffect } from "react"
import Preloader from "@/components/ui/preloader"
import { motion } from "framer-motion"

export default function SnapScoutLanding() {
  const [showPreloader, setShowPreloader] = useState(true)

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setShowPreloader(false)
    }, 3000) // Adjust this duration as needed

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      {!showPreloader && (
        <div className="min-h-screen bg-white">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex items-center space-x-2">
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
              </div>

              <div className="flex items-center space-x-4"></div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 sm:py-32 bg-white">
            {" "}
            {/* Added bg-gray-900 for better contrast with beams */}
            {/* Background Beams */}
            <BackgroundBeams className="absolute inset-0 w-full h-full max-w-none" />{" "}
            {/* BackgroundBeams component as background */}
            <div className="relative z-10">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Badge variant="secondary" className="mb-4 bg-red-50 text-red-700">
                      ✨ Your Local Companion
                    </Badge>
                  </motion.div>

                  <motion.h1
                    className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Connecting you with the people and tools to give you the utility to create
                    <Badge variant="secondary" className="ml-4 bg-yellow-100 text-yellow-800 text-sm">
                      Coming Soon
                    </Badge>
                  </motion.h1>

                  <motion.p
                    className="mt-6 text-lg leading-8 text-gray-700 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    Discover talented local photographers, videographers, and content creators in your area based on
                    portfolio quality. Your local companion for finding the perfect creative partner
                  </motion.p>

                  <motion.div
                    className="mt-10 flex items-center justify-center gap-x-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <PreviewButtonWithRedHover
                      onClick={() => window.open("https://www.youtube.com/watch?v=cpQKutRoglo", "_blank")}
                      className="h-11 px-6"
                    >
                      Preview
                    </PreviewButtonWithRedHover>
                  </motion.div>

                  <motion.p
                    className="mt-4 text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                  >
                    Launching Soon • Be the first to know • Join our waitlist
                  </motion.p>
                </div>
              </div>

              {/* Trust Indicators */}
              <motion.div
                className="mt-16 container mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="flex items-center justify-center space-x-8 text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm">Verified Creators</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">Secure Payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span className="text-sm">Quality Guaranteed</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Featured Creators Section */}
          <section id="creators" className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
              <motion.div
                className="mx-auto max-w-2xl text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Discover Amazing Creators
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Browse portfolios from talented creatives across different specialties
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Creator Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <Image
                        src="/images/photography-workspace.jpg"
                        alt="Photography workspace with DSLR camera and laptop"
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-gray-700">Photography</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Sarah Chen</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                      </div>
                      <CardDescription>Portrait & Event Photography</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>127 projects</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>98% satisfaction</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Specializing in authentic moments and natural lighting. Available for weddings, corporate
                        events, and portraits.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">From $150/hr</span>
                        <Button size="sm" variant="outline" disabled>
                          Coming Soon
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Creator Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <Image
                        src="/images/videography-camera.jpg"
                        alt="Professional videography camera in golden hour"
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-gray-700">Videography</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Marcus Rodriguez</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">5.0</span>
                        </div>
                      </div>
                      <CardDescription>Brand & Product Videos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>89 projects</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>100% satisfaction</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Creating compelling brand stories through cinematic visuals. Expert in product launches and
                        commercial content.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">From $300/day</span>
                        <Button size="sm" variant="outline" disabled>
                          Coming Soon
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Creator Card 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <Image
                        src="/images/film-clapperboard.jpg"
                        alt="Film production clapperboard in desert setting"
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 text-gray-700">Design</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Emma Thompson</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      <CardDescription>Social Media & Brand Design</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>203 projects</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>96% satisfaction</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Crafting scroll-stopping visuals for social media and brand campaigns. Specializing in Instagram
                        and TikTok content.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">From $75/post</span>
                        <Button size="sm" variant="outline" disabled>
                          Coming Soon
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="px-8" disabled>
                  Launching Soon
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="bg-gray-50 py-24 sm:py-32">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Simple. Transparent. Effective.
                </h2>
                <p className="mt-4 text-lg text-gray-600">Book the perfect creative in just a few clicks</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                {/* How it works steps */}
                {[...Array(5)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {index === 0 && (
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-6">
                          <Search className="h-8 w-8 text-red-700" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">1. Discover Local Talent</h3>
                        <p className="text-gray-600">
                          Explore curated portfolios from verified local creatives in your area. Filter by style,
                          location, and budget to find your perfect local match.
                        </p>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-6">
                          <MessageCircle className="h-8 w-8 text-red-700" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">2. Connect & Plan</h3>
                        <p className="text-gray-600">
                          Message creators directly to discuss your project. Share your vision and get custom proposals
                          with transparent pricing.
                        </p>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-6">
                          <CheckCircle className="h-8 w-8 text-red-700" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">3. Book & Create</h3>
                        <p className="text-gray-600">
                          Secure your booking with protected payments. Collaborate seamlessly and receive your stunning
                          content on time.
                        </p>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-6">
                          <Camera className="h-8 w-8 text-red-700" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">4. Gear & Studio Rental</h3>
                        <p className="text-gray-600">
                          Access a marketplace for local gear and studio rentals. Find the equipment and space you need
                          to bring your creative vision to life.
                        </p>
                      </>
                    )}
                    {index === 4 && (
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-6">
                          <Star className="h-8 w-8 text-red-700" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4">5. No Algorithm Needed</h3>
                        <p className="text-gray-600">
                          SnapScout gets you booked without the algorithm — no reels, no trends, just real work seen by
                          real clients.
                        </p>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Trusted by Brands & Creators
                </h2>
                <p className="mt-4 text-lg text-gray-600">See what our community has to say about SnapScout</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Testimonial Cards */}
                {[...Array(3)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    {index === 0 && (
                      <Card className="bg-white border-0 shadow-lg">
                        <CardHeader>
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <CardTitle className="text-lg">Found our perfect photographer</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            "SnapScout helped us find an amazing photographer for our product launch. The quality of
                            work was incredible, and the booking process was so smooth. No more guessing based on
                            follower counts!"
                          </p>
                          <div className="flex items-center space-x-3">
                            <Image
                              src="/images/janelle-hiroshige-gfG_csFvelY-unsplash.jpg"
                              alt="Profile picture of Jessica Park"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">Jessica Park</p>
                              <p className="text-sm text-gray-600">Marketing Director, TechFlow</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {index === 1 && (
                      <Card className="bg-white border-0 shadow-lg">
                        <CardHeader>
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <CardTitle className="text-lg">Game-changer for creators</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            "As a creator, I love that clients can see my actual work first. I've booked more quality
                            projects through SnapScout than any other platform. It's refreshing to be valued for my
                            craft!"
                          </p>
                          <div className="flex items-center space-x-3">
                            <Image
                              src="/images/marco-xu-ToUPBCO62Lw-unsplash.jpg"
                              alt="Profile picture of David Kim"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">David Kim</p>
                              <p className="text-sm text-gray-600">Photographer & Content Creator</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {index === 2 && (
                      <Card className="bg-white border-0 shadow-lg">
                        <CardHeader>
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <CardTitle className="text-lg">Exceptional quality every time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            "We've used SnapScout for multiple campaigns and the quality has been consistently
                            outstanding. The platform makes it easy to find creators who truly understand our brand
                            vision."
                          </p>
                          <div className="flex items-center space-x-3">
                            <Image
                              src="/images/kyle-loftus-FtQE89f3EXA-unsplash.jpg"
                              alt="Profile picture of Maria Santos"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">Maria Santos</p>
                              <p className="text-sm text-gray-600">Brand Manager, Lifestyle Co.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="bg-gray-50 py-24 sm:py-32">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple Monthly Plans</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Choose the plan that fits your creative business. Clients always browse and book for free.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Pricing Cards */}
                {[...Array(3)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.15 }}
                    viewport={{ once: true }}
                  >
                    {index === 0 && (
                      <Card className="bg-white border-2 border-gray-200">
                        <CardHeader className="text-center">
                          <CardTitle className="text-2xl">Clients</CardTitle>
                          <CardDescription>Find and book amazing creators</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <span className="text-4xl font-bold text-green-600">Free</span>
                            <p className="text-gray-600">Always free to use</p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Browse unlimited portfolios</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Message creators directly</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Secure booking & payments</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Project management tools</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>24/7 customer support</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-red-700 hover:bg-red-800" disabled>
                            Launching Soon
                          </Button>
                        </CardFooter>
                      </Card>
                    )}
                    {index === 1 && (
                      <Card className="bg-white border-2 border-red-200 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-red-700">Most Popular</Badge>
                        </div>
                        <CardHeader className="text-center">
                          <CardTitle className="text-2xl">Creators</CardTitle>
                          <CardDescription>Individual photographers & content creators</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <span className="text-4xl font-bold">R60</span>
                            <p className="text-gray-600">/month</p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Professional portfolio showcase</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Unlimited project applications</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Direct client messaging</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Analytics & insights</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Priority support</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-red-700 hover:bg-red-800" disabled>
                            Join Waitlist
                          </Button>
                        </CardFooter>
                      </Card>
                    )}
                    {index === 2 && (
                      <Card className="bg-white border-2 border-gray-200">
                        <CardHeader className="text-center">
                          <CardTitle className="text-2xl">Studios</CardTitle>
                          <CardDescription>Production companies & creative agencies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <span className="text-4xl font-bold">R300</span>
                            <p className="text-gray-600">/month</p>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Team portfolio management</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Multiple creator profiles</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Advanced project tools</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Studio branding options</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span>Dedicated account manager</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant="outline" disabled>
                            Notify Me
                          </Button>
                        </CardFooter>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="bg-red-700 py-24 sm:py-32">
            <div className="container mx-auto px-4">
              <motion.div
                className="mx-auto max-w-2xl text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Your Local Creative Companion is Coming Soon
                </h2>
                <p className="mt-4 text-lg text-red-50">
                  SnapScout is launching soon! Be the first to discover amazing local talent in your area.
                </p>

                <Button size="lg" variant="secondary" className="px-8" disabled>
                  Join Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-red-700"
                  disabled
                >
                  Get Notified
                </Button>

                <p className="mt-4 text-sm text-red-100">Coming Soon • Be the first to experience SnapScout</p>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-16">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/images/snapscout-new-logo.jpeg"
                        alt="SnapScout Logo: People Create Utility Tools"
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full bg-white border border-gray-700"
                      />
                      <div>
                        <span className="text-xl font-bold">SnapScout</span>
                        <p className="text-xs text-gray-400">Your Local Companion</p>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-400">
                      Your local companion for connecting with talented creators based on portfolio quality, not
                      follower count.
                    </p>
                    <div className="mt-6 flex space-x-4">
                      <Link
                        href="https://www.instagram.com/snapscout_int/"
                        className="text-gray-400 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-5 w-5" />
                      </Link>
                      <Link
                        href="https://www.linkedin.com/company/snapscout-int-za/"
                        className="text-gray-400 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-5 w-5" />
                      </Link>
                      <Link
                        href="https://www.youtube.com/watch?v=cpQKutRoglo"
                        className="text-gray-400 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Youtube className="h-5 w-5" />
                      </Link>
                      <Link
                        href="https://www.facebook.com/people/SnapScoutZA/61556883658539/?mibextid=kFxxJD&rdid=N2Juv3pTTWNI7iWh&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FwafakqCvNNiLoHnQ%2F%3Fmibextid%3DkFxxJD"
                        className="text-gray-400 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-5 w-5" />
                      </Link>
                      {/* Removed the Mail icon as no mail link was provided */}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider">For Clients</h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Browse Creators
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          How It Works
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Pricing
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Success Stories
                        </Link>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider">For Creators</h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Join SnapScout
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Creator Resources
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Portfolio Tips
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Community
                        </Link>
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Help Center
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Safety & Trust
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                          Terms of Service
                        </Link>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>

              <div className="mt-12 border-t border-gray-800 pt-8">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                  <p className="text-gray-400">© {new Date().getFullYear()} SnapScout. All rights reserved.</p>
                  <div className="mt-4 flex space-x-6 lg:mt-0">
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      Cookie Policy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  )
}
