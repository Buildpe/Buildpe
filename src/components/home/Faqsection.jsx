import { ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is the typical timeline for a home interior project?",
      answer: "The timeline varies based on project scope. A single room makeover takes 2-3 weeks, modular kitchen installation takes 3-4 weeks, and a complete home interior project typically takes 45-60 days from design approval to final handover."
    },
    {
      question: "Do you provide free design consultation?",
      answer: "Yes! We offer a complimentary initial consultation where our design experts visit your home, understand your requirements, take measurements, and provide design recommendations. This service is absolutely free with no obligations."
    },
    {
      question: "What is included in the quoted price?",
      answer: "Our quotes are comprehensive and include design, materials, labor, installation, hardware, and finishing. We provide detailed breakdowns so you know exactly what you're paying for. There are no hidden charges."
    },
    {
      question: "Can I customize the designs shown in your packages?",
      answer: "Absolutely! All our packages are fully customizable. You can modify colors, materials, finishes, layouts, and designs according to your preferences and budget. Our designers will work with you to create your perfect space."
    },
    {
      question: "What materials and brands do you use?",
      answer: "We work with premium brands and materials including Hettich, Ebco, Hafele for hardware, Greenply and Century ply for wood, and Asian Paints, Dulux for finishes. We also offer options across different budget ranges without compromising on quality."
    },
    {
      question: "Do you offer warranty on your work?",
      answer: "Yes, we provide up to 10 years warranty on selected products and services. Modular furniture comes with 5-10 years warranty, hardware has 5 years warranty, and we offer 1 year service warranty on installation and finishing work."
    },
    {
      question: "What is your payment structure?",
      answer: "We follow a milestone-based payment structure: 40% on order confirmation, 30% on material delivery, 20% on installation completion, and 10% on final handover. This ensures transparency and protects both parties."
    },
    {
      question: "Do you handle complete home interiors or just specific rooms?",
      answer: "We handle everything from single-room makeovers to complete home interior projects. Whether it's just your kitchen, bedroom, living room, or an entire home, we have specialized teams for each category."
    },
    {
      question: "Can I see the design before finalizing?",
      answer: "Yes! We provide detailed 3D visualizations and rendered images of your space before starting work. You can review, request changes, and approve the final design. We also provide material samples for your review."
    },
    {
      question: "What happens if I'm not satisfied with the work?",
      answer: "Customer satisfaction is our priority. If you're not happy with any aspect, we'll revise it at no additional cost during the project. We also provide post-installation support and will address any concerns promptly."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find answers to common questions about our services
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="faq-content">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className="chevron-icon"
                    size={20}
                  />
                </button>
                <div className="faq-answer-wrapper">
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div className="faq-cta">
            <div className="cta-icon">
              <MessageCircle size={40} />
            </div>
            <h3>Still have questions?</h3>
            <p>
              Our team is here to help! Get in touch with us for personalized assistance.
            </p>
            <button className="contact-btn">Contact Us</button>
            <div className="contact-info">
              <p><strong>Call us:</strong> +91-9676368455</p>
              <p><strong>Email:</strong> rohit@eternaleveryday@gmail.com</p>
              <p><strong>Hours:</strong> Mon-Sat, 9 AM - 7 PM</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          padding: 12px 16px;
          background: #fff;
        }

        .faq-container {
          width: 100%;
          margin: 0 auto;
          border: 2px solid #d4d4d4;
          border-radius: 8px;
          padding: 24px;
          background: #fff;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .section-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0;
        }

        .faq-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 40px;
          align-items: start;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          border-color: #e74c3c;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.1);
        }

        .faq-item.active {
          border-color: #e74c3c;
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: none;
          border: none;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .faq-question:hover {
          background: #f8f9fa;
        }

        .chevron-icon {
          flex-shrink: 0;
          transition: transform 0.3s ease;
          color: #e74c3c;
        }

        .faq-item.active .chevron-icon {
          transform: rotate(180deg);
        }

        .faq-answer-wrapper {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .faq-item.active .faq-answer-wrapper {
          max-height: 500px;
        }

        .faq-answer {
          padding: 0 24px 20px 24px;
          font-size: 15px;
          line-height: 1.7;
          color: #555;
        }

        .faq-cta {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          padding: 40px 30px;
          border-radius: 16px;
          color: #fff;
          text-align: center;
          position: sticky;
          top: 20px;
        }

        .cta-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .faq-cta h3 {
          font-size: 24px;
          margin: 0 0 12px 0;
          font-weight: 700;
        }

        .faq-cta p {
          font-size: 15px;
          margin: 0 0 24px 0;
          opacity: 0.95;
          line-height: 1.6;
        }

        .contact-btn {
          width: 100%;
          padding: 14px 24px;
          background: #fff;
          color: #e74c3c;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 24px;
        }

        .contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .contact-info {
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          text-align: left;
        }

        .contact-info p {
          margin: 8px 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .contact-info strong {
          font-weight: 600;
        }

        @media (max-width: 968px) {
          .faq-content {
            grid-template-columns: 1fr;
          }

          .faq-cta {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .faq-section {
            padding: 12px 12px;
          }

          .section-title {
            font-size: 24px;
          }

          .section-header {
            margin-bottom: 30px;
          }

          .faq-question {
            padding: 16px 18px;
            font-size: 15px;
          }

          .faq-answer {
            padding: 0 18px 16px 18px;
            font-size: 14px;
          }

          .faq-cta {
            padding: 30px 20px;
          }

          .faq-cta h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </section>
  );
}