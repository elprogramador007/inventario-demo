'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria: string;
}

export default function EditarProducto({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string, role: string } | null>(null)
  const [producto, setProducto] = useState<Producto>({
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    categoria: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      if (parsedUser.role !== 'admin') {
        router.push('/productos')
      }
    } else {
      router.push('/login')
    }

    if (params.id !== 'nuevo') {
      // Simular la obtención de datos del producto
      const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]')
      const productoExistente = productosGuardados.find((p: Producto) => p.id === parseInt(params.id))
      if (productoExistente) {
        setProducto(productoExistente)
      } else {
        router.push('/productos')
      }
    }
  }, [params.id, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (producto.cantidad < 0) {
      setError('La cantidad no puede ser negativa')
      return
    }

    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]')
    
    if (params.id === 'nuevo') {
      // Crear nuevo producto
      const nuevoId = Math.max(0, ...productosGuardados.map((p: Producto) => p.id)) + 1
      const nuevoProducto = { ...producto, id: nuevoId }
      productosGuardados.push(nuevoProducto)
    } else {
      // Actualizar producto existente
      const index = productosGuardados.findIndex((p: Producto) => p.id === parseInt(params.id))
      if (index !== -1) {
        productosGuardados[index] = producto
      }
    }

    localStorage.setItem('productos', JSON.stringify(productosGuardados))
    router.push('/productos')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProducto(prevProducto => ({
      ...prevProducto,
      [name]: name === 'precio' || name === 'cantidad' ? parseFloat(value) : value
    }))
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {params.id === 'nuevo' ? 'Agregar Producto' : 'Editar Producto'}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="nombre" className="block mb-2">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block mb-2">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="precio" className="block mb-2">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cantidad" className="block mb-2">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={producto.cantidad}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="categoria" className="block mb-2">Categoría:</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={producto.categoria}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Guardar
        </button>
      </form>
    </div>
  )
}

