/**
 * Única fuente de verdad de los assets de imagen de la librería.
 *
 * Regla: ningún componente, página ni story debe escribir a mano una URL o ruta de imagen.
 * Cualquier imagen nueva (logos, banderas, portadas, iconos de mapa, imágenes de demo...) se
 * declara aquí y se importa desde "@/lib/assets".
 *
 * Quedan fuera a propósito las imágenes que llegan como datos en tiempo de ejecución
 * (p. ej. `user.avatar`, `event.imageUrl` o los campos de imagen del editor Puck), porque las
 * decide quien consume la librería y no forman parte de ella.
 */

/* ---------- Orígenes base ---------- */

/**
 * Origen del sitio que sirve las imágenes de Air Spain.
 * En local (o sin `window`, p. ej. en SSR) apunta a producción; en cualquier otro host usa el
 * propio host de la página.
 */
export const SITE_BASE: string =
  typeof window === "undefined" || window.location.hostname === "localhost"
    ? "https://air-spain.es"
    : `${window.location.protocol}//${window.location.hostname}`;

const IMAGES_BASE = `${SITE_BASE}/imagenes`;

// Demo images are hot-linked from the AdminLTE demo site. For production, copy the files you need
// from node_modules/admin-lte/dist/assets/img into /public/img and point these at them.
const ADMINLTE_BASE = "https://adminlte.io/themes/v4/assets/img";

const LEAFLET_BASE = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images";

/* ---------- Dashboard (AdminLTE) ---------- */

export const logo = `${ADMINLTE_BASE}/AdminLTELogo.png`;
export const user1 = `${ADMINLTE_BASE}/user1-128x128.jpg`;
export const user2 = `${ADMINLTE_BASE}/user2-160x160.jpg`;
export const user3 = `${ADMINLTE_BASE}/user3-128x128.jpg`;
export const user4 = `${ADMINLTE_BASE}/user4-128x128.jpg`;

/* ---------- Marca y socios ---------- */

/** Logo de la aerolínea virtual (también usado como imagen de IVAO en la web). */
export const vaLogo = `${IMAGES_BASE}/va.png`;

export const partnerLogos = {
  vatsim: `${IMAGES_BASE}/VATSIM_LOGO.png`,
  ivao: vaLogo,
  simbrief: `${IMAGES_BASE}/simbrief2.png`,
} as const;

/* ---------- Portadas ---------- */

/** Portadas numeradas del 1 al 15. Las número 3 y 12 son .jpg; el resto, .png. */
export const coverImages: readonly string[] = Array.from({ length: 15 }, (_, i) => {
  const n = i + 1;
  return `${IMAGES_BASE}/portada/${n}.${n === 3 || n === 12 ? "jpg" : "png"}`;
});

export const loginCover = coverImages[2]!;
export const registerCover = coverImages[11]!;

/* ---------- Banderas y logros ---------- */

/** Bandera por código de país (p. ej. "ES", "GB"). */
export const flagUrl = (code: string) => `${IMAGES_BASE}/flags/${code}.png`;

/** Insignia de horas voladas (p. ej. "5000-a"). */
export const achievementBadgeUrl = (badge: string) => `${IMAGES_BASE}/logros/${badge}.png`;

/* ---------- Mapas ---------- */

/** Plantilla de teselas de OpenStreetMap para Leaflet. */
export const osmTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

/** Iconos por defecto de los marcadores de Leaflet. */
export const leafletMarkerIcons = {
  iconRetinaUrl: `${LEAFLET_BASE}/marker-icon-2x.png`,
  iconUrl: `${LEAFLET_BASE}/marker-icon.png`,
  shadowUrl: `${LEAFLET_BASE}/marker-shadow.png`,
} as const;

/* ---------- Imágenes de demo (stories) ---------- */

export const demoImages = {
  airplaneWindow:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
  barcelonaAerial:
    "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=1200&q=80",
} as const;
