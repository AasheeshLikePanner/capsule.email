import { Checkout } from '@polar-sh/nextjs'
import { NextRequest } from 'next/server'

const handler = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: `https://capsule-email.vercel.app/success`, // use https from ngrok
  server: "production",
})

export const GET = async (req: NextRequest) => {
  try {
    return await handler(req)
  } catch (err) {
    console.error('Checkout error:', err)
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500 }
    )
  }
}
