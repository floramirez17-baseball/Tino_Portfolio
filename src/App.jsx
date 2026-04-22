import { useState } from 'react'
import Header from './components/Header'
import TickerTape from './components/TickerTape'
import NavTabs from './components/NavTabs'
import About from './tabs/About'
import Projects from './tabs/Projects'
import Experience from './tabs/Experience'
import Contact from './tabs/Contact'

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
    }}>
      <Header />
      <TickerTape />
      <NavTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div style={{ padding: '2rem 2rem' }}>{content[activeTab]}</div>
    </div>
  )
}
