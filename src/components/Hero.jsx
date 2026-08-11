import { useTranslation } from 'react-i18next'
import BrandLogo from './BrandLogo'
import { Estrella, Llama, Separador } from './Ornamentos'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-14 pt-6 sm:px-6 sm:pb-20">
      {/* Brasas de fondo: dos llamas grandes muy tenues que laten */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 select-none">
        <Llama className="anim-llama absolute -left-10 top-16 h-56 w-44 text-teja-400/10 sm:h-72 sm:w-56" />
        <Llama
          className="anim-llama absolute -right-8 top-40 h-44 w-36 text-brasa-400/10 sm:h-60 sm:w-48"
          style={{ animationDelay: '-1.3s' }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <BrandLogo size="lg" animar className="mb-7" />

        <p className="anim-subir font-cond text-[0.68rem] uppercase tracking-[0.42em] text-teja-500 sm:text-xs">
          {t('hero.sello')}
        </p>

        <h1
          className="anim-subir mt-3 font-display text-[2.9rem] leading-[0.92] text-tinta-900 sm:text-6xl"
          style={{ animationDelay: '90ms' }}
        >
          {t('marca.nombre')}
        </h1>

        <p
          className="anim-subir mt-4 max-w-md text-balance font-body text-[0.98rem] leading-relaxed text-tinta-700 sm:text-lg"
          style={{ animationDelay: '180ms' }}
        >
          {t('hero.entradilla')}
        </p>

        <Separador className="anim-subir mt-8 w-full" style={{ animationDelay: '260ms' }} />

        <a
          href="#carta"
          className="anim-subir group mt-8 inline-flex items-center gap-3 rounded-full bg-tinta-900 px-7 py-3.5 font-cond text-sm uppercase tracking-[0.2em] text-papel-100 shadow-[0_14px_30px_-16px_rgba(30,24,23,0.95)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-teja-600 active:translate-y-0"
          style={{ animationDelay: '340ms' }}
        >
          <Estrella className="h-3 w-3 text-teja-300 transition-transform duration-500 group-hover:rotate-[72deg]" />
          {t('hero.verCarta')}
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true" className="h-4 w-4 stroke-current">
            <path d="M12 5v14m0 0l-5.5-5.5M12 19l5.5-5.5" />
          </svg>
        </a>
      </div>
    </section>
  )
}
