export interface Producto {
  nombre: string
  url: string
}

const PRODUCTOS_POR_MODULO: Record<number, Producto[]> = {
  1: [
    { nombre: 'Velvet Cleansing Milk', url: 'https://www.perfumeriasrouge.com/velvet%20cleansing%20milk?_q=velvet%20cleansing%20milk&map=ft' },
    { nombre: 'Hydrating Gentle Foaming Cleanser', url: 'https://www.perfumeriasrouge.com/hydrating%20gentle%20foaming%20cleanser?_q=hydrating%20gentle%20foaming%20cleanser&map=ft' },
    { nombre: 'Hydrating Toning Lotion', url: 'https://www.perfumeriasrouge.com/hydrating%20toning%20lotion?_q=hydrating%20toning%20lotion&map=ft' },
    { nombre: 'Double Serum Light Texture', url: 'https://www.perfumeriasrouge.com/double%20serum%20light%20texture?_q=double%20serum%20light%20texture&map=ft' },
    { nombre: 'Double Serum Eye', url: 'https://www.perfumeriasrouge.com/double%20serum%20eye?_q=double%20serum%20eye&map=ft' },
    { nombre: 'Extra-Firming Jour', url: 'https://www.perfumeriasrouge.com/extra%20firming%20jour?_q=extra%20firming%20jour&map=ft' },
    { nombre: 'Extra-Firming Nuit', url: 'https://www.perfumeriasrouge.com/extra%20firming%20nuit?_q=extra%20firming%20nuit&map=ft' },
    { nombre: 'Clarins Comfort Oil', url: 'https://www.perfumeriasrouge.com/comfort%20oil%20clarins?_q=comfort%20oil%20clarins&map=ft' },
    { nombre: 'Invisible Sun Care Stick SPF 50', url: 'https://www.perfumeriasrouge.com/invisible%20sun%20care%20stick?_q=invisible%20sun%20care%20stick&map=ft' },
  ],
  2: [
    { nombre: 'SOS Primer', url: 'https://www.perfumeriasrouge.com/sos%20primer%20clarins?_q=sos%20primer%20clarins&map=ft' },
    { nombre: 'Double Serum Foundation', url: 'https://www.perfumeriasrouge.com/double-serum-foundation-g80119230/p' },
    { nombre: 'Tinted Oleo-Serum', url: 'https://www.perfumeriasrouge.com/tinted%20oleo%20serum?_q=tinted%20oleo%20serum&map=ft' },
    { nombre: 'Everlasting Concealer', url: 'https://www.perfumeriasrouge.com/everlasting%20concealer?_q=everlasting%20concealer&map=ft' },
    { nombre: 'Ever Bronze Compact Powder', url: 'https://www.perfumeriasrouge.com/ever%20bronze%20compact%20powder?_q=ever%20bronze%20compact%20powder&map=ft' },
    { nombre: 'Mascara Supra Volume', url: 'https://www.perfumeriasrouge.com/supra%20volume%20mascara?_q=supra%20volume%20mascara&map=ft' },
    { nombre: 'Lip Comfort Oil', url: 'https://www.perfumeriasrouge.com/lip%20comfort%20oil?_q=lip%20comfort%20oil&map=ft' },
    { nombre: 'Lip Perfector', url: 'https://www.perfumeriasrouge.com/lip%20perfector?_q=lip%20perfector&map=ft' },
  ],
  3: [
    { nombre: 'Blue Orchid Face Treatment Oil', url: 'https://www.perfumeriasrouge.com/blue%20orchid%20face%20treatment%20oil?_q=blue%20orchid%20face%20treatment%20oil&map=ft' },
    { nombre: 'Water Lip Stain', url: 'https://www.perfumeriasrouge.com/water%20lip%20stain%20clarins?_q=water%20lip%20stain%20clarins&map=ft' },
  ],
  4: [
    { nombre: 'Sombras Clarins', url: 'https://www.perfumeriasrouge.com/sombras%20clarins?_q=sombras%20clarins&map=ft' },
    { nombre: 'Delineador negro Clarins', url: 'https://www.perfumeriasrouge.com/delineador%20clarins?_q=delineador%20clarins&map=ft' },
    { nombre: 'Lip Oil Balm', url: 'https://www.perfumeriasrouge.com/lip%20oil%20balm?_q=lip%20oil%20balm&map=ft' },
  ],
}

export function getProductosByModulo(moduloOrden: number | null): Producto[] {
  if (moduloOrden === null || moduloOrden === undefined) return []
  return PRODUCTOS_POR_MODULO[moduloOrden] || []
}
