// Los 14 alérgenos de declaración obligatoria — Reglamento (UE) 1169/2011.
//
// Cada uno lleva su nombre en los tres idiomas. El pictograma es una imagen en
// /public/alergenos/<id>.png (set de iconos de react-allergens, discos de
// color). Web y PDF los cargan por ese id.

export const ALERGENOS = [
  { id: 'gluten', nombre: { es: 'Gluten', en: 'Gluten', pt: 'Glúten' } },
  { id: 'crustaceos', nombre: { es: 'Crustáceos', en: 'Crustaceans', pt: 'Crustáceos' } },
  { id: 'huevos', nombre: { es: 'Huevos', en: 'Eggs', pt: 'Ovos' } },
  { id: 'pescado', nombre: { es: 'Pescado', en: 'Fish', pt: 'Peixe' } },
  { id: 'cacahuetes', nombre: { es: 'Cacahuetes', en: 'Peanuts', pt: 'Amendoins' } },
  { id: 'soja', nombre: { es: 'Soja', en: 'Soy', pt: 'Soja' } },
  { id: 'lacteos', nombre: { es: 'Lácteos', en: 'Milk', pt: 'Leite' } },
  { id: 'frutos-cascara', nombre: { es: 'Frutos de cáscara', en: 'Tree nuts', pt: 'Frutos de casca rija' } },
  { id: 'apio', nombre: { es: 'Apio', en: 'Celery', pt: 'Aipo' } },
  { id: 'mostaza', nombre: { es: 'Mostaza', en: 'Mustard', pt: 'Mostarda' } },
  { id: 'sesamo', nombre: { es: 'Sésamo', en: 'Sesame', pt: 'Sésamo' } },
  { id: 'sulfitos', nombre: { es: 'Sulfitos', en: 'Sulphites', pt: 'Sulfitos' } },
  { id: 'altramuces', nombre: { es: 'Altramuces', en: 'Lupin', pt: 'Tremoços' } },
  { id: 'moluscos', nombre: { es: 'Moluscos', en: 'Molluscs', pt: 'Moluscos' } },
]

export const ALERGENOS_POR_ID = Object.fromEntries(ALERGENOS.map((a) => [a.id, a]))
