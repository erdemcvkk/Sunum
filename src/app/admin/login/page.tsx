'use client'

import { useState } from 'react'
import { loginAction } from '@/app/actions/auth'
import { Lock, User } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    
    const result = await loginAction(formData)
    
    if (result && !result.success) {
      setError(result.error || 'Giriş başarısız')
      setLoading(false)
    } else {
      window.location.href = '/admin'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fantas-gray">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-fantas-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-fantas-blue rounded-full flex items-center justify-center mb-4">
            <User className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-fantas-dark">Admin Paneli</h1>
          <p className="text-fantas-text-light text-sm mt-2">Lütfen şifrenizi girin</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-fantas-text mb-2">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                required
                className="block w-full pl-10 pr-3 py-2 border border-fantas-border rounded-lg focus:ring-fantas-blue focus:border-fantas-blue bg-gray-50 text-fantas-text"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-fantas-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fantas-blue disabled:opacity-50 transition-colors"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
