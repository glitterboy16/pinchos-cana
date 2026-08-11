# Pinchos Caña — Carta digital

Carta digital de **Pinchos Caña**, la caseta de pinchos a la brasa.
Los clientes escanean el QR de la mesa y ven la carta en **español, inglés o
portugués**, con la ración entera y la media ración.

React + Vite + Tailwind v4 + Supabase.

---

## Para el dueño: cómo cambiar precios y platos

1. Abre la web en el móvil y baja del todo, hasta el pie de página.
2. Pulsa el nombre **Pinchos Caña** que hay junto al ©.
3. Entra con tu usuario (`admin`) y tu contraseña.
4. Aparece abajo a la derecha el botón **Editar carta**. Púlsalo y ya puedes:
   - Cambiar nombres, precios, medias raciones y descripciones.
   - Añadir o borrar platos y categorías completas.
5. **Escribe siempre en español**: el inglés y el portugués se traducen solos
   al salir de cada campo.
6. Los cambios se guardan al momento y se ven al instante en todas las mesas.
   Pulsa **Guardar** para salir del modo edición.

Para cerrar la sesión, vuelve a pulsar el nombre del pie.

---

## El QR

La web **genera su propio QR** con su dirección: no hay que rehacerlo nunca,
aunque cambie el dominio. Está en el pie de página, y desde ahí:

- **Descargar QR** → PNG listo para imprimir (10×15 cm a 300 ppp), con el logo,
  el marco de la marca y la leyenda en los tres idiomas.
- **Copiar enlace** → para mandarlo por WhatsApp o ponerlo en Instagram.

También hay **Carta en PDF** en cualquiera de los tres idiomas, por si hace
falta una carta física.

---

## Puesta en marcha (desarrollo)

```bash
npm install
npm run dev
```

Copia `.env.example` a `.env` y rellena las variables. **Sin ellas la carta se
ve igual** (usa los datos de `src/data/carta.js`), pero no se puede editar
desde la web.

| Variable | Para qué |
| --- | --- |
| `VITE_SUPABASE_URL` | Proyecto de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública del proyecto |
| `VITE_CONTENT_KEY` | Fila de `site_content` con esta carta (`carta_pinchos_cana`) |
| `VITE_ADMIN_DOMAIN` | Dominio ficticio del login (`acceso.pinchoscana.local`) |
| `VITE_SITE_URL` | Solo si el QR debe apuntar a otro dominio |

## Supabase

1. Ejecuta `supabase/setup.sql` en el SQL Editor. Crea la tabla `site_content`
   (lectura pública, escritura solo para usuarios autenticados) y activa la
   sincronización en vivo entre dispositivos.
2. En **Authentication → Users → Add user**, con *Auto Confirm User* activado:
   - Email: `admin@acceso.pinchoscana.local`
   - Password: la que elijas
3. En la web se entra escribiendo solo `admin` y esa contraseña.

La carta entera vive en **una sola fila** de `site_content`, en formato JSON.
Si Supabase no responde, la web sigue funcionando con la última carta que vio
ese móvil (caché local) o con la semilla de `src/data/carta.js`: nunca se queda
en blanco delante de un cliente.

## Despliegue

Producción en **Vercel** (framework detectado: Vite). Hay que configurar allí
las mismas variables de entorno.

---

## Cómo está montado

```
src/
  data/carta.js         La carta: categorías, platos y precios en es/en/pt
  i18n/                 Textos de la interfaz en los tres idiomas
  admin/                Sesión del dueño y modo edición
  components/           Cabecera, portada, carta, QR y pie
  export/               Generación del QR imprimible y del PDF
  lib/                  Cliente de Supabase, avisos y animación al hacer scroll
supabase/setup.sql      Tabla, permisos y realtime
public/logo.jpg         Logo de la casa
```

**Detalles que importan:**

- El cliente de Supabase se carga **después** de pintar la carta: quien escanea
  el QR en la calle ve el menú al instante aunque vaya con mala cobertura.
- Cada campo visible es un objeto `{ es, en, pt }`. Los precios son cadenas
  (`'16,00 €'`) y no se traducen.
- `precio` es la ración entera y `precioMedia` la media. En los bocadillos esas
  dos columnas son "Bocadillo · Montado".
- Fuentes servidas desde el propio dominio: sin CDN de Google, sin aviso de
  cookies.
- Todas las animaciones respetan `prefers-reduced-motion`.
