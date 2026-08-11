// Piezas decorativas dibujadas a mano en SVG, tomadas del propio logo:
// la estrella de cinco puntas, la llama de la brasa y el pincho.

export function Estrella({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 1.6l2.5 6.6 7 .3-5.5 4.3 1.9 6.8L12 15.7 6.1 19.6 8 12.8 2.5 8.5l7-.3z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Llama({ className = '', style }) {
  return (
    <svg viewBox="0 0 32 40" className={className} style={style} aria-hidden="true">
      <path
        d="M16 0c2.6 8.3-3.4 11.7-3.4 17.9 0 3.1 2 5.1 2 5.1s-5-1-5-5.6C5.6 21 3 25.4 3 30.6 3 36.4 9 40 16 40s13-3.6 13-9.6c0-10.8-10.2-15.3-10.2-22.1-3.1 1.9-4 5.2-4 5.2S24.7 5.7 16 0Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Un pincho con sus trozos ensartados. `fondo` debe ser el color sobre el que
// se dibuja, para que la brocheta no se transparente a través de la carne.
export function Pincho({ className = '', fondo = 'none' }) {
  return (
    <svg viewBox="0 0 120 24" className={className} fill="none" aria-hidden="true">
      <path d="M3 12h114" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx={26 + i * 17}
          cy={12 + (i % 2 ? 1.4 : -1.4)}
          rx="9.4"
          ry="8.6"
          fill={fondo}
          stroke="currentColor"
          strokeWidth="1.6"
        />
      ))}
    </svg>
  )
}

// Filete separador: línea · estrella · línea
export function Separador({ className = '', style }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-teja-400 ${className}`} style={style} aria-hidden="true">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-teja-400/70 sm:w-20" />
      <Estrella className="h-3 w-3 shrink-0" />
      <span className="h-px w-4 bg-teja-400/50" />
      <Estrella className="h-2 w-2 shrink-0 opacity-70" />
      <span className="h-px w-4 bg-teja-400/50" />
      <Estrella className="h-3 w-3 shrink-0" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-teja-400/70 sm:w-20" />
    </div>
  )
}
