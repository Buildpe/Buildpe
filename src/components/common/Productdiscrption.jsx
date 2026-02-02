import React, { useState } from 'react';
import { X, ShoppingCart, Star, Zap, Shield, Truck, CheckCircle, Award, Clock, RefreshCw, Send } from 'lucide-react';

const ProductDescription = ({ product, isOpen, onClose }) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Google Form Configuration
  const GOOGLE_FORM_CONFIG = {
    formId: '1FAIpQLSf-z5xESgi94JF64E1KQ7vFIuqoOtbQQYKSij4CFwAI-KY0Aw',
    entries: {
      serviceName: 'entry.77093322',
      name: 'entry.1392727185',
      phone: 'entry.1491459465',
      email: 'entry.903938955'
    }
  };

  if (!isOpen || !product) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Construct the Google Form submission URL
      const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_CONFIG.formId}/formResponse`;
      
      // Create form data
      const submitData = new FormData();
      submitData.append(GOOGLE_FORM_CONFIG.entries.serviceName, product.title);
      submitData.append(GOOGLE_FORM_CONFIG.entries.name, formData.name);
      submitData.append(GOOGLE_FORM_CONFIG.entries.phone, formData.phone);
      if (formData.email) {
        submitData.append(GOOGLE_FORM_CONFIG.entries.email, formData.email);
      }

      // Submit to Google Forms (using no-cors mode)
      await fetch(formUrl, {
        method: 'POST',
        body: submitData,
        mode: 'no-cors'
      });

      // Show success message
      setIsSubmitted(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setShowQuoteForm(false);
        setFormData({ name: '', phone: '', email: '' });
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="modal-backdrop"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="modal-container">
        <div className="modal-content">
          {/* Close Button */}
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {/* Discount Badge (floating) */}
          {product.discount && (
            <div className="floating-discount">
              <Zap size={16} />
              <span>{product.discount}% OFF</span>
            </div>
          )}

          {/* Product Layout */}
          <div className="product-layout">
            {/* Left Side - Product Image */}
            <div className="product-image-section">
              <div className="image-container">
                <div className="image-placeholder">
                  {product.image ? (
                    <img src={product.image} alt={product.title} />
                  ) : (
                    <div className="no-image">
                      <ShoppingCart size={48} strokeWidth={1.5} />
                      <span>Product Image</span>
                    </div>
                  )}
                </div>
                
                {/* Image decorative elements */}
                <div className="image-glow"></div>
              </div>
              
              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="badge">
                  <Shield size={18} />
                  <span>Secure Payment</span>
                </div>
                <div className="badge">
                  <Truck size={18} />
                  <span>Fast Delivery</span>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="additional-info">
                <div className="info-item">
                  <Award size={20} />
                  <div className="info-content">
                    <span className="info-title">Warranty</span>
                    <span className="info-value">1 Year Official</span>
                  </div>
                </div>
                <div className="info-item">
                  <Clock size={20} />
                  <div className="info-content">
                    <span className="info-title">Delivery</span>
                    <span className="info-value">3-5 Business Days</span>
                  </div>
                </div>
                <div className="info-item">
                  <RefreshCw size={20} />
                  <div className="info-content">
                    <span className="info-title">Returns</span>
                    <span className="info-value">7 Days Easy Return</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="product-details-section">
              {/* Rating */}
              <div className="rating-section">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="#FCD34D" color="#FCD34D" />
                  ))}
                </div>
                <span className="rating-text">4.8 (2,345 reviews)</span>
              </div>

              <h2 className="product-title">{product.title}</h2>
              
              {/* Price Section with animation */}
              <div className="price-section">
                <div className="price-main">
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">₹{product.originalPrice}</span>
                  )}
                </div>
                {product.discount && (
                  <div className="savings-badge">
                    Save ₹{product.originalPrice - parseInt(product.price.replace(/[^\d]/g, ''))}
                  </div>
                )}
              </div>

              {/* Product Overview */}
              <div className="description-section">
                <h3 className="section-title">
                  <div className="title-line"></div>
                  Product Overview
                </h3>
                <p className="description-text">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {/* Specifications */}
              <div className="features-section">
                <h3 className="section-title">
                  <div className="title-line"></div>
                  What's Included
                </h3>
                <ul className="features-list">
                  <li>
                    <CheckCircle size={18} />
                    <span>Premium Quality Materials</span>
                  </li>
                  <li>
                    <CheckCircle size={18} />
                    <span>Latest Technology</span>
                  </li>
                  <li>
                    <CheckCircle size={18} />
                    <span>1 Year Warranty</span>
                  </li>
                  <li>
                    <CheckCircle size={18} />
                    <span>24/7 Customer Support</span>
                  </li>
                </ul>
              </div>

              {/* Quote Form or Button */}
              {!showQuoteForm ? (
                <div className="action-buttons">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowQuoteForm(true)}
                  >
                    <Send size={20} />
                    Get Quote Now
                  </button>
                </div>
              ) : (
                <div className="quote-form-container">
                  {!isSubmitted ? (
                    <>
                      <h3 className="form-title">Request a Quote</h3>
                      <form onSubmit={handleQuoteSubmit} className="quote-form">
                        {/* Service Name (pre-filled, read-only) */}
                        <div className="form-group">
                          <label>Service</label>
                          <input
                            type="text"
                            value={product.title}
                            readOnly
                            className="readonly-input"
                          />
                        </div>

                        {/* Name */}
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="John Doe"
                          />
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            placeholder="+91 98765 43210"
                            pattern="[0-9+\s-]+"
                          />
                        </div>

                        {/* Email (Optional) */}
                        <div className="form-group">
                          <label>Email (Optional)</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                          />
                        </div>

                        {/* Form Buttons */}
                        <div className="form-buttons">
                          <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={() => {
                              setShowQuoteForm(false);
                              setFormData({ name: '', phone: '', email: '' });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="spinner"></div>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send size={18} />
                                Submit Request
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <div className="success-message">
                      <CheckCircle size={64} className="success-icon" />
                      <h3>Thank You!</h3>
                      <p>We'll get back to you within 24 hours</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
          backdrop-filter: blur(10px);
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 75%;
          max-width: 1200px;
          max-height: 90vh;
          z-index: 10001;
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .close-button:hover {
          background: #fee;
          transform: rotate(90deg) scale(1.1);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
        }

        .close-button:hover :global(svg) {
          color: #ef4444;
        }

        .floating-discount {
          position: absolute;
          top: 20px;
          left: 20px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 700;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          padding: 3rem;
          overflow-y: auto;
        }

        .product-image-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .image-container {
          position: relative;
        }

        .image-placeholder {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
        }

        .image-placeholder:hover {
          transform: scale(1.02);
          border-color: #2563eb;
        }

        .image-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .image-placeholder:hover img {
          transform: scale(1.1);
        }

        .no-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: #9ca3af;
        }

        .no-image span {
          font-size: 1rem;
          font-weight: 500;
        }

        .image-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
          animation: glow 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        .trust-badges {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #166534;
          transition: all 0.3s ease;
        }

        .badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
        }

        .additional-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
          border-radius: 12px;
          border: 1px solid #fde047;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .info-item :global(svg) {
          color: #ca8a04;
          flex-shrink: 0;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .info-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #78716c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .product-details-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideInRight 0.5s ease-out 0.1s both;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .stars {
          display: flex;
          gap: 0.25rem;
        }

        .rating-text {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .product-title {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1a1a1a 0%, #374151 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1.2;
          animation: slideInRight 0.5s ease-out 0.2s both;
        }

        .price-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-left: 4px solid #059669;
          border-radius: 12px;
          animation: slideInRight 0.5s ease-out 0.3s both;
        }

        .price-main {
          display: flex;
          align-items: baseline;
          gap: 1rem;
        }

        .current-price {
          font-size: 2.25rem;
          font-weight: 800;
          color: #059669;
          animation: pricePopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both;
        }

        @keyframes pricePopIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .original-price {
          font-size: 1.25rem;
          color: #6b7280;
          text-decoration: line-through;
        }

        .savings-badge {
          display: inline-block;
          background: #059669;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 700;
          align-self: flex-start;
        }

        .description-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: slideInRight 0.5s ease-out 0.4s both;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .title-line {
          width: 4px;
          height: 24px;
          background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
          border-radius: 2px;
        }

        .description-text {
          font-size: 1rem;
          line-height: 1.7;
          color: #4b5563;
          margin: 0;
          white-space: pre-line;
        }

        .features-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: slideInRight 0.5s ease-out 0.5s both;
        }

        .features-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .features-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          transition: all 0.3s ease;
        }

        .features-list li :global(svg) {
          color: #2563eb;
          flex-shrink: 0;
        }

        .features-list li span {
          flex: 1;
        }

        .features-list li:hover {
          transform: translateX(4px);
          background: #eff6ff;
          border-color: #2563eb;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: auto;
          padding-top: 1.5rem;
          animation: slideInRight 0.5s ease-out 0.6s both;
        }

        .btn {
          flex: 1;
          padding: 1.125rem 1.75rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.5);
        }

        .btn-primary:active {
          transform: translateY(-1px);
        }

        /* Quote Form Styles */
        .quote-form-container {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid #38bdf8;
          border-radius: 12px;
          padding: 1.25rem;
          margin-top: auto;
          animation: slideInUp 0.4s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0c4a6e;
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .quote-form {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }

        .form-group label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #0c4a6e;
        }

        .form-group input {
          padding: 0.625rem 0.875rem;
          border: 2px solid #bae6fd;
          border-radius: 6px;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .readonly-input {
          background: #f0f9ff !important;
          color: #0c4a6e;
          font-weight: 600;
          cursor: not-allowed;
        }

        .form-buttons {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .btn-cancel {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
          padding: 0.625rem 0.875rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .btn-submit {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: white;
          border: none;
          padding: 0.625rem 0.875rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .success-message {
          text-align: center;
          padding: 2rem 1.5rem;
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .success-icon {
          color: #059669;
          margin-bottom: 0.75rem;
          animation: checkmark 0.8s ease-out;
        }

        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        .success-message h3 {
          font-size: 1.375rem;
          font-weight: 700;
          color: #059669;
          margin: 0 0 0.5rem 0;
        }

        .success-message p {
          font-size: 1rem;
          color: #4b5563;
          margin: 0;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .modal-container {
            width: 85%;
          }

          .product-layout {
            gap: 2rem;
            padding: 2rem;
          }

          .product-title {
            font-size: 1.875rem;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .modal-container {
            width: 96%;
            max-height: 88vh;
            top: 50%;
            transform: translate(-50%, -50%);
          }

          .modal-content {
            max-height: 88vh;
            border-radius: 16px;
          }

          .product-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1rem;
            padding-top: 3.5rem;
          }

          .product-title {
            font-size: 1.5rem;
          }

          .current-price {
            font-size: 1.75rem;
          }

          .features-list {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .floating-discount {
            top: 12px;
            left: 12px;
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }

          .close-button {
            top: 12px;
            right: 12px;
            width: 40px;
            height: 40px;
          }

          .trust-badges {
            grid-template-columns: 1fr;
          }

          .image-placeholder {
            border-radius: 12px;
          }

          .additional-info {
            padding: 1rem;
          }

          .quote-form-container {
            padding: 1rem;
          }

          .form-title {
            font-size: 1rem;
          }

          .form-group input {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
          }

          .form-buttons {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .btn-cancel,
          .btn-submit {
            padding: 0.5rem 0.75rem;
            font-size: 0.8125rem;
          }

          .success-message {
            padding: 1.5rem 1rem;
          }

          .success-icon {
            width: 48px;
            height: 48px;
          }

          .success-message h3 {
            font-size: 1.125rem;
          }

          .success-message p {
            font-size: 0.875rem;
          }
        }

        /* Small Mobile */
        @media (max-width: 480px) {
          .modal-container {
            width: 100%;
            max-height: 100%;
            height: 100vh;
            top: 0;
            left: 0;
            transform: none;
            border-radius: 0;
          }

          .modal-content {
            border-radius: 0;
            max-height: 100vh;
            height: 100vh;
          }

          .product-layout {
            padding: 0.75rem;
            padding-top: 3.5rem;
            gap: 1rem;
          }

          .floating-discount {
            top: 8px;
            left: 8px;
            padding: 0.4rem 0.75rem;
            font-size: 0.7rem;
          }

          .close-button {
            top: 8px;
            right: 8px;
            width: 36px;
            height: 36px;
          }

          .close-button :global(svg) {
            width: 20px;
            height: 20px;
          }

          .quote-form-container {
            padding: 0.875rem;
          }

          .form-title {
            font-size: 0.9375rem;
          }

          .form-group {
            gap: 0.25rem;
          }

          .form-group label {
            font-size: 0.75rem;
          }

          .form-group input {
            padding: 0.5rem 0.625rem;
            font-size: 0.8125rem;
          }

          .success-message {
            padding: 1.25rem 0.875rem;
          }

          .success-icon {
            width: 40px;
            height: 40px;
          }
        }

        /* Safe area for notched devices */
        @supports (padding: max(0px)) {
          @media (max-width: 768px) {
            .modal-content {
              padding-top: max(0px, env(safe-area-inset-top));
              padding-bottom: max(0px, env(safe-area-inset-bottom));
            }
          }
        }
      `}</style>
    </>
  );
};

export default ProductDescription;