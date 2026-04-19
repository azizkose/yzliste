import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'yzliste Blog'
  const kategori = searchParams.get('kategori') ?? 'Blog'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: '0',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Indigo top bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: '#6366f1', display: 'flex' }} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 72px 56px 72px',
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#6366f1',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              y
            </div>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>yzliste</span>
            <span style={{ fontSize: '16px', color: '#9ca3af', marginLeft: '4px' }}>Blog</span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 60 ? '44px' : '52px',
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Category badge + domain */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#eef2ff',
                color: '#4f46e5',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              {kategori}
            </div>
            <span style={{ fontSize: '18px', color: '#9ca3af' }}>www.yzliste.com</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
