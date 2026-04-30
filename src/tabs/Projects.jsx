import { Suspense, lazy, useState, useEffect } from 'react'
import NeonSnake from '../components/NeonSnake'

const ProjectsHub3D = lazy(() => import('../components/ProjectsHub3D'))
const AcademicHub3D = lazy(() => import('../components/AcademicHub3D'))

const RE_SLIDES = 23
const AI_SLIDES = 19

const ACADEMIC_PROJECTS = [
  {
    key: 'Real Estate Finance',
    title: 'Marinoni Manor Development',
    meta: 'Northwest Arkansas Multifamily Conversion',
    marker: 'CRE',
  },
  {
    key: "Should AVM's Replace Human Appraisers?",
    title: "Should AVM's Replace Human Appraisers?",
    meta: 'PropTech, AVMs, and valuation bias',
    marker: 'AI in CRE',
  },
  {
    key: 'AI Bubble Research',
    title: 'AI Bubble Research',
    meta: 'AI equities and market speculation',
    marker: 'Market Research',
  },
  {
    key: 'Stock Analysis App',
    title: 'Stock Analysis App',
    meta: 'Interactive portfolio dashboard',
    marker: 'Python Analysis',
  },
]

function handleScenePointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3)
  const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3)

  event.currentTarget.style.setProperty('--scene-x', x)
  event.currentTarget.style.setProperty('--scene-y', y)
}

function handleScenePointerLeave(event) {
  event.currentTarget.style.setProperty('--scene-x', 0)
  event.currentTarget.style.setProperty('--scene-y', 0)
}

/* ── shared style objects ───────────────────────── */
const mastheadTop = {
  borderTop: '4px solid #0C2340',
  borderBottom: '1px solid #D4C9B0',
  padding: '10px 0',
  marginBottom: 6,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
}
const mastheadRule = { border: 'none', borderBottom: '3px solid #0C2340', marginBottom: 28 }
const mastheadLabel = { fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#0C2340', fontWeight: 600 }
const mastheadMeta = { fontSize: 11, color: '#5C5C5C' }
const abstractBox = {
  background: '#FFFEF8',
  borderLeft: '4px solid #C49A22',
  border: '1px solid #D4C9B0',
  borderLeft: '4px solid #C49A22',
  padding: '20px 24px',
  marginBottom: 36,
}
const abstractLabel = { fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: '#0C2340', fontWeight: 700, marginBottom: 10 }

function KeywordTag({ children }) {
  return (
    <span style={{
      fontSize: 11,
      border: '1px solid #1B3A6B',
      borderRadius: 2,
      padding: '2px 9px',
      color: '#0C2340',
      background: '#FFFEF8',
      letterSpacing: 0.5,
    }}>{children}</span>
  )
}

function DlBtn({ href, children }) {
  return (
    <a href={href} download style={{
      display: 'inline-block',
      fontFamily: '"Times New Roman", Times, serif',
      border: '1px solid #0C2340',
      background: '#FFFEF8',
      cursor: 'pointer',
      padding: '8px 20px',
      borderRadius: 2,
      textDecoration: 'none',
      color: '#0C2340',
      fontSize: 13,
    }}>{children}</a>
  )
}

function NavBtn({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: '"Times New Roman", Times, serif',
      border: '1px solid #0C2340',
      background: '#FFFEF8',
      cursor: disabled ? 'default' : 'pointer',
      padding: '6px 20px',
      borderRadius: 2,
      color: '#0C2340',
      fontSize: 13,
      opacity: disabled ? 0.35 : 1,
    }}>{children}</button>
  )
}

function Slideshow({ basePath, totalSlides }) {
  const [idx, setIdx] = useState(0)
  return (
    <div>
      <img
        src={`${basePath}/slide_${String(idx + 1).padStart(3, '0')}.jpg`}
        style={{ width: '100%', border: '1px solid #D4C9B0', display: 'block', borderRadius: 2 }}
        alt={`Slide ${idx + 1}`}
      />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
        <NavBtn onClick={() => setIdx(i => i - 1)} disabled={idx === 0}>← Prev</NavBtn>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 14, color: '#5C5C5C', fontFamily: '"Times New Roman", Times, serif' }}>
          Slide {idx + 1} of {totalSlides}
        </span>
        <NavBtn onClick={() => setIdx(i => i + 1)} disabled={idx === totalSlides - 1}>Next →</NavBtn>
      </div>
    </div>
  )
}

