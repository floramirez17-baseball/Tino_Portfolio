import { useState } from 'react'
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub } from 'react-icons/fa'
import Header from './components/Header'
import TickerTape from './components/TickerTape'
import NavTabs from './components/NavTabs'
import About from './tabs/About'
import Projects from './tabs/Projects'
import Experience from './tabs/Experience'
import Contact from './tabs/Contact'

function Footer() {
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
          Dallas, TX &nbsp;·&nbsp; © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('About')
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
      <NavTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div style={{ padding: '2rem 2rem', flex: 1 }}>{content[activeTab]}</div>
      <Footer />
    </div>
  )
}
