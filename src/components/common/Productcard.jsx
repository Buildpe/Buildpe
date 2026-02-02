import React from 'react';
import { useProductModal } from '../../context/ProductModelContext';

const ProductCard = ({ 
  title, 
  price, 
  originalPrice, 
  discount, 
  image,
  description,
  productData,
  onClick 
}) => {
  const { openModal } = useProductModal();

  // Extract data from productData if it exists, otherwise use individual props
  const cardData = productData || {
    title,
    price,
    originalPrice,
    discount,
    image,
    description
  };

  const handleClick = () => {
    // Open the global modal with product data
    openModal(cardData);

    // Call custom onClick if provided
    if (onClick) {
      onClick(cardData);
    }
  };

  // Handle image error - fallback to placeholder
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.parentElement.querySelector('.no-image').style.display = 'flex';
  };

  return (
    <div className="product-card" onClick={handleClick}>
      {/* Product Image */}
      <div className="product-image">
        {cardData.image ? (
          <>
            <img 
              src={cardData.image} 
              alt={cardData.title}
              onError={handleImageError}
            />
            <div className="no-image" style={{ display: 'none' }}>
              <span>No Image</span>
            </div>
          </>
        ) : (
          <div className="no-image">
            <span>No Image</span>
          </div>
        )}
        
        {cardData.discount && (
          <div className="discount-badge">
            {cardData.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-title">{cardData.title}</h3>
        
        <div className="price-container">
          <span className="current-price">{cardData.price}</span>
          {cardData.originalPrice && (
            <span className="original-price">₹{cardData.originalPrice}</span>
          )}
        </div>
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: #2563eb;
        }

        .product-image {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 6px;
          background: #f9fafb;
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .discount-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #ef4444;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 1;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .product-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .price-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: auto;
        }

        .current-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #059669;
        }

        .original-price {
          font-size: 0.875rem;
          color: #6b7280;
          text-decoration: line-through;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .product-card {
            padding: 0.75rem;
          }

          .product-title {
            font-size: 0.875rem;
          }

          .current-price {
            font-size: 1rem;
          }

          .original-price {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;