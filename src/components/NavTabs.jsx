export default function NavTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', borderBottom: '2px solid #1a1a1a', padding: '0 2rem' }}>
      {tabs.map(tab => (
        <button key={tab} onClick={() => onChange(tab)} style={{
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: 15, fontWeight: 600, background: 'none', border: 'none',
          cursor: 'pointer', padding: '10px 20px', color: '#333',
          borderBottom: active === tab ? '3px solid #1a1a1a' : '3px solid transparent',
          marginBottom: -2,
        }}>
          {tab}
        </button>
      ))}
    </div>
  )
}
