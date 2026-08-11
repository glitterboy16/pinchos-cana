import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Llama } from './Ornamentos'

// El sello de la casa. Usa el logo real de /logo.jpg y, si por lo que sea no
// carga, cae a una recreación en SVG para que la marca nunca falte.

const TAMANOS = {
  sm: 'h-11 w-11',
  md: 'h-14 w-14',
  lg: 'h-40 w-40 sm:h-52 sm:w-52',
}

export default function BrandLogo({ size = 'sm', className = '', animar = false }) {
  const { t } = useTranslation()
  const [falla, setFalla] = useState(false)
  const dim = TAMANOS[size] ?? TAMANOS.sm

  const marco =
    'relative shrink-0 rounded-full bg-papel-200 ring-1 ring-tinta-900/15 ' +
    'shadow-[0_10px_30px_-14px_rgba(30,24,23,0.55)]'

  if (falla) {
    return (
      <span
        className={`${marco} ${dim} ${animar ? 'anim-sello' : ''} flex items-center justify-center ${className}`}
        role="img"
        aria-label={`${t('marca.nombre')} — ${t('marca.lemaLargo')}`}
      >
        <Llama className={`text-tinta-900 ${size === 'lg' ? 'h-20 w-16' : 'h-6 w-5'}`} />
      </span>
    )
  }

  return (
    <span className={`${marco} ${dim} ${animar ? 'anim-sello' : ''} block overflow-hidden ${className}`}>
      <img
        src="/logo.jpg"
        alt={`${t('marca.nombre')} — ${t('marca.lemaLargo')}`}
        width="1279"
        height="1296"
        loading={size === 'lg' ? 'eager' : 'lazy'}
        fetchPriority={size === 'lg' ? 'high' : 'auto'}
        onError={() => setFalla(true)}
        className="h-full w-full scale-[1.14] object-cover"
      />
    </span>
  )
}
