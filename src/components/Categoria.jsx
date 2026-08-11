import { useTranslation } from 'react-i18next'
import EditableField from './EditableField'

const Chevron = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className={`h-5 w-5 stroke-current ${className}`} aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const IconoX = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4 stroke-current" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
)

// Campo de edición con el estilo de la carta (línea inferior de tinta)
const inputBase =
  'w-full bg-transparent font-body text-tinta-900 outline-none border-b border-tinta-900/25 ' +
  'focus:border-teja-500 transition-colors placeholder:text-tinta-600/50 py-1'

const soloEs = (v) => (v && typeof v === 'object' ? (v.es ?? '') : (v ?? ''))

export default function Categoria({ cat, indice, abierta, alAlternar, L, admin, acciones }) {
  const { t } = useTranslation()
  const { titulo, cabeceraPrecio, platos } = cat
  const numero = String(indice).padStart(2, '0')

  return (
    <section id={`cat-${cat.id}`} className={`scroll-mt-32 border-b border-tinta-900/12 ${abierta ? 'abierta' : ''}`}>
      {/* ── Cabecera ─────────────────────────────────────────────────── */}
      {admin ? (
        <div className="flex items-center gap-2 py-4">
          <EditableField
            className={`${inputBase} min-w-0 flex-1 font-display text-xl text-tinta-900`}
            value={soloEs(titulo)}
            placeholder={t('admin.phCategoria')}
            allowEmpty={false}
            onCommit={(v) => acciones.editarTitulo(cat.id, v)}
          />
          <button
            className="shrink-0 rounded-lg border border-tinta-900/20 p-2.5 text-tinta-600 transition-colors hover:border-teja-500 hover:text-teja-600"
            title={t('admin.eliminar')}
            onClick={() => acciones.eliminarCategoria(cat.id)}
          >
            <IconoX />
          </button>
          <button
            className="shrink-0 rounded-lg border border-tinta-900/20 p-2.5 text-tinta-800 transition-colors hover:bg-papel-200"
            onClick={alAlternar}
            aria-expanded={abierta}
            aria-label={t('carta.desplegar')}
          >
            <Chevron className={`transition-transform duration-500 ${abierta ? 'rotate-180' : ''}`} />
          </button>
        </div>
      ) : (
        <h2>
          <button
            className="group flex w-full items-center gap-3 py-6 text-left sm:gap-4"
            onClick={alAlternar}
            aria-expanded={abierta}
            aria-controls={`panel-${cat.id}`}
          >
            <span className="tabular shrink-0 font-cond text-xs text-teja-400 transition-colors group-hover:text-teja-600">
              {numero}
            </span>
            <span
              className={`min-w-0 flex-1 font-display text-[1.75rem] leading-tight transition-colors duration-300 sm:text-4xl ${
                abierta ? 'text-teja-600' : 'text-tinta-900 group-hover:text-teja-600'
              }`}
            >
              {L(titulo)}
            </span>
            <span className="hidden shrink-0 font-cond text-[0.66rem] uppercase tracking-[0.18em] text-tinta-600 sm:inline">
              {t('carta.platos', { count: platos.length })}
            </span>
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                abierta
                  ? 'rotate-180 border-teja-500 bg-teja-500 text-papel-50'
                  : 'border-tinta-900/20 text-tinta-800 group-hover:border-teja-500 group-hover:text-teja-600'
              }`}
            >
              <Chevron />
            </span>
          </button>
        </h2>
      )}

      {/* ── Cuerpo: animación de 0fr a 1fr, sin saltos de altura ──────── */}
      <div
        id={`panel-${cat.id}`}
        className={`grid transition-[grid-template-rows] duration-[550ms] ease-[cubic-bezier(.22,.75,.3,1)] ${
          abierta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-8">
            {cabeceraPrecio && !admin && (
              <p className="mb-4 text-right font-cond text-[0.66rem] uppercase tracking-[0.24em] text-teja-500">
                {L(cabeceraPrecio)}
              </p>
            )}
            {admin && (
              <EditableField
                className={`${inputBase} mb-4 text-right font-cond text-xs uppercase tracking-[0.2em]`}
                value={soloEs(cabeceraPrecio)}
                placeholder={t('admin.phCabecera')}
                onCommit={(v) => acciones.editarCabeceraPrecio(cat.id, v)}
              />
            )}

            <ul className="flex flex-col gap-4">
              {platos.map((p, i) => {
                const platoId = p.id ?? i

                if (!admin) {
                  return (
                    <li key={platoId} className="reveal" style={{ '--d': `${Math.min(i, 10) * 45}ms` }}>
                      <div className="flex items-baseline">
                        <span className="font-body text-[1.02rem] leading-snug text-tinta-900 sm:text-[1.08rem]">
                          {L(p.nombre)}
                        </span>
                        {(p.precio || p.precioMedia) && <span className="leader" aria-hidden="true" />}
                        {(p.precio || p.precioMedia) && (
                          <span className="flex shrink-0 flex-col items-end leading-tight">
                            {p.precio && (
                              <span className="tabular font-cond text-[1.05rem] font-medium text-tinta-900">
                                {L(p.precio)}
                              </span>
                            )}
                            {p.precioMedia && (
                              <span className="tabular mt-0.5 font-cond text-[0.72rem] uppercase tracking-[0.1em] text-teja-500">
                                {t('carta.media')} {L(p.precioMedia)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      {p.desc && (
                        <p className="mt-1 max-w-prose font-body text-[0.86rem] italic leading-relaxed text-tinta-600">
                          {L(p.desc)}
                        </p>
                      )}
                    </li>
                  )
                }

                return (
                  <li key={platoId} className="rounded-xl border border-tinta-900/12 bg-papel-50/70 p-3.5">
                    <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                      <EditableField
                        className={`${inputBase} min-w-0 flex-1 basis-full sm:basis-0`}
                        value={soloEs(p.nombre)}
                        placeholder={t('admin.phNombre')}
                        allowEmpty={false}
                        onCommit={(v) => acciones.editarNombre(cat.id, platoId, v)}
                      />
                      <EditableField
                        className={`${inputBase} tabular w-24 shrink-0 text-right font-cond`}
                        value={soloEs(p.precio)}
                        placeholder={t('admin.phPrecio')}
                        onCommit={(v) => acciones.editarPrecio(cat.id, platoId, v)}
                      />
                      <EditableField
                        className={`${inputBase} tabular w-24 shrink-0 text-right font-cond text-teja-600`}
                        value={soloEs(p.precioMedia)}
                        placeholder={t('admin.phMedia')}
                        onCommit={(v) => acciones.editarPrecioMedia(cat.id, platoId, v)}
                      />
                      <button
                        className="shrink-0 rounded-lg border border-tinta-900/20 p-2.5 text-tinta-600 transition-colors hover:border-teja-500 hover:text-teja-600"
                        title={t('admin.eliminar')}
                        onClick={() => acciones.eliminarPlato(cat.id, platoId)}
                      >
                        <IconoX />
                      </button>
                    </div>
                    <EditableField
                      multiline
                      rows={2}
                      className={`${inputBase} mt-2 min-h-[2.5rem] resize-y text-sm italic`}
                      value={soloEs(p.desc)}
                      placeholder={t('admin.phDesc')}
                      onCommit={(v) => acciones.editarDesc(cat.id, platoId, v)}
                    />
                  </li>
                )
              })}
            </ul>

            {admin && (
              <button
                className="mt-4 rounded-full border border-teja-500/50 px-4 py-2 font-cond text-sm uppercase tracking-[0.14em] text-teja-600 transition-colors hover:bg-teja-200/40"
                onClick={() => acciones.anadirPlato(cat.id)}
              >
                {t('admin.anadirPlato')}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