/* ── AVM paper (unchanged content, updated styles) ── */
const references = [
  'Baum, Andrew, et al. Protech 3.0: The Future of Real Estate. University of Oxford, Saïd Business School, 2020.',
  'Brown, Kyle, and Jonathan Engler. "Automated Valuation Models and Racial Inequity in Housing." Brookings Institution, 2023.',
  'CoStar Group. Business History Overview. Speedwell Research, 2025.',
  'Deng, L. "Real Estate Valuation with Multi-Source Image Fusion and Enhanced Machine Learning Pipeline." PLoS ONE, vol. 20, no. 5, 2025.',
  'Domingos, Pedro. "A Few Useful Things to Know About Machine Learning." Communications of the ACM, 2012.',
  'Equifax. AVM Insights Product Sheet. Equifax, 2016.',
  'First American. First American Automated Valuation Model White Paper. First American, 2025.',
  'Geltner, David. "Loss Aversion in Real Estate Valuation." Massachusetts Institute of Technology, 2010.',
  'Hastie, Trevor, Robert Tibshirani, and Jerome Friedman. The Elements of Statistical Learning. Springer, 2009.',
  'International Association of Assessing Officers (IAAO). Standard on Automated Valuation Models (AVMs). IAAO, 2018.',
  'Jordan, R., and G. Boeing. "Zillow\'s Zestimate and Human Pricing Behavior: A Comparative Accuracy Study." Advances in Consumer Research, 2025.',
  'Liu, X., et al. "Meta-Radiology Applications to Machine Learning Systems." Meta-Radiology, vol. 1, no. 2, 2023.',
  'MBA (Mortgage Bankers Association). State of Automated Valuation Models. Mortgage Bankers Association, 2019.',
  'Mortgage Bankers Association. Property Data Collection and AVM Worksession Report. MBA, 2024.',
  'Mayer, Chris, and Frank Nothaft. "Appraisal Overvaluation and Price Adjustment Bias." Maxwell School, Syracuse University, 2022.',
  'National Association of Realtors. "Multiple Listing Services: 140 Years in the Making." NAR Magazine.',
  'Perry, Andre, et al. The Devaluation of Assets in Black Neighborhoods. Brookings Institution, 2018.',
  'U.S. Department of Housing and Urban Development. "What Drives Racial-Ethnic Differences in Mortgage Default?" Cityscape, vol. 26, no. 1, 2024.',
  'U.S. Federal Housing Finance Agency. White Paper WP-2406. FHFA, 2025.',
  'Fannie Mae. Advancing Collateral Valuation: Report. Fannie Mae, 2025.',
  'Williamson, Jeffrey, and Mark Palim. "Racial Bias in Appraisals: New Evidence from Refinance Data." Fannie Mae, 2022.',
  'Zhu, J., et al. "Automated Valuation Model Bias across Racially Distinct Neighborhoods." Urban Institute, 2025.',
]

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, borderBottom: '1px solid #D4C9B0', paddingBottom: 6, marginBottom: 14, color: '#0C2340' }}>{title}</h2>
      {children}
    </div>
  )
}

