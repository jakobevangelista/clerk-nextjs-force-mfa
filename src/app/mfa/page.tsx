'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Shield, RefreshCw } from 'lucide-react'
import { GenerateBackupCodes } from './generateBackuCodes'

const TotpEnabled = () => {
  const { user } = useUser()

  const disableTOTP = async () => {
    await user?.disableTOTP()
  }

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium leading-none">TOTP Authentication</span>
        <span className="text-sm text-muted-foreground">Enabled via authentication app</span>
      </div>
      <Switch checked={true} onCheckedChange={disableTOTP} />
    </div>
  )
}

const TotpDisabled = () => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium leading-none">TOTP Authentication</span>
        <span className="text-sm text-muted-foreground">Add TOTP via authentication app</span>
      </div>
      <Button asChild>
        <Link href="/mfa/add">Add</Link>
      </Button>
    </div>
  )
}

export default function ManageMFA() {
  const { isLoaded, user } = useUser()
  const [showNewCodes, setShowNewCodes] = React.useState(false)

  if (!isLoaded) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>

  if (!user) {
    return <p className="text-center text-red-500">You must be logged in to access this page</p>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span>User MFA Settings</span>
        </CardTitle>
        <CardDescription>Manage your multi-factor authentication settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {user.totpEnabled ? <TotpEnabled /> : <TotpDisabled />}

        {user.backupCodeEnabled && user.twoFactorEnabled && (
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium leading-none">Backup Codes</span>
              <span className="text-sm text-muted-foreground">Generate new backup codes</span>
            </div>
            <Button onClick={() => setShowNewCodes(true)} disabled={showNewCodes}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        )}
      </CardContent>
      {showNewCodes && (
        <CardFooter className="flex flex-col space-y-4">
          <GenerateBackupCodes />
          <Button onClick={() => setShowNewCodes(false)} variant="outline">Done</Button>
        </CardFooter>
      )}
    </Card>
  )
}
