const gold = '#C49A22'
const navy = '#0C2340'
const border = '#D4C9B0'

function ResumeSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: navy,
        borderBottom: `2px solid ${gold}`,
        paddingBottom: 4,
        marginBottom: 10,
      }}>{title}</div>
      {children}
    </div>
  )
}

function ExpEntry({ org, location, role, dates, bullets }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: navy }}>{org}</span>
        <span style={{ fontSize: 11, color: '#5C5C5C' }}>{location}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontStyle: 'italic', fontSize: 11, color: '#444' }}>{role}</span>
        <span style={{ fontSize: 11, color: '#5C5C5C' }}>{dates}</span>
      </div>
      {bullets && (
        <ul style={{ margin: '5px 0 0', paddingLeft: 16 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontSize: 11, lineHeight: 1.55, color: '#333', marginBottom: 2 }}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EduEntry({ school, location, degree, dates, gpa, minor }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: navy }}>{school}</span>
        <span style={{ fontSize: 11, color: '#5C5C5C' }}>{location}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontStyle: 'italic', fontSize: 11, color: '#444' }}>{degree}</span>
        <span style={{ fontSize: 11, color: '#5C5C5C' }}>{dates}</span>
      </div>
      {gpa && <div style={{ fontSize: 11, color: '#5C5C5C' }}>GPA: {gpa}</div>}
      {minor && <div style={{ fontSize: 11, color: '#5C5C5C' }}>{minor}</div>}
    </div>
  )
}

