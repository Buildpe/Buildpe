import React from 'react';
import ProductCard from '../common/Productcard';

const ServicesList = ({ services, loading = false }) => {
  if (loading) {
    return (
      <div className="services-loading">
        <div className="loading-spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="no-services">
        <div className="no-services-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#f3f4f6"/>
            <path d="M32 20v24M20 32h24" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <h3>No services found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="services-list-wrapper">
      <div className="services-list">
        {services.map((service) => (
          <ProductCard
            key={service.id}
            productData={service}
          />
        ))}
      </div>

      <style jsx>{`
        .services-list-wrapper {
          padding: 24px 16px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .services-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .services-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .services-loading p {
          color: #6b7280;
          font-size: 16px;
        }

        .no-services {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
          text-align: center;
        }

        .no-services-icon {
          margin-bottom: 8px;
        }

        .no-services h3 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .no-services p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          max-width: 400px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .services-list-wrapper {
            padding: 16px 12px;
          }

          .services-list {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .services-list {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesList;