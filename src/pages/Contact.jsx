import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+91-9676368455',
      link: 'tel:+919676368455'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'rohit@eternaleveryday.gmail.com',
      link: 'mailto:rohit@eternaleveryday.gmail.com'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: 'Hyderabad, Telangana, India',
      link: 'https://www.google.com/maps/place/Hyderabad,+Telangana/@17.4065452,78.2578107,11z'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: 'Mon - Sat: 9:00 AM - 6:00 PM',
      link: null
    }
  ];

  const faqs = [
    {
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on scope and complexity. Residential projects typically take 3-6 months, while commercial projects may take 6-12 months.'
    },
    {
      question: 'Do you provide free consultations?',
      answer: 'Yes! We offer free initial consultations to discuss your project requirements, budget, and timeline.'
    },
    {
      question: 'What areas do you serve?',
      answer: 'We primarily serve Hyderabad and surrounding areas in Telangana. For larger projects, we can extend our services to other cities.'
    },
    {
      question: 'Do you handle permits and approvals?',
      answer: 'Yes, we handle all necessary permits, approvals, and regulatory compliance for your project.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-subtitle">We're here to help bring your vision to life. Reach out to us today!</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="info-card">
                <div className="info-icon">
                  <info.icon size={28} />
                </div>
                <h3>{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="info-link">
                    {info.details}
                  </a>
                ) : (
                  <p>{info.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="form-map-section">
        <div className="container">
          <div className="form-map-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>Send Us a Message</h2>
              <p className="form-subtitle">
                Fill out the form below and we'll get back to you within 24 hours
              </p>

              {submitted ? (
                <div className="success-message">
                  <CheckCircle size={48} />
                  <h3>Thank You!</h3>
                  <p>Your message has been sent successfully. We'll contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 96763 68455"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="quote">Request a Quote</option>
                      <option value="residential">Residential Project</option>
                      <option value="commercial">Commercial Project</option>
                      <option value="interior">Interior Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-btn">
                    <Send size={20} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Map & Social */}
            <div className="map-social-wrapper">
              {/* Map */}
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.3160410944!2d78.24323099726562!3d17.412608636618123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BuildPe Location"
                ></iframe>
              </div>

              {/* Social Media */}
              <div className="social-container">
                <h3>Connect With Us</h3>
                <p>Follow us on social media for updates and inspiration</p>
                <div className="social-links">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    <Instagram size={20} />
                    <span>Instagram</span>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    <Facebook size={20} />
                    <span>Facebook</span>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    <Twitter size={20} />
                    <span>Twitter</span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="quick-contact">
                <h3>Need Immediate Help?</h3>
                <p>Call us directly for urgent inquiries</p>
                <a href="tel:+919676368455" className="call-btn">
                  <Phone size={20} />
                  <span>+91-9676368455</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          background: #ffffff;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Page Header */
        .page-header {
          padding: 60px 0 40px 0;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 15px;
        }

        .page-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Contact Info Section */
        .contact-info-section {
          padding: 60px 0;
          background: #f9fafb;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 25px;
        }

        .info-card {
          background: white;
          padding: 35px 25px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(236, 25, 64, 0.2);
        }

        .info-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .info-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 10px;
        }

        .info-card p {
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .info-link {
          font-size: 0.9375rem;
          color: #EC1940;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .info-link:hover {
          color: #F89C1C;
        }

        /* Form & Map Section */
        .form-map-section {
          padding: 80px 0;
        }

        .form-map-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 50px;
        }

        .contact-form-wrapper h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
        }

        .form-subtitle {
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 35px;
        }

        .contact-form {
          background: white;
          padding: 40px;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9375rem;
          color: #111827;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #EC1940;
          box-shadow: 0 0 0 3px rgba(236, 25, 64, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px 28px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(236, 25, 64, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(236, 25, 64, 0.4);
        }

        .success-message {
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.1) 0%, rgba(248, 156, 28, 0.1) 100%);
          padding: 60px 40px;
          border-radius: 16px;
          text-align: center;
          color: #EC1940;
        }

        .success-message svg {
          margin-bottom: 20px;
        }

        .success-message h3 {
          font-size: 1.75rem;
          margin-bottom: 10px;
        }

        .success-message p {
          font-size: 1rem;
          color: #6b7280;
        }

        /* Map & Social */
        .map-social-wrapper {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .map-container {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .social-container,
        .quick-contact {
          background: white;
          padding: 30px;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
        }

        .social-container h3,
        .quick-contact h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }

        .social-container p,
        .quick-contact p {
          font-size: 0.9375rem;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .social-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          text-decoration: none;
          color: #374151;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.05) 0%, rgba(248, 156, 28, 0.05) 100%);
          border-color: #EC1940;
          color: #EC1940;
        }

        .call-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(236, 25, 64, 0.3);
        }

        .call-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(236, 25, 64, 0.4);
        }

        /* FAQ Section */
        .faq-section {
          padding: 80px 0;
          background: #f9fafb;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          text-align: center;
          margin-bottom: 50px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .faq-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .faq-card:hover {
          border-color: #EC1940;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(236, 25, 64, 0.15);
        }

        .faq-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }

        .faq-card p {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #6b7280;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .form-map-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            padding: 40px 0 30px 0;
          }

          .page-title {
            font-size: 2rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .contact-info-section,
          .form-map-section,
          .faq-section {
            padding: 50px 0;
          }

          .contact-form {
            padding: 30px 20px;
          }

          .section-title {
            font-size: 2rem;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}