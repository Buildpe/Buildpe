import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../Services/Categoryapi';

// Custom hook for responsive behavior
const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(
    () => window.matchMedia(query).matches
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Default icon component for categories without images
const DefaultIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="4" fill="#E8F5E9"/>
    <path d="M24 16v16M16 24h16" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const CategoryNav = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const scrollContainerRef = React.useRef(null);
  const [categories, setCategories] = React.useState([]);
  const [hoveredId, setHoveredId] = React.useState(null);

  // ✅ Load categories from API
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        // Map to the shape this component needs
        const mapped = data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: `/assets/icons/${cat.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error('CategoryNav: failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate('/services', { state: { selectedCategory: categoryName } });
  };

  const styles = {
    categoryNavWrapper: {
      width: '100%',
      padding: isMobile ? '0 8px' : '0 16px',
      marginTop: '12px',
      marginBottom: '12px',
    },
    categoryNav: {
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
      width: '100%',
      overflow: 'hidden',
    },
    categoryNavContainer: {
      display: 'flex',
      justifyContent: isMobile ? 'flex-start' : 'space-around',
      alignItems: 'center',
      maxWidth: '100%',
      margin: '0 auto',
      padding: isMobile ? '10px 8px' : '14px 16px',
      gap: isMobile ? '8px' : '8px',
      overflowX: isMobile ? 'auto' : 'visible',
      overflowY: 'hidden',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
    categoryItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isMobile ? '6px' : '8px',
      cursor: 'pointer',
      padding: isMobile ? '6px 8px' : '8px 12px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      minWidth: isMobile ? '85px' : '100px',
      flex: isMobile ? '0 0 auto' : 1,
      maxWidth: isMobile ? '110px' : '140px',
    },
    categoryIcon: {
      position: 'relative',
      width: isMobile ? '56px' : '72px',
      height: isMobile ? '56px' : '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s ease',
    },
    categoryIconImg: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      display: 'block',
    },
    defaultIconWrapper: {
      display: 'none',
    },
    categoryName: {
      fontSize: isMobile ? '11px' : '13px',
      fontWeight: isMobile ? '400' : '500',
      color: '#212121',
      textAlign: 'center',
      lineHeight: '1.3',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      whiteSpace: isMobile ? 'normal' : 'normal',
    },
  };

  return (
    <div style={styles.categoryNavWrapper}>
      <div style={styles.categoryNav}>
        <div ref={scrollContainerRef} style={styles.categoryNavContainer}>
          {categories.map((category, index) => {
            const isHovered = hoveredId === category.id;

            return (
              <div
                key={category.id}
                style={{
                  ...styles.categoryItem,
                  backgroundColor: isHovered && !isMobile ? '#f5f5f5' : 'transparent',
                  transform: isHovered && !isMobile ? 'translateY(-3px)' : 'translateY(0)',
                  animation: `fadeInUp 0.3s ease forwards`,
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0,
                }}
                onClick={() => handleCategoryClick(category.name)}
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  style={{
                    ...styles.categoryIcon,
                    transform: isHovered && !isMobile ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  <img
                    src={category.icon}
                    alt={category.name}
                    style={styles.categoryIconImg}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div style={styles.defaultIconWrapper}>
                    <DefaultIcon />
                  </div>
                </div>
                <span style={styles.categoryName}>{category.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default CategoryNav;
