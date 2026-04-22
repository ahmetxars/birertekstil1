import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Birer Tekstil',
    short_name: 'Birer Tekstil',
    description:
      "Istanbul'da ureticiden kaliteli ev tekstili urunleri. Pike, nevresim, keten, saten ve daha fazlasi.",
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f5f0',
    theme_color: '#a67c52',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 48x48 64x64',
        type: 'image/x-icon',
      },
      {
        src: '/icon.png',
        sizes: '1024x1024',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '1024x1024',
        type: 'image/png',
      },
    ],
  }
}
