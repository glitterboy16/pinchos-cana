import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import i18n from '../i18n'
import { getSupabase, haySupabase, CLAVE_CARTA, DOMINIO_ADMIN } from '../lib/supabaseClient'
import { carta as cartaBase } from '../data/carta'

// ── Modo edición ─────────────────────────────────────────────────────────
// La carta vive en Supabase (tabla `site_content`, una fila por restaurante)
// para que un cambio hecho desde el móvil del dueño se vea al instante en
// todas las mesas. El login usa Supabase Auth con un email ficticio: el dueño
// solo escribe "admin".
//
// Si Supabase no está configurado o no responde, la web sigue funcionando con
// la última carta cacheada o con la semilla local: nunca se queda en blanco.

const IDIOMAS_DESTINO = ['en', 'pt']
const CACHE_KEY = `pinchoscana-carta:${CLAVE_CARTA}`
// Cuenta gratuita de MyMemory: identificarse sube el límite a 50k chars/día.
const MYMEMORY_EMAIL = 'villorinaangelandres@gmail.com'

const t = (clave, opciones) => i18n.t(clave, opciones)

// Traducción automática ES → EN/PT (API gratuita MyMemory)
async function traducir(textoEs) {
  const uno = async (lang) => {
    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoEs)}` +
      `&langpair=es|${lang}&de=${encodeURIComponent(MYMEMORY_EMAIL)}`
    const r = await fetch(url)
    if (!r.ok) throw new Error('HTTP ' + r.status)
    const j = await r.json()
    const texto = j?.responseData?.translatedText
    if (!texto || j.responseStatus !== 200) throw new Error('sin traducción')
    return [lang, texto]
  }
  const resultados = await Promise.allSettled(IDIOMAS_DESTINO.map(uno))
  return Object.fromEntries(resultados.filter((r) => r.status === 'fulfilled').map((r) => r.value))
}

const leerCache = () => {
  try {
    const crudo = localStorage.getItem(CACHE_KEY)
    const val = crudo && JSON.parse(crudo)
    return Array.isArray(val) && val.length ? val : null
  } catch {
    return null
  }
}

const escribirCache = (valor) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(valor))
  } catch {
    /* modo incógnito o cuota llena: no es crítico */
  }
}

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(false)
  // Arranca con la última carta vista en este móvil; si no hay, con la semilla
  const [cartaData, setCartaData] = useState(() => leerCache() ?? cartaBase)
  // Tras el login se ve la web normal; este flag activa el editor
  const [editando, setEditando] = useState(false)

  // Sesión de admin (persiste sola entre recargas vía Supabase Auth)
  useEffect(() => {
    let vivo = true
    let desuscribir = null
    getSupabase().then((sb) => {
      if (!sb || !vivo) return
      sb.auth.getSession().then(({ data }) => vivo && setAdmin(!!data.session))
      const { data: sub } = sb.auth.onAuthStateChange((_evento, sesion) => vivo && setAdmin(!!sesion))
      desuscribir = () => sub.subscription.unsubscribe()
      if (!vivo) desuscribir()
    })
    return () => {
      vivo = false
      desuscribir?.()
    }
  }, [])

  // Carga inicial de la carta publicada
  useEffect(() => {
    let vivo = true
    getSupabase().then(async (sb) => {
      if (!sb) return
      const { data, error } = await sb.from('site_content').select('value').eq('key', CLAVE_CARTA).maybeSingle()
      if (!vivo) return
      if (!error && Array.isArray(data?.value) && data.value.length) {
        setCartaData(data.value)
        escribirCache(data.value)
      }
    })
    return () => {
      vivo = false
    }
  }, [])

  // Sincroniza en vivo cuando se guarda desde otro navegador o dispositivo
  useEffect(() => {
    let vivo = true
    let limpiar = null
    getSupabase().then((sb) => {
      if (!sb || !vivo) return
      const canal = sb
        .channel('site_content-cambios')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload) => {
          const fila = payload.new
          if (fila && fila.key === CLAVE_CARTA && Array.isArray(fila.value)) {
            setCartaData(fila.value)
            escribirCache(fila.value)
          }
        })
        .subscribe()
      limpiar = () => sb.removeChannel(canal)
      if (!vivo) limpiar()
    })
    return () => {
      vivo = false
      limpiar?.()
    }
  }, [])

  const login = async (usuario, clave) => {
    const sb = await getSupabase()
    if (!sb) return false
    const email = usuario.includes('@') ? usuario : `${usuario}@${DOMINIO_ADMIN}`
    const { error } = await sb.auth.signInWithPassword({ email, password: clave })
    if (error) return false
    toast(t('login.bienvenida'), { icon: '🔥', id: 'bienvenida' })
    return true
  }

  const logout = async () => {
    const sb = await getSupabase()
    await sb?.auth.signOut()
    setEditando(false)
    toast(t('login.salir'), { id: 'sesion' })
  }

  // Confirma los cambios (ya persistidos al editar) y sale del modo edición
  const guardar = () => {
    setEditando(false)
    toast.success(t('admin.cambiosGuardados'), { id: 'guardar' })
  }

  const escribirRemoto = async (valor) => {
    const sb = await getSupabase()
    if (!sb) {
      toast(t('admin.soloLocal'), { id: 'local' })
      return false
    }
    const { error } = await sb
      .from('site_content')
      .upsert({ key: CLAVE_CARTA, value: valor, updated_at: new Date().toISOString() })
    if (error) {
      toast.error(t('admin.sinConexion'), { id: 'guardar-error' })
      return false
    }
    return true
  }

  // Acepta valor directo o función (prev) => nuevo, para que las
  // actualizaciones asíncronas (traducciones) no pisen cambios recientes.
  const guardarCarta = (nueva) => {
    setCartaData((prev) => {
      const valor = typeof nueva === 'function' ? nueva(prev) : nueva
      escribirCache(valor)
      escribirRemoto(valor)
      return valor
    })
  }

  // Actualiza un campo multiidioma desde su texto en español y dispara la
  // traducción automática a inglés y portugués. `aplicar` recibe { es, en, pt }.
  const campoTraducido = async (textoEs, aplicar) => {
    aplicar({ es: textoEs }) // primero el español, al instante
    try {
      const resto = await traducir(textoEs)
      if (Object.keys(resto).length) {
        aplicar({ es: textoEs, ...resto })
        toast.success(t('admin.traduccionOk'), { id: 'trad' })
      } else {
        toast(t('admin.traduccionKo'), { id: 'trad' })
      }
    } catch {
      toast(t('admin.traduccionKo'), { id: 'trad' })
    }
  }

  const valor = useMemo(
    () => ({
      admin,
      login,
      logout,
      guardar,
      cartaData,
      guardarCarta,
      campoTraducido,
      editando,
      setEditando,
      haySupabase,
    }),
    [admin, cartaData, editando]
  )

  return <AdminContext.Provider value={valor}>{children}</AdminContext.Provider>
}

export const useAdmin = () => useContext(AdminContext)
