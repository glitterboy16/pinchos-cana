import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAdmin } from './AdminContext'
import { Estrella } from '../components/Ornamentos'

// Acceso al modo edición: se abre al pulsar "Pinchos Caña" en el pie.
export default function LoginModal({ onClose }) {
  const { t } = useTranslation()
  const { login, haySupabase } = useAdmin()
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const panelRef = useRef(null)
  const primerInput = useRef(null)

  useEffect(() => {
    primerInput.current?.focus()
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const enviar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    const ok = await login(usuario.trim(), clave)
    setEnviando(false)
    if (ok) return onClose()
    setError(true)
    setClave('')
  }

  const inputCls =
    'w-full rounded-xl border border-papel-200/25 bg-tinta-900 px-4 py-3 font-body text-papel-100 outline-none ' +
    'transition-colors placeholder:text-papel-300/45 focus:border-teja-400'

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-tinta-950/70 p-4 backdrop-blur-sm"
      onPointerDown={(e) => {
        if (panelRef.current && !panelRef.current.contains(e.target)) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('login.titulo')}
        className="anim-subir w-full max-w-sm rounded-2xl border border-papel-200/20 bg-tinta-950 p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Estrella className="h-3.5 w-3.5 text-teja-400" />
          <p className="font-cond text-[0.62rem] uppercase tracking-[0.38em] text-papel-300/70">{t('login.titulo')}</p>
          <h3 className="font-display text-3xl text-papel-100">{t('login.subtitulo')}</h3>
        </div>

        <form onSubmit={enviar} className="flex flex-col gap-3">
          <input
            ref={primerInput}
            className={inputCls}
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder={t('login.usuario')}
            autoComplete="username"
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value)
              setError(false)
            }}
          />
          <input
            className={inputCls}
            type="password"
            placeholder={t('login.clave')}
            autoComplete="current-password"
            value={clave}
            onChange={(e) => {
              setClave(e.target.value)
              setError(false)
            }}
          />

          {error && <p className="text-center font-body text-sm italic text-teja-300">{t('login.error')}</p>}
          {!haySupabase && (
            <p className="text-center font-body text-xs italic text-papel-300/70">{t('admin.soloLocal')}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 h-12 rounded-xl bg-teja-500 font-cond text-sm uppercase tracking-[0.18em] text-papel-50 transition-colors hover:bg-teja-400 disabled:opacity-60"
          >
            {t('login.entrar')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 font-cond text-xs uppercase tracking-[0.18em] text-papel-300/70 transition-colors hover:text-papel-100"
          >
            {t('login.cerrar')}
          </button>
        </form>
      </div>
    </div>
  )
}