function AVMPaper() {
  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: 820, margin: '0 auto' }}>
      <div style={mastheadTop}>
        <span style={mastheadLabel}>Walton College of Business</span>
        <span style={mastheadMeta}>Reviewed by Dr. Andrew Lynch &nbsp;·&nbsp; Fall 2025 &nbsp;·&nbsp; Master's of Science in Finance</span>
      </div>
      <hr style={mastheadRule} />

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#5C5C5C', marginBottom: 10 }}>Original Research &nbsp;·&nbsp; Real Estate Valuation</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: '0 0 16px', color: '#0C2340' }}>
          Should Automated Valuation Models Replace Human Appraisers?
        </h1>
        <div style={{ fontSize: 15, color: '#333', marginBottom: 4 }}><strong>Florentino M. Ramirez IV</strong></div>
        <div style={{ fontSize: 13, color: '#5C5C5C', marginBottom: 16 }}>Digital Innovation 52403 &nbsp;·&nbsp; December 2025</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {['Automated Valuation Models', 'PropTech', 'Machine Learning', 'Appraisal Bias', 'Real Estate'].map(k => (
            <KeywordTag key={k}>{k}</KeywordTag>
          ))}
        </div>
        <DlBtn href="/files/Should AVMs Replace Human Appraisers%3F.docx">↓ Download Full Paper (.docx)</DlBtn>
      </div>

      <div style={{ borderTop: '1px solid #D4C9B0', margin: '28px 0' }} />

      <div style={{ fontSize: 15, lineHeight: 1.85, color: '#1a1a1a' }}>
        <Section title="Abstract">
          <div style={abstractBox}>
            <p style={{ margin: 0 }}>Automated Valuation Models (AVMs) are programs built to produce an estimated property price by interpreting all of the variables that affect a property's value according to their level of significance, ultimately generating an estimate that reflects how those factors interact in the real market. AVMs draw on enormous pools of real estate information, combining everything from ownership histories and tax data to listing details, mortgage records, and neighborhood characteristics. They use these inputs to estimate what a home should sell for, with recent sales of comparable properties carrying the most weight in shaping the model's final prediction. Appraisals are critical to the real estate industry because they serve as an official assessment of value and a starting point for negotiations toward an agreeable market price. Recent work shows that advanced AVMs can outperform human appraisers in accuracy and stability (Deng, 2025; Williamson and Palim, 2022), raising the possibility that they could eventually dominate valuation work across the real estate industry. This paper provides an overview of the composition and performance of AVMs by analyzing the emerging literature and ultimately determines whether AVMs should be allowed to fully replace a human appraiser. While rapid advances in AI make full automation seem plausible, current IAAO and Fannie Mae guidelines acknowledge persistent risks of inherited bias and suggest that complete replacement is neither realistic nor advisable. Machines cannot identify when historical data is flawed, and fully automated valuations may deepen existing price disparities in minority communities.</p>
          </div>
        </Section>

        <Section title="Introduction">
          <p>Property valuation sits at the center of the American housing system, shaping everything from mortgage eligibility, to tax burdens, to the price a homeowner can command on the market. The real estate process in the United States depends entirely on the judgment of licensed appraisers who interpret an array of interrelated factors and put them together to determine what a property is officially worth. Their role in determining an estimated property price reflects an older valuation culture built on finances, checklists, and human interpretation (Assimakopoulos, 2003). That culture is now undergoing a profound transformation as new technologies emerge in the real estate industry. Specifically, advances in property data infrastructure and machine learning algorithms have introduced Automated Valuation Models (AVMs). AVMs are programs designed to estimate property values by interpreting large sets of variables according to their statistical significance. Recent literature shows that they perform far better than humans due to being built on a machine learning platform (Brown & Engler, 2025; Jordan & Boeing, 2025; Williamson & Palim, 2022). This paper will discuss machine learning platforms and why they signal continued use of AVMs in the long term.</p>
          <p>Although appraisers anchor the formal valuation process, the industry surrounding them runs on a constant need to anticipate value before a sale ever occurs. Developers, lenders, investors, and even municipal agencies make decisions months or years before a transaction produces new price information, which means the market must operate with partial, outdated, or uneven data. Economic studies describe this as a structural information disadvantage, where the gap between when decisions are made and when reliable data arrives creates chronic uncertainty (Bokhari & Geltner, 2011). Firms therefore look for tools that can close that gap by using technology that can help them make immediate predictions about present market conditions. The demand for faster, more consistent insight laid the groundwork for technologies that could automate parts of the valuation process, and AVMs emerged as a natural response to that pressure long before they became sophisticated enough to rival human appraisers. This paper will walk through the history of technology in the real estate industry (PropTech) up until the latest AVMs, explain how AVMs function, review emerging literature on their performance, and provide an assessment on whether they should be used in official property assessments without the supervision of a human.</p>
        </Section>
        <Section title="PropTech">
          <p>PropTech emerged during the real estate industry's first technological revolution in the late 1980s, which coincided with the development of the computer. Real estate has long moved at a slower pace than other asset classes, partly because determining a property's value takes time. Unlike stocks or commodities, which update in real time, real estate depends on collecting and interpreting information that is scattered, inconsistent, and often incomplete about assets that can take weeks or months to transact between parties (Bokhari & Geltner, 2011). Before the digital age, real estate prospects and investors had to manually gather records from city halls, tax offices, planning departments, and local brokers. Before the 1980s, each property told its story through paper files that were rarely standardized. The market's speed was limited by how quickly people could assemble and verify the data needed to make a valuation. Thanks to this system, there were real estate service companies and the National Association of Realtors (NAR) that would shoulder the cost of acquiring as much property data as possible and sell it to customers for a premium. Many of these companies were pioneers of PropTech in the 1980s because they were sitting on a pool of monopolized property data.</p>
          <p>When the computer became a widely used piece of technology in the late 1980s, companies started digitalizing all of the data that they were sitting on (Baum et al., 2020). The NAR, which had been operating a Multiple Listing Service (MLS) for major U.S. cities since 1885, digitalized their own MLS in a groundbreaking move with the breakthrough of the RISCO MLS software system (Block, 2024). One of the most influential PropTech innovations was CoStar, a company founded in 1987. At the time, commercial real estate information was generally available only through paid sources, which limited how active the market was. CoStar addressed this issue by creating a centralized digital database of significant property data on a floppy disk. Its platform reshaped the industry by giving market participants a single, digital source for reliable data and allowing them to evaluate properties more quickly with a level of accuracy that had not been possible before. CoStar remains widely used across commercial real estate (Baum et al., 2020; Speedwell, 2025). During the time of CoStar's founding, advancements in computer technology also produced the very first AVMs (Baum et al., 2020).</p>
          <p>AVMs today rely on complex algorithms to determine a property's price, but the first AVMs were often simple spreadsheets made possible by applications like Microsoft Excel and ARGUS (Baum et al., 2020; MBA, 2019). These applications came later as developments in computers advanced, and they allowed real estate investors to access the earliest AVMs. ARGUS, which came after Microsoft Excel, is a network application that accesses the file system in the user's computer to allow them to digitally transfer saved property data as inputs for a spreadsheet model, which could be customized to a multitude of different templates depending on what outcome the user needs to estimate. Both ARGUS and Excel support the assumption that AVMs will grow to have stronger capabilities as machine learning technology improves, just as PropTech from the 1980s evolved through the 2000s with advancements in computers (Baum et al., 2020).</p>
          <p>Indeed, research suggests a second PropTech boom emerged in 2017, with the novel technology being machine learning rather than standard computer applications (Baum et al., 2020; MBA, 2019). Machine learning technology is the architecture on which AVMs operate, and its development has produced AVMs so advanced and accurate that they could replace a human appraiser (Deng et al., 2025; Williamson & Palim, 2022). The next section will define machine learning, describe how these models are better than traditional regressions, and explain how AVMs use their machine learning algorithms to generate an estimated value.</p>
        </Section>
        <Section title="Machine Learning in the Composition of AVMs">
          <p>Machine learning models are computer programs that receive large sets of historical property data, including sales prices, in order to run regressions on the dataset and learn the statistical relationships between each variable that affects the sales price (Deng et al., 2025). Enhanced AVMs work so that these models act as a pre-trained operating system: when the user submits a property, the model weighs the determined significance of all input variables to produce an estimated price (Deng et al., 2025; MBA, 2019). In its most general form, machine learning refers to a computer program that "improves its performance at a task through experience" (Russell & Norvig, 2010). Unlike traditional valuation formulas that apply fixed rules, machine learning models adapt to the data they are trained on, making it possible to train different programs to operate AVMs that estimate non-price values like rents, loan terms, or portfolio risk.</p>
          <p>AVMs are built on machine learning regressors because this guarantees that the AVM will have a more accurate understanding of the significance behind each variable than traditional models, ultimately producing a more accurate price estimate. Many of these algorithms can model nonlinear relationships, adjust to irregular or high-dimensional data, and learn which variables exert the greatest influence on the outcome (Domingos, 2021). Traditional ordinary least squares regressions can only capture linear relationships, which is a limitation that fits poorly with real estate markets where price is shaped by a complex combination of structural attributes, location traits, neighborhood dynamics, and market conditions. Machine learning models extend the abilities of regression by handling nonlinear interactions, computing far more variables at a time, and weighting inputs in a way that reflects how real markets actually behave (Hastie et al., 2009).</p>
        </Section>
        <Section title="Multi-Purpose AVM Development in the Mortgage Industry">
          <p>Substantial research on the performance of AVMs has come from the Mortgage Bankers Association, likely because the mortgage industry has become heavily reliant upon AVMs due to the many different valuations that must occur throughout the life cycle of a mortgage (MBA, 2019). Lenders and insurers now rely on AVMs to reassess equity during refinancing, track shifts in collateral strength over time, and flag irregularities that might signal fraud or data inconsistencies (First American, 2025). PropTech firms like Equifax are able to satisfy these firms' demands for specific-use AVMs by building different models to be used at each stage of the mortgage life cycle (Equifax, 2016).</p>
        </Section>
        <Section title="Literature Review on Human vs. AVM Performance">
          <p>When reviewing the performance of human appraisers, research documents that traditional valuation practices contribute to persistent racial gaps in majority-Black neighborhoods by consistently appraising properties below comparable homes in majority-white areas, even after accounting for housing characteristics, location, and market conditions (Mayer & Nothaft, 2021; FHFA, 2019). These gaps are not small misfires: findings from a 2021 FHFA data analysis aligned with results from Brown & Engler (2022) in showing that 23.3% of homes in minority neighborhoods were undervalued in an official assessment, confirming racial bias among traditional appraisers (FHFA, 2021; Brown & Engler, 2022).</p>
          <p>A 2025 study from Advances in Consumer Research examined how Zillow's Zestimate AVM performance compares to seller listing prices across over 300 NYC properties on the MLS. The findings show that Zestimates achieve a lower median absolute percentage error than seller-set list prices (MdAPE ~17.5% vs. 19.8%), demonstrating that Zillow's AVM modestly outperforms human pricing (Jordan & Boeing, 2025). A 2023 Brookings report found that several leading AVMs can estimate home prices within 10 percent of actual sale values for at least 95 percent of properties in tested samples (Brown & Engler, 2023).</p>
        </Section>
        <Section title="Conclusion">
          <p>The trajectory of research, industry practice, and policy guidance in automated valuation shows a real estate ecosystem moving steadily toward deeper automation while confronting the consequences of embedding historical patterns into machine learning systems. This paper supports the authors whose work was reviewed in arguing that human oversight should remain necessary in the future use of AVMs as official assessment sources. Although AVMs are proven to outperform human appraisers and the capability of their underlying frameworks continues to advance, human review is still needed to check for the appearance of bias errors.</p>
        </Section>

        <div style={{ borderTop: '2px solid #0C2340', marginTop: 40, paddingTop: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#0C2340', fontWeight: 600, marginBottom: 16 }}>References</div>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {references.map((ref, i) => (
              <li key={i} style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 8, color: '#333' }}>{ref}</li>
            ))}
          </ol>
        </div>

        {/* Full report download button */}
        <a
          href="/files/Should AVMs Replace Human Appraisers%3F.docx"
          download
          style={{
            display: 'block',
            marginTop: 40,
            background: '#0C2340',
            color: '#FFFEF8',
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 0.5,
            textAlign: 'center',
            padding: '18px 24px',
            borderRadius: 2,
            textDecoration: 'none',
            border: '2px solid #C49A22',
          }}
        >
          ↓ Download the Full Report (.docx)
        </a>
      </div>
    </div>
  )
}

