import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useAdmin } from '../admin/AdminContext'
import { idiomaCorto } from '../i18n'
import { confirmarToast } from '../lib/confirmToast'
import Categoria from './Categoria'
import { Separador } from './Ornamentos'

export default function Carta() {
  const { t, i18n } = useTranslation()
  const { admin, cartaData, guardarCarta, campoTraducido, editando, setEditando, guardar } = useAdmin()
  const enEdicion = admin && editando

  const lang = idiomaCorto(i18n.language)
  // Resuelve un campo multiidioma { es, en, pt } (o una cadena universal)
  const L = useCallback((v) => (v && typeof v === 'object' ? (v[lang] ?? v.es) : v), [lang])

  const ids = useMemo(() => cartaData.map((c) => c.id), [cartaData])
  const [abiertas, setAbiertas] = useState(() => new Set(ids.slice(0, 1)))
  const [activa, setActiva] = useState(ids[0])
  const cintaRef = useRef(null)

  // En modo edición cada plato necesita un id estable
  useEffect(() => {
    if (!enEdicion) return
    if (!cartaData.some((c) => c.platos.some((p) => !p.id))) return
    guardarCarta((prev) =>
      prev.map((c) => ({
        ...c,
        platos: c.platos.map((p, i) => (p.id ? p : { ...p, id: `${c.id}-${i}-${Date.now()}` })),
      }))
    )
  }, [enEdicion]) // eslint-disable-line react-hooks/exhaustive-deps

  // Marca en la cinta de categorías la que se está mirando
  useEffect(() => {
    const secciones = ids.map((id) => document.getElementById(`cat-${id}`)).filter(Boolean)
    if (!secciones.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActiva(visible.target.id.replace('cat-', ''))
      },
      { rootMargin: '-38% 0px -50% 0px', threshold: 0 }
    )
    secciones.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [ids])

  // Mantiene la pastilla activa a la vista dentro de la cinta horizontal
  useEffect(() => {
    const cinta = cintaRef.current
    const chip = cinta?.querySelector(`[data-chip="${activa}"]`)
    if (!cinta || !chip) return
    const dx = chip.offsetLeft - cinta.scrollLeft - cinta.clientWidth / 2 + chip.clientWidth / 2
    if (Math.abs(dx) > 24) cinta.scrollBy({ left: dx, behavior: 'smooth' })
  }, [activa])

  const alternar = (id) =>
    setAbiertas((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const irA = (id) => {
    setAbiertas((prev) => new Set(prev).add(id))
    requestAnimationFrame(() => {
      document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const todasAbiertas = ids.length > 0 && ids.every((id) => abiertas.has(id))
  const alternarTodas = () => setAbiertas(todasAbiertas ? new Set() : new Set(ids))

  // ── Acciones de edición ───────────────────────────────────────────────
  const setPlato = (catId, platoId, fn) =>
    guardarCarta((prev) =>
      prev.map((c) =>
        c.id !== catId ? c : { ...c, platos: c.platos.map((p, i) => ((p.id ?? i) !== platoId ? p : fn(p))) }
      )
    )

  const setCategoria = (catId, fn) => guardarCarta((prev) => prev.map((c) => (c.id === catId ? fn(c) : c)))

  const acciones = {
    editarTitulo: (catId, texto) => campoTraducido(texto, (obj) => setCategoria(catId, (c) => ({ ...c, titulo: obj }))),
    editarCabeceraPrecio: (catId, texto) => {
      if (!texto) return setCategoria(catId, (c) => ({ ...c, cabeceraPrecio: undefined }))
      campoTraducido(texto, (obj) => setCategoria(catId, (c) => ({ ...c, cabeceraPrecio: obj })))
    },
    editarNombre: (catId, platoId, texto) =>
      campoTraducido(texto, (obj) => setPlato(catId, platoId, (p) => ({ ...p, nombre: obj }))),
    editarDesc: (catId, platoId, texto) => {
      if (!texto) return setPlato(catId, platoId, (p) => ({ ...p, desc: undefined }))
      campoTraducido(texto, (obj) => setPlato(catId, platoId, (p) => ({ ...p, desc: obj })))
    },
    editarPrecio: (catId, platoId, texto) => setPlato(catId, platoId, (p) => ({ ...p, precio: texto || undefined })),
    editarPrecioMedia: (catId, platoId, texto) =>
      setPlato(catId, platoId, (p) => ({ ...p, precioMedia: texto || undefined })),
    anadirPlato: (catId) => {
      setCategoria(catId, (c) => ({
        ...c,
        platos: [...c.platos, { id: `p-${Date.now()}`, nombre: { es: t('admin.nuevoPlato') }, precio: '0,00 €' }],
      }))
      toast.success(t('admin.platoAnadido'))
    },
    eliminarPlato: (catId, platoId) =>
      confirmarToast(
        t('admin.confirmarEliminarPlato'),
        () => {
          setCategoria(catId, (c) => ({ ...c, platos: c.platos.filter((p, i) => (p.id ?? i) !== platoId) }))
          toast.success(t('admin.platoEliminado'))
        },
        { confirmar: t('admin.eliminar'), cancelar: t('admin.cancelar') }
      ),
    eliminarCategoria: (catId) =>
      confirmarToast(
        t('admin.confirmarEliminarCategoria'),
        () => {
          guardarCarta((prev) => prev.filter((c) => c.id !== catId))
          toast.success(t('admin.categoriaEliminada'))
        },
        { confirmar: t('admin.eliminar'), cancelar: t('admin.cancelar') }
      ),
  }

  const anadirCategoria = () => {
    const id = `cat-${Date.now()}`
    guardarCarta((prev) => [...prev, { id, titulo: { es: t('admin.nuevaCategoria') }, platos: [] }])
    setAbiertas((prev) => new Set(prev).add(id))
    toast.success(t('admin.categoriaAnadida'))
  }

  return (
    <main id="carta" className="relative z-[2] scroll-mt-20 pb-20">
      {/* Cinta de categorías: pegajosa bajo la cabecera, se desliza en móvil */}
      {!enEdicion && ids.length > 1 && (
        <nav
          aria-label={t('nav.categorias')}
          className="sticky top-16 z-30 border-y border-tinta-900/10 bg-papel-100/90 backdrop-blur-md"
        >
          <div
            ref={cintaRef}
            className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6"
          >
            {cartaData.map((cat) => {
              const esActiva = cat.id === activa
              return (
                <button
                  key={cat.id}
                  data-chip={cat.id}
                  onClick={() => irA(cat.id)}
                  aria-current={esActiva ? 'true' : undefined}
                  className={`shrink-0 rounded-full border px-4 py-2 font-cond text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
                    esActiva
                      ? 'border-tinta-900 bg-tinta-900 text-papel-100'
                      : 'border-tinta-900/15 text-tinta-700 hover:border-teja-500 hover:text-teja-600'
                  }`}
                >
                  {L(cat.titulo)}
                </button>
              )
            })}
          </div>
        </nav>
      )}

      <div className="mx-auto w-full max-w-3xl px-4 pt-12 sm:px-6">
        <header className="reveal flex flex-col items-center gap-4 pb-8 text-center">
          <p className="font-cond text-[0.68rem] uppercase tracking-[0.42em] text-teja-500">{t('carta.intro')}</p>
          <Separador className="w-full" />
        </header>

        {!enEdicion && ids.length > 1 && (
          <div className="reveal mb-2 flex justify-end">
            <button
              onClick={alternarTodas}
              className="rounded-full px-3 py-1.5 font-cond text-[0.7rem] uppercase tracking-[0.18em] text-tinta-600 transition-colors hover:text-teja-600"
            >
              {todasAbiertas ? '—  ' : '+  '}
              {t(todasAbiertas ? 'carta.cerrarTodo' : 'carta.abrirTodo')}
            </button>
          </div>
        )}

        {enEdicion && (
          <p className="mb-6 rounded-xl border border-teja-400/40 bg-teja-200/30 px-4 py-3 text-center font-body text-sm italic text-tinta-700">
            {t('admin.aviso')}
          </p>
        )}

        <div className="border-t border-tinta-900/12">
          {cartaData.map((cat, i) => (
            <Categoria
              key={cat.id}
              cat={cat}
              indice={i + 1}
              L={L}
              admin={enEdicion}
              acciones={acciones}
              abierta={abiertas.has(cat.id)}
              alAlternar={() => alternar(cat.id)}
            />
          ))}
        </div>

        {enEdicion && (
          <button
            onClick={anadirCategoria}
            className="mt-6 rounded-full border border-teja-500/50 px-5 py-2.5 font-cond text-sm uppercase tracking-[0.14em] text-teja-600 transition-colors hover:bg-teja-200/40"
          >
            {t('admin.anadirCategoria')}
          </button>
        )}

        <p className="reveal mt-14 text-center font-body text-sm italic leading-relaxed text-tinta-600">
          {t('carta.nota')}
        </p>

        <p className="reveal mt-8 text-center font-display text-2xl text-teja-500 sm:text-3xl">{t('carta.gracias')}</p>
      </div>

      {/* Botón flotante de administración */}
      {admin && (
        <button
          onClick={editando ? guardar : () => setEditando(true)}
          aria-label={editando ? t('admin.guardar') : t('admin.editar')}
          className={`fixed right-4 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 font-cond text-sm uppercase tracking-[0.14em] shadow-[0_16px_36px_-16px_rgba(30,24,23,0.9)] transition-colors ${
            editando
              ? 'bg-teja-600 text-papel-50 hover:bg-teja-500'
              : 'border border-tinta-900/20 bg-papel-50/95 text-tinta-800 backdrop-blur hover:border-teja-500 hover:text-teja-600'
          }`}
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          {editando ? (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.9" className="h-4 w-4 stroke-current" aria-hidden="true">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" className="h-4 w-4 stroke-current" aria-hidden="true">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
            </svg>
          )}
          {editando ? t('admin.guardar') : t('admin.editar')}
        </button>
      )}
    </main>
  )
}
