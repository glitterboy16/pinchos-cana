-- Pinchos Caña — alérgenos por plato (borrador para revisar con la cocina)
--
-- Marca en la carta viva qué alérgenos lleva cada plato, para que aparezcan los
-- iconos debajo de cada uno (web y PDF). Es un PRIMER BORRADOR según los
-- ingredientes evidentes: la cocina debe revisarlo, la responsabilidad legal es
-- del establecimiento (Reglamento UE 1169/2011).
--
-- Ejecutar UNA vez en el SQL Editor de Supabase. Idempotente: fija los alérgenos
-- de los platos listados y borra los de los demás.

with mapa(m) as (
  values ('{
    "rac-01": ["crustaceos"],
    "rac-07": ["lacteos"],
    "rac-08": ["gluten", "moluscos", "huevos"],
    "rac-09": ["pescado", "gluten"],
    "rac-10": ["mostaza"],
    "pat-03": ["sulfitos"],
    "pat-04": ["lacteos", "sulfitos"],
    "pin-02": ["sulfitos"],
    "boc-01": ["gluten"],
    "boc-02": ["gluten", "lacteos", "moluscos", "pescado"],
    "boc-03": ["gluten"],
    "pic-01": ["lacteos"],
    "pic-02": ["gluten", "huevos", "lacteos", "mostaza"],
    "pic-03": ["gluten", "mostaza", "sulfitos"],
    "pic-04": ["sulfitos"],
    "beb-01": ["gluten"],
    "beb-02": ["gluten"]
  }'::jsonb)
)
update site_content sc
set
  value = (
    select jsonb_agg(
      cat || jsonb_build_object('platos', (
        select coalesce(jsonb_agg(
          case
            when jsonb_exists(m, plato->>'id') then plato || jsonb_build_object('alergenos', m -> (plato->>'id'))
            else plato - 'alergenos'
          end
        ), '[]'::jsonb)
        from jsonb_array_elements(cat->'platos') as plato
      ))
      from jsonb_array_elements(sc.value) as cat
    ),
    updated_at = now()
from mapa
where sc.key = 'carta_pinchos_cana';
