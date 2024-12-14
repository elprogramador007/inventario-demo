'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReporteLowStock } from '../../components/ReporteLowStock'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria: string;
}

const UMBRAL_STOCK_BAJO = 5;

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [user, setUser] = useState<{ email: string, role: string } | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [notificaciones, setNotificaciones] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/login')
    }

    const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]')
    setProductos(productosGuardados)
  }, [router])

  useEffect(() => {
    const productosConBajoStock = productos.filter(producto => producto.cantidad < UMBRAL_STOCK_BAJO)
    if (productosConBajoStock.length > 0 && user?.role === 'admin') {
      const nuevasNotificaciones = productosConBajoStock.map(
        producto => `El producto "${producto.nombre}" tiene un stock bajo (${producto.cantidad} unidades).`
      )
      setNotificaciones(nuevasNotificaciones)
    }
  }, [productos, user])

  const eliminarProducto = (id: number) => {
    const nuevosProductos = productos.filter(producto => producto.id !== id)
    setProductos(nuevosProductos)
    localStorage.setItem('productos', JSON.stringify(nuevosProductos))
  }

  const generarReportePDF = () => {
    const doc = new jsPDF()
    doc.text('Reporte de Inventario', 20, 10)
    
    let y = 30
    productos.forEach((producto, index) => {
      doc.text(`${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio}`, 20, y)
      y += 10
      if (y > 280) {
        doc.addPage()
        y = 20
      }
    })
    
    doc.save('reporte_inventario.pdf')
  }

  const generarReporteExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productos)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario")
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(data, 'reporte_inventario.xlsx')
  }

  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoriaFiltro === '' || producto.categoria === categoriaFiltro)
  )

  const categoriasUnicas = Array.from(new Set(productos.map(p => p.categoria)))

  if (!user) return null

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lista de Productos</h1>
        <div>
          <button 
            onClick={generarReportePDF} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
          >
            📄 Generar PDF
          </button>
          <button 
            onClick={generarReporteExcel} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            📊 Generar Excel
          </button>
          {user.role === 'admin' && (
            <Link href="/productos/nuevo" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Agregar Producto
            </Link>
          )}
        </div>
      </div>

      {user.role === 'admin' && notificaciones.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Notificaciones de stock bajo:</p>
          <ul>
            {notificaciones.map((notificacion, index) => (
              <li key={index}>{notificacion}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todas las categorías</option>
          {categoriasUnicas.map(categoria => (
            <option key={categoria} value={categoria}>{categoria}</option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Descripción</th>
            <th className="border border-gray-300 p-2">Precio</th>
            <th className="border border-gray-300 p-2">Cantidad</th>
            <th className="border border-gray-300 p-2">Categoría</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id}>
              <td className="border border-gray-300 p-2">{producto.nombre}</td>
              <td className="border border-gray-300 p-2">{producto.descripcion}</td>
              <td className="border border-gray-300 p-2">${producto.precio.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">{producto.cantidad}</td>
              <td className="border border-gray-300 p-2">{producto.categoria}</td>
              <td className="border border-gray-300 p-2">
                {user.role === 'admin' ? (
                  <>
                    <Link href={`/productos/${producto.id}`} className="text-blue-500 hover:underline mr-2">
                      Editar
                    </Link>
                    <button onClick={() => eliminarProducto(producto.id)} className="text-red-500 hover:underline">
                      Eliminar
                    </button>
                  </>
                ) : (
                  producto.cantidad < UMBRAL_STOCK_BAJO && (
                    <ReporteLowStock
                      productoId={producto.id}
                      productoNombre={producto.nombre}
                      cantidadActual={producto.cantidad}
                    />
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

