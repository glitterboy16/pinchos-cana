import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

// La propia web genera su QR en el navegador: apunta siempre a la dirección
// donde está publicada, sin tener que regenerarlo a mano si cambia el dominio.
export const urlCarta = () =>
  import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

export default function QrPanel() {
  const { t } = useTranslation()
  const [imagen, setImagen] = useState(null)
  const [descargando, setDescargando] = useState(false)
  const url = urlCarta()

  useEffect(() => {
    if (!url) return
    let vivo = true
    import('qrcode')
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(url, {
          width: 560,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: { dark: '#1E1817', light: '#F6EAE0' },
        })
      )
      .then((d) => vivo && setImagen(d))
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [url])

  const descargar = async () => {
    setDescargando(true)
    try {
      const { exportarQrPng } = await import('../export/exportarQr')
      await toast.promise(exportarQrPng(url), {
        loading: t('exportar.generando'),
        success: t('exportar.qrOk'),
        error: t('exportar.qrError'),
      })
    } finally {
      setDescargando(false)
    }
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success(t('qr.copiado'))
    } catch {
      toast.error(t('qr.copiarError'))
    }
  }

  const btn =
    'inline-flex h-11 items-center justify-center gap-2 rounded-full border border-papel-200/35 px-5 ' +
    'font-cond text-xs uppercase tracking-[0.16em] text-papel-100 transition-colors ' +
    'hover:border-teja-300 hover:text-teja-200 disabled:opacity-50'

  return (
    <div className="reveal flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      {/* Tarjeta del QR */}
      <div className="anim-flotar relative shrink-0 rounded-2xl bg-papel-100 p-3.5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.75)]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-xl border border-teja-500/35" />
        {imagen ? (
          <img src={imagen} alt={t('qr.alt')} width="160" height="160" className="h-[160px] w-[160px] rounded-lg" />
        ) : (
          <div className="grid h-[160px] w-[160px] place-items-center rounded-lg bg-papel-200 font-cond text-[0.6rem] uppercase tracking-[0.16em] text-tinta-600">
            {t('qr.generando')}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
        <h3 className="font-display text-2xl text-papel-100 sm:text-[1.7rem]">{t('qr.titulo')}</h3>
        <p className="max-w-sm font-body text-sm leading-relaxed text-papel-300">{t('qr.texto')}</p>
        <p className="tabular break-all font-cond text-[0.72rem] uppercase tracking-[0.12em] text-teja-300">
          {url.replace(/^https?:\/\//, '')}
        </p>
        <div className="mt-1 flex flex-wrap justify-center gap-2.5 sm:justify-start">
          <button className={btn} onClick={descargar} disabled={descargando}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-4 w-4 stroke-current" aria-hidden="true">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
            </svg>
            {descargando ? t('exportar.generando') : t('qr.descargar')}
          </button>
          <button className={btn} onClick={copiar}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-4 w-4 stroke-current" aria-hidden="true">
              <rect x="9" y="9" width="12" height="12" rx="2.5" />
              <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
            </svg>
            {t('qr.copiar')}
          </button>
        </div>
      </div>
    </div>
  )
}
