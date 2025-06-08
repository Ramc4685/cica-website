import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Key, User } from "lucide-react"

export default function AdminLoginInfo() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Portal Access</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Admin Login Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Admin Portal</AlertTitle>
              <AlertDescription>
                The admin portal allows authorized users to update website content, manage tournaments, and handle other
                administrative tasks.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Access Instructions
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  To access the admin portal, navigate to{" "}
                  <span className="font-mono bg-gray-100 px-1 rounded">/admin</span> and enter the password provided to
                  board members.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Default Password</h3>
                <p className="text-sm text-gray-600 mt-1">
                  The default admin password is <span className="font-mono bg-gray-100 px-1 rounded">admin123</span>
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Note: This is a temporary password. For security reasons, please contact the CICA technical team to
                  set up your personal admin credentials.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Need Help?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  If you're having trouble accessing the admin portal or need assistance with content management, please
                  contact the technical support team at <span className="text-blue-600">tech@cicainfo.com</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
