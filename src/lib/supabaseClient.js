const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// La carta tiene que verse SIEMPRE, aunque el backend no esté configurado.
// Si faltan las variables, `getSupabase()` devuelve null y la app funciona con
// la última carta cacheada o con la semilla local (ver AdminContext).
export const haySupabase = Boolean(url && anonKey)

// El cliente pesa más que toda la web junta y no hace falta para pintar la
// carta: se carga aparte, después del primer render. Quien escanea el QR en la
// calle ve el menú al instante y la sincronización llega un momento después.
let promesa = null

export function getSupabase() {
  if (!haySupabase) return Promise.resolve(null)
  if (!promesa) {
    promesa = import('@supabase/supabase-js')
      .then(({ createClient }) => createClient(url, anonKey))
      .catch(() => null)
  }
  return promesa
}

// Clave de la fila de `site_content` donde vive esta carta. Permite compartir
// un mismo proyecto de Supabase entre varios restaurantes sin pisarse.
export const CLAVE_CARTA = import.meta.env.VITE_CONTENT_KEY || 'carta_pinchos_cana'

// Dominio ficticio del login: el dueño solo escribe "admin".
export const DOMINIO_ADMIN = import.meta.env.VITE_ADMIN_DOMAIN || 'acceso.pinchoscana.local'

if (!haySupabase && import.meta.env.DEV) {
  console.warn(
    '[Pinchos Caña] Sin VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY: ' +
      'la carta funciona en modo local (los cambios no se comparten entre dispositivos).'
  )
}
