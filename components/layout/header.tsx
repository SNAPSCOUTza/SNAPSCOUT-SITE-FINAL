'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { getCurrentUser, signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    fetchUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center space-x-4 animate-pulse">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="/images/snapscout-circular-logo.png"
                alt="SnapScout Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                <span className="text-red-600">Snap</span>Scout
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Your Local Companion</p>
            </div>
          </Link>

          {/* Navigation and User Menu */}
          <nav className="flex items-center space-x-4">
            <Link href="/find-crew" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Find Crew
            </Link>
            <Link href="/studios" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Studios
            </Link>
            <Link href="/stores" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Stores
            </Link>

            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <Button asChild variant="outline" size="sm" className="flex items-center space-x-1">
                  <Link href="/dashboard">
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button asChild className="ml-4 bg-red-600 hover:bg-red-700 text-white">
                <Link href="/onboarding">
                  <User className="w-4 h-4 mr-2" />
                  Join as Pro
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
