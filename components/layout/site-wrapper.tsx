"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import RedPreloader from "@/components/ui/red-preloader"

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasLoaded")
    if (hasLoaded) {
      setIsLoading(false)
    } else {
      sessionStorage.setItem("hasLoaded", "true")
    }
  }, [])

  const handleComplete = () => {
    setIsLoading(false)
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <RedPreloader key="preloader" onComplete={handleComplete} />
      ) : (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
