import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join SnapScout",
  description: "Start your journey with SnapScout by creating your professional profile.",
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
