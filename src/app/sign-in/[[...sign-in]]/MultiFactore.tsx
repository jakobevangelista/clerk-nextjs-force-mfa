'use client'

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, LockIcon, MailIcon } from 'lucide-react'

export default function SignInForm() {
	const { isLoaded, signIn, setActive } = useSignIn()
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [code, setCode] = React.useState('')
	const [useBackupCode, setUseBackupCode] = React.useState(false)
	const [displayTOTP, setDisplayTOTP] = React.useState(false)
	const router = useRouter()

	const handleFirstStage = (e: React.FormEvent) => {
		e.preventDefault()
		setDisplayTOTP(true)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!isLoaded) return

		try {
			await signIn.create({
				identifier: email,
				password,
			})

			const signInAttempt = await signIn.attemptSecondFactor({
				strategy: useBackupCode ? 'backup_code' : 'totp',
				code: code,
			})

			if (signInAttempt.status === 'complete') {
				await setActive({ session: signInAttempt.createdSessionId })
				router.refresh()
			} else {
				console.log(signInAttempt)
			}
		} catch (err) {
			console.error('Error:', JSON.stringify(err, null, 2))
		}
	}

	if (displayTOTP) {
		return (
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<CardTitle>Verify your account</CardTitle>
					<CardDescription>Enter your verification code to continue</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="code">Code</Label>
							<Input
								id="code"
								name="code"
								type="text"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder="Enter your code"
								required
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="backupcode"
								checked={useBackupCode}
								onCheckedChange={() => setUseBackupCode((prev) => !prev)}
							/>
							<Label htmlFor="backupcode">This code is a backup code</Label>
						</div>
						<Button type="submit" className="w-full">
							Verify <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</form>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Sign in</CardTitle>
				<CardDescription>Enter your email and password to sign in</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleFirstStage} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<div className="relative">
							<Input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="m@example.com"
								required
								className="pl-10"
							/>
							<MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Input
								id="password"
								name="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								required
								className="pl-10"
							/>
							<LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
						</div>
					</div>
					<Button type="submit" className="w-full">
						Continue <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-gray-500">
					Don&apos;t have an account?{' '}
					<a href="#" className="text-primary hover:underline">
						Sign up
					</a>
				</p>
			</CardFooter>
		</Card>
	)
}
