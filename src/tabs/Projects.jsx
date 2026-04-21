import { useState } from 'react'

const PROJECT_TABS = ['FINN Real Estate', "Should AVM's Replace Human Appraisers?", 'Downloads']
const TOTAL_SLIDES = 24

const dlBtn = {
  display: 'inline-block',
  fontFamily: '"Times New Roman", Times, serif',
  border: '1px solid #1a1a1a',
  background: '#fff',
  cursor: 'pointer',
  padding: '8px 20px',
  borderRadius: 2,
  textDecoration: 'none',
  color: '#1a1a1a',
  fontSize: 14,
}
const navBtn = { ...dlBtn, padding: '6px 20px' }

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

function AVMPaper() {
  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: 820, margin: '0 auto' }}>

      {/* Journal masthead */}
      <div style={{ borderTop: '4px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '10px 0', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#444' }}>Walton College of Business</span>
        <span style={{ fontSize: 11, color: '#888' }}>Reviewed by Dr. Andrew Lynch &nbsp;·&nbsp; 2025 &nbsp;·&nbsp; Master's of Science in Finance</span>
      </div>
      <div style={{ borderBottom: '3px solid #1a1a1a', marginBottom: 28 }} />

      {/* Article header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 10 }}>Original Research &nbsp;·&nbsp; Real Estate Valuation</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: '0 0 16px' }}>
          Should Automated Valuation Models Replace a Human Appraiser?
        </h1>
        <div style={{ fontSize: 15, color: '#333', marginBottom: 4 }}>
          <strong>Florentino M. Ramirez IV</strong>
        </div>
        <div style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>
          Digital Innovation 52403 &nbsp;·&nbsp; December 2025
        </div>

        {/* Keywords */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {['Automated Valuation Models', 'PropTech', 'Machine Learning', 'Appraisal Bias', 'Real Estate'].map(k => (
            <span key={k} style={{ fontSize: 11, border: '1px solid #bbb', borderRadius: 2, padding: '2px 8px', color: '#555', letterSpacing: 0.5 }}>{k}</span>
          ))}
        </div>

        {/* Download */}
        <a href="/files/Should AVMs Replace Human Appraisers?.docx" download style={{ ...dlBtn, fontSize: 13 }}>
          ↓ Download Full Paper (.docx)
        </a>
      </div>

      <div style={{ borderTop: '1px solid #ccc', margin: '28px 0' }} />

      {/* Abstract */}
      <div style={{ background: '#f7f7f5', border: '1px solid #e0e0da', padding: '20px 24px', marginBottom: 36 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 10 }}>Abstract</div>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.8, color: '#222' }}>
          Automated Valuation Models (AVMs) are programs built to produce an estimated property price by interpreting all of the variables that impact a property's price according to their level of significance, ultimately generating a value that reflects how those factors interact in the real market. AVMs draw on enormous pools of real estate information, combining everything from ownership histories and tax data to listing details, mortgage records, and neighborhood traits. They use these inputs to estimate what a home should sell for, with recent sales of similar properties carrying the most weight in shaping the model's final prediction. Appraisals are critical to the real estate industry as they are an official assessment and a starting point for negotiations toward an agreeable market price. Recent work shows that advanced AVMs can outperform human appraisers in accuracy and stability (Deng, 2025; Williamson and Palm, 2022), raising the possibility that they could eventually dominate valuation work across the real estate industry. This paper will provide an overview on the composition and performance of AVMs by analyzing the emerging literature and ultimately determine whether or not it is believed AVMs should be allowed to fully replace a human appraiser. While rapid advances in AI make full automation seem plausible, current IAAO and Fannie Mae guidelines acknowledge persistent risks of inherited bias and suggest that complete replacement is neither realistic nor advisable. Machines cannot identify when historical data is flawed, and fully automated valuations may deepen existing price disparities in minority areas.
        </p>
      </div>

      {/* Body */}
      <div style={{ fontSize: 15, lineHeight: 1.85, color: '#1a1a1a' }}>

        <Section title="Introduction">
          <p>Property valuation sits at the center of the American housing system, shaping everything from mortgage eligibility, to tax burdens, to the price a homeowner can command on the market. The real estate process in the United States depends entirely on the judgment of licensed appraisers who interpret an array of interrelated factors and put them together to determine what a property is officially worth. Their role in determining an estimated property price reflects an older valuation culture built on finances, checklists, and human interpretation (Assimakopoulos, 2003). That culture is now undergoing a profound transformation as new technologies emerge in the real estate industry. Specifically advances in property data infrastructure and machine learning algorithms have introduced Automated Valuation Models (AVMs). AVMs are programs designed to estimate property values by interpreting large sets of variables according to their statistical significance. Recent literature shows that they perform far better than humans due to being built on a machine learning platform (Brown & Engler, 2025; Jordan & Boeing, 2025; Williamson & Palim, 2022). This paper will discuss machine learning platforms and why they are signaling for continued use of AVMs in the long-term.</p>
          <p>Although appraisers anchor the formal valuation process, the industry surrounding them runs on a constant need to anticipate value before a sale ever occurs. Developers, lenders, investors, and even municipal agencies make decisions months or years before a transaction produces new price information, which means the market must operate with partial, outdated, or uneven data. Economic studies describe this as a structural information disadvantage, where the gap between when decisions are made and when reliable data arrives creates chronic uncertainty (Bokhari & Geltner, 2011). Firms therefore look for tools that can close that gap by using technology that can help them make immediate predictions about present market conditions. The demand for faster, more consistent insight laid the groundwork for technologies that could automate parts of the valuation process, and AVMs emerged as a natural response to that pressure long before they became sophisticated enough to rival human appraisers. This paper will walk through the history of technology in the real estate industry (PropTech) up until the latest AVMs, explain how AVMs function, review emerging literature on their performance, and provide an assessment on whether or not they should be used in official property assessments without the supervision of a human.</p>
        </Section>

        <Section title="PropTech">
          <p>PropTech emerged during the real estate industry's first technological revolution in the late 80s, which coincided with the development of the computer. Real estate has long moved at a slower pace than other asset classes, partly because determining a property's value takes time. Unlike stocks or commodities, which update in real time, real estate depends on collecting and interpreting information that is scattered, inconsistent, and often incomplete about assets that can take weeks or months to transact between parties (Bokhari & Geltner, 2011). Before the digital age, real estate prospects and investors had to manually gather records from city halls, tax offices, planning departments, and local brokers. Before the 80s, each property told its story through paper files that were rarely standardized. The market's speed was limited by how quickly people could assemble and verify the data needed to make a valuation. Thanks to this system there were real estate service companies and the National Association of Realtors (NAR) that would shoulder the cost of acquiring as much property data as possible and sell it to customers for a premium. Many of these companies were pioneers of PropTech in the 80s because they were sitting on a pile of monopolized property data and did not have to go fetch it.</p>
          <p>When the computer became a widely used piece of technology in the late 80s companies started digitalizing all of the data that they were sitting on (Baum, et. al. 2020). The NAR, which had been operating a Multiple Listing Service (MLS) for major U.S. cities since 1885 digitalized their own MLS in a groundbreaking move with the breakthrough of the RISCO MLS software system (Block, 2024). One of the most influential PropTech innovations was CoStar, a company founded in 1987. At the time, commercial real estate information was generally available only through paid sources, which limited how active the market was. CoStar addressed this issue by creating a centralized digital database of a variety of significant property data information on a floppy disk. Its platform reshaped the industry by giving market participants a single, digital source for reliable data and allowing them to evaluate properties more quickly with a level of accuracy that had not been possible before. CoStar remains widely used across commercial real estate (Baum et. al., 2020; Speedwell, 2025). During the time of CoStar's founding, the computer was a breakthrough piece of technology, and the advancements in computer technology created the very first AVMs (Baum et. al. 2020).</p>
          <p>AVMs today rely on complex algorithms to determine property's price, but the first AVMs were often simple spreadsheets that were made possible by the inventions of applications like Microsoft Excel and ARGUS (Baum et. al., 2020; MBA, 2019). These applications came later as developments in computers advanced and they allowed for real estate investors to have access to the earliest AVMs. ARGUS, which came after the invention of Microsoft Excel, is a network application that accesses the file system in the user's computer to allow them to digitally transfer their saved property data as inputs for their spreadsheet model, which could be customized to a multitude of different templates depending on what outcome the user needs to estimate. ARGUS and Excel are companies whose existence supports the assumption that AVMs will grow to have stronger capabilities as machine learning technology improves, just as PropTech from the 80s did through the 2000s with advancements in computers (Baum et. al., 2020).</p>
          <p>Indeed, research suggests a second PropTech boom emerging in 2017 with the novel technology being machine learning rather than standard computer applications (Baum et. al., 2020; MBA, 2019). Machine learning technology is the architecture for AVMs to operate on, and their development has been used to create AVMs so advanced and accurate that they could replace a human appraiser (Deng et. al., 2025, Williamson & Palim, 2022). The next section will define machine learning, describe how these models are better than traditional regressions, and explain how AVMs uses its machine learning algorithm to generate an estimate for a certain value.</p>
        </Section>

        <Section title="Machine Learning in the Composition of AVMs">
          <p>These machine learning models are computer programs that receive large sets of historical property data, including the sales prices, in order to run different regressions on the dataset to learn the statistical relationships between each variable that affects the sales price (Deng et. al, 2025). Enhanced AVMs work so that these models act as an operating system that has been pre-trained so that when the user gives the AVM a property and presses enter, the model will weigh the determined significance of all the input variables when making its calculations to produce an estimated price (Deng et. al., 2025, MBA, 2019). In its most general form, machine learning refers to a computer program that "improves its performance at a task through experience." (Russell & Norvig, 2010). Unlike traditional valuation formulas that apply fixed rules, machine-learning models adapt to the information they are trained by, making it possible to train different machine learning programs to operate AVMs that estimate non-price values like rents, loan terms, or portfolio risk.</p>
          <p>AVMs are built on machine learning regressors because it guarantees that the AVM will have a more accurate assumption of the significance behind each variable than traditional models, ultimately producing a more accurate price estimation. Many of these algorithms can model nonlinear relationships, adjust to irregular or high-dimensional data, and learn which variables exert the greatest influence on the outcome (Domingos, 2021). Traditional ordinary least squares regressions can only capture simple and linear relationships, which is a limitation that fits poorly with real estate markets where price is shaped by a messy combination of structural attributes, location traits, neighborhood dynamics, and market conditions. Machine learning models extend the abilities of regression by handling nonlinear interactions without breaking down, computing far more variables at a time, and getting trained on past data so that it can weigh inputs in a way that reflects how real markets actually behave (Hastie et al., 2009).</p>
          <p>Because the features that are significant to the value of a single-family home differ from those for an apartment building or a mortgage portfolio, machine learning models must be tailored to the specific valuation problem they are designed to solve. PropTech firms have applied these algorithms across all segments of the industry, building specialized AVMs that can deliver more accurate and consistent estimates than earlier tools (Baum et. al., 2020). All AVMs are being developed and used by firms all over the real estate industry since the 2017 PropTech boom regardless of their specific purpose. Their increased use throughout the sector shows how the speed and accuracy at which information can be processed will continue to grow in the real estate industry. Machine learning technology is advancing, and its abilities expand so do AVMs'. In recent literature there is data emerging that shows machine learning enhanced-AVMs as being capable of outperforming official assessors through exceptional accuracy and bias reductions (Deng et. al., 2025; Jordan & Boeing, 2025; Brown & Engler, 2025). Could a machine really take over the human job of assessing official property value?</p>
          <p>Under the guidelines of the International Association of Assessing Officers (IAAO), which is the governing body that enforces strict oversight on all registered official assessors in the U.S., appraisers are allowed to use AVMs in conjunction with their work provided that the model underwent testing and was approved for use by the IAAO (IAAO, 2018). The use of AVMs in assessing official property values is ongoing, but it can only be used side by side with humans. Accuracy aside, the speed and detail at which properties can get a report generated from would make continued AVM use by official assessors obvious given the large quantities of properties assessment offices handle. The expanding capabilities of these models carry real implications for Americans because AVMs increasingly are used by formal property assessments, which determine everything from annual tax bills to a homeowner's ability to refinance. With approximately 86 million owner-occupied housing units subject to periodic property assessment, even modest valuation errors can accumulate into meaningful financial strain for households (U.S. Census Bureau, 2023). The cost benefits to using AVMs for official assessors seems significant enough to claim that AVM use will be utilized for all official assessments at some point in the future.</p>
        </Section>

        <Section title="Multi-Purpose AVM Development in the Mortgage Industry">
          <p>Substantial research on the performance of AVMs has come from the Mortgage Broker's Association; likely because the mortgage industry has become heavily reliant upon AVMs due to the many different valuations that must occur throughout the life cycle of a mortgage (MBA, 2019). Lenders and insurers now rely on AVMs to reassess equity during refinancing, track shifts in collateral strength over time, and flag irregularities that might signal fraud or data inconsistencies (First American, 2025). PropTech firms like Equifax are able to satisfy these firms' demands for specific-use AVMs by building different AVMs to be used along the life cycle of a mortgage (Equifax, 2016). Within AVM Insight, Equifax's primary B2B AVM product, lenders can deploy separate models designed for tasks that go outside of estimating a home's market value. One tool, the Collateral Value Forecast, projects near-term changes in local market conditions so loan officers can judge the stability of a property securing the loan. Another, the Portfolio Monitoring AVM, scans entire pools of loans to flag emerging risks or shifts in collateral quality before they become losses. These programs signal that demand is not just for a single valuation number but for continuous, data-driven intelligence across the mortgage process (Equifax, 2016; Baum, et. al. 2020). This broad functionality has turned AVMs and their machine learning architecture into an everyday product for real estate service firms to use for quality control and portfolio-wide oversight.</p>
          <p>Today, assessors, lenders, and insurers are expanding their reliance on AVMs in addition to the mortgage industry, and further research must be done on whether or not AVM use in all corners of the real estate industry can occur ethically (MBA, 2019). This requires a careful examination of how well AVMs actually perform when compared to human appraisers, as well as what modern literature reveals about their bias tendencies (MBA, 2024). Any large-scale shift toward algorithmic valuation must be grounded in evidence that these systems are at least as accurate as traditional methods and that they do not reproduce or amplify existing inequities in property assessment. For this reason, the next step is to look directly at contemporary studies that test AVMs against human judgment and analyze where algorithmic bias persists, diminishes, or changes form.</p>
        </Section>

        <Section title="Literature Review on Human vs. AVM Performance">
          <p>When reviewing the performance of human appraisers, research evidence documents that traditional valuation practices contribute to persistent racial gaps in majority-Black neighborhoods by consistently appraising properties in majority-Black neighborhoods below comparable homes in majority-white areas even after accounting for housing characteristics, location, and market conditions (Mayer & Nothaft, 2021; FHFA, 2019). These gaps are not small misfires: findings from a 2021 FHFA data analysis up with results from Brown & Engler (2022) in that 23.3% of homes in minority neighborhoods had their home undervalued in an official assessment, confirming racial human biases by traditional appraisers (FHFA, 2021; Brown & Engler, 2022).</p>
          <p>The findings that human appraisers have a tendency to be racially biased when appraising homes from a certain neighborhood raises a complicated issue if the industry were to fully automate property valuation. AVMs rely heavily on comparable sales and historical transaction data, the very data shaped by decades of undervaluation, so it seems logical to suggest that machine learning models could easily reproduce patterns of underpricing even without explicit human judgment. The concern is that automation may formalize and scale past inequities by treating them as statistically meaningful signals within the model (Zhu, et. al., 2025). In that scenario, replacing appraisers with AVMs would not resolve racial valuation gaps but could instead harden them, continuing the socio-economic consequences associated with depressed property values in majority-Black neighborhoods (Brown & Engler, 2023).</p>
          <p>A 2025 study from Advances in Consumer Research compares how Zillow's Zestimate AVM performance compares to the seller's listing price of over 300 NYC properties on the MLS using New York City's official assessment of the property in their finance department (Jordan & Boeing, 2025). The authors set the city's official assessment as the baseline property price instead of the actual sales price to allow analysis of buildings not for sale within a singular year. The findings were that Zestimates achieve a lower median absolute percentage error than seller-set list prices (MdAPE ~ 17.5% vs. 19.8%), showing that Zillow's AVM modestly outperforms humans (Jordan & Boeing, 2025). The study also finds that both Zestimates and list prices systematically overvalue homes relative to New York City's official assessments, with median overvaluation in the range of 16 to 18 percent and heavy-tailed error distributions (Jordan & Boeing, 2025). These findings of similarity in overvaluation reveals that AVMs are not introducing new distortions but instead mirroring and replicating the same optimism already embedded in human pricing behavior. The authors conclude by arguing that Zestimates act as market signals rather than passive predictions; they influence how sellers anchor their list prices and how buyers interpret value, feeding directly back into the data that future algorithms will learn from (Jordan & Boeing, 2025).</p>
          <p>A 2023 Brookings report analyzed how well automated valuation models can estimate the sales price of a home and found that several leading AVMs can estimate home prices within 10 percent of actual sale values for at least 95 percent of properties in tested samples (Brown & Engler, 2023). That level of accuracy carries important implications for how the industry will operate. When an algorithm can estimate market prices closely across large samples, it becomes more than a supplementary tool—it becomes a practical substitute for many routine valuation tasks.</p>
          <p>More findings from Brown & Engler support AVM accuracy, however, the study raises a concern by finding that AVM errors are not evenly distributed amongst neighborhoods: performance declines in low-income and majority-Black neighborhoods (Brown & Engler, 2023). These areas are traditionally dealing with thinner sales data coupled with historic undervaluation, causing larger and less predictable deviations in price prediction. Brown & Engler's findings support the earlier claim that AVMs are powerful tools that can outperform traditional appraisals in many settings, but their outputs still require human oversight to identify outliers, catch structural blind spots, and prevent algorithmic replication of long-standing inequities.</p>
          <p>A study from Urban Institute expanded on these findings by studying specifically whether or not Automated Valuation Models exacerbate pre-existing racial disparities. The authors compared AVM-generated values with observed sale prices across racially distinct neighborhoods (Zhu et. al., 2025). Their analysis showed that AVMs, much like human appraisals, tend to perform worse in majority-Black communities by producing larger error spreads and more frequent undervaluations relative to majority-white areas (Zhu et. al., 2025). The authors conclude that improving AVM fairness requires policy action aimed at better data quality, greater transparency, and explicit fairness metrics when it comes to training machine learning algorithms for future AVM use.</p>
        </Section>

        <Section title="Recent AVM Developments">
          <p>AVM use and development will continue in the future because of the evidence from current literature that supports AVMs' ability to outperform humans, as well as the opportunity for improvement along with advancements in machine learning algorithms. Despite this certainty of adoption there are serious racial disparities that could continue to exist in the U.S. if fully automated valuations became the norm. Most AVMs used by real estate investment firms require photographs of the property, but they have never been significant to the model for calculating the price, instead they serve as an add-on feature used by developers to boost model legitimacy (Deng et. al., 2025). This is going to change very soon.</p>
          <p>A 2025 study examines whether or not an AVM could find images of a property to be significant in determining its price by training 8 different machine learning algorithms (Deng et. al., 2025). The algorithms were trained with and without images so the authors could isolate whether photographs added measurable predictive value. The findings were that only the latest enhanced machine learning regressors can find images as a significant factor to determining a property's price estimate (Deng et. al., 2025). Visual cues, long treated as something only a human on-site could interpret, can now be quantified and folded into a valuation model with measurable gains in accuracy from the corner of an office.</p>
          <p>When AVMs get to the level of capability where images can be processed remotely with meaningful accuracy, and if this saves firms time and money, the natural incentive will be to focus the development of AVMs toward ever-stronger machine learning systems rather than toward understanding or correcting their biases. Major commercial firms such as JLL and CBRE (Hong Kong Division) are implementing enhanced AVMs in parts of their underwriting and portfolio analysis, especially multi-family apartment buildings (Steele, 2022; Kwok & Luk, 2025). These algorithm advancements raise concerns because these firms are landlords over millions of Americans, and with the average American household paying 31% of their income in rent, they are capable of automating the system that determines how much people pay for the roof over their head (U.S. Census Bureau, 2023).</p>
        </Section>

        <Section title="Implications of Future AVM Use in the U.S.">
          <p>The valuation culture in the United States is shifting from a practice grounded in human judgment to one driven by automated systems that outperform humans and have the potential to become far better. As firms and public agencies deepen their reliance on AVMs, they place greater authority in models that learn directly from historical records. That dependence becomes problematic in majority-Black communities, where decades of limited credit access, uneven investment, and appraiser bias have produced lower sale prices and sparse transaction data (Zhu et. al., 2025). The model does not understand these patterns as the outcome of structural disadvantage; it treats them as objective indicators of what the market believes a property is worth.</p>
          <p>Because the model reads historical patterns as neutral signals rather than the product of structural barriers, it reproduces them in its outputs and extends them into the future. Research estimates that homes in majority-Black neighborhoods are undervalued by roughly forty-eight thousand dollars on average, adding up to about one hundred and fifty-six billion dollars in cumulative lost equity nationwide (Perry et. al. 2018). That lost equity constrains upward mobility because households with less accumulated value have a harder time moving into higher-priced neighborhoods, qualifying for favorable mortgages, financing education or business formation, and passing property wealth to the next generation.</p>
          <p>Fannie Mae has publicly committed to reducing potential appraisal bias by tightening standards for how valuations are conducted and introducing data-driven valuation tools that emphasize objective inputs over subjective judgments. A study published in 2024 on 1.8 million appraisals conducted during 2019–2019 refinancing confirmed that African American borrowers were more likely to receive a lower appraisal from a human than an automatic model (Williamson & Palim, 2022). Fannie Mae's response recommends that lenders and appraisers expand the use of alternative scope valuation methods such as desktop and hybrid appraisals that rely on extensive data resources and third-party inspections rather than direct borrower interactions (Williamson & Palim, 2022).</p>
          <p>Fannie Mae's recent efforts to research AVM discrepancies and promote the fair training of machine learning programs offers hope for the future of AVM use. The models will almost certainly continue to be developed in the real estate industry, as AVMs can deliver striking levels of accuracy. Yet, the documented racial disparity in their errors shows that these systems still need structured human oversight in how they are built and used. Human involvement remains necessary to monitor these systems, correct for inherited biases, and set standards that prevent automated tools from reproducing long-standing inequities.</p>
        </Section>

        <Section title="Conclusion">
          <p>The trajectory of research, industry practice, and policy guidance in automated valuation shows a real estate ecosystem moving steadily toward deeper automation while confronting the consequences of embedding historical patterns into machine learning systems. Current scholarship and industry reports trace a clear arc: AVMs have evolved from basic spreadsheet tools into sophisticated statistical engines capable of processing enormous, heterogeneous datasets, learning from historical sales, and generating highly accurate price estimates at speeds no human could match. Advances in machine learning—especially nonlinear regressors and expanded feature sets—have improved AVM precision to the point where their estimates now rival, and often surpass, those of human appraisers.</p>
          <p>The features that make AVMs powerful also make them vulnerable to inheriting and reproducing the structural distortions in the real estate market's past. The literature consistently shows that decades of undervaluation in majority-Black neighborhoods have left a data trail marked by depressed sales prices, thin transaction volumes, and concentrated risk perceptions. Because machine learning models treat those inputs as neutral signals rather than as artifacts of discrimination, AVMs can replicate the same inequities that shaped the historical record. Recent breakthroughs in AVM machine learning prove that the abilities of AVMs are only going to increase—models are beginning to find success when trained on richer forms of information like high-resolution images, spatial context, and environmental cues. Yet the authors from the studies in the literature encourage humans to operate and make AVMs ethically so as to eliminate the potential for inherent racial biases.</p>
        </Section>

        <Section title="Summary">
          <p>This paper stands behind the authors whose work was reviewed by claiming that human intervention should be necessary in the future use of AVMs as official assessment sources. At the present time, the machine learning capabilities are not being publicly researched enough to claim that there may be developments in building a model without the inherent bias to undervalue homes in majority-Black neighborhoods. Although the performance of AVMs is proven to outperform humans and the capability of their underlying framework continues to advance, there should be humans utilizing AVMs to check for the appearance of a bias error. The consequences of an AVM left to operate without guided oversight would be too significant for policymakers, lenders, and communities to ignore. For that reason, even as automation accelerates, continued human involvement in how these systems are built and applied remains the safeguard that keeps a fully unsupervised future from becoming inevitable.</p>
        </Section>

        {/* References */}
        <div style={{ borderTop: '2px solid #1a1a1a', marginTop: 40, paddingTop: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 16 }}>References</div>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {references.map((ref, i) => (
              <li key={i} style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 8, color: '#333' }}>{ref}</li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, borderBottom: '1px solid #ddd', paddingBottom: 6, marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  )
}

