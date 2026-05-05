import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../../data/blogData';

export default function BlogSection() {
  const navigate = useNavigate();
  const preview  = BLOG_POSTS.slice(0, 4);

  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Construction & Design Insights</h2>
            <p className="section-subtitle">Expert advice on building, interiors, and real estate in India</p>
          </div>
          <button className="view-all-btn" onClick={() => navigate('/blogs')}>
            View All Articles <ArrowRight size={18} />
          </button>
        </div>

        <div className="blog-grid">
          {preview.map((post) => (
            <article key={post.id} className="blog-card" onClick={() => navigate(`/blogs/${post.slug}`)}>
              <div className="blog-image-container">
                <img src={post.image} alt={post.title} className="blog-image" />
                <span className="blog-category">{post.category}</span>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="meta-item"><Calendar size={14} />{post.date}</span>
                  <span className="meta-item"><Clock size={14} />{post.readTime}</span>
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-footer">
                  <span className="blog-author">By {post.author}</span>
                  <button className="read-more-btn">Read More <ArrowRight size={16} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-section { padding: 12px 16px; background: #fff; }
        .blog-container { width: 100%; margin: 0 auto; border: 2px solid #d4d4d4; border-radius: 8px; padding: 24px; background: #f8f9fa; box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1); }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; flex-wrap: wrap; gap: 20px; }
        .section-title { font-size: 32px; font-weight: 700; color: #1a1a1a; margin: 0 0 8px 0; }
        .section-subtitle { font-size: 16px; color: #666; margin: 0; }
        .view-all-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: #fff; border: 2px solid #EC1940; color: #EC1940; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; font-family: inherit; font-size: 14px; }
        .view-all-btn:hover { background: #EC1940; color: #fff; transform: translateX(4px); }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .blog-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer; }
        .blog-card:hover { transform: translateY(-8px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .blog-image-container { position: relative; width: 100%; height: 200px; overflow: hidden; }
        .blog-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .blog-card:hover .blog-image { transform: scale(1.08); }
        .blog-category { position: absolute; top: 12px; left: 12px; background: #EC1940; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .blog-content { padding: 20px; }
        .blog-meta { display: flex; gap: 16px; margin-bottom: 12px; }
        .meta-item { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #888; }
        .blog-title { font-size: 17px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .blog-excerpt { font-size: 14px; color: #666; line-height: 1.6; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .blog-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #eee; }
        .blog-author { font-size: 13px; color: #888; }
        .read-more-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: #EC1940; font-weight: 600; font-size: 14px; cursor: pointer; transition: gap 0.3s ease; font-family: inherit; }
        .read-more-btn:hover { gap: 10px; }
        @media (max-width: 768px) { .blog-section { padding: 12px; } .section-header { flex-direction: column; align-items: flex-start; } .section-title { font-size: 24px; } .view-all-btn { width: 100%; justify-content: center; } .blog-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}