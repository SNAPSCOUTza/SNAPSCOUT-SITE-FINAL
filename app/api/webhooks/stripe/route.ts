import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  // ---------------------------------------------------------------------------
  // 1. Environment variables
  // ---------------------------------------------------------------------------
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecret || !webhookSecret) {
    console.error("Stripe environment variables (STRIPE_SECRET_KEY and/or STRIPE_WEBHOOK_SECRET) are missing.")
    return NextResponse.json({ error: "Server mis-configuration" }, { status: 500 })
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // ---------------------------------------------------------------------------
  // 2. Get raw body + Stripe signature
  // ---------------------------------------------------------------------------
  const rawBody = await request.text()
  const signature = request.headers.get("stripe-signature") ?? ""

  // ---------------------------------------------------------------------------
  // 3. Verify the event
  // ---------------------------------------------------------------------------
  let event: Stripe.Event
  try {
    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-04-10" })
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error("Failed to verify Stripe webhook:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // ---------------------------------------------------------------------------
  // 4. Handle the event types you care about
  // ---------------------------------------------------------------------------
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(supabase, session)
      break
    }
    case "customer.subscription.updated": {
      const updatedSubscription = event.data.object as Stripe.Subscription
      await handleSubscriptionUpdated(supabase, updatedSubscription)
      break
    }
    case "customer.subscription.deleted": {
      const deletedSubscription = event.data.object as Stripe.Subscription
      await handleSubscriptionDeleted(supabase, deletedSubscription)
      break
    }
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

async function handleCheckoutCompleted(supabase: any, session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  if (!userId) return

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })
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

async function handleSubscriptionUpdated(supabase: any, subscription: Stripe.Subscription) {
  await supabase
    .from("user_subscriptions")
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq("subscription_id", subscription.id)
}

async function handleSubscriptionDeleted(supabase: any, subscription: Stripe.Subscription) {
  await supabase.from("user_subscriptions").update({ status: "cancelled" }).eq("subscription_id", subscription.id)
}
