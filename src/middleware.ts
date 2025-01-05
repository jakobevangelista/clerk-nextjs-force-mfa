import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isMFARoute = createRouteMatcher(['/mfa(.*)'])
const isSignInRoute = createRouteMatcher(['/sign-in(.*)'])
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  if (userId !== null && isSignInRoute(req) && !isMFARoute(req)) {
    // redirect to root if logged in
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (userId !== null && !isMFARoute(req)) {
    if (sessionClaims.isMfa === false) {
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