function Resume() {
  return (
    <div style={{
      background: '#FFFEF8',
      border: `1px solid ${border}`,
      borderTop: `4px solid ${navy}`,
      borderRadius: 2,
      padding: '24px 28px 20px',
      fontFamily: '"Times New Roman", Times, serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${border}` }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: navy, letterSpacing: 0.5 }}>Florentino M. Ramirez</div>
        <div style={{ fontSize: 11, color: '#5C5C5C', marginTop: 4 }}>
          Fmr001@uark.edu &nbsp;·&nbsp; Dallas, TX 75231 &nbsp;·&nbsp; (214) 620-4632
        </div>
        <div style={{ fontSize: 11, marginTop: 2 }}>
          <a href="https://www.linkedin.com/in/tinor17" target="_blank" rel="noopener noreferrer"
            style={{ color: navy, textDecoration: 'none' }}>
            linkedin.com/in/tinor17
          </a>
        </div>
      </div>

      {/* Education */}
      <ResumeSection title="Education">
        <EduEntry
          school="Sam M. Walton College of Business, University of Arkansas"
          location="Fayetteville, AR"
          degree="Master of Science in Finance"
          dates="Graduation: May 2026"
          gpa="3.80 / 4.00"
        />
        <EduEntry
          school="Austin College"
          location="Sherman, TX"
          degree="Bachelor of Arts in Finance"
          dates="Graduation: May 2025"
          gpa="3.05 / 4.00"
          minor="Minor: Political Science"
        />
        <EduEntry
          school="Anderson College of Business, Regis University"
          location="Denver, CO"
          degree="Bachelor of Arts in Finance (transferred)"
          dates="2020 – 2023"
        />
        <EduEntry
          school="Jesuit College Preparatory"
          location="Dallas, TX"
          degree=""
          dates="Graduation: May 2020"
        />
      </ResumeSection>
      {/* Experience */}
      <ResumeSection title="Professional Experience">
        <ExpEntry
          org="Ramirez & Associates P.C."
          location="Dallas, TX"
          role="Case Manager / Research Analyst"
          dates="May 2025 – Present"
          bullets={[
            'Prepare nonimmigrant visa petitions and applications for employees of public and private sector employers for filing with the USCIS, under direction of firm\'s lead immigration paralegal.',
            'Research publicly accessible data related to online privacy policies and industry standards for intracompany risk tolerances, for general application by firm\'s attorneys.',
          ]}
        />
        <ExpEntry
          org="ProSource Athletics"
          location="Dallas, TX"
          role="17u Assistant Coach"
          dates="May 2024 – July 2024"
          bullets={[
            'Three National Tournament Championship wins. Teaching the game and assisting rising seniors with their college baseball aspirations.',
          ]}
        />
        <ExpEntry
          org="Ramirez & Associates P.C."
          location="Dallas, TX"
          role="Case Administrator"
          dates="May 2023 – August 2023"
          bullets={[
            'Prepared and assembled nonimmigrant visa petitions and applications for employees of public and private sector employers filing with the USCIS.',
          ]}
        />
        <ExpEntry
          org="Ramlaw Corporate Services, L.L.C."
          location="Dallas, TX"
          role="Registered Agent Coordinator"
          dates="May 2022 – August 2022"
          bullets={[
            'Conducted audit of company\'s corporate clients for compliance and registration status with states\' Secretary of State; prepared reports of clients\' active status and registered agent information.',
          ]}
        />
      </ResumeSection>
      {/* Leadership */}
      <ResumeSection title="Professional Development & Leadership">
        <ExpEntry
          org="Walton College Finance Association"
          location="Fayetteville, AR"
          role="Active Member"
          dates="August 2025 – Present"
          bullets={[
            'Meets with business executives to discuss topics pertaining to the different facets of finance, including corporate finance, investment strategies, and management and real estate strategies.',
          ]}
        />
        <ExpEntry
          org="Texas Real Estate Sales Agent — 180 TREC Hours"
          location="Dallas, TX"
          role="Licensure Candidate"
          dates="Spring 2026"
          bullets={[
            'Full online education of Texas real estate sales; passed National Exam 2025–2026 in pursuit of future brokerage opportunities.',
          ]}
        />
        <ExpEntry
          org="Austin College Baseball — Team Captain"
          location="Sherman, TX"
          role="Team Captain & 2024 Newcomer of the Year"
          dates="2024 & 2025"
          bullets={[
            'Two-time elected team captain by teammates; named 2024 Newcomer of the Year by the coaching staff.',
          ]}
        />
        <ExpEntry
          org="NCAA Baseball"
          location="Denver, CO & Sherman, TX"
          role="Student-Athlete"
          dates="2020 – 2025"
          bullets={[
            'Five years of NCAA Baseball at Regis University (DII) and Austin College (DIII).',
          ]}
        />
      </ResumeSection>
      {/* Skills */}
      <ResumeSection title="Skills & Interests">
        <div style={{ fontSize: 11, lineHeight: 1.7, color: '#333' }}>
          <div><strong>Skills:</strong> Microsoft Excel, Python, Legal Compliance Platforms, Analytical Writing</div>
          <div style={{ marginTop: 4 }}><strong>Interests:</strong> Mountain Biking, Hunting, Weightlifting, Coaching Baseball</div>
        </div>
      </ResumeSection>

      {/* Download button */}
      <div style={{ borderTop: `1px solid ${border}`, paddingTop: 16, marginTop: 6, textAlign: 'center' }}>
        <a
          href="/files/Tino_Ramirez_Resume.docx"
          download
          style={{
            display: 'inline-block',
            fontFamily: '"Times New Roman", Times, serif',
            background: navy,
            color: '#FFFEF8',
            border: `1px solid ${navy}`,
            padding: '8px 28px',
            borderRadius: 2,
            textDecoration: 'none',
            fontSize: 12,
            letterSpacing: 0.5,
          }}
        >
          ↓ Download Resume (.docx)
        </a>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '36px 18px 60px 18px',
        background: '#FFFEF8',
        border: `1px solid ${border}`,
        borderRadius: 8,
        minHeight: 500,
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontSize: 36,
          fontWeight: 900,
          color: navy,
          letterSpacing: 2,
          marginBottom: 32,
          marginTop: 8,
        }}
      >
        About Me
      </div>
      {/* About text — above resume */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#1A1A1A', margin: 0, maxWidth: 780 }}>
          I am a Master of Science in Finance candidate at the Sam M. Walton College of Business,
          University of Arkansas, completing an accelerated one-year program graduating in Spring
          2026. I hold a Bachelor of Arts in Finance from Austin College and have passed the
          national real estate licensing exam toward my Texas sales agent license.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.9, color: '#1A1A1A', margin: '16px 0 0', maxWidth: 780 }}>
          I am interested in real estate and want to deepen my understanding of how deals are evaluated, structured, and executed. I aim to begin my career as an investment, development, or market analyst at a real estate firm, where I can gain practical experience and work toward earning my brokerage license.
        </p>
      </div>  

      {/* Resume — below about text */}
      <Resume />

    </div>
  )
}
