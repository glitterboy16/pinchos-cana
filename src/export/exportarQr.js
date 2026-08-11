import QRCode from 'qrcode'
import i18n, { idiomaCorto } from '../i18n'
import { TRADUCCIONES } from '../i18n/traducciones'

// ── PNG imprimible con el QR de la carta, para pegar en las mesas ────────
// Lienzo 1181×1748 px ≈ 10×14,8 cm a 300 dpi. Papel crema, tinta de sello.

const PAPEL = '#F6EAE0'
const TINTA = '#1E1817'
const TEJA = '#B9634F'

const cargarImagen = (src) =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })

export async function exportarQrPng(url) {
  const W = 1181
  const H = 1748
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = PAPEL
  ctx.fillRect(0, 0, W, H)

  // Marco doble, como el sello del logo
  ctx.strokeStyle = TINTA
  ctx.lineWidth = 7
  ctx.strokeRect(44, 44, W - 88, H - 88)
  ctx.strokeStyle = TEJA
  ctx.lineWidth = 2.5
  ctx.strokeRect(62, 62, W - 124, H - 124)

  // Logo recortado en círculo
  const logo = await cargarImagen('/logo.jpg')
  if (logo) {
    const d = 330
    const x = (W - d) / 2
    const y = 120
    ctx.save()
    ctx.beginPath()
    ctx.arc(x + d / 2, y + d / 2, d / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(logo, x - d * 0.07, y - d * 0.07, d * 1.14, d * 1.14)
    ctx.restore()
  }

  try {
    await Promise.all([
      document.fonts.load('500 62px Oswald'),
      document.fonts.load('300 34px Oswald'),
      document.fonts.load('600 40px Lora'),
    ])
    await document.fonts.ready
  } catch {
    /* si falla la carga de fuentes, el canvas usa la de por defecto */
  }

  ctx.textAlign = 'center'

  // Marca
  ctx.fillStyle = TINTA
  ctx.font = '500 76px Oswald, sans-serif'
  ctx.fillText('PINCHOS CAÑA', W / 2, 545)

  ctx.fillStyle = TEJA
  ctx.font = '300 30px Oswald, sans-serif'
  ctx.fillText('B R A S A   ·   P I N C H O S   ·   C A S E T A', W / 2, 595)

  // QR
  const lado = 720
  const tmp = document.createElement('canvas')
  await QRCode.toCanvas(tmp, url, {
    width: lado,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: TINTA, light: PAPEL },
  })
  const qy = 660
  ctx.drawImage(tmp, (W - lado) / 2, qy)

  // Esquinas de encuadre alrededor del QR
  const m = 26
  const l = 64
  const x0 = (W - lado) / 2 - m
  const y0 = qy - m
  const x1 = x0 + lado + m * 2
  const y1 = y0 + lado + m * 2
  ctx.strokeStyle = TEJA
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(x0, y0 + l); ctx.lineTo(x0, y0); ctx.lineTo(x0 + l, y0)
  ctx.moveTo(x1 - l, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + l)
  ctx.moveTo(x1, y1 - l); ctx.lineTo(x1, y1); ctx.lineTo(x1 - l, y1)
  ctx.moveTo(x0 + l, y1); ctx.lineTo(x0, y1); ctx.lineTo(x0, y1 - l)
  ctx.stroke()

  // Leyenda en los tres idiomas + URL
  const lang = idiomaCorto(i18n.language)
  const orden = [lang, ...['es', 'en', 'pt'].filter((c) => c !== lang)]
  ctx.fillStyle = TINTA
  ctx.font = '600 36px Lora, serif'
  ctx.fillText(TRADUCCIONES[orden[0]].footer.escanea, W / 2, 1520)
  ctx.fillStyle = 'rgba(30,24,23,0.62)'
  ctx.font = '300 27px Oswald, sans-serif'
  ctx.fillText(`${TRADUCCIONES[orden[1]].footer.escanea}  ·  ${TRADUCCIONES[orden[2]].footer.escanea}`, W / 2, 1566)

  ctx.fillStyle = TEJA
  ctx.font = '400 30px Oswald, sans-serif'
  ctx.fillText(url.replace(/^https?:\/\//, '').replace(/\/$/, ''), W / 2, 1638)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  const objUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objUrl
  a.download = 'pinchos-cana-qr.png'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(objUrl)
}
