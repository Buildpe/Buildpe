import { Calendar, ArrowRight, Clock } from 'lucide-react';

export default function BlogSection() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Modern Living Room Design Ideas for 2026",
      excerpt: "Transform your living space with these contemporary design trends that blend functionality with aesthetics.",
      image: "/api/placeholder/400/250",
      category: "Living Room",
      date: "Jan 25, 2026",
      readTime: "5 min read",
      author: "Design Team"
    },
    {
      id: 2,
      title: "Modular Kitchen: Complete Planning Guide",
      excerpt: "Everything you need to know about planning the perfect modular kitchen for your home.",
      image: "/api/placeholder/400/250",
      category: "Kitchen",
      date: "Jan 20, 2026",
      readTime: "7 min read",
      author: "Interior Experts"
    },
    {
      id: 3,
      title: "Space-Saving Bedroom Interior Ideas",
      excerpt: "Maximize your bedroom space with smart storage solutions and clever design techniques.",
      image: "/api/placeholder/400/250",
      category: "Bedroom",
      date: "Jan 15, 2026",
      readTime: "4 min read",
      author: "Design Team"
    },
    {
      id: 4,
      title: "Choosing the Right Color Palette for Your Home",
      excerpt: "Learn how to select colors that create harmony and reflect your personality.",
      image: "/api/placeholder/400/250",
      category: "Tips & Tricks",
      date: "Jan 10, 2026",
      readTime: "6 min read",
      author: "Color Specialists"
    }
  ];

  return (
    <section className="blog-section">
      <div className="blog-container">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <h2 className="section-title">Interior Design Tips & Trends</h2>
            <p className="section-subtitle">
              Expert advice and inspiration for your dream home
            </p>
          </div>
          <button className="view-all-btn">
            View All Articles
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              {/* Image Container */}
              <div className="blog-image-container">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="blog-image"
                />
                <span className="blog-category">{post.category}</span>
              </div>

              {/* Content */}
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="meta-item">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                  <span className="meta-item">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>

                <div className="blog-footer">
                  <span className="blog-author">By {post.author}</span>
                  <button className="read-more-btn">
                    Read More
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-section {
          padding: 12px 16px;
          background: #fff;
        }

        .blog-container {
          width: 100%;
          margin: 0 auto;
          border: 2px solid #d4d4d4;
          border-radius: 8px;
          padding: 24px;
          background: #f8f9fa;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .section-subtitle {
          font-size: 16px;
          color: #666;
          margin: 0;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #fff;
          border: 2px solid #e74c3c;
          color: #e74c3c;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          background: #e74c3c;
          color: #fff;
          transform: translateX(4px);
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .blog-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .blog-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .blog-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .blog-card:hover .blog-image {
          transform: scale(1.1);
        }

        .blog-category {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #e74c3c;
          color: #fff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .blog-content {
          padding: 20px;
        }

        .blog-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #888;
        }

        .blog-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-excerpt {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 16px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #eee;
        }

        .blog-author {
          font-size: 13px;
          color: #888;
        }

        .read-more-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #e74c3c;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: gap 0.3s ease;
        }

        .read-more-btn:hover {
          gap: 10px;
        }

        @media (max-width: 768px) {
          .blog-section {
            padding: 12px 12px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .section-title {
            font-size: 24px;
          }

          .view-all-btn {
            width: 100%;
            justify-content: center;
          }

          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}