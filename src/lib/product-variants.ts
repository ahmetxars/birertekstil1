export interface ProductVariantOption {
  image: string
  label: string
  inStock: boolean
}

function sanitizeLabel(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

export function parseProductVariantOptions(value: unknown, gallery: string[]) {
  const normalizedGallery = gallery.filter(
    (image, index, list): image is string =>
      typeof image === 'string' && Boolean(image) && list.indexOf(image) === index
  )

  let parsedOptions: Array<Partial<ProductVariantOption>> = []

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        parsedOptions = parsed
      }
    } catch {
      parsedOptions = []
    }
  } else if (Array.isArray(value)) {
    parsedOptions = value
  }

  return normalizedGallery.map((image, index) => {
    const existing = parsedOptions.find((option) => option.image === image)

    return {
      image,
      label: sanitizeLabel(existing?.label, `Renk ${index + 1}`),
      inStock: typeof existing?.inStock === 'boolean' ? existing.inStock : true,
    }
  })
}

export function serializeProductVariantOptions(
  options: ProductVariantOption[],
  gallery: string[]
) {
  const normalized = parseProductVariantOptions(options, gallery)
  return JSON.stringify(normalized)
}
