import { useState } from 'react'
import Header from './components/Header'
import NavTabs from './components/NavTabs'
import About from './tabs/About'
import Skills from './tabs/Skills'
import Projects from './tabs/Projects'
import Experience from './tabs/Experience'
import Contact from './tabs/Contact'

export default function App() {
  const [activeTab, setActiveTab] = useState('About')
  const tabs = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

  const content = {
    About: <About />,
    Skills: <Skills />,
    Projects: <Projects />,
    Experience: <Experience />,
    Contact: <Contact />,
  }

  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', background: '#fff', margin: 0 }}>
      <Header />
      <NavTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div style={{ padding: '2rem' }}>{content[activeTab]}</div>
    </div>
  )
}
