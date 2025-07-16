import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const createPortalSession = async () => {
  const response = await fetch("/api/create-portal-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })

  const session = await response.json()
  window.location.href = session.url
}
