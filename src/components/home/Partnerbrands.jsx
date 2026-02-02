import {  useState} from 'react';

export default function PartnerBrands() {
  const [isAnimating, setIsAnimating] = useState(true);

  const brands = [
    {
      name: "Hettich",
      logo: "/api/placeholder/140/60",
      category: "Hardware"
    },
    {
      name: "Hafele",
      logo: "/api/placeholder/140/60",
      category: "Hardware"
    },
    {
      name: "Ebco",
      logo: "/api/placeholder/140/60",
      category: "Hardware"
    },
    {
      name: "Greenply",
      logo: "/api/placeholder/140/60",
      category: "Plywood"
    },
    {
      name: "Century Ply",
      logo: "/api/placeholder/140/60",
      category: "Plywood"
    },
    {
      name: "Asian Paints",
      logo: "/api/placeholder/140/60",
      category: "Paints"
    },
    {
      name: "Dulux",
      logo: "/api/placeholder/140/60",
      category: "Paints"
    },
    {
      name: "Kohler",
      logo: "/api/placeholder/140/60",
      category: "Sanitaryware"
    },
    {
      name: "Jaquar",
      logo: "/api/placeholder/140/60",
      category: "Sanitaryware"
    },
    {
      name: "Kajaria",
      logo: "/api/placeholder/140/60",
      category: "Tiles"
    },
    {
      name: "Somany",
      logo: "/api/placeholder/140/60",
      category: "Tiles"
    },
    {
      name: "Sleepwell",
      logo: "/api/placeholder/140/60",
      category: "Furnishing"
    }
  ];

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="brands-section">
      <div className="brands-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Our Trusted Partners</h2>
          <p className="section-subtitle">
            We collaborate with leading brands to deliver premium quality
          </p>
        </div>

        {/* Brands Carousel */}
        <div className="carousel-wrapper">
          <div 
            className={`brands-track ${isAnimating ? 'animate' : ''}`}
            onMouseEnter={() => setIsAnimating(false)}
            onMouseLeave={() => setIsAnimating(true)}
          >
            {duplicatedBrands.map((brand, index) => (
              <div key={index} className="brand-card">
                <div className="brand-logo-container">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="brand-logo"
                  />
                </div>
                <div className="brand-info">
                  <h4 className="brand-name">{brand.name}</h4>
                  <span className="brand-category">{brand.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="indicator">
            <div className="indicator-icon">✓</div>
            <span>100% Genuine Products</span>
          </div>
          <div className="indicator">
            <div className="indicator-icon">✓</div>
            <span>Premium Quality Materials</span>
          </div>
          <div className="indicator">
            <div className="indicator-icon">✓</div>
            <span>Manufacturer Warranty</span>
          </div>
          <div className="indicator">
            <div className="indicator-icon">✓</div>
            <span>Best Price Guarantee</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .brands-section {
          padding: 12px 16px;
          background: #fff;
          overflow: hidden;
        }

        .brands-container {
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

        .carousel-wrapper {
          position: relative;
          overflow: hidden;
          margin-bottom: 50px;
        }

        .carousel-wrapper::before,
        .carousel-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          width: 100px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .carousel-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #fff, transparent);
        }

        .carousel-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #fff, transparent);
        }

        .brands-track {
          display: flex;
          gap: 24px;
          width: fit-content;
        }

        .brands-track.animate {
          animation: scroll 40s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .brand-card {
          flex-shrink: 0;
          width: 200px;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .brand-card:hover {
          border-color: #e74c3c;
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(231, 76, 60, 0.15);
        }

        .brand-logo-container {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
        }

        .brand-logo {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          filter: grayscale(100%);
          transition: filter 0.3s ease;
        }

        .brand-card:hover .brand-logo {
          filter: grayscale(0%);
        }

        .brand-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .brand-name {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .brand-category {
          font-size: 13px;
          color: #888;
        }

        .trust-indicators {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .indicator:hover {
          border-color: #e74c3c;
          background: #fff;
          transform: translateY(-2px);
        }

        .indicator-icon {
          width: 36px;
          height: 36px;
          background: #e74c3c;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .indicator span {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        @media (max-width: 768px) {
          .brands-section {
            padding: 12px 12px;
          }

          .section-title {
            font-size: 24px;
          }

          .section-header {
            margin-bottom: 30px;
          }

          .brand-card {
            width: 160px;
            padding: 16px;
          }

          .brands-track {
            gap: 16px;
          }

          .trust-indicators {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .indicator {
            padding: 16px;
          }

          .indicator span {
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
}