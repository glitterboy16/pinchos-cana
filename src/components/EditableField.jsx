import { useEffect, useRef, useState } from 'react'

// Campo de edición robusto: es controlado, así que SIEMPRE muestra el valor
// actual (nunca aparece vacío). Mientras escribes usa estado local para no
// perder el foco; se resincroniza desde fuera (traducción, realtime, cambio de
// idioma) solo cuando el campo no está enfocado; y guarda al salir (onBlur).
export default function EditableField({
  value,
  onCommit,
  className = '',
  placeholder,
  multiline = false,
  rows = 2,
  allowEmpty = true,
}) {
  const [local, setLocal] = useState(value ?? '')
  const focusRef = useRef(false)

  useEffect(() => {
    if (!focusRef.current) setLocal(value ?? '')
  }, [value])

  const commit = () => {
    focusRef.current = false
    const v = local.trim()
    if (!allowEmpty && v === '') {
      setLocal(value ?? '') // revierte: un nombre/título no puede quedar vacío
      return
    }
    if (v !== (value ?? '')) onCommit(v)
  }

  const shared = {
    value: local,
    placeholder,
    className,
    onChange: (e) => setLocal(e.target.value),
    onFocus: () => {
      focusRef.current = true
    },
    onBlur: commit,
  }

  return multiline ? <textarea rows={rows} {...shared} /> : <input {...shared} />
}
