import { useState } from 'react'

const gold = '#C49A22'
const navy = '#0C2340'
const border = '#D4C9B0'

function Entry({ org, location, role, dates, body }) {
  return (
    <div style={{
      background: '#FFFEF8',
      border: `1px solid ${border}`,
      borderLeft: `4px solid ${gold}`,
      borderRadius: 2,
      padding: '14px 18px',
      marginBottom: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: navy }}>{org}</span>
        {location && <span style={{ fontSize: 13, color: '#5C5C5C' }}>{location}</span>}
      </div>
      {(role || dates) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
          {role && <span style={{ fontStyle: 'italic', fontSize: 13, color: '#444' }}>{role}</span>}
          {dates && <span style={{ fontSize: 13, color: '#5C5C5C' }}>{dates}</span>}
        </div>
      )}
      {body && <p style={{ fontSize: 13, lineHeight: 1.7, color: '#333', margin: '10px 0 0' }}>{body}</p>}
    </div>
  )
}

function Section({ title, open, onToggle, children }) {
  return (
    <div style={{ marginBottom: 14, border: `1px solid ${border}`, borderRadius: 2, background: '#FFFEF8' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          textAlign: 'left',
          background: open ? navy : '#FFFEF8',
          color: open ? '#FFFEF8' : navy,
          border: 'none',
          borderBottom: open ? `2px solid ${gold}` : 'none',
          padding: '14px 20px',
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 0.5,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 14, color: gold }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ padding: '18px 20px' }}>{children}</div>}
    </div>
  )
}

function Academic() {
  return (
    <>

      <Entry
        org="Sam M. Walton College of Business, University of Arkansas"
        location="Fayetteville, AR"
        role="Master of Science in Finance — Expected May 2026"
        dates="2025 – 2026"
        body="Accelerated one-year graduate program emphasizing financial modeling, valuation, and applied quantitative analysis. Active member of the Walton College Finance Association, where I engage with industry leaders on corporate finance, investment strategy, and real estate."
      />
      <Entry
        org="Austin College"
        location="Sherman, TX"
        role="Bachelor of Arts in Finance, Minor in Political Science"
        dates="2023 – 2025"
        body="Transferred in to finish my undergraduate degree at a liberal arts institution known for small classes and close faculty relationships. Two-time elected team captain of the baseball program and 2024 Newcomer of the Year."
      />
      <Entry
        org="Anderson College of Business, Regis University"
        location="Denver, CO"
        role="Finance (transferred)"
        dates="2020 – 2023"
        body="Began my college career at a Jesuit university in Denver while competing as an NCAA Division II student-athlete. Built the foundation of my finance coursework and adjusted to balancing academics at the collegiate level with a full athletic schedule."
      />
      <Entry
        org="Jesuit College Preparatory School of Dallas"
        location="Dallas, TX"
        role="High School Diploma"
        dates="Graduated May 2020"
        body="An all-boys Jesuit Catholic preparatory school that shaped the discipline, work ethic, and values I carry today. Ad Majorem Dei Gloriam — the Jesuit call to be a man for others — continues to guide how I approach school, work, and teammates."
      />
    </>
  )
}

