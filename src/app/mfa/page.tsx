// 'use client'
//
// import * as React from 'react'
// import { useUser } from '@clerk/nextjs'
// import Link from 'next/link'
// import { BackupCodeResource } from '@clerk/types'
// // If TOTP is enabled, provide the option to disable it
// const TotpEnabled = () => {
//   const { user } = useUser()
//
//   const disableTOTP = async () => {
//     await user?.disableTOTP()
//   }
//
//   return (
//     <div>
//       <p>
//         TOTP via authentication app enabled - <button onClick={() => disableTOTP()}>Remove</button>
//       </p>
//     </div>
//   )
// }
//
// // If TOTP is disabled, provide the option to enable it
// const TotpDisabled = () => {
//   return (
//     <div>
//       <p>
//         Add TOTP via authentication app -{' '}
//         <Link href="/mfa/add">
//           <button>Add</button>
//         </Link>
//       </p>
//     </div>
//   )
// }
//
// // Generate and display backup codes
// export function GenerateBackupCodes() {
//   const { user } = useUser()
//   const [backupCodes, setBackupCodes] = React.useState<BackupCodeResource | undefined>(undefined)
//
//   const [loading, setLoading] = React.useState(false)
//
//   React.useEffect(() => {
//     if (backupCodes) {
//       return
//     }
//
//     setLoading(true)
//     void user
//       ?.createBackupCode()
//       .then((backupCode: BackupCodeResource) => {
//         setBackupCodes(backupCode)
//         setLoading(false)
//       })
//       .catch((err) => {
//         // See https://clerk.com/docs/custom-flows/error-handling
//         // for more info on error handling
//         console.error(JSON.stringify(err, null, 2))
//         setLoading(false)
//       })
//   }, [])
//
//   if (loading) {
//     return <p>Loading...</p>
//   }
//
//   if (!backupCodes) {
//     return <p>There was a problem generating backup codes</p>
//   }
//
//   return (
//     <ol>
//       {backupCodes.codes.map((code, index) => (
//         <li key={index}>{code}</li>
//       ))}
//     </ol>
//   )
// }
//
// export default function ManageMFA() {
//   const { isLoaded, user } = useUser()
//   const [showNewCodes, setShowNewCodes] = React.useState(false)
//
//   if (!isLoaded) return null
//
//   if (!user) {
//     return <p>You must be logged in to access this page</p>
//   }
//
//   return (
//     <>
//       <h1>User MFA Settings</h1>
//
//       {/* Manage TOTP MFA */}
//       {user.totpEnabled ? <TotpEnabled /> : <TotpDisabled />}
//
//       {/* Manage backup codes */}
//       {user.backupCodeEnabled && user.twoFactorEnabled && (
//         <div>
//           <p>
//             Generate new backup codes? -{' '}
//             <button onClick={() => setShowNewCodes(true)}>Generate</button>
//           </p>
//         </div>
//       )}
//       {showNewCodes && (
//         <>
//           <GenerateBackupCodes />
//           <button onClick={() => setShowNewCodes(false)}>Done</button>
//         </>
//       )}
//     </>
//   )
// }

'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { BackupCodeResource } from '@clerk/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Shield, Key, RefreshCw } from 'lucide-react'

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

export function GenerateBackupCodes() {
  const { user } = useUser()
  const [backupCodes, setBackupCodes] = React.useState<BackupCodeResource | undefined>(undefined)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (backupCodes) return

    setLoading(true)
    void user?.createBackupCode()
      .then((backupCode: BackupCodeResource) => {
        setBackupCodes(backupCode)
        setLoading(false)
      })
      .catch((err) => {
        console.error(JSON.stringify(err, null, 2))
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center p-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating backup codes...</div>
  }

  if (!backupCodes) {
    return <p className="text-red-500">There was a problem generating backup codes</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup Codes</CardTitle>
        <CardDescription>Store these codes in a safe place. They can be used to access your account if you lose your device.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-1">
          {backupCodes.codes.map((code, index) => (
            <li key={index} className="font-mono">{code}</li>
          ))}
        </ol>
      </CardContent>
    </Card>
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
