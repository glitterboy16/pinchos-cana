import { useTranslation } from 'react-i18next'
import { ALERGENOS } from '../data/alergenos'
import { idiomaCorto } from '../i18n'
import AlergenoIcono from './AlergenoIcono'
import { Separador } from './Ornamentos'

// Leyenda de los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011).
export default function Alergenos() {
  const { t, i18n } = useTranslation()
  const lang = idiomaCorto(i18n.language)
  return (
    <section className="reveal mt-16" aria-label={t('carta.alergenosTitulo')}>
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-cond text-[0.66rem] uppercase tracking-[0.4em] text-teja-500">{t('carta.alergenosTitulo')}</p>
        <Separador className="w-full" />
      </div>
      <ul className="mx-auto mt-7 grid max-w-xl grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
        {ALERGENOS.map((a) => (
          <li key={a.id} className="flex items-center gap-2.5">
            <AlergenoIcono id={a.id} className="h-9 w-9 shrink-0" />
            <span className="font-body text-[0.9rem] leading-tight text-tinta-800">{a.nombre[lang] ?? a.nombre.es}</span>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-7 max-w-prose text-center font-body text-xs italic leading-relaxed text-tinta-600">
        {t('carta.alergenosNota')}
      </p>
    </section>
  )
}
