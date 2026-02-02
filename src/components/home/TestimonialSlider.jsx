import React, { useState, useEffect, useRef } from 'react';

// VideoItem component with mute toggle
const VideoItem = ({ video, isMobile }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div style={styles.videoItem}>
      <video
        ref={videoRef}
        src={video.path}
        style={styles.video}
        controls={!isMobile}
        autoPlay={isMobile}
        muted={isMuted}
        loop={isMobile}
        playsInline
        onError={() => {
          console.error('Video failed to load:', video.path);
        }}
      />
      {isMobile && (
        <button
          onClick={toggleMute}
          style={styles.muteButton}
          className="mute-toggle-button"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

const TestimonialSlider = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  // Detect mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load video files from the testimonials folder
  useEffect(() => {
    const loadVideoFiles = async () => {
      try {
        // Fetch the list of files from the testimonials folder
        const response = await fetch('/testimonials/manifest.json');
        
        if (!response.ok) {
          throw new Error('manifest.json not found. Please create it in public/testimonials/');
        }
        
        const data = await response.json();
        
        // Process video files
        const processedVideos = data.files.map(filename => ({
          path: `/testimonials/${filename}`,
          filename: filename,
          name: filename.replace(/\.[^/.]+$/, "").replace(/_/g, ' ')
        }));
        
        if (processedVideos.length === 0) {
          setError('No video files found in the testimonials folder.');
        } else {
          setVideos(processedVideos);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading video files:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadVideoFiles();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 300 : 400;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 300 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div style={{...styles.wrapper, padding: isMobile ? '0 8px' : '0 16px'}}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <p style={styles.loadingText}>Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{...styles.wrapper, padding: isMobile ? '0 8px' : '0 16px'}}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <p style={styles.errorText}>{error}</p>
            <p style={styles.errorHint}>
              Please create a <strong>manifest.json</strong> file in the <strong>public/testimonials/</strong> folder with your video files.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div style={{...styles.wrapper, padding: isMobile ? '0 8px' : '0 16px'}}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>No testimonial videos found. Please add videos to the testimonials folder.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{...styles.wrapper, padding: isMobile ? '0 8px' : '0 16px'}}>
      <div style={styles.container}>
        {/* Section Title */}
        <div style={styles.titleSection}>
          <h2 style={styles.title}>Customer Testimonials</h2>
          <p style={styles.subtitle}>Hear what our customers have to say</p>
        </div>

        {/* Horizontal Scrolling Container with Navigation */}
        <div style={styles.scrollWrapper}>
          {/* Left Arrow - Desktop: large, Mobile: small plain */}
          <button
            onClick={scrollLeft}
            style={isMobile ? {...styles.scrollButton, ...styles.scrollButtonLeft, ...styles.mobileScrollButton} : {...styles.scrollButton, ...styles.scrollButtonLeft}}
            className="scroll-nav-button"
            aria-label="Scroll left"
          >
            <svg width={isMobile ? "16" : "24"} height={isMobile ? "16" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Videos Container */}
          <div 
            ref={scrollContainerRef}
            style={styles.videosContainer}
            className="videos-scroll-container"
          >
            {videos.map((video, index) => (
              <VideoItem 
                key={index} 
                video={video} 
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* Right Arrow - Desktop: large, Mobile: small plain */}
          <button
            onClick={scrollRight}
            style={isMobile ? {...styles.scrollButton, ...styles.scrollButtonRight, ...styles.mobileScrollButton} : {...styles.scrollButton, ...styles.scrollButtonRight}}
            className="scroll-nav-button"
            aria-label="Scroll right"
          >
            <svg width={isMobile ? "16" : "24"} height={isMobile ? "16" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .scroll-nav-button:hover {
          background-color: rgba(255, 87, 34, 1) !important;
        }
        
        .scroll-nav-button:active {
          background-color: rgba(255, 87, 34, 0.8) !important;
        }

        @media (max-width: 768px) {
          .scroll-nav-button:hover {
            background-color: rgba(255, 255, 255, 0.9) !important;
          }
          
          .scroll-nav-button:active {
            background-color: rgba(255, 255, 255, 0.9) !important;
          }
        }

        .mute-toggle-button:hover {
          background-color: rgba(0, 0, 0, 0.8) !important;
          transform: scale(1.1) !important;
        }
        
        .mute-toggle-button:active {
          transform: scale(0.95) !important;
        }

        .videos-scroll-container {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .videos-scroll-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  wrapper: {
    width: '100%',
    marginBottom: '32px',
    marginTop: '32px',
  },
  container: {
    width: '100%',
    border: '2px solid #d4d4d4',
    borderRadius: '8px',
    padding: '24px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '24px',
    animation: 'fadeIn 0.6s ease',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  scrollWrapper: {
    position: 'relative',
    width: '100%',
  },
  videosContainer: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
    padding: '8px 0',
  },
  videoItem: {
    flexShrink: 0,
    width: '320px',
    aspectRatio: '9 / 16',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
    border: '2px solid #d4d4d4',
    borderRadius: '8px',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  muteButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    border: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
    backdropFilter: 'blur(4px)',
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 87, 34, 0.9)',
    border: 'none',
    color: '#fff',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 10,
    borderRadius: '50%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  scrollButtonLeft: {
    left: '-8px',
  },
  scrollButtonRight: {
    right: '-8px',
  },
  mobileScrollButton: {
    width: '28px',
    height: '28px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
    color: '#e74c3c',
  },
  loadingContainer: {
    width: '100%',
    height: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    border: '2px solid #d4d4d4',
    margin: '4px',
  },
  loader: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(255, 87, 34, 0.1)',
    borderTopColor: '#ff5722',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#666',
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
    color: '#ff5722',
    fontSize: '16px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    marginBottom: '8px',
    textAlign: 'center',
    padding: '0 20px',
  },
  errorHint: {
    color: '#999',
    fontSize: '14px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    textAlign: 'center',
    padding: '0 20px',
    lineHeight: '1.5',
  }
};

export default TestimonialSlider;