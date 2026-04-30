export default function NeonSnake() {
  const mastheadTop = {
    borderTop: '4px solid #0C2340',
    borderBottom: '1px solid #D4C9B0',
    padding: '10px 0',
    marginBottom: 6,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  }

  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: 820, margin: '0 auto' }}>
      <div style={mastheadTop}>
        <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#0C2340', fontWeight: 600 }}>
          Personal Project
        </span>
        <span style={{ fontSize: 11, color: '#5C5C5C' }}>
          Vanilla JS &nbsp;·&nbsp; No Frameworks
        </span>
      </div>
      <hr style={{ border: 'none', borderBottom: '3px solid #0C2340', marginBottom: 28 }} />

      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0C2340', marginBottom: 8 }}>
        Neon Snake
      </h1>
      <p style={{ fontSize: 14, color: '#5C5C5C', marginBottom: 28, lineHeight: 1.6 }}>
        A self-contained browser snake game built with plain HTML, CSS, and JavaScript — no libraries or frameworks.
        Use the arrow keys to move, eat charged apples to grow, and beat your high score.
      </p>

      <iframe
        src="/files/index.html"
        title="Neon Snake"
        style={{
          display: 'block',
          width: '100%',
          height: 680,
          border: '1px solid #D4C9B0',
          borderRadius: 2,
        }}
        scrolling="no"
      />
    </div>
  )
}
