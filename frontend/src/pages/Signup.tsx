import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { BookOpen } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../stores/authStore'
import { useTitle } from '../hooks/useTitle'
import { getApiError } from '../utils/error'

export default function Signup() {
  useTitle('Create account')
  const navigate = useNavigate()
  const signupAction = useAuthStore((s) => s.signupAction)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signupAction(username, email, password)
      toast.success('Account created! Welcome to EduVerse.')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(getApiError(err, 'Signup failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <BookOpen className="w-10 h-10 text-accent-primary mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold text-text-primary">Create account</h1>
          <p className="text-text-secondary mt-1">Start your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={12} placeholder="12+ chars, uppercase, number, special char" />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-primary hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  )
}
