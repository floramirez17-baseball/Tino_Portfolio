import { FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '16px',
  };

  const iconStyle = {
    marginRight: '15px',
    fontSize: '24px',
    color: '#333',
  };

  const linkStyle = {
    color: '#0077b5',
    textDecoration: 'none',
  };

  return (
    <div style={{ maxWidth: 720, lineHeight: 1.8, fontSize: 15 }}>
      <h2 style={{ marginTop: 0, marginBottom: '30px' }}>Contact</h2>
      <div style={contactItemStyle}>
        <FaEnvelope style={iconStyle} />
        <span>fmramirez17@outlook.com</span>
      </div>
      <div style={contactItemStyle}>
        <FaPhone style={iconStyle} />
        <span>214-620-4632</span>
      </div>
      <div style={contactItemStyle}>
        <FaLinkedin style={iconStyle} />
        <a href="https://www.linkedin.com/in/tinor17" target="_blank" rel="noopener noreferrer" style={linkStyle}>
          linkedin.com/in/tinor17
        </a>
      </div>
    </div>
  );
}
