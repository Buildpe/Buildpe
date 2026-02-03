import React from 'react';
import { Award, Users, Building2, TrendingUp, CheckCircle, Heart, Target, Eye, Phone, Mail, MapPin, Briefcase, PenTool, ClipboardCheck, Headphones } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: Building2, value: '500+', label: 'Projects Completed' },
    { icon: Users, value: '1000+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: TrendingUp, value: '98%', label: 'Client Satisfaction' }
  ];

  const values = [
    {
      icon: CheckCircle,
      title: 'Quality First',
      description: 'We never compromise on quality. Every project is executed with precision and attention to detail.'
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We work closely with you to bring your vision to life.'
    },
    {
      icon: Target,
      title: 'On-Time Delivery',
      description: 'We respect your time and ensure timely completion of all projects without delays.'
    },
    {
      icon: Award,
      title: 'Expert Team',
      description: 'Our skilled professionals have years of experience in construction and interior design.'
    }
  ];

  const team = [
    {
      icon: Briefcase,
      role: 'Leadership',
      description: 'Experienced industry professionals'
    },
    {
      icon: PenTool,
      role: 'Design Team',
      description: 'Creative interior designers'
    },
    {
      icon: ClipboardCheck,
      role: 'Project Management',
      description: 'Expert project execution'
    },
    {
      icon: Headphones,
      role: 'Client Support',
      description: 'Dedicated customer service'
    }
  ];

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">About BuildPe</h1>
          <p className="page-subtitle">
            Transforming houses into homes with innovative design and quality craftsmanship since 2009
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon-wrapper">
                  <stat.icon size={32} />
                </div>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="about-content-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="section-title">Who We Are</h2>
              <p className="section-description">
                BuildPe is a leading construction and interior design company committed to delivering 
                exceptional results. With over 15 years of experience, we've successfully completed 
                500+ projects across residential and commercial sectors.
              </p>
              <p className="section-description">
                Our team of skilled professionals combines creativity with technical expertise to 
                transform your vision into reality. From concept to completion, we handle every 
                aspect of your project with precision and care.
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <CheckCircle size={20} color="#EC1940" />
                  <span>Licensed and Insured Professionals</span>
                </div>
                <div className="feature-item">
                  <CheckCircle size={20} color="#EC1940" />
                  <span>Premium Quality Materials</span>
                </div>
                <div className="feature-item">
                  <CheckCircle size={20} color="#EC1940" />
                  <span>Transparent Pricing</span>
                </div>
                <div className="feature-item">
                  <CheckCircle size={20} color="#EC1940" />
                  <span>Post-Project Support</span>
                </div>
              </div>
            </div>
            <div className="content-image">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop" 
                alt="Construction site"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">
                <Target size={40} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To deliver world-class construction and interior design services that exceed 
                client expectations while maintaining the highest standards of quality, safety, 
                and sustainability.
              </p>
            </div>
            <div className="vision-card">
              <div className="card-icon">
                <Eye size={40} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be the most trusted and innovative construction partner in India, known for 
                transforming spaces and creating lasting value for our clients and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title centered">Our Core Values</h2>
          <p className="section-subtitle centered">
            The principles that guide everything we do
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  <value.icon size={32} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title centered">Our Departments</h2>
          <p className="section-subtitle centered">
            Dedicated teams working together for your success
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <member.icon size={48} />
                </div>
                <div className="team-info">
                  <h3>{member.role}</h3>
                  <p className="team-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>Let's bring your vision to life. Contact us today for a free consultation.</p>
            <div className="cta-buttons">
              <a href="/contact" className="btn-primary">Get Started</a>
              <a href="/services" className="btn-secondary">View Services</a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
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

        /* Stats Section */
        .stats-section {
          padding: 60px 0;
          background: #f9fafb;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .stat-card {
          background: white;
          padding: 40px 30px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(236, 25, 64, 0.2);
        }

        .stat-icon-wrapper {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 500;
        }

        /* About Content */
        .about-content-section {
          padding: 80px 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
        }

        .section-title.centered {
          text-align: center;
        }

        .section-description {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 20px;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 50px;
        }

        .section-subtitle.centered {
          text-align: center;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 30px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1rem;
          color: #374151;
          font-weight: 500;
        }

        .content-image {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .content-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Mission & Vision */
        .mission-vision-section {
          padding: 80px 0;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.05) 0%, rgba(248, 156, 28, 0.05) 100%);
        }

        .mission-vision-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .mission-card,
        .vision-card {
          background: white;
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .card-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 25px;
        }

        .mission-card h3,
        .vision-card h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 15px;
        }

        .mission-card p,
        .vision-card p {
          font-size: 1.0625rem;
          line-height: 1.8;
          color: #4b5563;
        }

        /* Values Section */
        .values-section {
          padding: 80px 0;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .value-card {
          background: white;
          padding: 40px 30px;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .value-card:hover {
          border-color: #EC1940;
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(236, 25, 64, 0.15);
        }

        .value-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.1) 0%, rgba(248, 156, 28, 0.1) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #EC1940;
          margin-bottom: 20px;
        }

        .value-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }

        .value-card p {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #6b7280;
        }

        /* Team Section */
        .team-section {
          padding: 80px 0;
          background: #f9fafb;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 30px;
        }

        .team-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 40px 30px;
          text-align: center;
        }

        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 30px rgba(236, 25, 64, 0.2);
        }

        .team-avatar {
          width: 100px;
          height: 100px;
          margin: 0 auto 25px;
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(236, 25, 64, 0.3);
          color: white;
        }

        .team-info {
          padding: 0;
        }

        .team-info h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 10px;
        }

        .team-description {
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.6;
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 0;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .cta-content {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 15px;
        }

        .cta-content p {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 35px;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          padding: 15px 40px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-primary {
          background: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(236, 25, 64, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(236, 25, 64, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #EC1940;
          border: 2px solid #EC1940;
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, rgba(236, 25, 64, 0.1) 0%, rgba(248, 156, 28, 0.1) 100%);
        }

        /* Responsive */
        @media (max-width: 968px) {
          .page-title {
            font-size: 2rem;
          }

          .content-grid,
          .mission-vision-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .content-image {
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            padding: 40px 0 30px 0;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .stats-section,
          .about-content-section,
          .mission-vision-section,
          .values-section,
          .team-section,
          .cta-section {
            padding: 50px 0;
          }

          .cta-content h2 {
            font-size: 1.75rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            max-width: 300px;
          }

          .team-avatar {
            width: 90px;
            height: 90px;
          }
        }
      `}</style>
    </div>
  );
}