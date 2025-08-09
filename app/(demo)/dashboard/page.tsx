"use client"

import { ProfileForm } from "@/components/demo/profile-form"

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
        <p className="text-gray-600 mt-1">
          Changes are saved automatically to your browser. View your work on the{" "}
          <a href="/profile" className="text-primary hover:underline font-medium">
            Live Preview
          </a>{" "}
          page.
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}