/* ── AI Bubble Research project ─────────────────── */
const aiReferences = [
  'Goldman Sachs. "Why we are not in a bubble… yet." Global Strategy Paper, October 2025.',
  'Goldman Sachs. "Why AI is not a bubble." Global Strategy Paper No. 64, 2023.',
  'Shiller, Robert J. Irrational Exuberance. Princeton University Press, 2000.',
  'Campbell, T. "Bank of America revamps Palantir stock price target." Yahoo Finance / TheStreet, September 24, 2025.',
  'National Institutes of Health. "GJR-GARCH Model and Volatility Clustering in Stock Indices." PMC, 2024.',
  'BBC. "Are AI stocks in a bubble?" BBC News, 2024.',
]

function AIBubbleProject() {
  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: 820, margin: '0 auto' }}>
      <div style={mastheadTop}>
        <span style={mastheadLabel}>Walton College of Business</span>
        <span style={mastheadMeta}>Reviewed by Dr. Cathy Pacheco &nbsp;·&nbsp; Fall 2025 &nbsp;·&nbsp; Master's of Science in Finance</span>
      </div>
      <hr style={mastheadRule} />

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#5C5C5C', marginBottom: 10 }}>
          Group Research Project &nbsp;·&nbsp; Equity Markets &amp; AI
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: '0 0 16px', color: '#0C2340' }}>
          Is There an AI Bubble? An Empirical Analysis of AI-Focused Equities
        </h1>
        <div style={{ fontSize: 15, color: '#333', marginBottom: 4 }}>
          <strong>Eric Beatty, Ethan Kaufman, Florentino M. Ramirez IV</strong>
        </div>
        <div style={{ fontSize: 13, color: '#5C5C5C', marginBottom: 16 }}>
          Financial Data Analytics I 53403 &nbsp;·&nbsp; December 2025
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {['AI Equities', 'Bubble Analysis', 'Monte Carlo', 'Volatility', 'DCF Valuation', 'NVIDIA', 'Palantir'].map(k => (
            <KeywordTag key={k}>{k}</KeywordTag>
          ))}
        </div>
        <DlBtn href="/files/Is There an AI Bubble%3F.pptx">↓ Download Presentation (.pptx)</DlBtn>
      </div>

      <div style={{ borderTop: '1px solid #D4C9B0', margin: '28px 0' }} />

      {/* Abstract */}
      <div style={{ fontSize: 15, lineHeight: 1.85, color: '#1a1a1a' }}>
        <Section title="Abstract">
          <div style={abstractBox}>
            <p style={{ margin: 0 }}>This paper examines whether AI-focused equities have entered bubble territory, analyzing NVIDIA, AMD, TSMC, and Palantir over the period from 2021 through September 2025 — four companies central to the AI investment thesis. Returns and volatility are benchmarked against the broader market, with particular attention to correlations with the S&P 500 and the Nasdaq Composite. A discounted cash flow model is constructed to evaluate whether Palantir's market price is supported by fundamental value, cross-checked against analyst estimates from Bank of America, Alpha Spread, and Yahoo Finance. The data show that NVIDIA and Palantir have significantly outpaced the market and exhibit erratic, clustered volatility characteristic of speculative environments. Palantir's current valuation implies a level of revenue growth that most analysts consider unrealistic. The analysis concludes that a broad market bubble has not formed, but certain AI stocks — Palantir in particular — display clear signs of speculative excess.</p>
          </div>
        </Section>
      </div>

      {/* Slideshow */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#0C2340', fontWeight: 700, marginBottom: 14 }}>
          Presentation
        </div>
        <Slideshow basePath="/ai-slides" totalSlides={AI_SLIDES} />
      </div>

      {/* References */}
      <div style={{ borderTop: '2px solid #0C2340', paddingTop: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#0C2340', fontWeight: 600, marginBottom: 16 }}>References</div>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          {aiReferences.map((ref, i) => (
            <li key={i} style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 8, color: '#333' }}>{ref}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ── Stock Analysis App ──────────────────────────── */
function StockAnalysisApp() {
  const [code, setCode] = useState('Loading source code…')

  useEffect(() => {
    fetch('/files/App.py')
      .then(r => r.text())
      .then(setCode)
      .catch(() => setCode('Could not load source code.'))
  }, [])

  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: 820, margin: '0 auto' }}>
      {/* Masthead */}
      <div style={mastheadTop}>
        <span style={mastheadLabel}>Walton College of Business</span>
        <span style={mastheadMeta}>Reviewed by Dr. Alejandro Pacheco &nbsp;·&nbsp; Spring 2026 &nbsp;·&nbsp; Master's of Science in Finance</span>
      </div>
      <hr style={mastheadRule} />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#5C5C5C', marginBottom: 10 }}>
          Individual Project &nbsp;·&nbsp; Financial Data Analytics II
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: '0 0 16px', color: '#0C2340' }}>
          Stock Analysis App: An Interactive Equity Portfolio Dashboard
        </h1>
        <div style={{ fontSize: 15, color: '#333', marginBottom: 4 }}>
          <strong>Florentino M. Ramirez IV</strong>
        </div>
        <div style={{ fontSize: 13, color: '#5C5C5C', marginBottom: 16 }}>
          Financial Data Analytics II 53403 &nbsp;·&nbsp; April 2026
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {['Streamlit', 'Portfolio Optimization', 'Equity Analysis', 'Python', 'Mean-Variance', 'Sharpe Ratio'].map(k => (
            <KeywordTag key={k}>{k}</KeywordTag>
          ))}
        </div>

        {/* Launch button */}
        <a
          href="https://stapp-fmr.streamlit.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            fontFamily: '"Times New Roman", Times, serif',
            background: '#0C2340',
            color: '#FFFEF8',
            border: '1px solid #0C2340',
            padding: '10px 24px',
            borderRadius: 2,
            textDecoration: 'none',
            fontSize: 13,
            letterSpacing: 0.5,
            marginRight: 12,
          }}
        >
          ↗ Launch Live App
        </a>
      </div>

      <div style={{ borderTop: '1px solid #D4C9B0', margin: '28px 0' }} />

      {/* Abstract */}
      <div style={{ fontSize: 15, lineHeight: 1.85, color: '#1a1a1a' }}>
        <Section title="Abstract">
          <div style={abstractBox}>
            <p style={{ margin: 0 }}>This project presents an interactive web application built with Streamlit that enables users to construct and analyze equity portfolios in real time. The application accepts user-defined ticker symbols, date ranges, and a configurable risk-free rate; retrieves adjusted closing price data from Yahoo Finance via yfinance; and produces a full suite of return calculations, risk analytics, correlation analysis, and portfolio optimizations. Users may select between 3 and 10 tickers and explore five analytical tabs: an overview of key metrics per stock, price and performance charts including a cumulative wealth index and rolling volatility, drawdown and return distribution analysis, a pairwise correlation and covariance matrix, and a full portfolio optimization module. The optimization tab constructs equal-weight, Global Minimum Variance, and Tangency (Maximum Sharpe Ratio) portfolios, incorporates a custom weight slider interface, plots the efficient frontier with the Capital Allocation Line, and tests the sensitivity of optimal weights to the choice of estimation window. The application is deployed live on Streamlit Community Cloud.</p>
          </div>
        </Section>
      </div>

      {/* Embedded app */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#0C2340', fontWeight: 700, marginBottom: 6 }}>
          Live Application
        </div>
        <div style={{ fontSize: 12, color: '#5C5C5C', marginBottom: 12 }}>
          Interact with the app below, or{' '}
          <a href="https://stapp-fmr.streamlit.app" target="_blank" rel="noopener noreferrer" style={{ color: '#0C2340' }}>
            open it in a new tab
          </a>{' '}for full screen.
        </div>
        <iframe
          src="https://stapp-fmr.streamlit.app?embed=true"
          title="Stock Analysis App"
          style={{
            width: '100%',
            height: 750,
            border: '1px solid #D4C9B0',
            borderRadius: 2,
            background: '#fff',
          }}
          allow="clipboard-write"
        />
      </div>
    </div>
  )
}

