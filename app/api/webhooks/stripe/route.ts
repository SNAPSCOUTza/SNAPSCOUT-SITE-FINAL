import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(updatedSubscription)
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(deletedSubscription)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  if (!userId) return

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

  await supabase.from("user_subscriptions").upsert({
    user_id: userId,
    subscription_id: subscription.id,
    customer_id: session.customer as string,
    status: "active",
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await supabase
    .from("user_subscriptions")
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq("subscription_id", subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabase.from("user_subscriptions").update({ status: "cancelled" }).eq("subscription_id", subscription.id)
}
