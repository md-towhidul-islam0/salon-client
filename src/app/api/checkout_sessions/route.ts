import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { getSessionByserver } from '@/lib/core/Importantfunction'

export async function POST(req: Request) {

  const { searchParams } = new URL(req.url);

  const serviceID = searchParams.get("serviceID");

  const Usersession=await getSessionByserver();
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1UeJlPLTlnkYabdCfryiGTKX',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: Usersession?.user.email,
      metadata: {
        serviceID :serviceID as string,
        userID: Usersession?.user.id as string,
      },
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'hair_salon_001',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}