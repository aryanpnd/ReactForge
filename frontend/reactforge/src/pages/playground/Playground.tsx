import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useAuthStore from "@/store/authStore"
import { Code2, LogOut, User } from "lucide-react"

export default function Playground() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-blue-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ReactForge
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-4 w-4" />
              <span className="text-sm">Welcome, {user?.firstName || 'Developer'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-gray-800/50 border-white/10 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              Welcome to ReactForge Playground
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start building and experimenting with React components in your AI-powered micro-frontend playground.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-white/10 bg-gray-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Component Library</CardTitle>
                <CardDescription className="text-gray-400">
                  Browse and use pre-built UI components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Explore Components
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-gray-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Code Editor</CardTitle>
                <CardDescription className="text-gray-400">
                  Write and test React components live
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  Open Editor
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-gray-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">AI Assistant</CardTitle>
                <CardDescription className="text-gray-400">
                  Get help generating and improving components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Ask AI
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}