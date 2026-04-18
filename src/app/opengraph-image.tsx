import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Birer Tekstil İstanbul — Kaliteli Ev Tekstili'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3d2c1e 0%, #5c3d2e 50%, #4a3225 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Decorative border */}
        <div style={{
          position: 'absolute',
          inset: 24,
          border: '2px solid rgba(212,169,106,0.3)',
          borderRadius: 16,
        }} />

        {/* Scissors icon area */}
        <div style={{
          fontSize: 64,
          marginBottom: 16,
          lineHeight: 1,
        }}>
          ✂️
        </div>

        {/* Brand name */}
        <div style={{
          fontSize: 80,
          fontWeight: 'bold',
          color: '#d4a96a',
          letterSpacing: '0.08em',
          marginBottom: 8,
        }}>
          BİRER TEKSTİL
        </div>

        {/* Location */}
        <div style={{
          fontSize: 24,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.3em',
          marginBottom: 40,
        }}>
          İ S T A N B U L
        </div>

        {/* Divider */}
        <div style={{
          width: 120,
          height: 2,
          background: '#d4a96a',
          marginBottom: 32,
        }} />

        {/* Description */}
        <div style={{
          fontSize: 26,
          color: 'rgba(255,255,255,0.85)',
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.5,
          marginBottom: 40,
        }}>
          Üreticiden Kaliteli Ev Tekstili Ürünleri
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 800,
          marginBottom: 40,
        }}>
          {['Nevresim', 'Pike', 'Saten', 'Keten', 'Kapitone'].map((cat) => (
            <div key={cat} style={{
              background: 'rgba(212,169,106,0.15)',
              border: '1px solid rgba(212,169,106,0.4)',
              borderRadius: 50,
              padding: '6px 20px',
              color: '#d4a96a',
              fontSize: 18,
            }}>
              {cat}
            </div>
          ))}
        </div>

        {/* Website */}
        <div style={{
          background: '#d4a96a',
          padding: '10px 36px',
          borderRadius: 50,
          color: '#3d2c1e',
          fontWeight: 'bold',
          fontSize: 20,
          letterSpacing: '0.05em',
        }}>
          www.birertekstil.com
        </div>
      </div>
    ),
    { ...size }
  )
}