function SceneButton({ type, title, kicker, detail, onClick }) {
  return (
    <button className={`projects-scene-object projects-scene-object-${type}`} onClick={onClick}>
      <span className="skyscraper-roof" aria-hidden="true" />
      <span className="skyscraper-windows" aria-hidden="true" />
      <span className="skyscraper-upper-floor" aria-hidden="true" />
      <span className="skyscraper-label">
        <span className="projects-scene-kicker">{kicker}</span>
        <span className="projects-scene-title">{title}</span>
        <span className="projects-scene-detail">{detail}</span>
        <span className="projects-scene-action">Enter Upper Floor</span>
      </span>
    </button>
  )
}

function ProjectsHub({ onAcademic, onPersonal }) {
  const [entering, setEntering] = useState(null)
  const [labelHover, setLabelHover] = useState(null)

  const enterBuilding = (target, callback) => {
    if (entering) return
    setEntering(target)
    window.setTimeout(callback, 480)
  }

  return (
    <div
      className={`projects-scene projects-hub-scene${entering ? ` entering-${entering}` : ''}`}
      onPointerMove={handleScenePointerMove}
      onPointerLeave={handleScenePointerLeave}
    >
      <div className="projects-ambient projects-ambient-a" aria-hidden="true" />
      <div className="projects-ambient projects-ambient-b" aria-hidden="true" />
      <div className="projects-cloud projects-cloud-a" aria-hidden="true" />
      <div className="projects-cloud projects-cloud-b" aria-hidden="true" />
      <Suspense fallback={<div className="projects-hub-3d-loading" aria-hidden="true" />}>
        <ProjectsHub3D
          entering={entering}
          hovering={labelHover}
          onEnter={(target) => enterBuilding(target, target === 'academic' ? onAcademic : onPersonal)}
        />
      </Suspense>
      <div className="projects-scene-header">
        <span>Projects Hub</span>
        <h1>Choose a collection</h1>
      </div>
      <div className="projects-scene-stage">
        <button
          className="hub-3d-label hub-3d-label-academic"
          onClick={() => enterBuilding('academic', onAcademic)}
          onMouseEnter={() => setLabelHover('academic')}
          onMouseLeave={() => setLabelHover(null)}
        >
          <span className="projects-scene-kicker">Walton College</span>
          <span className="projects-scene-title">Academic Projects</span>
          <span className="projects-scene-detail">Research, presentations, analytics, and finance coursework</span>
          <span className="projects-scene-action">Enter Upper Floor</span>
        </button>
        <button
          className="hub-3d-label hub-3d-label-personal"
          onClick={() => enterBuilding('personal', onPersonal)}
          onMouseEnter={() => setLabelHover('personal')}
          onMouseLeave={() => setLabelHover(null)}
        >
          <span className="projects-scene-kicker">Personal Build</span>
          <span className="projects-scene-title">Personal Projects</span>
          <span className="projects-scene-detail">A neon snake game built with vanilla JavaScript</span>
          <span className="projects-scene-action">Enter Upper Floor</span>
        </button>
      </div>
    </div>
  )
}

