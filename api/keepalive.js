// Latido diario contra Supabase.
//
// El plan gratuito de Supabase pausa un proyecto tras 7 días sin actividad, y
// un proyecto pausado hay que despertarlo a mano desde el panel. Una consulta
// al día basta para que nunca llegue a dormirse.
//
// Lo dispara el cron de Vercel (ver `crons` en vercel.json). La web en sí no
// necesita esto: Vercel sirve estáticos y no se apaga nunca.

export default async function handler(req, res) {
  // Vercel firma sus crons con CRON_SECRET. Si está configurado, exigimos la
  // cabecera para que nadie de fuera pueda disparar el endpoint.
  const secreto = process.env.CRON_SECRET
  if (secreto && req.headers.authorization !== `Bearer ${secreto}`) {
    return res.status(401).json({ ok: false, error: 'no autorizado' })
  }

  const url = process.env.VITE_SUPABASE_URL
  const clave = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !clave) {
    return res.status(500).json({ ok: false, error: 'faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY' })
  }

  const consulta = `${url}/rest/v1/site_content?select=key&limit=1`

  try {
    const inicio = Date.now()
    const r = await fetch(consulta, {
      headers: { apikey: clave, Authorization: `Bearer ${clave}` },
      signal: AbortSignal.timeout(10_000),
    })
    const ms = Date.now() - inicio

    // Un 404 significa que la tabla todavía no existe (falta el setup.sql),
    // pero la petición ha llegado igual: para Supabase eso ya es actividad.
    const ok = r.ok || r.status === 404

    return res.status(ok ? 200 : 502).json({
      ok,
      estado: r.status,
      ms,
      nota: r.status === 404 ? 'site_content aún no existe — ejecuta supabase/setup.sql' : undefined,
      cuando: new Date().toISOString(),
    })
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e?.message ?? e) })
  }
}
