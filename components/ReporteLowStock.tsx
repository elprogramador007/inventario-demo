import { useState } from 'react'

interface ReporteLowStockProps {
  productoId: number;
  productoNombre: string;
  cantidadActual: number;
}

export function ReporteLowStock({ productoId, productoNombre, cantidadActual }: ReporteLowStockProps) {
  const [reportado, setReportado] = useState(false)

  const handleReporte = () => {
    // Aquí iría la lógica para enviar el reporte al sistema
    console.log(`Reporte de stock bajo para el producto ${productoNombre} (ID: ${productoId}). Cantidad actual: ${cantidadActual}`)
    setReportado(true)
    // En un sistema real, aquí se enviaría una notificación al administrador
    alert(`Reporte enviado para ${productoNombre}`)
  }

  if (reportado) {
    return <span className="text-green-500">Reportado</span>
  }

  return (
    <button
      onClick={handleReporte}
      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
      aria-label={`Reportar stock bajo para ${productoNombre}`}
    >
      Reportar stock bajo
    </button>
  )
}

