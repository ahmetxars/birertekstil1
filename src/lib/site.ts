export const SITE_NAME = 'Birer Tekstil'
export const SITE_URL = 'https://birertekstil.com'
export const ADMIN_PATH = '/yonetim'
export const LOGIN_PATH = '/giris'
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/B%C4%B0RER+TEKST%C4%B0L+Ev+Tekstil+%C3%9Cr%C3%BCnleri/@41.0149831,28.9668684,16.84z/data=!4m10!1m2!2m1!1sbirer+tekstil!3m6!1s0x14cab908453b746d:0xdbd49a0cfa41b5df!8m2!3d41.0153495!4d28.9704608!15sCg1iaXJlciB0ZWtzdGlsWg8iDWJpcmVyIHRla3N0aWySARFmYWJyaWNfd2hvbGVzYWxlcpoBRENpOURRVWxSUVVOdlpFTm9kSGxqUmpsdlQydGFhbHBYZUZaalJXeExURmh3VjFWc1pFNU5iR2hHWWtoV1JsVXhSUkFC4AEA-gEECAAQMw!16s%2Fg%2F11myhn3q33?entry=ttu&g_ep=EgoyMDI2MDQxOS4wIKXMDSoASAFQAw%3D%3D'
export const GOOGLE_MAPS_EMBED_URL =
  'https://www.google.com/maps?q=B%C4%B0RER+TEKST%C4%B0L+Ev+Tekstil+%C3%9Cr%C3%BCnleri&z=16&output=embed'

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
