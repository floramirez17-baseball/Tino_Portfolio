export default function NavTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', borderBottom: '2px solid #0C2340', padding: '0 2rem', background: '#FFFEF8' }}>
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
  )
}
