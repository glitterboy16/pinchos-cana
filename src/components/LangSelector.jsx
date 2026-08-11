import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IDIOMAS, idiomaCorto } from '../i18n'

export default function LangSelector({ tono = 'claro' }) {
  const { t, i18n } = useTranslation()
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)
  const lang = idiomaCorto(i18n.language)
  const actual = IDIOMAS.find((i) => i.code === lang) ?? IDIOMAS[0]

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

  const oscuro = tono === 'oscuro'
  const botón = oscuro
    ? 'border-papel-200/35 text-papel-100 hover:border-teja-300 hover:text-teja-200'
    : 'border-tinta-900/20 bg-papel-50/70 text-tinta-800 hover:border-teja-500 hover:text-teja-600'
  const panel = oscuro
    ? 'border-papel-200/25 bg-tinta-900 text-papel-100'
    : 'border-tinta-900/15 bg-papel-50 text-tinta-800'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={t('nav.idioma')}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
        className={`flex h-10 items-center gap-2 rounded-full border px-3.5 font-cond text-sm uppercase tracking-[0.14em] backdrop-blur transition-colors ${botón}`}
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4" aria-hidden="true" className="h-4 w-4 stroke-current">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3.4 9h17.2M3.4 15h17.2" />
        </svg>
        {actual.code}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.8"
          aria-hidden="true"
          className={`h-3.5 w-3.5 stroke-current transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <ul
          role="listbox"
          aria-label={t('nav.idioma')}
          className={`anim-subir absolute right-0 top-[calc(100%+8px)] z-50 min-w-[11rem] overflow-hidden rounded-xl border py-1 shadow-xl shadow-tinta-950/25 ${panel}`}
        >
          {IDIOMAS.map(({ code, nombre }) => (
            <li key={code}>
              <button
                role="option"
                aria-selected={code === lang}
                onClick={() => {
                  i18n.changeLanguage(code)
                  setAbierto(false)
                }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm transition-colors ${
                  oscuro ? 'hover:bg-tinta-800' : 'hover:bg-papel-200'
                } ${code === lang ? 'text-teja-500' : ''}`}
              >
                <span aria-hidden="true" className="font-cond text-[0.7rem] uppercase tracking-[0.1em] opacity-60">
                  {code}
                </span>
                {nombre}
                {code === lang && (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="ml-auto h-4 w-4 stroke-current">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
