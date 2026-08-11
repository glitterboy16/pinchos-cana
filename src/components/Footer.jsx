import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAdmin } from '../admin/AdminContext'
import { confirmarToast } from '../lib/confirmToast'
import LoginModal from '../admin/LoginModal'
import ExportBar from './ExportBar'
import QrPanel from './QrPanel'
import LangSelector from './LangSelector'
import BrandLogo from './BrandLogo'
import { Estrella, Pincho } from './Ornamentos'
import { CONTACTO } from '../data/carta'

// Borde superior en festón, como el volante de un toldo de feria
const FESTON = (() => {
  let d = 'M0 10 V6 '
  for (let x = 0; x < 120; x += 10) d += 'a5 5 0 0 1 10 0 '
  return d + 'V10 Z'
})()

export default function Footer() {
  const { t } = useTranslation()
  const { admin, logout } = useAdmin()
  const [loginAbierto, setLoginAbierto] = useState(false)

  // Acceso discreto al modo edición: pulsando el nombre junto al ©.
  // Con la sesión abierta, ese mismo nombre pide confirmación para cerrarla.
  const clickNombre = () => {
    if (!admin) return setLoginAbierto(true)
    confirmarToast(t('login.confirmarSalir'), logout, {
      confirmar: t('login.cerrarSesion'),
      cancelar: t('login.cancelar'),
      peligro: false,
    })
  }

  const anio = new Date().getFullYear()
  const hayContacto = CONTACTO.direccion || CONTACTO.telefono

  return (
    <footer className="relative z-[2] mt-4">
      <svg viewBox="0 0 120 10" preserveAspectRatio="none" aria-hidden="true" className="block h-3 w-full sm:h-4">
        <path d={FESTON} fill="#12100f" />
      </svg>

      <div className="relative overflow-hidden bg-tinta-950 text-papel-100">
        <span
          aria-hidden="true"
          className="lunares pointer-events-none absolute inset-0 text-teja-400/20"
          style={{ maskImage: 'radial-gradient(120% 90% at 50% 0%, #000, transparent 72%)' }}
        />

        <div
          className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-4 py-14 text-center sm:px-6 sm:py-16"
          style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
        >
          {/* Marca */}
          <div className="reveal flex flex-col items-center gap-4">
            <BrandLogo size="md" />
            <div>
              <p className="font-display text-3xl text-papel-100 sm:text-4xl">{t('marca.nombre')}</p>
              <p className="mt-2 font-cond text-[0.64rem] uppercase tracking-[0.36em] text-teja-300">
                {t('marca.lemaLargo')}
              </p>
            </div>
            <Pincho className="anim-vaiven h-6 w-32 text-papel-300/50" fondo="#12100f" />
          </div>

          {/* QR autogenerado */}
          <QrPanel />

          {/* Acciones */}
          <div className="reveal flex flex-wrap items-center justify-center gap-3">
            <ExportBar />
            <LangSelector tono="oscuro" />
            {CONTACTO.instagram && (
              <a
                href={CONTACTO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-papel-200/35 text-papel-100 transition-colors hover:border-teja-300 hover:text-teja-200"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-5 w-5 stroke-current" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r=".9" className="fill-current" stroke="none" />
                </svg>
              </a>
            )}
          </div>

          {hayContacto && (
            <p className="reveal font-body text-sm text-papel-300">
              {CONTACTO.direccion}
              {CONTACTO.direccion && CONTACTO.telefono && ' · '}
              {CONTACTO.telefono &&
                (CONTACTO.telHref ? (
                  <a href={CONTACTO.telHref} className="transition-colors hover:text-teja-200">
                    {CONTACTO.telefono}
                  </a>
                ) : (
                  CONTACTO.telefono
                ))}
            </p>
          )}

          <div className="flex items-center gap-3 text-teja-400/70" aria-hidden="true">
            <span className="h-px w-10 bg-papel-200/20" />
            <Estrella className="h-2.5 w-2.5" />
            <span className="h-px w-10 bg-papel-200/20" />
          </div>

          {/* Acceso del propietario */}
          <p className="font-cond text-[0.68rem] uppercase tracking-[0.18em] text-papel-300/70">
            © {anio}{' '}
            <button
              onClick={clickNombre}
              title={admin ? t('login.cerrarSesion') : t('login.ayuda')}
              className="cursor-pointer font-cond uppercase text-papel-200 underline decoration-teja-400/50 decoration-dotted underline-offset-4 transition-colors hover:text-teja-300"
            >
              {t('marca.nombre')}
            </button>{' '}
            · {t('footer.derechos')}
          </p>
        </div>
      </div>

      {loginAbierto && <LoginModal onClose={() => setLoginAbierto(false)} />}
    </footer>
  )
}
