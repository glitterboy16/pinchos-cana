import toast from 'react-hot-toast'

// Sustituye a window.confirm por un aviso con botones, con el estilo de la
// casa. Llama a onConfirm() solo si se confirma.
export function confirmarToast(mensaje, onConfirm, opciones = {}) {
  const { confirmar = 'Eliminar', cancelar = 'Cancelar', peligro = true } = opciones

  toast(
    (tt) => (
      <div className="flex flex-col gap-3">
        <p className="font-body text-sm text-papel-100">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(tt.id)}
            className="rounded-full border border-papel-200/30 px-4 py-1.5 font-cond text-[0.7rem] uppercase tracking-[0.14em] text-papel-300 transition-colors hover:text-papel-100"
          >
            {cancelar}
          </button>
          <button
            onClick={() => {
              toast.dismiss(tt.id)
              onConfirm()
            }}
            className={`rounded-full px-4 py-1.5 font-cond text-[0.7rem] uppercase tracking-[0.14em] text-papel-50 transition-colors ${
              peligro ? 'bg-teja-600 hover:bg-teja-500' : 'bg-tinta-700 hover:bg-tinta-600'
            }`}
          >
            {confirmar}
          </button>
        </div>
      </div>
    ),
    { duration: Infinity }
  )
}
