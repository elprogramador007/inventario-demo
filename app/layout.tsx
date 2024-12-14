'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<{ email: string, role: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Inicializar productos si no existen
    if (!localStorage.getItem('productos')) {
      const productosIniciales = [
        { id: 1, nombre: 'Laptop', descripcion: 'Portátil de alta gama', precio: 1200, cantidad: 10, categoria: 'Electrónica' },
        { id: 2, nombre: 'Smartphone', descripcion: 'Teléfono inteligente', precio: 800, cantidad: 15, categoria: 'Electrónica' },
        { id: 3, nombre: 'Auriculares', descripcion: 'Auriculares inalámbricos', precio: 150, cantidad: 3, categoria: 'Accesorios' },
      ]
      localStorage.setItem('productos', JSON.stringify(productosIniciales))
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <html lang="es">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Gestión de Inventario
            </Link>
            <div>
              {user ? (
                <>
                  <Link href="/productos" className="mr-4 hover:underline">
                    Productos
                  </Link>
                  <span className="mr-4">
                    {user.email} ({user.role === 'admin' ? 'Administrador' : 'Empleado'})
                  </span>
                  <button onClick={handleLogout} className="hover:underline bg-red-500 text-white px-2 py-1 rounded">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link href="/login" className="hover:underline">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}

