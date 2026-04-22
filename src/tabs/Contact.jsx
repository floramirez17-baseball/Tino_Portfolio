import { FaEnvelope, FaPhone, FaLinkedin, FaGithub } from 'react-icons/fa';

const gold = '#C49A22'
const navy = '#0C2340'
const border = '#D4C9B0'

const items = [
  { Icon: FaEnvelope, label: 'Email',    value: 'fmramirez17@outlook.com',    href: 'mailto:fmramirez17@outlook.com' },
  { Icon: FaPhone,    label: 'Phone',    value: '(214) 620-4632',              href: 'tel:+12146204632' },
  { Icon: FaLinkedin, label: 'LinkedIn', value: 'linkedin.com/in/tinor17',     href: 'https://www.linkedin.com/in/tinor17' },
  { Icon: FaGithub,   label: 'GitHub',   value: 'github.com/floramirez17-baseball',         href: 'https://github.com/floramirez17-baseball' },
]

export default function Contact() {
  return (
    <div style={{ maxWidth: 480, fontFamily: '"Times New Roman", Times, serif' }}>
      <h2 style={{
        marginTop: 0,
        color: navy,
        fontSize: 20,
        borderBottom: `2px solid ${gold}`,
        paddingBottom: 8,
        marginBottom: 24,
      }}>
        Contact
      </h2>

      {items.map(({ Icon, label, value, href }) => (
        <div key={label} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: '#FFFEF8',
          border: `1px solid ${border}`,
          borderLeft: `4px solid ${gold}`,
          borderRadius: 2,
          padding: '14px 20px',
          marginBottom: 14,
        }}>
          <Icon style={{ fontSize: 22, color: navy, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: gold, marginBottom: 2 }}>
              {label}
            </div>
            <a
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: navy, textDecoration: 'none', fontFamily: '"Times New Roman", Times, serif' }}
            >
              {value}
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
