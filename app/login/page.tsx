'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { findUser, addUser } from '../../lib/users'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isRegistering) {
      // Registro
      if (findUser(email, password)) {
        setError('El usuario ya existe')
      } else {
        addUser({ email, password, role: 'employee' })
        localStorage.setItem('user', JSON.stringify({ email, role: 'employee' }))
        router.push('/productos')
      }
    } else {
      // Inicio de sesión
      const user = findUser(email, password)
      if (user) {
        localStorage.setItem('user', JSON.stringify({ email: user.email, role: user.role }))
        router.push('/productos')
      } else {
        setError('Credenciales inválidas')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Correo electrónico:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isRegistering 
              ? '¿Ya tienes una cuenta? Inicia sesión' 
              : '¿No tienes una cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  )
}

