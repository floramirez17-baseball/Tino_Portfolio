import { useState } from 'react'
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub } from 'react-icons/fa'
import Header from './components/Header'
import TickerTape from './components/TickerTape'
import NavTabs from './components/NavTabs'
import About from './tabs/About'
import Projects from './tabs/Projects'
import Experience from './tabs/Experience'
import Contact from './tabs/Contact'

function AboutAppModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(12,35,64,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFEF8',
          borderTop: '4px solid #0C2340',
          borderLeft: '4px solid #C49A22',
          maxWidth: 520, width: '100%',
          padding: '26px 28px 22px',
          fontFamily: '"Times New Roman", Times, serif',
          color: '#1A1A1A',
          borderRadius: 2,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 10, right: 12,
            background: 'none', border: 'none', fontSize: 20,
            color: '#0C2340', cursor: 'pointer', lineHeight: 1,
          }}
        >×</button>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#C49A22', marginBottom: 6 }}>
          About This Site
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0C2340', marginBottom: 12 }}>
          How this site was built
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.75, margin: '0 0 12px' }}>
          Designed and coded as a personal career website. The project is a
          single-page application built with <strong>React</strong> and
          <strong> Vite</strong>, styled with inline CSS-in-JS and custom
          typography, and hosted from the <strong>GitHub</strong> repository
          linked in the footer, with <strong>GitHub Pro</strong> access provided
          through the <strong>GitHub Student Developer Pack</strong>.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.75, margin: '0 0 12px' }}>
          The live ticker pulls real-time quotes from the <strong>Finnhub</strong> API
          through a serverless function deployed on <strong>Vercel</strong>. Icons
          are provided by <strong>react-icons</strong>. The codebase is written in
          JavaScript (JSX) and HTML/CSS.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.75, margin: '0 0 12px' }}>
          Development was assisted by <strong>Claude Opus 4.7</strong> running in
          Claude Code, used as a pair-programming tool for iteration, refactoring,
          and UI refinement.
        </p>
        <p style={{ fontSize: 12, lineHeight: 1.7, color: '#5C5C5C', margin: '12px 0 0', fontStyle: 'italic' }}>
          Disclaimer: Content reflects personal career history. Market data is provided
          for display purposes only and is not intended as financial advice.
        </p>
      </div>
    </div>
  )
}

function Footer({ onOpenAbout }) {
  return (
    <footer style={{
      borderTop: '3px solid #0C2340',
      background: '#0C2340',
      color: '#FFFEF8',
      fontFamily: '"Times New Roman", Times, serif',
      padding: '28px 2rem',
      marginTop: 40,
    }}>
      <div style={{ maxWidth: 1500, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>Florentino Ramirez</div>
          <div style={{ fontSize: 12, color: '#C49A22', letterSpacing: 1.5, textTransform: 'uppercase' }}>Career Website</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {[
            { Icon: FaEnvelope, label: 'fmramirez17@outlook.com', href: 'mailto:fmramirez17@outlook.com' },
            { Icon: FaPhone,    label: '(214) 620-4632',           href: 'tel:+12146204632' },
            { Icon: FaLinkedin, label: 'linkedin.com/in/tinor17',  href: 'https://www.linkedin.com/in/tinor17' },
            { Icon: FaGithub,   label: 'github.com/floramirez17-baseball',      href: 'https://github.com/floramirez17-baseball' },
          ].map(({ Icon, label, href }) => (
            <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FFFEF8', textDecoration: 'none', fontSize: 13 }}>
              <Icon style={{ color: '#C49A22', fontSize: 15 }} />
              {label}
            </a>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#8899BB', textAlign: 'right' }}>
          <button
            onClick={onOpenAbout}
            style={{
              background: 'none', border: 'none', color: '#C49A22',
              fontFamily: '"Times New Roman", Times, serif', fontSize: 12,
              letterSpacing: 0.5, cursor: 'pointer', padding: 0,
              textDecoration: 'underline',
            }}
          >About this app</button>
          <div style={{ marginTop: 4 }}>Dallas, TX &nbsp;·&nbsp; © {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('About')
  const [showAbout, setShowAbout] = useState(false)
  const tabs = ['About', 'Projects', 'Experience', 'Contact']

  const content = {
    About: <About />,
    Projects: <Projects />,
    Experience: <Experience />,
    Contact: <Contact />,
  }

  return (
    <div style={{
      fontFamily: '"Times New Roman", Times, serif',
      maxWidth: 1500,
      margin: '0 auto',
      background: 'var(--parchment)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header />
      <TickerTape />
      <NavTabs tabs={tabs} active={activeTab} onChange={setActiveTab} onInfo={() => setShowAbout(true)} />
      <div style={{ padding: '2rem 2rem', flex: 1 }}>{content[activeTab]}</div>
      <Footer onOpenAbout={() => setShowAbout(true)} />
      {showAbout && <AboutAppModal onClose={() => setShowAbout(false)} />}
    </div>
  )
}
