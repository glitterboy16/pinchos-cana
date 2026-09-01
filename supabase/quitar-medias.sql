-- Pinchos Caña — quitar las medias raciones de la carta viva
--
-- Deja UN solo precio en "Raciones" y "Patatas": borra el `precioMedia` de
-- cada plato de esas dos categorías y su cabecera de dos columnas
-- ("Ración · Media"). NO toca "Bocadillos y montados": ahí el segundo precio
-- es el montado (un producto distinto) y se conserva.
--
-- Ejecutar UNA vez en el SQL Editor de Supabase. Es idempotente: si lo repites
-- no pasa nada (borrar una clave que ya no existe no hace daño).
--
-- Actúa sobre la fila que indique VITE_CONTENT_KEY (por defecto
-- 'carta_pinchos_cana'); cámbiala abajo si tu clave es otra.

update site_content
set
  value = (
    select jsonb_agg(
      case
        when categoria->>'id' in ('raciones', 'patatas') then
          (categoria - 'cabeceraPrecio') || jsonb_build_object(
            'platos', (
              select coalesce(jsonb_agg(plato - 'precioMedia'), '[]'::jsonb)
              from jsonb_array_elements(categoria->'platos') as plato
            )
          )
        else categoria
      end
    )
    from jsonb_array_elements(value) as categoria
  ),
  updated_at = now()
where key = 'carta_pinchos_cana';
