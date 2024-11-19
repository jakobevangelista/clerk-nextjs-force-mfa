import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <main className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            MFA Enforcement Template
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This template demonstrates how to enforce Multi-Factor Authentication (MFA) using Clerk in a Next.js application.
          </p>

          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Key Features:</h2>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Seamless Clerk authentication integration</li>
                <li>Forced MFA for enhanced security</li>
                <li>Next.js App Router ready</li>
                <li>TypeScript support</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href="https://github.com/jakobevangelista/clerk-nextjs-force-mfa/tree/main" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto">
                  View on GitHub
                </Button>
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="w-full sm:w-auto">Sign In to Demo</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Signed in as:</span>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 sm:p-12 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 mb-4">
            This template uses Clerk's authentication system to enforce MFA. Once a user signs up or logs in, they are required to set up and use a second factor for authentication, ensuring an extra layer of security for your application.
          </p>
          <p className="text-gray-600">
            Explore the code to see how MFA is implemented and enforced throughout the application flow.
          </p>
        </div>
      </main>
    </div>
  );
}
