import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'OverseasNursing — Find Trusted Overseas Nursing Agencies'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F8FAFC',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Left accent */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, backgroundColor: '#0F4C81' }} />

        {/* Logo mark */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            backgroundColor: '#0F4C81',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <span style={{ color: 'white', fontSize: 36, fontWeight: 700 }}>O</span>
        </div>

        {/* Brand */}
        <div style={{ fontSize: 26, fontWeight: 700, color: '#0F4C81', marginBottom: 16 }}>
          OverseasNursing
        </div>

        {/* Headline */}
        <div style={{ fontSize: 52, fontWeight: 800, color: '#1E293B', lineHeight: 1.15, marginBottom: 24 }}>
          Find trusted overseas<br />nursing agencies.
        </div>

        {/* Sub */}
        <div style={{ fontSize: 24, color: '#64748B', marginBottom: 32 }}>
          Real reviews · Transparent pricing · Scam alerts
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#DCFCE7',
            borderRadius: 24,
            padding: '10px 20px',
            width: 'fit-content',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600, color: '#166534' }}>✓ Trusted by 4,200+ nurses</span>
        </div>
      </div>
    ),
    size,
  )
}
