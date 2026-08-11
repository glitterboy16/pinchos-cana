import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BrandLogo from './BrandLogo'
import LangSelector from './LangSelector'

export default function Navbar() {
  const { t } = useTranslation()
  const [fijada, setFijada] = useState(false)

  useEffect(() => {
    const alScroll = () => setFijada(window.scrollY > 40)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
        fijada
          ? 'border-b border-tinta-900/10 bg-papel-100/85 shadow-[0_10px_30px_-24px_rgba(30,24,23,0.9)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-3"
          aria-label={`${t('marca.nombre')} — ${t('marca.lemaLargo')}`}
        >
          <BrandLogo
            size="sm"
            className={`transition-all duration-500 ${fijada ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
          />
          <span
            className={`flex min-w-0 flex-col leading-none transition-all duration-500 ${
              fijada ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
            }`}
          >
            <span className="truncate font-display text-lg text-tinta-900 sm:text-xl">{t('marca.nombre')}</span>
            <span className="mt-1 font-cond text-[0.62rem] uppercase tracking-[0.3em] text-teja-500">
              {t('marca.lema')}
            </span>
          </span>
        </a>

        <LangSelector />
      </div>
    </header>
  )
}
