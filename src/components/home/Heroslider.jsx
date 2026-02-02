import React, { useState, useEffect, useRef, useCallback } from 'react';

const HeroSlider = () => {
  const [media, setMedia] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  // Detect mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-detect media files from the hero-media folder
  useEffect(() => {
    const loadMediaFiles = async () => {
      try {
        // Fetch the list of files from the hero-media folder
        // This requires a manifest.json file in the public/hero-media folder
        const response = await fetch('/hero-media/manifest.json');
        
        if (!response.ok) {
          throw new Error('manifest.json not found. Please create it in public/hero-media/');
        }
        
        const data = await response.json();
        
        // Process files and auto-detect type based on extension
        const processedMedia = data.files.map(filename => {
          const extension = filename.split('.').pop().toLowerCase();
          
          // Detect if it's a video or image based on extension
          const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
          const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
          
          let type = 'unknown';
          if (videoExtensions.includes(extension)) {
            type = 'video';
          } else if (imageExtensions.includes(extension)) {
            type = 'image';
          }
          
          return {
            path: `/hero-media/${filename}`,
            type: type,
            filename: filename
          };
        });
        
        // Filter out any unknown types
        const validMedia = processedMedia.filter(item => item.type !== 'unknown');
        
        if (validMedia.length === 0) {
          setError('No valid media files found in the hero-media folder.');
        } else {
          setMedia(validMedia);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading media files:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadMediaFiles();
  }, []);

  const goToNext = useCallback(() => {
    if (media.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length);
      setIsTransitioning(false);
    }, 500);
  }, [media.length]);

  const goToPrevious = useCallback(() => {
    if (media.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
      setIsTransitioning(false);
    }, 500);
  }, [media.length]);

  const goToSlide = useCallback((index) => {
    if (index === currentIndex || media.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 500);
  }, [currentIndex, media.length]);

  useEffect(() => {
    if (media.length === 0) return;

    const currentMedia = media[currentIndex];
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (currentMedia.type === 'image') {
      // For images, auto-advance after 2 seconds
      timerRef.current = setTimeout(() => {
        goToNext();
      }, 2000);
    } else if (currentMedia.type === 'video') {
      // Store videoRef.current in a variable for cleanup
      const videoElement = videoRef.current;
      
      if (videoElement) {
        // For videos, advance when video ends
        const handleVideoEnd = () => {
          goToNext();
        };
        
        const handleVideoError = () => {
          console.error('Video error:', currentMedia.path);
          // If video fails to load, skip to next after 1 second
          setTimeout(() => {
            goToNext();
          }, 1000);
        };
        
        videoElement.addEventListener('ended', handleVideoEnd);
        videoElement.addEventListener('error', handleVideoError);
        
        // Auto-play the video
        videoElement.play().catch(() => {
          // If autoplay fails, try playing muted
          videoElement.muted = true;
          videoElement.play().catch(() => {
            console.error('Muted play also failed:', currentMedia.path);
          });
        });
        
        return () => {
          if (videoElement) {
            videoElement.removeEventListener('ended', handleVideoEnd);
            videoElement.removeEventListener('error', handleVideoError);
          }
        };
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, media, goToNext]);

  if (loading) {
    return (
      <div style={{...styles.sliderWrapper, padding: isMobile ? '0 8px' : '0 16px'}}>
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Loading media...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{...styles.sliderWrapper, padding: isMobile ? '0 8px' : '0 16px'}}>
        <div style={styles.loadingContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>{error}</p>
          <p style={styles.errorHint}>
            Please create a <strong>manifest.json</strong> file in the <strong>public/hero-media/</strong> folder.
          </p>
        </div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div style={{...styles.sliderWrapper, padding: isMobile ? '0 8px' : '0 16px'}}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>No media files found. Please add images or videos to the hero-media folder.</p>
        </div>
      </div>
    );
  }

  const currentMedia = media[currentIndex];

  return (
    <div style={{...styles.sliderWrapper, padding: isMobile ? '0 8px' : '0 16px'}}>
      <div style={styles.sliderContainer}>
        <div style={styles.sliderInner}>
          {/* Media Display */}
          <div style={{
            ...styles.mediaContainer,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'scale(1.05)' : 'scale(1)'
          }}>
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.path}
                alt={currentMedia.filename}
                style={styles.media}
                onError={() => {
                  console.error('Image failed to load:', currentMedia.path);
                }}
              />
            ) : (
              <video
                ref={videoRef}
                src={currentMedia.path}
                style={styles.media}
                muted
                playsInline
                onError={() => {
                  console.error('Video failed to load:', currentMedia.path);
                }}
              />
            )}
            
            {/* Gradient Overlay */}
            <div style={styles.gradientOverlay}></div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            style={{...styles.navButton, ...styles.prevButton}}
            className="nav-button"
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            style={{...styles.navButton, ...styles.nextButton}}
            className="nav-button"
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Dots Indicator */}
          <div style={styles.dotsContainer}>
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="dot-button"
                style={{
                  ...styles.dot,
                  backgroundColor: index === currentIndex ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                  width: index === currentIndex ? '32px' : '8px'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Media Counter */}
          <div style={styles.counter}>
            {currentIndex + 1} / {media.length}
          </div>

          {/* Media Type Indicator */}
          <div style={styles.typeIndicator}>
            {currentMedia.type === 'video' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .nav-button:hover {
         background-color: transparent !important;
         transform: translateY(-50%) scale(1.2) !important;
        }
        
        .nav-button:active {
          transform: translateY(-50%) scale(0.95) !important;
        }

        .dot-button:hover {
          background-color: rgba(255, 255, 255, 0.6) !important;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  sliderWrapper: {
    width: '100%',
    marginBottom: '12px',
  },
  sliderContainer: {
    width: '100%',
    height: '300px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
    border: '1px solid #d4d4d4', // More visible border matching CategoryNav
    borderRadius: '4px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Stronger shadow matching CategoryNav
  },
  sliderInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    pointerEvents: 'none',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
  },
  prevButton: {
    left: '16px',
  },
  nextButton: {
    right: '16px',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
  },
  dot: {
    height: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: 0,
  },
  counter: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: "'Inter', -apple-system, sans-serif",
    zIndex: 10,
  },
  typeIndicator: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#fff',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: '36px',
    height: '36px',
  },
  loadingContainer: {
    width: '100%',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: '4px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
  },
  loader: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#fff',
    marginTop: '16px',
    fontSize: '16px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    textAlign: 'center',
    padding: '0 20px',
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '16px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    marginBottom: '8px',
    textAlign: 'center',
    padding: '0 20px',
  },
  errorHint: {
    color: '#aaa',
    fontSize: '14px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    textAlign: 'center',
    padding: '0 20px',
    lineHeight: '1.5',
  }
};

export default HeroSlider;