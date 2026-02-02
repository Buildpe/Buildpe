import React from 'react';
import { Search, Tag, Package, TrendingUp, ArrowRight } from 'lucide-react';

/**
 * SearchDropdown Component
 * Displays autocomplete suggestions for services and categories
 */
export default function SearchDropdown({ 
  searchResults, 
  selectedIndex, 
  onItemSelect,
  onCategoryClick,
  onServiceClick,
  onViewAll,
  searchQuery 
}) {
  const { categories, services, allServicesCount, allCategoriesCount } = searchResults;
  
  if (!categories.length && !services.length) {
    return (
      <div style={dropdownStyle}>
        <div style={noResultsStyle}>
          <Search size={40} color="#9ca3af" />
          <p style={noResultsTextStyle}>No results found for "{searchQuery}"</p>
          <p style={noResultsSubtextStyle}>Try different keywords or browse our services</p>
        </div>
      </div>
    );
  }

  let currentIndex = 0;

  return (
    <div style={dropdownStyle}>
      {/* Categories Section */}
      {categories.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <Tag size={16} />
            <span>Categories</span>
          </div>
          {categories.map((category, idx) => {
            const itemIndex = currentIndex++;
            return (
              <div
                key={`category-${idx}`}
                style={{
                  ...itemStyle,
                  ...(selectedIndex === itemIndex ? selectedItemStyle : {})
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryClick(category);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => {
                  if (selectedIndex !== itemIndex) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={itemIconStyle}>
                  <Tag size={18} color="#EC1940" />
                </div>
                <div style={itemContentStyle}>
                  <div style={itemTitleStyle}>{category}</div>
                  <div style={itemSubtitleStyle}>Browse all {category} services</div>
                </div>
                <ArrowRight size={16} color="#9ca3af" />
              </div>
            );
          })}
        </div>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <Package size={16} />
            <span>Services</span>
          </div>
          {services.map((service, idx) => {
            const itemIndex = currentIndex++;
            return (
              <div
                key={`service-${service.id}`}
                style={{
                  ...itemStyle,
                  ...(selectedIndex === itemIndex ? selectedItemStyle : {})
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceClick(service);
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => {
                  if (selectedIndex !== itemIndex) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={itemIconStyle}>
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      style={serviceImageStyle}
                    />
                  ) : (
                    <Package size={18} color="#EC1940" />
                  )}
                </div>
                <div style={itemContentStyle}>
                  <div style={itemTitleStyle}>{service.title}</div>
                  <div style={itemSubtitleStyle}>
                    <span style={categoryBadgeStyle}>{service.category}</span>
                    {service.price && (
                      <span style={priceStyle}>{service.price}</span>
                    )}
                    {service.discount && (
                      <span style={discountBadgeStyle}>-{service.discount}%</span>
                    )}
                  </div>
                </div>
                <ArrowRight size={16} color="#9ca3af" />
              </div>
            );
          })}
        </div>
      )}

      {/* View All Results Footer */}
      {(allServicesCount > 5 || allCategoriesCount > 3) && (
        <div 
          style={viewAllStyle}
          onClick={(e) => {
            e.stopPropagation();
            onViewAll();
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <TrendingUp size={18} color="#EC1940" />
          <span style={viewAllTextStyle}>
            View all results ({allServicesCount} services, {allCategoriesCount} categories)
          </span>
          <ArrowRight size={18} color="#EC1940" />
        </div>
      )}
    </div>
  );
}

// Styles
const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  right: 0,
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
  maxHeight: '500px',
  overflowY: 'auto',
  zIndex: 10000,
  border: '1px solid #e5e7eb',
  animation: 'dropdownSlide 0.2s ease-out'
};

const sectionStyle = {
  padding: '8px 0',
  borderBottom: '1px solid #f3f4f6'
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px 8px 16px',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderLeft: '3px solid transparent'
};

const selectedItemStyle = {
  background: '#fef2f2',
  borderLeftColor: '#EC1940'
};

const itemIconStyle = {
  flexShrink: 0,
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  background: '#f9fafb',
  border: '1px solid #e5e7eb'
};

const serviceImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px'
};

const itemContentStyle = {
  flex: 1,
  minWidth: 0
};

const itemTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: '500',
  color: '#111827',
  marginBottom: '4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const itemSubtitleStyle = {
  fontSize: '0.8rem',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap'
};

const categoryBadgeStyle = {
  padding: '2px 8px',
  background: '#f3f4f6',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '500',
  color: '#374151'
};

const priceStyle = {
  fontWeight: '600',
  color: '#EC1940'
};

const discountBadgeStyle = {
  padding: '2px 6px',
  background: 'linear-gradient(135deg, #EC1940 0%, #F89C1C 100%)',
  color: '#ffffff',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: '600'
};

const viewAllStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderTop: '1px solid #e5e7eb'
};

const viewAllTextStyle = {
  flex: 1,
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#EC1940'
};

const noResultsStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  textAlign: 'center'
};

const noResultsTextStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#374151',
  marginTop: '16px',
  marginBottom: '8px'
};

const noResultsSubtextStyle = {
  fontSize: '0.875rem',
  color: '#9ca3af'
};