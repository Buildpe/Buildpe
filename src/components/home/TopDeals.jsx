import React, { useRef, useState, useEffect } from 'react';
import ProductCard from '../common/Productcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '../../Services/Api';

const transformDealService = (svc) => {
  const hasPrice = svc.price && Number(svc.price) > 0;
  const discount = svc.discount && Number(svc.discount) > 0 ? svc.discount : null;
  return {
    id:            String(svc.id),
    title:         svc.title,
    description:   svc.description,
    price:         hasPrice ? `₹${Number(svc.price).toLocaleString('en-IN')}` : 'Get Quote!',
    originalPrice: hasPrice ? Number(svc.price) : null,
    discount,
    image:         svc.imgUrl || null,
  };
};

const TopDeals = ({ title = 'Top Deals' }) => {
  const scrollContainerRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/api/public/deals', { params: { name: 'TOP_DEAL' } });
        const data = Array.isArray(res.data) ? res.data : [];
        setServices(data.map(transformDealService));
      } catch {
        setError('Failed to load services. Please try again later.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + (direction === 'left' ? -320 : 320),
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="top-deals-section">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading top deals...</p>
        </div>
        <style jsx>{`
          .top-deals-section {
            background-color: #fff;
            padding: 1.5rem;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            height: 100%;
          }
          .loading-state {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            min-height: 300px; gap: 1rem;
          }
          .loading-spinner {
            width: 40px; height: 40px;
            border: 4px solid #f3f4f6;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-state p { color: #6b7280; font-size: 1rem; margin: 0; }
        `}</style>
      </section>
    );
  }

  if (error) {
    return (
      <section className="top-deals-section">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
        </div>
        <style jsx>{`
          .top-deals-section {
            background-color: #fff; padding: 1.5rem;
            border: 2px solid #d1d5db; border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); height: 100%;
          }
          .error-state {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            min-height: 300px; gap: 1rem;
          }
          .error-message { color: #dc2626; font-size: 1rem; margin: 0; }
          .retry-button {
            padding: 0.5rem 1.5rem; background-color: #2563eb;
            color: white; border: none; border-radius: 6px;
            cursor: pointer; font-size: 0.875rem; font-weight: 500;
          }
          .retry-button:hover { background-color: #1d4ed8; }
        `}</style>
      </section>
    );
  }

  return (
    <section className="top-deals-section">
      <div className="top-deals-container">

        {/* Header */}
        <div className="top-deals-header">
          <h2 className="top-deals-title">{title}</h2>
          {/* Nav buttons — desktop only */}
          <div className="nav-buttons">
            <button onClick={() => scroll('left')}  aria-label="Scroll left"  className="nav-button">
              <ChevronLeft  size={20} color="#666" />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right" className="nav-button">
              <ChevronRight size={20} color="#666" />
            </button>
          </div>
        </div>

        {/* Products */}
        {services.length > 0 ? (
          <div ref={scrollContainerRef} className="products-container">
            {services.map(svc => (
              <div key={svc.id} className="product-item">
                <ProductCard productData={svc} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No top deals available at the moment</p>
          </div>
        )}

      </div>

      <style jsx>{`
        .top-deals-section {
          background-color: #fff;
          padding: 1.5rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .top-deals-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .top-deals-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
          flex-shrink: 0;
        }

        .top-deals-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .nav-buttons { display: flex; gap: 0.5rem; }

        .nav-button {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid #d1d5db;
          background-color: #fff;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .nav-button:hover { background-color: #f3f4f6; border-color: #9ca3af; }

        /* ── Desktop — horizontal scroll row ── */
        .products-container {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 0.5rem;
          flex: 1;
        }
        .products-container::-webkit-scrollbar { display: none; }

        .product-item {
          min-width: 260px;
          max-width: 260px;
          flex-shrink: 0;
          height: 100%;
        }

        .empty-state {
          display: flex; align-items: center; justify-content: center;
          width: 100%; min-height: 200px;
        }
        .empty-state p { color: #9ca3af; font-size: 1rem; margin: 0; }

        /* ── Mobile — 2 per row grid ── */
        @media (max-width: 768px) {
          .top-deals-section {
            padding: 1rem;
            border: 1px solid #d1d5db;
          }
          .top-deals-title { font-size: 1.25rem; }

          /* Hide nav buttons on mobile */
          .nav-buttons { display: none; }

          /* Switch from horizontal scroll to 2-column grid */
          .products-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            overflow-x: visible;
            overflow-y: visible;
            padding-bottom: 0;
          }

          .product-item {
            min-width: 0;
            max-width: 100%;
            width: 100%;
            height: auto;
          }
        }

        /* Very small mobile — 1 per row */
        @media (max-width: 360px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default TopDeals;