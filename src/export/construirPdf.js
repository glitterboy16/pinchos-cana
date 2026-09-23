import { jsPDF } from 'jspdf'
import { TRADUCCIONES } from '../i18n/traducciones'
import { CONTACTO } from '../data/carta'
import { ALERGENOS } from '../data/alergenos'

// ── Maquetación del PDF (pura: sin fetch ni DOM) ────────────────────────
// A4 sobre papel crema con tinta de sello y terracota, igual que la web. Se
// maqueta a DOS COLUMNAS para que la carta entera quepa, si puede, en una sola
// cara sin apretujarse. Si no cabe, fluye a una segunda página (también a dos
// columnas); la cabecera con el logo solo va en la primera.
//
// Recibe las fuentes en base64, el logo (dataURL) y los iconos de alérgenos ya
// rasterizados a PNG. La carga de esos recursos (fetch/canvas) vive en
// exportarPdf.js, que es quien depende del navegador.

export const PAPEL = [237, 220, 207] // el mismo tono del fondo del logo
export const TINTA = [30, 24, 23]
export const TINTA_SUAVE = [107, 86, 81]
export const TEJA = [185, 99, 79]
export const TEJA_HEX = '#b9634f'

const A4 = { w: 210, h: 297 }
const M = 16
const GAP = 9
const COLS = 2
const COL_W = (A4.w - 2 * M - GAP) / COLS
const COL_X = [M, M + COL_W + GAP]
const SUELO = A4.h - 15 // límite inferior del contenido (encima del pie)

export function construirPdf({ carta, lang, recursos: r, mostrarMedias = true }) {
  const L = (v) => (v && typeof v === 'object' ? (v[lang] ?? v.es) : v)
  const tr = TRADUCCIONES[lang] ?? TRADUCCIONES.es
  const iconos = r.iconos ?? {}
  // Las medias raciones solo salen si el interruptor está activo; los montados
  // de Bocadillos son un producto aparte y van siempre.
  const muestraMedia = (cat, p) => Boolean(p.precioMedia) && (mostrarMedias || cat.id === 'bocadillos')
  const muestraCabecera = (cat) => Boolean(cat.cabeceraPrecio) && (mostrarMedias || cat.id === 'bocadillos')

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
    const partes = [CONTACTO?.direccion, CONTACTO?.telefono].filter(Boolean)
    const linea = partes.join('   ·   ') || tr.marca.nombre
    doc.setFont('Lora', 'normal').setFontSize(7.5).setTextColor(...TINTA_SUAVE).setCharSpace(0.6)
    doc.text(linea.toUpperCase(), A4.w / 2, A4.h - 10, { align: 'center' })
    doc.setCharSpace(0)
  }

  // Estado del flujo por columnas
  let col = 0
  let y = 0
  let topCol = 0

  // Texto centrado teniendo en cuenta el espaciado entre letras (jsPDF no lo
  // descuenta al centrar, y el título quedaba desplazado).
  const centrado = (txt, cy, cs) => {
    doc.setCharSpace(cs)
    const ancho = doc.getTextWidth(txt) + cs * Math.max(0, txt.length - 1)
    doc.text(txt, (A4.w - ancho) / 2, cy)
    doc.setCharSpace(0)
  }

  const cabecera = () => {
    let hy = 11
    if (r.logo) {
      const d = 24
      doc.addImage(r.logo, 'PNG', (A4.w - d) / 2, hy, d, d, undefined, 'FAST')
      hy += d + 5.5
    } else {
      hy += 4
    }
    doc.setFont('LoraSemi', 'normal').setFontSize(19).setTextColor(...TINTA)
    centrado('PINCHOS CAÑA', hy, 2.1)
    hy += 5.6
    doc.setFont('Lora', 'italic').setFontSize(9).setTextColor(...TEJA)
    doc.text(tr.marca.lemaLargo, A4.w / 2, hy, { align: 'center' })
    hy += 4
    doc.setDrawColor(...TEJA).setLineWidth(0.3)
    doc.line(A4.w / 2 - 22, hy, A4.w / 2 + 22, hy)
    return hy + 5
  }

  const iniciarPagina = (primera) => {
    fondo()
    topCol = primera ? cabecera() : M + 6
    col = 0
    y = topCol
  }

  const saltar = () => {
    if (col < COLS - 1) {
      col++
      y = topCol
    } else {
      pie()
      doc.addPage()
      iniciarPagina(false)
    }
  }

  const necesita = (mm) => {
    if (y + mm > SUELO) saltar()
  }

  iniciarPagina(true)

  const izq = () => COL_X[col]
  const der = () => COL_X[col] + COL_W

  // Alto estimado de una categoría, para no partirla entre columnas si cabe entera.
  const altoCategoria = (cat) => {
    let h = (muestraCabecera(cat) ? 3 : 0) + 6
    for (const p of cat.platos) {
      doc.setFont('LoraSemi', 'normal').setFontSize(9.5)
      const ap = p.precio ? doc.getTextWidth(String(L(p.precio))) + 3 : 0
      doc.setFont('Lora', 'normal').setFontSize(10.5)
      const nl = doc.splitTextToSize(String(L(p.nombre) ?? ''), COL_W - ap - 5).length
      let dl = 0
      if (p.desc) {
        doc.setFont('Lora', 'italic').setFontSize(7.6)
        dl = doc.splitTextToSize(String(L(p.desc)), COL_W - 6).length
      }
      h += nl * 4.3 + (muestraMedia(cat, p) ? 2.2 : 0) + dl * 3.3 + (p.alergenos?.length ? 3.8 : 0) + 2.0
    }
    return h + 3.5
  }

  // ── Categorías ────────────────────────────────────────────────────────
  for (const cat of carta) {
    if (!cat.platos?.length) continue
    // Si una categoría entera cabe en una columna y aún no hemos llenado la
    // primera, la mantenemos junta; si no, se deja fluir (partir) para no
    // desperdiciar el fondo de la columna. Así las columnas quedan parejas.
    const alto = altoCategoria(cat)
    const hueco = SUELO - y
    // Salta de columna solo si queda poco hueco (para no orfanar el título); si
    // queda espacio decente, deja fluir/partir para llenar bien la columna.
    if (alto > hueco && alto <= SUELO - topCol && hueco < 30) saltar()
    else necesita(18)

    doc.setFont('LoraSemi', 'normal').setFontSize(12).setTextColor(...TINTA).setCharSpace(1.1)
    doc.text(String(L(cat.titulo) ?? '').toUpperCase(), izq(), y)
    doc.setCharSpace(0)
    doc.setDrawColor(...TEJA).setLineWidth(0.2).setLineDashPattern([], 0)
    doc.line(izq(), y + 2.6, der(), y + 2.6)

    if (muestraCabecera(cat)) {
      doc.setFont('Lora', 'italic').setFontSize(7.5).setTextColor(...TEJA)
      doc.text(String(L(cat.cabeceraPrecio)), der(), y + 6.4, { align: 'right' })
      y += 3
    }
    y += 6

    for (const p of cat.platos) {
      const nombre = String(L(p.nombre) ?? '')
      const precio = p.precio ? String(L(p.precio)) : null
      const media = muestraMedia(cat, p) ? String(L(p.precioMedia)) : null
      const desc = p.desc ? String(L(p.desc)) : null

      doc.setFont('LoraSemi', 'normal').setFontSize(9.5)
      const anchoPrecio = precio ? doc.getTextWidth(precio) + 3 : 0
      doc.setFont('Lora', 'normal').setFontSize(10.5)
      const lineasNombre = doc.splitTextToSize(nombre, COL_W - anchoPrecio - 5)

      let lineasDesc = []
      if (desc) {
        doc.setFont('Lora', 'italic').setFontSize(7.6)
        lineasDesc = doc.splitTextToSize(desc, COL_W - 6)
      }

      necesita(
        lineasNombre.length * 4.3 + (media ? 2.8 : 0) + lineasDesc.length * 3.3 + (p.alergenos?.length ? 4.6 : 0) + 2.6
      )

      doc.setFont('Lora', 'normal').setFontSize(10.5).setTextColor(...TINTA)
      doc.text(lineasNombre, izq(), y)

      if (precio) {
        doc.setFont('LoraSemi', 'normal').setFontSize(9.5).setTextColor(...TINTA)
        doc.text(precio, der(), y, { align: 'right' })

        doc.setFont('Lora', 'normal').setFontSize(10.5)
        const finNombre = izq() + doc.getTextWidth(lineasNombre[0]) + 2.5
        const inicioPrecio = der() - anchoPrecio - 1
        if (inicioPrecio > finNombre) {
          doc.setDrawColor(...TINTA_SUAVE).setLineWidth(0.2)
          doc.setLineDashPattern([0.35, 1.5], 0)
          doc.line(finNombre, y - 1, inicioPrecio, y - 1)
          doc.setLineDashPattern([], 0)
        }
      }
      y += lineasNombre.length * 4.3

      if (media) {
        doc.setFont('Lora', 'normal').setFontSize(7.6).setTextColor(...TEJA)
        doc.text(`${tr.carta.media} ${media}`, der(), y - 1, { align: 'right' })
        y += 2.2
      }

      if (lineasDesc.length) {
        doc.setFont('Lora', 'italic').setFontSize(7.6).setTextColor(...TINTA_SUAVE)
        doc.text(lineasDesc, izq(), y)
        y += lineasDesc.length * 3.3
      }

      if (p.alergenos?.length) {
        const s = 3.3
        let ax = izq()
        for (const aid of p.alergenos) {
          const png = iconos[aid]
          if (!png) continue
          doc.addImage(png, 'PNG', ax, y - 0.6, s, s, undefined, 'FAST')
          ax += s + 1.2
        }
        y += s + 0.5
      }
      y += 2.0
    }
    y += 3.5
  }

  // ── Alérgenos ─────────────────────────────────────────────────────────
  necesita(30)
  doc.setFont('LoraSemi', 'normal').setFontSize(12.5).setTextColor(...TINTA).setCharSpace(1.2)
  doc.text(String(tr.carta.alergenosTitulo ?? 'Alérgenos').toUpperCase(), izq(), y)
  doc.setCharSpace(0)
  doc.setDrawColor(...TEJA).setLineWidth(0.2)
  doc.line(izq(), y + 2.6, der(), y + 2.6)
  y += 7.5

  const celda = COL_W / 2
  const filaH = 5.0
  const icoS = 4.2
  for (let i = 0; i < ALERGENOS.length; i += 2) {
    necesita(filaH)
    for (let j = 0; j < 2; j++) {
      const a = ALERGENOS[i + j]
      if (!a) continue
      const x = izq() + j * celda
      const png = iconos[a.id]
      if (png) doc.addImage(png, 'PNG', x, y - icoS + 0.6, icoS, icoS, undefined, 'FAST')
      doc.setFont('Lora', 'normal').setFontSize(8).setTextColor(...TINTA)
      doc.text(String(a.nombre[lang] ?? a.nombre.es), x + icoS + 2, y - 0.8, { maxWidth: celda - icoS - 3 })
    }
    y += filaH
  }

  y += 2
  const nota = String(tr.carta.alergenosNota ?? '')
  doc.setFont('Lora', 'italic').setFontSize(7.4).setTextColor(...TINTA_SUAVE)
  const lineasNota = doc.splitTextToSize(nota, COL_W)
  necesita(lineasNota.length * 3.3 + 8)
  doc.text(lineasNota, izq(), y)
  y += lineasNota.length * 3.3 + 6

  // Cierre
  necesita(8)
  doc.setFont('LoraSemi', 'normal').setFontSize(11).setTextColor(...TEJA).setCharSpace(0.8)
  doc.text(String(tr.carta.gracias), izq() + COL_W / 2, y, { align: 'center' })
  doc.setCharSpace(0)

  pie()
  return doc
}
