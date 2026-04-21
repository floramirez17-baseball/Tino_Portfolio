export default function Header() {
  return (
    <>
      <div style={{ width: '100%', height: 230, overflow: 'hidden', lineHeight: 0, background: '#ccc' }}>
        <img src="/header.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 2rem 12px', borderBottom: '2px solid #1a1a1a' }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', border: '3px solid #1a1a1a', background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 13 }}>
          Photo
        </div>
        <div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#1a1a1a' }}>Florentino Ramirez</div>
          <div style={{ fontSize: 15, color: '#555', marginTop: 4 }}>Career Website &nbsp;|&nbsp; Dallas, TX</div>
        </div>
      </div>
    </>
  )
}
