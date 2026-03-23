import { useState, useEffect } from 'react';
import ProductCard from '../../components/common/Productcard';
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

export default function LiveServices() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/api/public/deals', { params: { name: 'LIVE_SERVICE' } });
        const data = Array.isArray(res.data) ? res.data : [];
        setServices(data.map(transformDealService));
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!loading && services.length === 0) return null;

  return (
    <>
      <div className="ls-wrapper">
        <div className="ls-card">

          <div className="ls-header">
            <div className="ls-title-wrap">
              <span className="ls-dot" />
              <h2 className="ls-title">Live Services</h2>
            </div>
          </div>

          <div className="ls-row">
            {loading
              ? [1,2,3,4,5].map(i => <div key={i} className="ls-skeleton" />)
              : services.map(svc => (
                  <div key={svc.id} className="ls-item">
                    <ProductCard productData={svc} />
                  </div>
                ))
            }
          </div>

        </div>
      </div>

      <style jsx>{`
        /* Outer wrapper — same as HeroSlider */
        .ls-wrapper {
          width: 100%;
          padding: 0 16px;
          margin-bottom: 12px;
        }

        /* Card box — same border/shadow as HeroSlider */
        .ls-card {
          width: 100%;
          background: #fff;
          border: 1px solid #d4d4d4;
          border-radius: 4px;
          box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06);
          padding: 14px 16px;
        }

        .ls-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .ls-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ls-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #EC1940;
          display: inline-block;
          flex-shrink: 0;
          animation: lsPulse 1.5s ease-in-out infinite;
        }

        @keyframes lsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }

        .ls-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        /* Desktop — flex row, space evenly, fixed card width */
        .ls-row {
          display: flex;
          justify-content: space-evenly;
          align-items: stretch;
          width: 100%;
        }

        .ls-item {
          width: 260px;
          flex-shrink: 0;
        }

        .ls-skeleton {
          width: 260px;
          flex-shrink: 0;
          height: 260px;
          border-radius: 8px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: lsShimmer 1.2s infinite;
        }

        @keyframes lsShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Mobile — 2 column grid, same as Services page */
        @media (max-width: 768px) {
          .ls-wrapper { padding: 0 8px; }

          .ls-title { font-size: 1rem; }

          /* Switch to grid — exactly like Services page cards */
          .ls-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .ls-item {
            width: 100%;
          }

          .ls-skeleton {
            width: 100%;
            height: 200px;
          }
        }

        /* Very small mobile — 1 per row */
        @media (max-width: 360px) {
          .ls-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}