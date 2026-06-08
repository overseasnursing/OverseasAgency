import React from 'react'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const W = 1200
const H = 630

// Shared brand colours
const BRAND   = '#0F4C81'
const DARK    = '#1E293B'
const MID     = '#475569'
const LIGHT   = '#94A3B8'
const BG      = '#F8FAFC'
const GREEN   = '#166534'
const GREENBG = '#DCFCE7'

function LogoMark() {
  return (
    <div
      style={{
        width: 64, height: 64, borderRadius: 14,
        backgroundColor: BRAND,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        flexShrink: 0,
      }}
    >
      <span style={{ color: 'white', fontSize: 32, fontWeight: 800, fontFamily: 'system-ui' }}>O</span>
    </div>
  )
}

function Brand() {
  return (
    <div style={{ fontSize: 22, fontWeight: 700, color: BRAND, marginBottom: 18, fontFamily: 'system-ui' }}>
      OverseasNursing.com
    </div>
  )
}

function Badge({ text, bg = GREENBG, color = GREEN }: { text: string; bg?: string; color?: string }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        backgroundColor: bg, borderRadius: 20,
        padding: '8px 16px', marginRight: 10,
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 600, color, fontFamily: 'system-ui' }}>{text}</span>
    </div>
  )
}

function Accent() {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, backgroundColor: BRAND }} />
  )
}

/* ── Exam / Mock-test variant ──────────────────────────────────── */
function ExamOg({ title, subtitle, testCount }: { title: string; subtitle: string; testCount: string }) {
  return (
    <div
      style={{
        width: W, height: H,
        display: 'flex', flexDirection: 'column',
        backgroundColor: BG,
        padding: '64px 80px',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
      }}
    >
      <Accent />
      <LogoMark />
      <Brand />

      {/* Category label */}
      <div style={{ fontSize: 18, color: LIGHT, marginBottom: 10, fontFamily: 'system-ui', letterSpacing: 1 }}>
        {subtitle.toUpperCase()}
      </div>

      {/* Exam name */}
      <div
        style={{
          fontSize: title.length > 40 ? 44 : 52,
          fontWeight: 800,
          color: DARK,
          lineHeight: 1.15,
          marginBottom: 28,
          fontFamily: 'system-ui',
        }}
      >
        {title}
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 0 }}>
        {testCount && (
          <Badge text={`${testCount} Free Practice Tests`} />
        )}
        <Badge text="✓ Timed & Scored" bg="#DBEAFE" color="#1D4ED8" />
        <Badge text="No Sign-up Needed" bg="#F1F5F9" color={MID} />
      </div>
    </div>
  )
}

/* ── Agency variant ─────────────────────────────────────────────── */
function AgencyOg({ name, location, rating }: { name: string; location: string; rating: string }) {
  return (
    <div
      style={{
        width: W, height: H,
        display: 'flex', flexDirection: 'column',
        backgroundColor: BG,
        padding: '64px 80px',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
      }}
    >
      <Accent />
      <LogoMark />
      <Brand />

      {/* Label */}
      <div style={{ fontSize: 18, color: LIGHT, marginBottom: 10, fontFamily: 'system-ui', letterSpacing: 1 }}>
        VERIFIED AGENCY
      </div>

      {/* Agency name */}
      <div
        style={{
          fontSize: name.length > 40 ? 44 : 52,
          fontWeight: 800,
          color: DARK,
          lineHeight: 1.15,
          marginBottom: 12,
          fontFamily: 'system-ui',
        }}
      >
        {name}
      </div>

      {/* Location */}
      {location && (
        <div style={{ fontSize: 22, color: MID, marginBottom: 24, fontFamily: 'system-ui' }}>
          {location}
        </div>
      )}

      {/* Badges */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 0 }}>
        {rating && <Badge text={`⭐ ${rating} Rating`} />}
        <Badge text="Real Nurse Reviews" bg="#DBEAFE" color="#1D4ED8" />
        <Badge text="Transparent Pricing" bg="#F1F5F9" color={MID} />
      </div>
    </div>
  )
}

/* ── Default (fallback) variant ─────────────────────────────────── */
function DefaultOg({ title }: { title: string }) {
  return (
    <div
      style={{
        width: W, height: H,
        display: 'flex', flexDirection: 'column',
        backgroundColor: BG,
        padding: '64px 80px',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
      }}
    >
      <Accent />
      <LogoMark />
      <Brand />
      <div
        style={{
          fontSize: title.length > 60 ? 38 : 48,
          fontWeight: 800,
          color: DARK,
          lineHeight: 1.2,
          marginBottom: 28,
          fontFamily: 'system-ui',
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 0 }}>
        <Badge text="✓ Trusted by 4,200+ nurses" />
        <Badge text="Free for nurses" bg="#DBEAFE" color="#1D4ED8" />
      </div>
    </div>
  )
}

/* ── Route handler ─────────────────────────────────────────────── */
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type      = searchParams.get('type') ?? 'default'
  const title     = searchParams.get('title') ?? 'OverseasNursing'
  const subtitle  = searchParams.get('subtitle') ?? ''
  const tests     = searchParams.get('tests') ?? ''
  const location  = searchParams.get('location') ?? ''
  const rating    = searchParams.get('rating') ?? ''

  let content: React.ReactElement

  if (type === 'exam') {
    content = <ExamOg title={title} subtitle={subtitle} testCount={tests} />
  } else if (type === 'agency') {
    content = <AgencyOg name={title} location={location} rating={rating} />
  } else {
    content = <DefaultOg title={title} />
  }

  return new ImageResponse(content, { width: W, height: H })
}
