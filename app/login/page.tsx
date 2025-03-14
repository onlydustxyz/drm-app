"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {      
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          console.log("Session found, redirecting to dashboard")
          
          // Only redirect if not in a loop
          console.log("Redirecting to dashboard")
          window.location.href = '/dashboard'
        }
      } catch (error) {
        console.error("Error checking session:", error)
      }
    }
    
    checkSession()
  }, [supabase.auth])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setError(error.message)
      } else {
        // When authentication is successful, wait for session to be established
        // then perform the redirection with a stronger approach
        try {
          // Small delay to ensure auth state is updated
          await new Promise(resolve => setTimeout(resolve, 100))
          
          // Force a hard redirect to dashboard
          router.push("/dashboard");
        } catch (redirectError) {
          console.error("Redirect error:", redirectError)
          // Fallback to router.push if direct navigation fails
          router.push("/dashboard");
        }
      }
    } catch (e) {
      setError("An unexpected error occurred")
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">DRM App Login</CardTitle>
          <CardDescription>
            Sign in to access the Dashboard Repository Manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In with Email"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-gray-500 text-center">
            Don't have an account? Please contact your administrator.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 