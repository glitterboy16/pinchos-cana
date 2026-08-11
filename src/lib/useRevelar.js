import { useEffect } from 'react'

// Observa todos los elementos con clase `.reveal` (también los que aparecen
// después, al abrir una categoría) y les añade `.visible` cuando entran en
// pantalla. Un solo observador para toda la página.
export function useRevelar() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'))
      return
    }

    const io = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue
          entrada.target.classList.add('visible')
          io.unobserve(entrada.target)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    )

    let pendiente = 0
    const observar = () => {
      cancelAnimationFrame(pendiente)
      pendiente = requestAnimationFrame(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el))
      })
    }

    observar()
    // `classList.add` es una mutación de atributos: no reentra aquí.
    const mo = new MutationObserver(observar)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(pendiente)
      mo.disconnect()
      io.disconnect()
    }
  }, [])
}
