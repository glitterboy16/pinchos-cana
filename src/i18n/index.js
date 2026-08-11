import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { TRADUCCIONES } from './traducciones'

// Sin banderas: en Windows no se dibujan y una bandera nunca representa bien
// a un idioma. El código de dos letras se entiende en cualquier país.
export const IDIOMAS = [
  { code: 'es', nombre: 'Español' },
  { code: 'en', nombre: 'English' },
  { code: 'pt', nombre: 'Português' },
]

const CODIGOS = IDIOMAS.map((i) => i.code)
const STORAGE_KEY = 'pinchoscana-lang'

function idiomaInicial() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  if (CODIGOS.includes(guardado)) return guardado
  // El cliente que escanea el QR suele ser turista: respetamos su navegador
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase()
  return CODIGOS.includes(nav) ? nav : 'es'
}

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(CODIGOS.map((c) => [c, { translation: TRADUCCIONES[c] }])),
  lng: idiomaInicial(),
  fallbackLng: 'es',
  supportedLngs: CODIGOS,
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.lang = lng
})
document.documentElement.lang = i18n.language

// Idioma corto y estable ('es' | 'en' | 'pt') para resolver campos { es, en, pt }
export const idiomaCorto = (lng = i18n.language) => {
  const c = String(lng || 'es').slice(0, 2).toLowerCase()
  return CODIGOS.includes(c) ? c : 'es'
}

export default i18n
