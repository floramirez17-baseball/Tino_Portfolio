import { useState, useEffect } from 'react'

const HEADER_IMAGES = [
  { src: '/header.jpg',        position: 'center 55%' },
  { src: '/austin-college.jpg', position: 'center 50%' },
  { src: '/uark.jpg',           position: 'center 40%' },
]

export default function Header() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % HEADER_IMAGES.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden', background: '#0C2340' }}>
      {/* Rotating campus images */}
      {HEADER_IMAGES.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: img.position,
            opacity: i === idx ? 0.72 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}

      {/* Gradient overlay — darkens bottom so text pops */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(12,35,64,0.15) 0%, rgba(12,35,64,0.78) 100%)',
      }} />

      {/* Identity bar overlaid at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', gap: 20,
        padding: '16px 2rem 18px',
      }}>
        <img
          src="/Header_Photo.JPG"
          style={{
            width: 86, height: 86,
            objectFit: 'cover', objectPosition: 'center top',
            border: '2px solid #C49A22',
            borderRadius: 2,
            flexShrink: 0,
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        />
        <div>
          <div style={{
            fontSize: 30, fontWeight: 700, color: '#FFFEF8',
            fontFamily: '"Times New Roman", Times, serif',
            letterSpacing: 0.5, lineHeight: 1.15,
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}>
            Florentino Ramirez
          </div>
          <div style={{
            fontSize: 12, color: '#C49A22', marginTop: 4,
            fontFamily: '"Times New Roman", Times, serif',
            letterSpacing: 1.5, textTransform: 'uppercase',
          }}>
            Career Website &nbsp;·&nbsp; Dallas, TX
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            {['Finance', 'Real Estate', 'Data Analytics'].map(t => (
              <span key={t} style={{
                fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
                color: '#FFFEF8', border: '1px solid #C49A22',
                padding: '2px 8px', borderRadius: 1,
                fontFamily: '"Times New Roman", Times, serif',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
