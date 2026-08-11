import { jsPDF } from 'jspdf'
import loraRegularUrl from '../assets/fonts/Lora-Regular.ttf'
import loraItalicUrl from '../assets/fonts/Lora-Italic.ttf'
import loraSemiUrl from '../assets/fonts/Lora-SemiBold.ttf'
import { TRADUCCIONES } from '../i18n/traducciones'
import { CONTACTO } from '../data/carta'

// ── Carta en PDF, en el idioma que se elija ─────────────────────────────
// A4 sobre papel crema con tinta de sello y terracota, igual que la web.

const PAPEL = [237, 220, 207] // el mismo tono del fondo del logo
const TINTA = [30, 24, 23]
const TINTA_SUAVE = [107, 86, 81]
const TEJA = [185, 99, 79]

const A4 = { w: 210, h: 297 }
const M = 20

let recursos = null // caché de fuentes y logo entre descargas

const aBase64 = (buf) => {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
  }
  return btoa(s)
}

async function cargarRecursos() {
  if (recursos) return recursos
  const traer = (u) => fetch(u).then((r) => r.arrayBuffer())
  const [reg, ital, semi] = await Promise.all([traer(loraRegularUrl), traer(loraItalicUrl), traer(loraSemiUrl)])
  let logo = null
  try {
    logo = 'data:image/jpeg;base64,' + aBase64(await traer('/logo.jpg'))
  } catch {
    /* sin logo el PDF sigue saliendo bien */
  }
  recursos = { reg: aBase64(reg), ital: aBase64(ital), semi: aBase64(semi), logo }
  return recursos
}

