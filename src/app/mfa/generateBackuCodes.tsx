
import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { BackupCodeResource } from '@clerk/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
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
