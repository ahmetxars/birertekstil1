export function parseProductImages(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  }

  if (typeof value !== 'string' || !value.trim()) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : []
  } catch {
    return []
  }
}

export function buildProductImageGallery(primaryImage?: string | null, images?: unknown) {
  return [primaryImage || '', ...parseProductImages(images)].filter(
    (image, index, list): image is string => Boolean(image) && list.indexOf(image) === index
  )
}

export function serializeProductImages(images: string[]) {
  return JSON.stringify(images.filter((image, index, list) => Boolean(image) && list.indexOf(image) === index))
}

