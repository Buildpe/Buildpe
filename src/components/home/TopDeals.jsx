import React, { useRef, useState, useEffect } from 'react';
import ProductCard from '../common/Productcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { loadServicesByComponent } from '../../utils/servicesLoader';

const TopDeals = ({ deals = [], title = "Top Deals" }) => {
  const scrollContainerRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        // Load services from topDeals.json
        const loadedServices = await loadServicesByComponent('topDeals.json');
        setServices(loadedServices);
      } catch (error) {
        console.error('Error loading top deals:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Use provided deals prop if available, otherwise use loaded services
  const displayDeals = deals.length > 0 ? deals : services;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="top-deals-section">
        <div className="top-deals-container">
          <div className="loading-state">Loading services...</div>
        </div>
        <style jsx>{`
          .top-deals-section {
            background-color: #fff;
            padding: 1.5rem;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            height: 100%;
          }
          
          .loading-state {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            color: #6b7280;
            font-size: 1rem;
          }
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

          {/* Navigation Buttons - Only show on desktop */}
          <div className="nav-buttons">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="nav-button"
            >
              <ChevronLeft size={20} color="#666" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="nav-button"
            >
              <ChevronRight size={20} color="#666" />
            </button>
          </div>
        </div>

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="products-container"
        >
          {displayDeals.length > 0 ? (
            displayDeals.map((deal) => (
              <div key={deal.id} className="product-item">
                <ProductCard productData={deal} />
              </div>
            ))
          ) : (
            <div className="empty-state">No services available</div>
          )}
        </div>
      </div>

      <style jsx>{`
        .top-deals-section {
          background-color: #fff;
          padding: 1.5rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

        .nav-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .nav-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #d1d5db;
          background-color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .nav-button:hover {
          background-color: #f9fafb;
          border-color: #9ca3af;
        }

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

        .products-container::-webkit-scrollbar {
          display: none;
        }

        .product-item {
          min-width: 260px;
          max-width: 260px;
          flex-shrink: 0;
          height: 100%;
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 200px;
          color: #9ca3af;
          font-size: 1rem;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .top-deals-section {
            padding: 1rem;
            border: 1px solid #d1d5db;
          }

          .top-deals-title {
            font-size: 1.25rem;
          }

          .nav-buttons {
            display: none;
          }

          .products-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            overflow-x: visible;
            overflow-y: visible;
          }

          .product-item {
            min-width: 100%;
            max-width: 100%;
          }
        }

        /* Very small mobile */
        @media (max-width: 480px) {
          .products-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default TopDeals;