function SceneBackButton({ onClick, children = 'Return to Projects Hub' }) {
  return (
    <button className="projects-scene-back" onClick={onClick}>
      {children}
    </button>
  )
}

function AcademicScene({ onSelect, onHub }) {
  const [cardHover, setCardHover] = useState(null)

  return (
    <div className="projects-scene projects-academic-hallway">
      <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: '#f0eee9' }} />}>
        <AcademicHub3D onSelect={onSelect} hoveredKey={cardHover} />
      </Suspense>
      <div className="projects-hallway-ui">
        <SceneBackButton onClick={onHub} />
        <div className="projects-scene-header projects-hallway-header">
          <span>Academic Collection</span>
          <h1>Select a project</h1>
        </div>
        <div className="academic-object-grid">
          {ACADEMIC_PROJECTS.map((project) => (
            <button
              key={project.key}
              className="academic-object"
              onClick={() => onSelect(project.key)}
              onMouseEnter={() => setCardHover(project.key)}
              onMouseLeave={() => setCardHover(null)}
            >
              <span className="academic-object-marker">{project.marker}</span>
              <span className="academic-object-title">{project.title}</span>
              <span className="academic-object-meta">{project.meta}</span>
              <span className="academic-object-action">View Project</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectFrame({ onBack, children }) {
  return (
    <div>
      <div className="projects-frame-toolbar">
        <button className="projects-frame-btn" onClick={onBack}>← Back to Academic Scene</button>
      </div>
      {children}
    </div>
  )
}

function PersonalFrame({ onHub, children }) {
  return (
    <div>
      <div className="projects-frame-toolbar">
        <button className="projects-frame-btn" onClick={onHub}>← Return to Projects Hub</button>
      </div>
      {children}
    </div>
  )
}

export default function Projects() {
  const [scene, setScene] = useState('hub')
  const [proj, setProj] = useState('Real Estate Finance')

  const openAcademicProject = (projectKey) => {
    setProj(projectKey)
    setScene('project')
  }

  const renderProject = () => {
    if (proj === 'Real Estate Finance') {
      return (
        <div style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: 820, margin: '0 auto' }}>
          <div style={mastheadTop}>
            <span style={mastheadLabel}>Walton College of Business</span>
            <span style={mastheadMeta}>Reviewed by Prof. Dale Carlton &nbsp;·&nbsp; Fall 2025 &nbsp;·&nbsp; Master's of Science in Finance</span>
          </div>
          <hr style={mastheadRule} />

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#5C5C5C', marginBottom: 10 }}>
              Group Final Project &nbsp;·&nbsp; Fayetteville Re-Zoning Investment Pitch
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: '0 0 16px', color: '#0C2340' }}>
              Marinoni Manor: A Value-Add Multifamily Conversion at 355 N. College Avenue, Fayetteville, AR
            </h1>
            <div style={{ fontSize: 15, color: '#333', marginBottom: 4 }}>
              <strong>Bryn Taylor, Florentino Ramirez, Mitchell Kennan, Jason Ferworn, Mason Bennett</strong>
            </div>
            <div style={{ fontSize: 13, color: '#5C5C5C', marginBottom: 16 }}>
            Real Estate Finance 54303 &nbsp;·&nbsp; December 2025
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {['Value-Add Investment', 'Re-Zoning', 'Multifamily', 'Fayetteville AR', 'Joint Venture'].map(k => (
                <KeywordTag key={k}>{k}</KeywordTag>
              ))}
            </div>
            <DlBtn href="/files/Real Estate Finance Final Project.pptx">↓ Download Full Presentation (.pptx)</DlBtn>
          </div>

          <div style={{ borderTop: '1px solid #D4C9B0', margin: '28px 0' }} />

          <div style={{ fontSize: 15, lineHeight: 1.85, color: '#1a1a1a' }}>
            <Section title="Abstract">
              <div style={abstractBox}>
                <p style={{ margin: 0 }}>Marinoni Manor is a proposed value-add multifamily conversion of a 4,946 square-foot commercial office building located at 355 N. College Avenue in Fayetteville, Arkansas. Currently listed at $1.25 million ($252.73/SF) and zoned C-2 Thoroughfare Commercial, the property was previously operated as a residential eight-plex, establishing precedent for a re-zoning or Planned Zoning Development (PZD) application to restore multifamily use. The project is structured as a joint venture under 54303 Enterprises, LLC, with limited partners providing 80% of required equity and the general partner contributing the remaining 20% while managing all operational responsibilities. Total capitalization is projected at $1.35 million, inclusive of $100,000 in targeted renovations, financed at 70% loan-to-value through a 10-year bank loan at 8.5% interest. The property's location — minutes from the University of Arkansas, downtown Fayetteville, and a rapidly expanding high-tech employment corridor — positions it within one of Arkansas' most supply-constrained rental markets, where a documented 10,000-unit housing deficit supports strong long-term rent growth. Base-case projections indicate cash-flow positivity in year one, an after-tax return of 12.4%, and a projected sale at $3.0 million at the end of a 10-year hold. Even under distressed assumptions, investor capital and a partial preferred return are preserved. Marinoni Manor represents a compelling, risk-adjusted acquisition opportunity in a high-growth submarket.</p>
              </div>
            </Section>
          </div>

          <Slideshow basePath="/slides" totalSlides={RE_SLIDES} />
        </div>
      )
    }

    if (proj === "Should AVM's Replace Human Appraisers?") return <AVMPaper />
    if (proj === 'AI Bubble Research') return <AIBubbleProject />
    if (proj === 'Stock Analysis App') return <StockAnalysisApp />
    return null
  }

  if (scene === 'hub') {
    return <ProjectsHub onAcademic={() => setScene('academic')} onPersonal={() => setScene('personal')} />
  }

  if (scene === 'academic') {
    return <AcademicScene onSelect={openAcademicProject} onHub={() => setScene('hub')} />
  }

  if (scene === 'personal') {
    return <PersonalFrame onHub={() => setScene('hub')}><NeonSnake /></PersonalFrame>
  }

  if (scene === 'project') {
    return <ProjectFrame onBack={() => setScene('academic')}>{renderProject()}</ProjectFrame>
  }

  return null
}