function Professional() {
  return (
    <>
      <div style={{
        background: '#F7F1E1',
        borderLeft: `4px solid ${navy}`,
        padding: '14px 18px',
        marginBottom: 18,
        borderRadius: 2,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: navy, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
          About Ramirez &amp; Associates, P.C.
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: '#333', margin: 0 }}>
          Ramirez &amp; Associates is a Dallas-based law firm founded by the Ramirez family,
          with a practice spanning U.S. immigration and international business law. The firm
          holds contracts with numerous Texas school districts to file H-1B nonimmigrant visa
          petitions on behalf of the districts as the employers of record, and also advises
          clients on cross-border corporate matters. My work has been performed under the
          direction of Teresa Daniels, the firm's lead immigration paralegal.
        </p>
      </div>

      <Entry
        org="Ramirez & Associates P.C."
        location="Dallas, TX"
        role="Case Administrator / Research Analyst"
        dates="May 2025 – Present"
        body="Prepare and assemble nonimmigrant visa petitions and applications for employees of public and private sector employers filing with USCIS, under the direction of the firm's lead immigration paralegal. Research publicly accessible data related to online privacy policies and industry standards for intracompany risk tolerances for general application by the firm's attorneys."
      />
      <Entry
        org="Ramirez & Associates P.C."
        location="Dallas, TX"
        role="Case Administrator"
        dates="May 2023 – August 2023"
        body="Prepared and assembled nonimmigrant visa petitions and applications for school district employees filing with USCIS. Worked closely with Teresa Daniels to manage filing timelines across multiple district clients during the summer H-1B cycle."
      />
      <Entry
        org="Ramlaw Corporate Services, L.L.C."
        location="Dallas, TX"
        role="Registered Agent Coordinator"
        dates="May 2022 – August 2022"
        body="Conducted an audit of the company's corporate clients for compliance and registration status with states' Secretary of State offices; prepared reports of clients' active status and registered agent information."
      />

      <div style={{
        background: '#FBF8EE',
        borderLeft: `4px solid ${navy}`,
        padding: '14px 18px',
        marginTop: 18,
        borderRadius: 2,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: navy, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
          Future Opportunities
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#1A1A1A', margin: 0 }}>
          My years in the legal industry have been a privilege, and I am grateful for the
          mentorship along the way. Looking ahead, I am excited to embrace an opportunity in
          the real estate industry.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#1A1A1A', margin: '10px 0 0' }}>
          Feel free to contact me for references or supervisor information.
        </p>
      </div>
    </>
  )
}

function Baseball() {
  return (
    <>
      <p style={{ fontSize: 14, lineHeight: 1.8, color: '#1A1A1A', margin: '0 0 16px' }}>
        Five years as an NCAA student-athlete across two programs, a high school career at one of
        Texas's premier 6A programs, a summer coaching staff, and still giving lessons to the next generation.
      </p>
      <Entry
        org="Austin College Baseball (NCAA DIII, SCAC)"
        location="Sherman, TX"
        role="Team Captain · 2024 All-Conference Honorable Mention 2B"
        dates="2023 – 2025"
        body="Grateful to Coach Shawn Counts for finding me in the transfer portal and giving me a home to finish out my baseball career. Played in every game across both seasons, batted leadoff in 2024, and was fortunate to earn All-Conference Honorable Mention at second base alongside a great group of teammates."
      />
      <Entry
        org="Regis University Baseball (NCAA DII, RMAC)"
        location="Denver, CO"
        role="Infielder"
        dates="2020 – 2023"
        body="Redshirted my first year and battled injuries through my time in Denver. Got to be part of an offense that averaged .330 and 57 home runs and competed at the national level. I owe a lot of my development to Coaches Drew LaComb and Pat Jolley."
      />
      <Entry
        org="Jesuit College Preparatory School of Dallas (Texas 6A)"
        location="Dallas, TX"
        role="Baseball"
        dates="2016 – 2020"
        body="Played behind some of the most talented young prospects and elite coaches in the state, and learned what it means to be held to a high standard both academically and athletically. Jesuit pushed us to balance the classroom and the field while competing against Texas's best. In summer 2020 my team advanced to the 18U Connie Mack World Series, falling in the quarterfinals."
      />
      <Entry
        org="ProSource Athletics"
        location="Dallas, TX"
        role="17U Assistant Coach"
        dates="May 2024 – July 2024"
        body="Won three straight Five Tool National Tournament championships, including an invitational hosted at the University of North Carolina in Chapel Hill. Spent the summer teaching the game and helping rising seniors chase their college baseball goals."
      />
      <Entry
        org="Independent Baseball Lessons"
        location="North Dallas, TX"
        role="Hitting Instructor"
        body="On summer evenings my partners and I give youth hitting lessons at public parks around North Dallas. My hitting philosophy traces back to the Jaramillo brothers — Rudy, the longtime Rangers hitting coach, and Tony, currently the Double-A hitting coach in the Angels organization — who taught me how to simplify the swing. I wish I'd learned it sooner, and that's why I love passing it on."
      />
    </>
  )
}

export default function Experience() {
  const [open, setOpen] = useState('academic')
  const toggle = (k) => setOpen(open === k ? null : k)

  return (
    <div style={{ maxWidth: 820, fontFamily: '"Times New Roman", Times, serif' }}>
      <h2 style={{
        marginTop: 0,
        color: navy,
        fontSize: 20,
        borderBottom: `2px solid ${gold}`,
        paddingBottom: 8,
        marginBottom: 20,
      }}>
        Experience
      </h2>

      <Section title="Academic" open={open === 'academic'} onToggle={() => toggle('academic')}>
        <Academic />
      </Section>

      <Section title="Professional" open={open === 'professional'} onToggle={() => toggle('professional')}>
        <Professional />
      </Section>

      <Section title="Baseball" open={open === 'baseball'} onToggle={() => toggle('baseball')}>
        <Baseball />
      </Section>
    </div>
  )
}
