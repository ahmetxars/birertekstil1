'use client'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
  }
}

export function trackLeadClick(type: 'whatsapp' | 'phone' | 'location', label: string) {
  if (typeof window === 'undefined') return

  const payload = {
    lead_type: type,
    lead_label: label,
  }

  window.dataLayer?.push({
    event: 'lead_click',
    ...payload,
  })

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'lead_click', payload)
  }
}
