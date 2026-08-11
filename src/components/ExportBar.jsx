import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAdmin } from '../admin/AdminContext'
import { IDIOMAS } from '../i18n'

// Botón público del pie: descargar la carta en PDF en cualquiera de los tres
// idiomas. jsPDF se carga solo cuando hace falta.
export default function ExportBar() {
  const { t } = useTranslation()
  const { cartaData } = useAdmin()
  const [abierto, setAbierto] = useState(false)
  const [exportando, setExportando] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false)
    }
    const esc = (e) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', esc)
    }
  }, [abierto])

  const exportar = async (lang) => {
    setAbierto(false)
    setExportando(true)
    try {
      const { exportarCartaPdf } = await import('../export/exportarPdf')
      await toast.promise(exportarCartaPdf(cartaData, lang), {
        loading: t('exportar.generando'),
        success: t('exportar.pdfOk'),
        error: t('exportar.pdfError'),
      })
    } finally {
      setExportando(false)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAbierto((v) => !v)}
        disabled={exportando}
        aria-haspopup="menu"
        aria-expanded={abierto}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-papel-200/35 px-5 font-cond text-xs uppercase tracking-[0.16em] text-papel-100 transition-colors hover:border-teja-300 hover:text-teja-200 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-4 w-4 stroke-current" aria-hidden="true">
          <path d="M7 3h7l5 5v13H7z" />
          <path d="M14 3v5h5" />
        </svg>
        {exportando ? t('exportar.generando') : t('exportar.pdf')}
      </button>

      {abierto && (
        <div
          role="menu"
          aria-label={t('exportar.idioma')}
          className="anim-subir absolute bottom-[calc(100%+10px)] left-1/2 z-50 min-w-[11rem] -translate-x-1/2 overflow-hidden rounded-xl border border-papel-200/25 bg-tinta-900 py-1 shadow-xl shadow-black/50"
        >
          {IDIOMAS.map(({ code, nombre }) => (
            <button
              key={code}
              role="menuitem"
              onClick={() => exportar(code)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm text-papel-100 transition-colors hover:bg-tinta-800"
            >
              <span aria-hidden="true" className="font-cond text-[0.7rem] uppercase tracking-[0.1em] opacity-60">
                {code}
              </span>
              {nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
