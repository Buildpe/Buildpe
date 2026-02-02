import { useState, useEffect } from 'react';
import { Menu, X, Search, Phone, Mail, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import useSearch from '../../hooks/useSearch';
import SearchDropdown from './Searchdropdown';
import servicesData from '../../../public/services/servicesData.json';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeIconIndex, setActiveIconIndex] = useState(0);

  // Use the search hook
  const {
    searchQuery,
    isDropdownOpen,
    selectedIndex,
    searchResults,
    handleSearchChange,
    handleKeyDown,
    handleItemSelect,
    navigateToCategory,
    navigateToService,
    handleViewAllResults,
    setIsDropdownOpen
  } = useSearch(servicesData);

  // Construction/Interior Design notifications
  const notifications = [
    '🏗️ 500+ Projects Completed',
    '✨ Award Winning Designs',
    '⚡ 48 Hour Quick Response',
    '🎨 Premium Interior Solutions',
    '🏠 Your Dream Home Awaits',
    '💡 Free Design Consultation',
    '⭐ 4.8★ Customer Rating',
    '🔧 Expert Craftmanship'
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-cycle social icons effect
  useEffect(() => {
    const iconCycleInterval = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(iconCycleInterval);
  }, []);

  // Typing animation
  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenWords = 2500;

    const currentNotification = notifications[greetingIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentNotification.length) {
          setDisplayText(currentNotification.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setGreetingIndex((prev) => (prev + 1) % notifications.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, greetingIndex]);

  const closeMenu = () => setIsOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleViewAllResults();
    }
  };

  return (
    <>
      <style>{`
        /* CSS Reset for Header Component - Prevent External Interference */
        .header-wrapper, 
        .header-wrapper *,
        .header-wrapper *::before,
        .header-wrapper *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .header-wrapper {
          all: unset;
          display: block;
          background-color: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: sticky !important;
          top: 0 !important;
          z-index: 9999 !important;
          isolation: isolate;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          width: 100%;
          left: 0;
          right: 0;
        }

        /* Root Variables */
        :root {
          --primary-gradient: linear-gradient(135deg, #EC1940 0%, #F89C1C 100%);
          --header-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          --header-shadow-scrolled: 0 8px 30px rgba(0, 0, 0, 0.12);
          --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Header Transitions */
        .header-wrapper {
          transition: var(--transition-smooth);
        }

        .header-wrapper.scrolled {
          box-shadow: var(--header-shadow-scrolled);
        }

        .header-wrapper.scrolled .main-header-mobile {
          padding: 0.75rem 0;
        }

        /* Simple Top Bar */
        .simple-top-bar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.5rem 0;
          font-size: 0.875rem;
        }

        .simple-top-bar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1.5rem;
        }

        .top-bar-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #374151;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s ease;
        }

        .top-bar-item:hover {
          color: #EC1940;
        }

        .top-bar-item svg {
          width: 16px;
          height: 16px;
        }

        .top-bar-social {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-left: 1rem;
          border-left: 1px solid #e5e7eb;
        }

        .top-bar-social-icon {
          color: #6b7280;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border-radius: 4px;
          position: relative;
        }

        .top-bar-social-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--primary-gradient);
          border-radius: 4px;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .top-bar-social-icon svg {
          position: relative;
          z-index: 1;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .top-bar-social-icon:hover,
        .top-bar-social-icon.active {
          color: #ffffff;
          transform: translateY(-2px);
        }

        .top-bar-social-icon:hover::before,
        .top-bar-social-icon.active::before {
          opacity: 1;
          transform: scale(1);
        }

        .top-bar-social-icon:hover svg,
        .top-bar-social-icon.active svg {
          color: #ffffff;
        }

        .top-bar-social-icon.active {
          animation: iconBounce 0.5s ease-in-out;
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateY(-2px); }
          50% { transform: translateY(-4px); }
        }

        /* Logo Animation */
        .logo-link {
          position: relative;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          text-decoration: none;
          cursor: pointer;
        }

        .logo-link:hover .logo-img {
          transform: scale(1.05) rotate(-2deg);
        }

        .logo-img {
          transition: var(--transition-smooth);
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
        }

        /* Brand Text Gradient Animation */
        .brand-text {
          font-family: 'Segoe UI', 'Arial', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -1px;
          margin-left: 16px;
          text-transform: uppercase;
          position: relative;
          transition: var(--transition-smooth);
        }

        .logo-link:hover .brand-text {
          letter-spacing: 0px;
        }

        /* Navigation Links Enhanced */
        .nav-link {
          position: relative;
          padding: 0.5rem 0;
          transition: var(--transition-smooth);
          text-decoration: none;
          color: #374151;
          font-weight: 500;
          font-size: 1rem;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
          background: var(--primary-gradient);
          border-radius: 3px 3px 0 0;
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: #EC1940 !important;
        }

        .nav-link:hover::before {
          width: 100%;
        }

        /* Search Bar Enhanced */
        .search-input {
          transition: transform 0.2s ease;
          border: 2px solid #e9ecef;
          width: 100%;
          padding: 0.7rem 3.5rem 0.7rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          outline: none;
          background-color: #ffffff;
        }

        .search-input:focus {
          border-color: #EC1940;
          box-shadow: 0 0 0 3px rgba(236, 25, 64, 0.1);
        }

        .search-input:hover {
          transform: scale(1.01);
        }

        .search-button {
          background: var(--primary-gradient) !important;
          border: none !important;
          transition: transform 0.2s ease;
          position: absolute;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          right: 2px;
          top: 50%;
          transform: translateY(-50%);
          box-shadow: 0 0 0 3px #ffffff;
        }

        .search-button:hover {
          transform: translateY(-50%) scale(1.05);
        }

        .search-button svg {
          color: white !important;
          position: relative;
          z-index: 1;
        }

        /* Typing Notification Enhanced */
        .typing-notification {
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          background: linear-gradient(135deg, #FFF5E6 0%, #FFE8CC 100%);
          padding: 8px 16px;
          border-radius: 25px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(248, 156, 28, 0.2);
          border: 2px solid rgba(248, 156, 28, 0.3);
          min-height: 36px;
          position: relative;
          overflow: hidden;
        }

        .typing-notification::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .notification-text {
          color: #323031;
          letter-spacing: 0.3px;
          position: relative;
          z-index: 1;
        }

        .cursor-blink {
          display: inline-block;
          width: 2px;
          height: 16px;
          background: var(--primary-gradient);
          margin-left: 2px;
          animation: blink 0.8s infinite;
          border-radius: 1px;
          box-shadow: 0 0 5px rgba(236, 25, 64, 0.5);
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Dropdown animation */
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Menu Enhanced */
        .mobile-menu {
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          animation: slideDown 0.3s ease-out;
          box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-link {
          position: relative;
          transition: var(--transition-smooth);
          text-decoration: none;
          color: #374151;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
        }

        .mobile-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 70%;
          background: var(--primary-gradient);
          border-radius: 0 4px 4px 0;
          transition: width 0.3s ease;
        }

        .mobile-link:hover {
          background-color: rgba(236, 25, 64, 0.05) !important;
          padding-left: 1.5rem !important;
          color: #EC1940 !important;
        }

        .mobile-link:hover::before {
          width: 4px;
        }

        /* Menu Button Animation */
        .mobile-menu-btn {
          transition: var(--transition-smooth);
          border-radius: 8px;
          padding: 0.5rem !important;
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #374151;
        }

        .mobile-menu-btn:hover {
          background-color: rgba(236, 25, 64, 0.1);
          transform: scale(1.05);
        }

        .mobile-menu-btn:active {
          transform: scale(0.95);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .logo-img {
            height: 40px !important;
          }
          .desktop-search {
            display: none !important;
          }
          .mobile-search {
            display: flex !important;
          }
          .mobile-greeting {
            display: flex !important;
            flex: 1;
            justify-content: center;
            align-items: center;
          }
          .brand-text {
            display: none !important;
          }
          .main-header-mobile {
            background: linear-gradient(180deg, #ffffff 0%, #fefefe 100%);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          }
          .typing-notification {
            font-size: 0.75rem;
            padding: 6px 12px;
          }

          /* Mobile Top Bar - Adjusted */
          .simple-top-bar {
            padding: 0.4rem 0;
          }

          .simple-top-bar-container {
            justify-content: space-between;
            gap: 1rem;
            font-size: 0.8rem;
          }

          /* Hide email on mobile */
          .top-bar-item.top-bar-email {
            display: none;
          }

          /* Phone number - show full number on right */
          .top-bar-item.top-bar-phone {
            order: 2;
          }

          .top-bar-item.top-bar-phone span {
            display: inline;
          }

          .top-bar-item svg {
            width: 16px;
            height: 16px;
          }

          /* Social icons - move to left */
          .top-bar-social {
            order: 1;
            padding-left: 0;
            border-left: none;
            padding-right: 0.75rem;
            border-right: 1px solid #e5e7eb;
          }

          .top-bar-social-icon svg {
            width: 16px;
            height: 16px;
          }

          /* Mobile search input styles */
          .mobile-search .search-input {
            padding: 0.7rem 3.5rem 0.7rem 1rem;
          }

          .mobile-search .search-button {
            position: absolute;
            right: 2px;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 0 3px #ffffff;
          }

          .mobile-search .search-button:hover {
            transform: translateY(-50%) scale(1.05);
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-search {
            display: none !important;
          }
          .mobile-greeting {
            display: none !important;
          }
        }

        /* Loading Animation */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .header-wrapper {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>

      <header className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        {/* Simple Top Bar */}
        <div className="simple-top-bar">
          <div className="simple-top-bar-container">
            {/* Phone */}
            <a href="tel:+9676368455" className="top-bar-item top-bar-phone">
              <Phone />
              <span>+91-9676368455</span>
            </a>
            
            {/* Email */}
            <a href="mailto:rohit@eternaleveryday@gmail.com" className="top-bar-item top-bar-email">
              <Mail />
              <span>rohit@eternaleveryday@gmail.com</span>
            </a>

            {/* Social Icons */}
            <div className="top-bar-social">
              <a 
                href="https://www.instagram.com/buildpe.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`top-bar-social-icon ${activeIconIndex === 0 ? 'active' : ''}`}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.facebook.com/ToSky.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`top-bar-social-icon ${activeIconIndex === 1 ? 'active' : ''}`}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`top-bar-social-icon ${activeIconIndex === 2 ? 'active' : ''}`}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/company/buildpe-constructions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`top-bar-social-icon ${activeIconIndex === 3 ? 'active' : ''}`}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div style={mainHeaderStyle} className="main-header-mobile">
          <div className="container" style={containerStyle}>
            
            {/* Logo with Brand Name */}
            <a href="/" className="logo-link" onClick={closeMenu}>
              <img 
                src="images/buildpe-logo.png" 
                alt="BuildPe Logo" 
                style={logoImageStyle}
                className="logo-img"
              />
              <span className="brand-text">BuildPe</span>
            </a>

            {/* Mobile Notification Badge */}
            <div className="mobile-greeting" style={mobileGreetingStyle}>
              <div className="typing-notification">
                <span className="notification-text">{displayText}</span>
                <span className="cursor-blink"></span>
              </div>
            </div>
            
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="desktop-search" style={desktopSearchStyle}>
              <div 
                style={searchContainerStyle}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  placeholder="Search services, categories..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery && setIsDropdownOpen(true)}
                  className="search-input"
                />
                <button type="submit" style={searchButtonStyle} className="search-button" aria-label="Search">
                  <Search size={18} />
                </button>

                {/* Search Dropdown for Desktop */}
                {isDropdownOpen && (
                  <SearchDropdown
                    searchResults={searchResults}
                    selectedIndex={selectedIndex}
                    onItemSelect={handleItemSelect}
                    onCategoryClick={navigateToCategory}
                    onServiceClick={navigateToService}
                    onViewAll={handleViewAllResults}
                    searchQuery={searchQuery}
                  />
                )}
              </div>
            </form>
            
            {/* Desktop Navigation */}
            <nav className="desktop-nav" style={navStyle}>
              <a href="/" className="nav-link">Home</a>
              <a href="/services" className="nav-link">Services</a>
              <a href="/about" className="nav-link">About</a>
              <a href="/contact" className="nav-link">Contact</a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mobile-search" style={mobileSearchContainerStyle}>
          <div 
            style={mobileSearchWrapperStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Search services, categories..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery && setIsDropdownOpen(true)}
              className="search-input"
            />
            <button type="submit" style={mobileSearchButtonStyle} className="search-button" aria-label="Search">
              <Search size={20} />
            </button>

            {/* Search Dropdown for Mobile */}
            {isDropdownOpen && (
              <SearchDropdown
                searchResults={searchResults}
                selectedIndex={selectedIndex}
                onItemSelect={handleItemSelect}
                onCategoryClick={navigateToCategory}
                onServiceClick={navigateToService}
                onViewAll={handleViewAllResults}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </form>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="mobile-menu">
            <a href="/" className="mobile-link" onClick={closeMenu}>Home</a>
            <a href="/services" className="mobile-link" onClick={closeMenu}>Services</a>
            <a href="/about" className="mobile-link" onClick={closeMenu}>About</a>
            <a href="/contact" className="mobile-link" onClick={closeMenu}>Contact</a>
          </div>
        )}
      </header>
    </>
  );
}

// Inline Styles
const desktopSearchStyle = {
  width: '450px',
  flexShrink: 0,
  margin: '0 2rem'
};

const searchContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%'
};

const searchButtonStyle = {
  // Position styles in CSS
};

const mobileGreetingStyle = {
  display: 'none',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 8px'
};

const mobileSearchContainerStyle = {
  display: 'none',
  backgroundColor: '#ffffff',
  padding: '0.75rem 1rem 1rem 1rem',
  borderTop: '1px solid rgba(236, 25, 64, 0.1)'
};

const mobileSearchWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%'
};

const mobileSearchButtonStyle = {
  // Position and styling in CSS
};

const mainHeaderStyle = {
  padding: '1rem 0',
  transition: 'padding 0.3s ease',
  backgroundColor: '#ffffff',
  display: 'block',
  position: 'relative',
  zIndex: 9999,
  width: '100%'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  boxSizing: 'border-box'
};

const logoImageStyle = {
  height: '50px',
  width: 'auto',
  display: 'block'
};

const navStyle = {
  display: 'flex',
  gap: '2rem'
};