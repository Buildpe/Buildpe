import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div className="container">
        
        {/* Footer Content Grid */}
        <div style={gridStyle}>
          
          {/* Company Info */}
          <div>
            <h4 style={headingStyle}>Buildpe</h4>
            <p style={textStyle}>
              Professional interior design, construction, and property services 
              tailored to bring your vision to life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={headingStyle}>Quick Links</h4>
            <ul style={listStyle}>
              <li><Link to="/" style={linkStyle}>Home</Link></li>
              <li><Link to="/services" style={linkStyle}>Services</Link></li>
              <li><Link to="/about" style={linkStyle}>About</Link></li>
              <li><Link to="/contact" style={linkStyle}>Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={headingStyle}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={contactItemStyle}>
                <Phone size={16} />
                <span>+91 9676368455</span>
              </div>
              <div style={contactItemStyle}>
                <Mail size={16} />
                <span>rohit@eternaleveryday.com</span>
              </div>
              <div style={contactItemStyle}>
                <MapPin size={16} />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={copyrightStyle}>
          <p>&copy; 2024 Buildpe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// UPDATED STYLES - Much lighter and more visible
const footerStyle = {
  backgroundColor: '#1f2937',  
  color: '#e5e7eb',            
  padding: '3rem 0 1.5rem',
  marginTop: '4rem'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  marginBottom: '2rem'
};

const headingStyle = {
  color: '#ffffff',            
  marginBottom: '1rem',
  fontSize: '1.25rem',
  fontWeight: '600'
};

const textStyle = {
  color: '#d1d5db',           
  lineHeight: '1.6',
  fontSize: '0.95rem'
};

const listStyle = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  padding: 0
};

const linkStyle = {
  color: '#d1d5db',           
  textDecoration: 'none',
  transition: 'color 0.3s ease',
  fontSize: '0.95rem'
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  color: '#d1d5db',
  fontSize: '0.95rem'
};

const copyrightStyle = {
  textAlign: 'center',
  paddingTop: '2rem',
  marginTop: '2rem',
  borderTop: '1px solid #374151',  
  color: '#9ca3af',                 
  fontSize: '0.9rem'
};