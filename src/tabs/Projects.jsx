import { useState } from 'react'

const PROJECT_TABS = ['FINN Real Estate', "Should AVM's Replace Human Appraisers?", 'Downloads']
const TOTAL_SLIDES = 24

const dlBtn = {
  display: 'inline-block',
  fontFamily: '"Times New Roman", Times, serif',
  border: '1px solid #1a1a1a',
  background: '#fff',
  cursor: 'pointer',
  padding: '8px 20px',
  borderRadius: 2,
  textDecoration: 'none',
  color: '#1a1a1a',
  fontSize: 14,
}
const navBtn = { ...dlBtn, padding: '6px 20px' }

export default function Projects() {
  const [proj, setProj] = useState('FINN Real Estate')
  const [slideIdx, setSlideIdx] = useState(0)

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #ccc', marginBottom: '1.5rem' }}>
        {PROJECT_TABS.map(t => (
          <button key={t} onClick={() => { setProj(t); setSlideIdx(0) }} style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: 14, background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 18px', color: proj === t ? '#1a1a1a' : '#666',
            borderBottom: proj === t ? '2px solid #1a1a1a' : '2px solid transparent',
            marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      {proj === 'FINN Real Estate' && (
        <div>
          <a href="/files/FINN Real Estate - Group Project.pptx" download style={dlBtn}>
            ↓ Download PPTX
          </a>
          <img
            src={`/slides/slide_${String(slideIdx + 1).padStart(3, '0')}.jpg`}
            style={{ width: '100%', marginTop: '1rem', border: '1px solid #ddd', display: 'block' }}
            alt={`Slide ${slideIdx + 1}`}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            <button onClick={() => setSlideIdx(i => i - 1)} disabled={slideIdx === 0} style={{ ...navBtn, opacity: slideIdx === 0 ? 0.4 : 1 }}>← Prev</button>
            <span style={{ flex: 1, textAlign: 'center', fontSize: 14, color: '#555' }}>
              Slide {slideIdx + 1} of {TOTAL_SLIDES}
            </span>
            <button onClick={() => setSlideIdx(i => i + 1)} disabled={slideIdx === TOTAL_SLIDES - 1} style={{ ...navBtn, opacity: slideIdx === TOTAL_SLIDES - 1 ? 0.4 : 1 }}>Next →</button>
          </div>
        </div>
      )}

      {proj === "Should AVM's Replace Human Appraisers?" && (
        <div>
          <a href="/files/Should AVMs Replace Human Appraisers?.docx" download style={dlBtn}>
            ↓ Download DOCX
          </a>
          <div style={{ maxHeight: 560, overflowY: 'auto', padding: '1.5rem', border: '1px solid #d0d0d0', marginTop: '1rem', lineHeight: 1.7, fontSize: 15 }}>
            AVM paper content here.
          </div>
        </div>
      )}

      {proj === 'Downloads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <a href="/files/FINN Real Estate - Group Project.pptx" download style={dlBtn}>
            ↓ FINN Real Estate — Group Project (.pptx)
          </a>
          <a href="/files/Should AVMs Replace Human Appraisers?.docx" download style={dlBtn}>
            ↓ Should AVM's Replace Human Appraisers? (.docx)
          </a>
        </div>
      )}
    </div>
  )
}
