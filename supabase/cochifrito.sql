-- Pinchos Caña — añadir "Cochifrito" (16,00 €) a Raciones en la carta viva
--
-- Ejecutar UNA vez en el SQL Editor de Supabase. Idempotente: si ya existe
-- (id rac-11) no lo duplica. Sin alérgenos inherentes.

update site_content
set
  value = (
    select jsonb_agg(
      case
        when cat->>'id' = 'raciones'
          and not exists (
            select 1 from jsonb_array_elements(cat->'platos') as p where p->>'id' = 'rac-11'
          )
        then jsonb_set(
          cat,
          '{platos}',
          (cat->'platos') || jsonb_build_object(
            'id', 'rac-11',
            'nombre', jsonb_build_object('es', 'Cochifrito', 'en', 'Cochifrito', 'pt', 'Cochifrito'),
            'precio', '16,00 €'
          )
        )
        else cat
      end
    )
    from jsonb_array_elements(value) as cat
  ),
  updated_at = now()
where key = 'carta_pinchos_cana';
