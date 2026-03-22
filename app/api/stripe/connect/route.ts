import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// Initialize Stripe with the secret key we securely saved in .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-02-24.acacia' as any, // latest stable
});

export async function POST(req: Request) {
  try {
    // 1. Create a new Express account for the Farmer
    // This offloads all KYC, identity verification, and 1099 tax forms to Stripe.
    const account = await stripe.accounts.create({
      type: 'express',
      capabilities: {
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    // 2. Generate the secure onboarding link
    // The farmer will be redirected here to enter their checking account info.
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/farmer/dashboard`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/farmer/dashboard?success=true&account_id=${account.id}`,
      type: 'account_onboarding',
    });

    // We send this link back to the frontend so the farmer can click it.
    return NextResponse.json({ url: accountLink.url, accountId: account.id });
  } catch (error: any) {
    console.error("Stripe Connect Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
