import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isMFARoute = createRouteMatcher(['/mfa(.*)'])
const isSignInRoute = createRouteMatcher(['/sign-in(.*)'])
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (userId !== null && isSignInRoute(req) && !isMFARoute(req)) {
    // redirect to root if logged in
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (userId !== null && !isMFARoute(req)) {
    const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    })

    const userData = await res.json()


    if (userData.two_factor_enabled === false) {
      return NextResponse.redirect(new URL('/mfa', req.url))

    }



  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