export async function exportarCartaPdf(carta, lang) {
  const L = (v) => (v && typeof v === 'object' ? (v[lang] ?? v.es) : v)
  const tr = TRADUCCIONES[lang] ?? TRADUCCIONES.es
  const r = await cargarRecursos()

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  doc.addFileToVFS('Lora.ttf', r.reg)
  doc.addFont('Lora.ttf', 'Lora', 'normal')
  doc.addFileToVFS('LoraIt.ttf', r.ital)
  doc.addFont('LoraIt.ttf', 'Lora', 'italic')
  doc.addFileToVFS('LoraSemi.ttf', r.semi)
  doc.addFont('LoraSemi.ttf', 'LoraSemi', 'normal')

  const fondo = () => {
    doc.setFillColor(...PAPEL)
    doc.rect(0, 0, A4.w, A4.h, 'F')
  }

  const pie = () => {
    const partes = [CONTACTO.direccion, CONTACTO.telefono].filter(Boolean)
    const linea = partes.join('   ·   ') || tr.marca.nombre
    doc.setFont('Lora', 'normal').setFontSize(7.5).setTextColor(...TINTA_SUAVE).setCharSpace(0.6)
    doc.text(linea.toUpperCase(), A4.w / 2, A4.h - 12, { align: 'center' })
    doc.setCharSpace(0)
  }

  fondo()

  // ── Cabecera ──────────────────────────────────────────────────────────
  let y = 22
  if (r.logo) {
    const d = 34
    doc.addImage(r.logo, 'JPEG', (A4.w - d) / 2, y, d, d, undefined, 'FAST')
    y += d + 9
  } else {
    y += 6
  }

  doc.setFont('LoraSemi', 'normal').setFontSize(24).setTextColor(...TINTA).setCharSpace(2.4)
  doc.text('PINCHOS CAÑA', A4.w / 2, y, { align: 'center' })
  doc.setCharSpace(0)
  y += 7

  doc.setFont('Lora', 'italic').setFontSize(10).setTextColor(...TEJA)
  doc.text(tr.marca.lemaLargo, A4.w / 2, y, { align: 'center' })
  y += 5

  doc.setDrawColor(...TEJA).setLineWidth(0.3)
  doc.line(A4.w / 2 - 26, y, A4.w / 2 + 26, y)
  y += 15

  const nuevaPagina = () => {
    pie()
    doc.addPage()
    fondo()
    y = M + 4
  }
  const necesita = (mm) => {
    if (y + mm > A4.h - 22) nuevaPagina()
  }

  // ── Categorías ────────────────────────────────────────────────────────
  for (const cat of carta) {
    necesita(30)

    doc.setFont('LoraSemi', 'normal').setFontSize(14).setTextColor(...TINTA).setCharSpace(1.4)
    doc.text(String(L(cat.titulo) ?? '').toUpperCase(), M, y)
    doc.setCharSpace(0)
    doc.setDrawColor(...TEJA).setLineWidth(0.2).setLineDashPattern([], 0)
    doc.line(M, y + 2.8, A4.w - M, y + 2.8)

    if (cat.cabeceraPrecio) {
      doc.setFont('Lora', 'italic').setFontSize(8).setTextColor(...TEJA)
      doc.text(String(L(cat.cabeceraPrecio)), A4.w - M, y + 7.8, { align: 'right' })
      y += 5
    }
    y += 10.5

    for (const p of cat.platos) {
      const nombre = String(L(p.nombre) ?? '')
      const precio = p.precio ? String(L(p.precio)) : null
      const media = p.precioMedia ? String(L(p.precioMedia)) : null
      const desc = p.desc ? String(L(p.desc)) : null

      doc.setFont('LoraSemi', 'normal').setFontSize(10)
      const anchoPrecio = precio ? doc.getTextWidth(precio) + 4 : 0
      doc.setFont('Lora', 'normal').setFontSize(11)
      const lineasNombre = doc.splitTextToSize(nombre, A4.w - 2 * M - anchoPrecio - 8)

      let lineasDesc = []
      if (desc) {
        doc.setFont('Lora', 'italic').setFontSize(8.2)
        lineasDesc = doc.splitTextToSize(desc, A4.w - 2 * M - 14)
      }

      necesita(lineasNombre.length * 5 + (media ? 4 : 0) + lineasDesc.length * 3.8 + 4.5)

      doc.setFont('Lora', 'normal').setFontSize(11).setTextColor(...TINTA)
      doc.text(lineasNombre, M, y)

      if (precio) {
        doc.setFont('LoraSemi', 'normal').setFontSize(10).setTextColor(...TINTA)
        doc.text(precio, A4.w - M, y, { align: 'right' })

        // Puntos de guía entre el nombre y el precio
        doc.setFont('Lora', 'normal').setFontSize(11)
        const finNombre = M + doc.getTextWidth(lineasNombre[0]) + 3
        const inicioPrecio = A4.w - M - anchoPrecio - 1
        if (inicioPrecio > finNombre) {
          doc.setDrawColor(...TINTA_SUAVE).setLineWidth(0.2)
          doc.setLineDashPattern([0.35, 1.5], 0)
          doc.line(finNombre, y - 1, inicioPrecio, y - 1)
          doc.setLineDashPattern([], 0)
        }
      }
      y += lineasNombre.length * 5

      if (media) {
        doc.setFont('Lora', 'normal').setFontSize(8).setTextColor(...TEJA)
        doc.text(`${tr.carta.media} ${media}`, A4.w - M, y - 1.2, { align: 'right' })
        y += 2.6
      }

      if (lineasDesc.length) {
        doc.setFont('Lora', 'italic').setFontSize(8.2).setTextColor(...TINTA_SUAVE)
        doc.text(lineasDesc, M, y)
        y += lineasDesc.length * 3.8
      }
      y += 3.6
    }
    y += 8
  }

  // ── Cierre ────────────────────────────────────────────────────────────
  necesita(24)
  doc.setFont('Lora', 'italic').setFontSize(8.4).setTextColor(...TINTA_SUAVE)
  doc.text(tr.pdf.nota, A4.w / 2, y, { align: 'center', maxWidth: A4.w - 2 * M })
  y += 10
  doc.setFont('LoraSemi', 'normal').setFontSize(13).setTextColor(...TEJA).setCharSpace(1)
  doc.text(tr.carta.gracias, A4.w / 2, y, { align: 'center' })
  doc.setCharSpace(0)
  pie()

  doc.save(`Pinchos-Cana-Carta-${lang.toUpperCase()}.pdf`)
}
