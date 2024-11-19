'use client'

import { useUser } from '@clerk/nextjs'
import { TOTPResource } from '@clerk/types'
import Link from 'next/link'
import * as React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Link as LinkIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GenerateBackupCodes } from '../generateBackuCodes'

type AddTotpSteps = 'add' | 'verify' | 'backupcodes' | 'success'
type DisplayFormat = 'qr' | 'uri'

function AddTotpScreen({ setStep }: { setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>> }) {
  const { user } = useUser()
  const [totp, setTOTP] = React.useState<TOTPResource | undefined>(undefined)
  const [displayFormat, setDisplayFormat] = React.useState<DisplayFormat>('qr')

  React.useEffect(() => {
    void user
      ?.createTOTP()
      .then((totp: TOTPResource) => {
        setTOTP(totp)
      })
      .catch((err) =>
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2)),
      )
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add TOTP MFA</CardTitle>
        <CardDescription>Scan the QR code or use the URI to set up your authenticator app</CardDescription>
      </CardHeader>
      <CardContent>
        {totp && (
          <Tabs value={displayFormat} onValueChange={(value) => setDisplayFormat(value as DisplayFormat)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="uri">URI</TabsTrigger>
            </TabsList>
            <TabsContent value="qr" className="flex justify-center py-4">
              <QRCodeSVG value={totp?.uri || ''} size={200} />
            </TabsContent>
            <TabsContent value="uri" className="py-4">
              <Input value={totp.uri} readOnly />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button onClick={() => setStep('verify')} className="w-full">Verify</Button>
        <Button variant="outline" onClick={() => setStep('add')}>Reset</Button>
      </CardFooter>
    </Card>
  )
}

function VerifyTotpScreen({ setStep }: { setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>> }) {
  const { user } = useUser()
  const [code, setCode] = React.useState('')

  const verifyTotp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await user?.verifyTOTP({ code })
      setStep('backupcodes')
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify TOTP</CardTitle>
        <CardDescription>Enter the code from your authentication app</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={verifyTotp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totp-code">Authentication Code</Label>
            <Input
              type="text"
              id="totp-code"
              placeholder="Enter 6-digit code"
              onChange={(e) => setCode(e.currentTarget.value)}
            />
          </div>
          <Button type="submit" className="w-full">Verify Code</Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => setStep('add')} className="w-full">Reset</Button>
      </CardFooter>
    </Card>
  )
}

function BackupCodeScreen({ setStep }: { setStep: React.Dispatch<React.SetStateAction<AddTotpSteps>> }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Backup Codes</CardTitle>
        <CardDescription>Save these codes in a secure location for emergency access</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Store these backup codes securely. They will allow you to access your account if you lose your authentication device.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <GenerateBackupCodes />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setStep('success')} className="w-full">Finish Setup</Button>
      </CardFooter>
    </Card>
  )
}

function SuccessScreen() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Success!</CardTitle>
        <CardDescription>You have successfully set up TOTP MFA</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert >
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>MFA Enabled</AlertTitle>
          <AlertDescription>
            Your account is now protected with multi-factor authentication using an authenticator app.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Link href="/mfa" className="w-full">
          <Button variant="outline" className="w-full">
            <LinkIcon className="mr-2 h-4 w-4" /> Manage MFA
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function AddMFaScreen() {
  const [step, setStep] = React.useState<AddTotpSteps>('add')
  const { isLoaded, user } = useUser()

  if (!isLoaded) return null

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You must be logged in to access this page. Please sign in and try again.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {step === 'add' && <AddTotpScreen setStep={setStep} />}
      {step === 'verify' && <VerifyTotpScreen setStep={setStep} />}
      {step === 'backupcodes' && <BackupCodeScreen setStep={setStep} />}
      {step === 'success' && <SuccessScreen />}
    </div>
  )
}
