export default function NavTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0C2340', padding: '0 2rem', background: '#FFFEF8' }}>
      <button
        onClick={() => onChange('About')}
        title="Home"
        style={{
          background: 'none',
          border: '1px solid #0C2340',
          borderRadius: 3,
          cursor: 'pointer',
          fontSize: 21,
          color: '#0C2340',
          padding: '4px 10px',
          lineHeight: 1,
          opacity: active === 'About' ? 1 : 0.55,
          transition: 'opacity 0.2s',
        }}
      >
        ⌂
      </button>
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
