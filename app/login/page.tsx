import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/components/auth/login-form'

export default async function Login() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-8 text-center">DRM App</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
} 