// Semilla de la carta de "Pinchos Caña".
//
// Es a la vez el contenido inicial y el FALLBACK local: si Supabase no
// responde, la web se ve igual con estos datos. Cada campo visible es un
// objeto multiidioma { es, en, pt }; los precios son cadenas universales
// (no se traducen).
//
// `precio` es la ración entera y `precioMedia` la media ración. En la
// categoría de bocadillos esas dos columnas son "Bocadillo · Montado".
//
// El dueño edita en español desde el modo admin y las traducciones a inglés
// y portugués se rellenan solas. Las de esta semilla están escritas a mano.

export const carta = [
  {
    id: 'raciones',
    titulo: { es: 'Raciones', en: 'Sharing Plates', pt: 'Doses' },
    platos: [
      {
        id: 'rac-01',
        nombre: { es: 'Plato de gambas', en: 'Prawns', pt: 'Gambas' },
        precio: '7,00 €',
      },
      {
        id: 'rac-02',
        nombre: { es: 'Pluma con patatas', en: 'Iberian pluma with fries', pt: 'Pluma ibérica com batatas' },
        precio: '16,00 €',
      },
      {
        id: 'rac-03',
        nombre: { es: 'Secreto con patatas', en: 'Iberian secreto with fries', pt: 'Secreto ibérico com batatas' },
        precio: '16,00 €',
      },
      {
        id: 'rac-04',
        nombre: { es: 'Solomillo con patatas', en: 'Pork tenderloin with fries', pt: 'Lombinho de porco com batatas' },
        precio: '16,00 €',
      },
      {
        id: 'rac-05',
        nombre: { es: 'Carne a la brasa', en: 'Chargrilled meat', pt: 'Carne na brasa' },
        precio: '16,00 €',
      },
      {
        id: 'rac-06',
        nombre: { es: 'Jamón ibérico', en: 'Iberian cured ham', pt: 'Presunto ibérico' },
        precio: '18,00 €',
      },
      {
        id: 'rac-07',
        nombre: { es: 'Queso', en: 'Cheese', pt: 'Queijo' },
        desc: { es: 'De oveja o de cabra.', en: 'Sheep or goat.', pt: 'De ovelha ou de cabra.' },
        precio: '17,00 €',
      },
      {
        id: 'rac-08',
        nombre: { es: 'Calamares', en: 'Fried squid', pt: 'Lulas fritas' },
        precio: '16,00 €',
      },
      {
        id: 'rac-09',
        nombre: { es: 'Rejos', en: 'Octopus tentacles', pt: 'Tentáculos de polvo' },
        precio: '16,00 €',
      },
      {
        id: 'rac-10',
        nombre: { es: 'Ensalada', en: 'Mixed salad', pt: 'Salada' },
        precio: '8,00 €',
      },
    ],
  },
  {
    id: 'patatas',
    titulo: { es: 'Patatas', en: 'Fries', pt: 'Batatas' },
    platos: [
      {
        id: 'pat-01',
        nombre: { es: 'Patatas fritas', en: 'French fries', pt: 'Batatas fritas' },
        precio: '7,00 €',
      },
      {
        id: 'pat-02',
        nombre: { es: 'Patatas fritas con pimientos', en: 'Fries with peppers', pt: 'Batatas fritas com pimentos' },
        precio: '10,00 €',
      },
      {
        id: 'pat-03',
        nombre: {
          es: 'Patatas fritas con pimientos y chorizo picante',
          en: 'Fries with peppers and spicy chorizo',
          pt: 'Batatas fritas com pimentos e chouriço picante',
        },
        precio: '12,00 €',
      },
      {
        id: 'pat-04',
        nombre: { es: 'Patatas con beicon y queso', en: 'Fries with bacon and cheese', pt: 'Batatas com bacon e queijo' },
        precio: '14,00 €',
      },
    ],
  },
  {
    id: 'pinchos',
    titulo: { es: 'Pinchos', en: 'Skewers', pt: 'Espetadas' },
    platos: [
      {
        id: 'pin-01',
        nombre: { es: 'Pincho de cerdo', en: 'Pork skewer', pt: 'Espetada de porco' },
        precio: '3,00 €',
      },
      {
        id: 'pin-02',
        nombre: { es: 'Pincho de chorizo picante', en: 'Spicy chorizo skewer', pt: 'Espetada de chouriço picante' },
        precio: '3,50 €',
      },
    ],
  },
  {
    id: 'bocadillos',
    titulo: { es: 'Bocadillos y montados', en: 'Baguettes & Rolls', pt: 'Sandes e montadinhos' },
    cabeceraPrecio: { es: 'Bocadillo · Montado', en: 'Baguette · Roll', pt: 'Sandes · Montadinho' },
    platos: [
      {
        id: 'boc-01',
        nombre: { es: 'Serranito o jamón', en: 'Serranito or cured ham', pt: 'Serranito ou presunto' },
        precio: '9,00 €',
      },
      {
        id: 'boc-02',
        nombre: { es: 'Queso curado, calamares o rejos', en: 'Cured cheese, squid or octopus', pt: 'Queijo curado, lulas ou polvo' },
        desc: { es: 'Extras 0,50 €.', en: 'Extras €0.50.', pt: 'Extras 0,50 €.' },
        precio: '8,00 €',
        precioMedia: '4,50 €',
      },
      {
        id: 'boc-03',
        nombre: {
          es: 'Filete de lomo, filete de pollo o beicon',
          en: 'Pork loin, chicken fillet or bacon',
          pt: 'Lombo, bife de frango ou bacon',
        },
        desc: { es: 'Extras 0,50 €.', en: 'Extras €0.50.', pt: 'Extras 0,50 €.' },
        precio: '7,00 €',
        precioMedia: '3,50 €',
      },
    ],
  },
  {
    id: 'picar',
    titulo: { es: 'Para picar', en: 'To Share', pt: 'Petiscos' },
    platos: [
      {
        id: 'pic-01',
        nombre: { es: 'Tapa de jamón o queso', en: 'Ham or cheese tapa', pt: 'Tapa de presunto ou queijo' },
        precio: '5,00 €',
      },
      {
        id: 'pic-02',
        nombre: { es: 'Hamburguesa mixta', en: 'Mixed burger', pt: 'Hambúrguer misto' },
        precio: '5,00 €',
      },
      {
        id: 'pic-03',
        nombre: { es: 'Perrito', en: 'Hot dog', pt: 'Cachorro-quente' },
        precio: '3,50 €',
      },
      {
        id: 'pic-04',
        nombre: { es: 'Salchipapa', en: 'Salchipapa', pt: 'Salchipapa' },
        desc: { es: 'Patatas con salchicha.', en: 'Fries with sausage.', pt: 'Batatas com salsicha.' },
        precio: '4,00 €',
      },
      {
        id: 'pic-05',
        nombre: { es: 'Cartucho de patatas', en: 'Cone of fries', pt: 'Cone de batatas' },
        precio: '3,00 €',
      },
    ],
  },
  {
    id: 'bebidas',
    titulo: { es: 'Bebidas', en: 'Drinks', pt: 'Bebidas' },
    platos: [
      {
        id: 'beb-01',
        nombre: { es: 'Refrescos y tercios', en: 'Soft drinks & bottled beer', pt: 'Refrigerantes e cervejas' },
        precio: '3,00 €',
      },
      {
        id: 'beb-02',
        nombre: { es: 'Tubos', en: 'Draught beer', pt: 'Cerveja de pressão' },
        precio: '2,50 €',
      },
    ],
  },
]

// Datos de contacto del puesto (pie de página y pie del PDF).
// TODO(Angel): completar con la dirección, el teléfono y el Instagram reales.
export const CONTACTO = {
  direccion: '',
  telefono: '',
  telHref: '',
  instagram: '',
}
