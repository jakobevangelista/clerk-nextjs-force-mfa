<p align="center"> <a href="https://go.clerk.com/e3UDpP4" target="_blank" rel="noopener noreferrer"> <picture> <source media="(prefers-color-scheme: dark)" srcset="./public/light-logo.png"> <img src="./public/dark-logo.png" height="64"> </picture> </a> <br /> </p> <div align="center"> <h1> Next.js Clerk MFA Enforcement Guide </h1> <a href="https://www.npmjs.com/package/@clerk/clerk-js"> <img alt="" src="https://img.shields.io/npm/dm/@clerk/clerk-js" /> </a> <a href="https://discord.com/invite/b5rXHjAg7A"> <img alt="Discord" src="https://img.shields.io/discord/856971667393609759?color=7389D8&label&logo=discord&logoColor=ffffff" /> </a> <a href="https://twitter.com/clerkdev"> <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40clerkdev&style=social&url=https%3A%2F%2Ftwitter.com%2Fclerkdev" /> </a> <br /> <br /> <img alt="Clerk MFA Hero Image" src="public/og.png"> </div>

# Introduction

This repository provides a practical example of enforcing Multi-Factor Authentication (MFA) in a Next.js application using Clerk. The guide demonstrates how to utilize Clerk's middleware to detect when a user does not have MFA enabled and redirect them to a setup page.

### Features:
Middleware to enforce MFA for secure access.
Redirect logic for users without MFA to set it up.
Seamless integration with Clerk's SDK and Next.js App Router.
Pre-configured example to get started quickly.
Demo
A live demo showcasing this MFA enforcement setup is available at https://clerk-nextjs-mfa-demo.vercel.app.

## Deploy
You can deploy this template directly to Vercel using the button below. Ensure the required environment variables are configured in the Vercel dashboard.



Getting Started
```bash
git clone https://github.com/jakobevangelista/clerk-nextjs-force-mfa
```
Steps:
Sign up for a Clerk account: Clerk.com.
Create a Clerk application: Visit the Clerk Dashboard.

Configure environment variables: Add your CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from your Clerk application.

Install dependencies:

```bash
npm install
```
Run the app:

```bash
npm run dev
```
Middleware setup:

Ensure your middleware.ts file includes logic to check for MFA status and redirect users to /setup-mfa if MFA is disabled.
Example:

```typescript
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

```
Test MFA enforcement:

Navigate to any route while signed in. If MFA is not enabled, you will be redirected to the /mfa page.

Found an issue or have feedback?

If you encounter an issue or have feedback, please create a thread in our Discord support channel. For quick fixes, feel free to submit a pull request.
