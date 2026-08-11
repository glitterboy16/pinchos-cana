import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Vuelta al principio. Va abajo a la izquierda para no chocar en móvil con
// el botón de edición del dueño, que vive abajo a la derecha.
export default function BotonArriba() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > 900)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('nav.irArriba')}
      className={`fixed left-4 z-50 grid h-12 w-12 place-items-center rounded-full border border-tinta-900/20 bg-papel-50/95 text-tinta-800 shadow-[0_16px_36px_-18px_rgba(30,24,23,0.9)] backdrop-blur transition-all duration-300 hover:border-teja-500 hover:text-teja-600 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="h-5 w-5 stroke-current" aria-hidden="true">
        <path d="M12 19V5m0 0l-5.5 5.5M12 5l5.5 5.5" />
      </svg>
    </button>
  )
}
