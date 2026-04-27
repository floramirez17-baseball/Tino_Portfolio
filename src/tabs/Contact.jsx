import { FaEnvelope, FaPhone, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useForm, ValidationError } from '@formspree/react';

const gold = '#C49A22'
const navy = '#0C2340'
const border = '#D4C9B0'

const items = [
  { Icon: FaEnvelope, label: 'Email',    value: 'fmramirez17@outlook.com',    href: 'mailto:fmramirez17@outlook.com' },
  { Icon: FaPhone,    label: 'Phone',    value: '(214) 620-4632',              href: 'tel:+12146204632' },
  { Icon: FaLinkedin, label: 'LinkedIn', value: 'linkedin.com/in/tinor17',     href: 'https://www.linkedin.com/in/tinor17' },
  { Icon: FaGithub,   label: 'GitHub',   value: 'github.com/floramirez17-baseball',         href: 'https://github.com/floramirez17-baseball' },
]

function MessageForm() {
  const [state, handleSubmit] = useForm('xdayragl');

  if (state.succeeded) {
    return (
      <div style={{ fontSize: 14, color: gold, textAlign: 'center', padding: '20px' }}>
        ✓ Message sent successfully! I'll get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
        style={{
          padding: '10px 14px',
          fontSize: 14,
          border: `1px solid ${border}`,
          borderRadius: 2,
          fontFamily: '"Times New Roman", Times, serif',
          color: navy,
        }}
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        required
        style={{
          padding: '10px 14px',
          fontSize: 14,
          border: `1px solid ${border}`,
          borderRadius: 2,
          fontFamily: '"Times New Roman", Times, serif',
          color: navy,
        }}
      />
      <ValidationError field="email" errors={state.errors} />
      <textarea
        name="message"
        placeholder="Your Message"
        required
        rows={5}
        style={{
          padding: '10px 14px',
          fontSize: 14,
          border: `1px solid ${border}`,
          borderRadius: 2,
          fontFamily: '"Times New Roman", Times, serif',
          color: navy,
          resize: 'none',
        }}
      />
      <ValidationError field="message" errors={state.errors} />
      <button
        type="submit"
        disabled={state.submitting}
        style={{
          background: navy,
          color: '#FFFEF8',
          border: `1px solid ${navy}`,
          padding: '10px 20px',
          borderRadius: 2,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
          cursor: state.submitting ? 'not-allowed' : 'pointer',
          fontFamily: '"Times New Roman", Times, serif',
          opacity: state.submitting ? 0.7 : 1,
        }}
      >
        {state.submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default function Contact() {
  return (
    <div style={{ display: 'flex', gap: 40, maxWidth: 900, fontFamily: '"Times New Roman", Times, serif' }}>
      {/* Left side - Contact items */}
      <div style={{ flex: 1, minWidth: 300 }}>
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

      {/* Right side - Message form */}
      <div style={{ flex: 1, minWidth: 300 }}>
        <h2 style={{
          marginTop: 0,
          color: navy,
          fontSize: 20,
          borderBottom: `2px solid ${gold}`,
          paddingBottom: 8,
          marginBottom: 24,
        }}>
          Send a Message
        </h2>
        <div style={{
          background: '#FFFEF8',
          border: `1px solid ${border}`,
          borderRadius: 2,
          padding: '20px',
        }}>
          <MessageForm />
        </div>
      </div>
    </div>
  )
}
