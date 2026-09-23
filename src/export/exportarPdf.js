import loraRegularUrl from '../assets/fonts/Lora-Regular.ttf'
import loraItalicUrl from '../assets/fonts/Lora-Italic.ttf'
import loraSemiUrl from '../assets/fonts/Lora-SemiBold.ttf'
import { ALERGENOS } from '../data/alergenos'
import { construirPdf } from './construirPdf'

// ── Carta en PDF ────────────────────────────────────────────────────────
// Este módulo solo depende del navegador: descarga fuentes, logo e iconos y se
// los pasa a `construirPdf` (que es puro y se puede probar en Node).

let recursos = null // caché entre descargas

const aBase64 = (buf) => {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
  }
  return btoa(s)
}

// El logo llega como JPEG cuadrado con fondo crema: lo recortamos a un círculo
// (esquinas transparentes) para que no se vea el recuadro y quede redondo.
async function logoCircular() {
  try {
    const buf = await fetch('/logo.jpg').then((r) => r.arrayBuffer())
    const dataUrl = 'data:image/jpeg;base64,' + aBase64(buf)
    return await new Promise((res) => {
      const img = new Image()
      img.onload = () => {
        try {
          const s = Math.min(img.width, img.height)
          const c = document.createElement('canvas')
          c.width = s
          c.height = s
          const ctx = c.getContext('2d')
          ctx.beginPath()
          ctx.arc(s / 2, s / 2, s * 0.47, 0, Math.PI * 2)
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, s, s)
          res(c.toDataURL('image/png'))
        } catch {
          res(null)
        }
      }
      img.onerror = () => res(null)
      img.src = dataUrl
    })
  } catch {
    return null
  }
}

// Pictogramas oficiales de alérgenos (discos de color) desde /public/alergenos.
async function cargarIconos() {
  const salida = {}
  await Promise.all(
    ALERGENOS.map(async (a) => {
      try {
        salida[a.id] = 'data:image/png;base64,' + aBase64(await fetch(`/alergenos/${a.id}.png`).then((r) => r.arrayBuffer()))
      } catch {
        salida[a.id] = null
      }
    })
  )
  return salida
}

async function cargarRecursos() {
  if (recursos) return recursos
  const traer = (u) => fetch(u).then((r) => r.arrayBuffer())
  const [reg, ital, semi, logo, iconos] = await Promise.all([
    traer(loraRegularUrl),
    traer(loraItalicUrl),
    traer(loraSemiUrl),
    logoCircular(),
    cargarIconos(),
  ])
  recursos = { reg: aBase64(reg), ital: aBase64(ital), semi: aBase64(semi), logo, iconos }
  return recursos
}

export async function exportarCartaPdf(carta, lang, mostrarMedias = true) {
  const r = await cargarRecursos()
  const doc = construirPdf({ carta, lang, recursos: r, mostrarMedias })
  doc.save(`Pinchos-Cana-Carta-${lang.toUpperCase()}.pdf`)
}
