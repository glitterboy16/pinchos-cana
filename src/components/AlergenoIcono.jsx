import { ALERGENOS_POR_ID } from '../data/alergenos'

// Pictograma oficial del alérgeno (disco de color, Reglamento UE 1169/2011).
// Las imágenes viven en /public/alergenos/<id>.png.
export default function AlergenoIcono({ id, className = '' }) {
  const a = ALERGENOS_POR_ID[id]
  if (!a) return null
  return <img src={`/alergenos/${id}.png`} alt="" aria-hidden="true" loading="lazy" className={className} />
}
