export default function Header() {
  return (
    <>
      <div style={{ width: '100%', height: 230, overflow: 'hidden', lineHeight: 0, background: '#0C2340' }}>
        <img src="/header.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', opacity: 0.88 }} />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '14px 2rem 12px',
        background: '#FFFEF8',
        borderBottom: '3px solid #0C2340',
        boxShadow: '0 2px 8px rgba(12,35,64,0.07)',
      }}>
        <img
          src="/Header_Photo.JPG"
          style={{
            width: 100,
            height: 100,
            objectFit: 'cover',
            objectPosition: 'center top',
            border: '2px solid #C49A22',
            display: 'block',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#0C2340', fontFamily: '"Times New Roman", Times, serif', letterSpacing: 0.5 }}>
            Florentino Ramirez
          </div>
          <div style={{ fontSize: 13, color: '#5C5C5C', marginTop: 4, fontFamily: '"Times New Roman", Times, serif', letterSpacing: 0.5 }}>
            Career Website &nbsp;
            <span style={{ color: '#C49A22' }}>|</span>
            &nbsp; Dallas, TX
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            {['Finance', 'Real Estate', 'Data Analytics'].map(t => (
              <span key={t} style={{
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: '#0C2340',
                border: '1px solid #C49A22',
                padding: '2px 8px',
                borderRadius: 1,
                fontFamily: '"Times New Roman", Times, serif',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
