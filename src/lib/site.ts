export const SITE_NAME = 'Birer Tekstil'
export const SITE_URL = 'https://birertekstil.com'
export const ADMIN_PATH = '/yonetim'
export const LOGIN_PATH = '/giris'

export function slugify(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildCategoryPath(slug: string) {
  return `/kategori/${slug}`
}

export function buildProductPath(name: string, id: string) {
  return `/urun/${slugify(name)}--${id}`
}

export function extractProductIdFromParam(value: string) {
  const [maybeId] = value.split('--').slice(-1)
  return maybeId || value
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export function buildPhoneHref(phone: string) {
  return `tel:${normalizePhone(phone)}`
}

export function buildWhatsAppHref(phone: string, message: string) {
  const normalized = normalizePhone(phone).replace(/^\+/, '')
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
