import { FaHome } from 'react-icons/fa'

export default function NavTabs({ tabs, active, onChange, onInfo }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0C2340', padding: '0 2rem', background: '#FFFEF8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onInfo}
          title="About this app"
          aria-label="About this app"
          style={{
            background: 'none',
            border: '1.5px solid #0C2340',
            borderRadius: '50%',
            width: 22,
            height: 22,
            padding: 0,
            color: '#0C2340',
            fontFamily: '"Times New Roman", Times, serif',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 13,
            lineHeight: 1,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          i
        </button>
        <button
          onClick={() => onChange('About')}
          title="Home"
          style={{
            background: 'none',
            border: '1.5px solid #0C2340',
            borderRadius: 3,
            cursor: 'pointer',
            color: '#0C2340',
            padding: '4px 10px',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: active === 'About' ? 1 : 0.7,
            transition: 'opacity 0.2s',
          }}
        >
          <FaHome style={{ fontSize: 18, color: '#0C2340' }} />
        </button>
      </div>
      <div style={{ display: 'flex' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`nav-tab${active === tab ? ' active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
