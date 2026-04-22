const gold = '#C49A22'
const navy = '#0C2340'
const border = '#D4C9B0'

const entries = [
  {
    org: 'Ramirez & Associates P.C.',
    location: 'Dallas, TX',
    role: 'Case Administrator',
    dates: 'May 2025 – Present',
    bullet: 'Prepare and assemble nonimmigrant visa petitions and applications for employees of public and private sector employers filing with the USCIS, under direction of the firm\'s lead immigration paralegal. Research publicly accessible data related to online privacy policies and industry standards for intracompany risk tolerances.',
  },
  {
    org: 'ProSource Athletics',
    location: 'Dallas, TX',
    role: '17u Assistant Coach',
    dates: 'May 2024 – July 2024',
    bullet: 'Three National Tournament Championship wins. Teaching the game and assisting rising seniors with their college baseball aspirations.',
  },
  {
    org: 'Ramirez & Associates P.C.',
    location: 'Dallas, TX',
    role: 'Case Administrator',
    dates: 'May 2023 – August 2023',
    bullet: 'Prepared and assembled nonimmigrant visa petitions and applications for employees of public and private sector employers filing with the USCIS.',
  },
  {
    org: 'Ramlaw Corporate Services, L.L.C.',
    location: 'Dallas, TX',
    role: 'Case Administrator',
    dates: 'May 2022 – August 2022',
    bullet: 'Conducted audit of company\'s corporate clients for compliance and registration status with states\' Secretary of State; prepared reports of clients\' active status and registered agent information.',
  },
]

export default function Experience() {
  return (
    <div style={{ maxWidth: 780, fontFamily: '"Times New Roman", Times, serif' }}>
      <h2 style={{
        marginTop: 0,
        color: navy,
        fontSize: 20,
        borderBottom: `2px solid ${gold}`,
        paddingBottom: 8,
        marginBottom: 24,
      }}>
        Professional Experience
      </h2>

      {entries.map((e, i) => (
        <div key={i} style={{
          background: '#FFFEF8',
          border: `1px solid ${border}`,
          borderLeft: `4px solid ${gold}`,
          borderRadius: 2,
          padding: '16px 20px',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: navy }}>{e.org}</span>
            <span style={{ fontSize: 13, color: '#5C5C5C' }}>{e.location}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
            <span style={{ fontStyle: 'italic', fontSize: 13, color: '#444' }}>{e.role}</span>
            <span style={{ fontSize: 13, color: '#5C5C5C' }}>{e.dates}</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: '#333', margin: '10px 0 0' }}>{e.bullet}</p>
        </div>
      ))}
    </div>
  )
}