export default function Projects() {
  const [proj, setProj] = useState('FINN Real Estate')
  const [slideIdx, setSlideIdx] = useState(0)

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #ccc', marginBottom: '1.5rem' }}>
        {PROJECT_TABS.map(t => (
          <button key={t} onClick={() => { setProj(t); setSlideIdx(0) }} style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: 14, background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 18px', color: proj === t ? '#1a1a1a' : '#666',
            borderBottom: proj === t ? '2px solid #1a1a1a' : '2px solid transparent',
            marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      {proj === 'FINN Real Estate' && (
        <div>
          <a href="/files/FINN Real Estate - Group Project.pptx" download style={dlBtn}>
            ↓ Download PPTX
          </a>
          <img
            src={`/slides/slide_${String(slideIdx + 1).padStart(3, '0')}.jpg`}
            style={{ width: '100%', marginTop: '1rem', border: '1px solid #ddd', display: 'block' }}
            alt={`Slide ${slideIdx + 1}`}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            <button onClick={() => setSlideIdx(i => i - 1)} disabled={slideIdx === 0} style={{ ...navBtn, opacity: slideIdx === 0 ? 0.4 : 1 }}>← Prev</button>
            <span style={{ flex: 1, textAlign: 'center', fontSize: 14, color: '#555' }}>
              Slide {slideIdx + 1} of {TOTAL_SLIDES}
            </span>
            <button onClick={() => setSlideIdx(i => i + 1)} disabled={slideIdx === TOTAL_SLIDES - 1} style={{ ...navBtn, opacity: slideIdx === TOTAL_SLIDES - 1 ? 0.4 : 1 }}>Next →</button>
          </div>
        </div>
      )}

      {proj === "Should AVM's Replace Human Appraisers?" && <AVMPaper />}

      {proj === 'Downloads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <a href="/files/FINN Real Estate - Group Project.pptx" download style={dlBtn}>
            ↓ FINN Real Estate — Group Project (.pptx)
          </a>
          <a href="/files/Should AVMs Replace Human Appraisers?.docx" download style={dlBtn}>
            ↓ Should AVM's Replace Human Appraisers? (.docx)
          </a>
        </div>
      )}
    </div>
  )
}
