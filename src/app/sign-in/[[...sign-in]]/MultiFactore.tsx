// 'use client'
//
// import * as React from 'react'
// import { useSignIn } from '@clerk/nextjs'
// import { useRouter } from 'next/navigation'
//
// export default function SignInForm() {
// 	const { isLoaded, signIn, setActive } = useSignIn()
// 	const [email, setEmail] = React.useState('')
// 	const [password, setPassword] = React.useState('')
// 	const [code, setCode] = React.useState('')
// 	const [useBackupCode, setUseBackupCode] = React.useState(false)
// 	const [displayTOTP, setDisplayTOTP] = React.useState(false)
// 	const router = useRouter()
//
// 	// Handle user submitting email and pass and swapping to TOTP form
// 	const handleFirstStage = (e: React.FormEvent) => {
// 		e.preventDefault()
// 		setDisplayTOTP(true)
// 	}
//
// 	// Handle the submission of the TOTP of Backup Code submission
// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault()
//
// 		if (!isLoaded) return
//
// 		// Start the sign-in process using the email and password provided
// 		try {
// 			await signIn.create({
// 				identifier: email,
// 				password,
// 			})
//
// 			// Attempt the TOTP or backup code verification
// 			const signInAttempt = await signIn.attemptSecondFactor({
// 				strategy: useBackupCode ? 'backup_code' : 'totp',
// 				code: code,
// 			})
//
// 			// If verification was completed, set the session to active
// 			// and redirect the user
// 			console.log(signInAttempt)
// 			if (signInAttempt.status === 'complete') {
// 				console.log("ITS COMPLETE!")
// 				await setActive({ session: signInAttempt.createdSessionId })
// 				router.refresh()
// 			} else {
// 				// If the status is not complete, check why. User may need to
// 				// complete further steps.
// 				console.log(signInAttempt)
// 			}
// 		} catch (err) {
// 			// See https://clerk.com/docs/custom-flows/error-handling
// 			// for more info on error handling
// 			console.error('Error:', JSON.stringify(err, null, 2))
// 		}
// 	}
//
// 	if (displayTOTP) {
// 		return (
// 			<div>
// 				<h1>Verify your account</h1>
// 				<form onSubmit={(e) => handleSubmit(e)}>
// 					<div>
// 						<label htmlFor="code">Code</label>
// 						<input
// 							onChange={(e) => setCode(e.target.value)}
// 							id="code"
// 							name="code"
// 							type="text"
// 							value={code} className='border border-black'
// 						/>
// 					</div>
// 					<div>
// 						<label htmlFor="backupcode">This code is a backup code</label>
// 						<input
// 							onChange={() => setUseBackupCode((prev) => !prev)}
// 							id="backupcode"
// 							name="backupcode"
// 							type="checkbox"
// 							checked={useBackupCode} className='border border-black'
// 						/>
// 					</div>
// 					<button type="submit">Verify</button>
// 				</form>
// 			</div>
// 		)
// 	}
//
// 	return (
// 		<>
// 			<h1>Sign in</h1>
// 			<form onSubmit={(e) => handleFirstStage(e)}>
// 				<div>
// 					<label htmlFor="email">Email</label>
// 					<input
// 						onChange={(e) => setEmail(e.target.value)}
// 						id="email"
// 						name="email"
// 						type="email"
// 						value={email}
// 						className='border border-black'
// 					/>
// 				</div>
// 				<div>
// 					<label htmlFor="password">Password</label>
// 					<input
// 						onChange={(e) => setPassword(e.target.value)}
// 						id="password"
// 						name="password"
// 						type="password"
// 						value={password}
// 						className='border border-black'
// 					/>
// 				</div>
// 				<button type="submit" className='border border-black'>
//
// 					Continue</button>
//
// 			</form>
// 		</>
// 	)
// }
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
