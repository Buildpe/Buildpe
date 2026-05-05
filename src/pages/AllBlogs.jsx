import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Search, ArrowRight } from 'lucide-react';


import { BLOG_POSTS, CATEGORIES_LIST } from '../data/blogData';

export default function AllBlogs() {
  const navigate          = useNavigate();
  const [search,  setSearch]  = useState('');
  const [category, setCategory] = useState('All');

  const filtered = BLOG_POSTS.filter(post => {
    const matchCat    = category === 'All' || post.category === category;
    const matchSearch = !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = BLOG_POSTS.find(p => p.featured);

  return (
    <>
      
      <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'inherit' }}>

        {/* ── Hero ──────────────────────────────────────────── */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', padding: '60px 20px 50px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(236,25,64,0.15)', border: '1px solid rgba(236,25,64,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: 13, color: '#EC1940', fontWeight: 600, marginBottom: 16 }}>
            BuildPe Knowledge Hub
          </div>
          <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            Construction & Interior Insights
          </h1>
          <p style={{ margin: '0 auto 32px', fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 520, lineHeight: 1.7 }}>
            Expert guides, cost breakdowns, and practical advice from India's top construction and design professionals.
          </p>

          {/* Search */}
          <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles, topics, categories..."
              style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: 12, border: 'none', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
            />
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>

          {/* ── Featured Post ──────────────────────────────── */}
          {!search && category === 'All' && featured && (
            <div
              onClick={() => navigate(`/blogs/${featured.slug}`)}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', marginBottom: 48, cursor: 'pointer', border: '1px solid #f0f0f0', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.10)'}
            >
              <div style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
                <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)' }} />
                <span style={{ position: 'absolute', top: 16, left: 16, background: '#EC1940', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  ⭐ Featured
                </span>
              </div>
              <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ display: 'inline-block', background: '#fef2f2', color: '#EC1940', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 14, width: 'fit-content' }}>
                  {featured.category}
                </span>
                <h2 style={{ margin: '0 0 14px', fontSize: 24, fontWeight: 800, color: '#111827', lineHeight: 1.35 }}>
                  {featured.title}
                </h2>
                <p style={{ margin: '0 0 24px', fontSize: 15, color: '#6b7280', lineHeight: 1.7 }}>
                  {featured.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9ca3af' }}>
                    <Calendar size={14} /> {featured.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9ca3af' }}>
                    <Clock size={14} /> {featured.readTime}
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: '#EC1940', fontWeight: 700, fontSize: 14 }}>
                    Read Article <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Category Filter ────────────────────────────── */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            {CATEGORIES_LIST.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 25, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', border: '2px solid',
                  borderColor: category === cat ? '#EC1940' : '#e5e7eb',
                  background: category === cat ? '#EC1940' : '#fff',
                  color: category === cat ? '#fff' : '#374151',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9ca3af', alignSelf: 'center' }}>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* ── Grid ──────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9ca3af' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 8 }}>No articles found</div>
              <div style={{ fontSize: 14 }}>Try a different search term or category</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
              {filtered.map(post => (
                <article
                  key={post.id}
                  onClick={() => navigate(`/blogs/${post.slug}`)}
                  style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', cursor: 'pointer', border: '1px solid #f0f0f0', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
                >
                  <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                    <span style={{ position: 'absolute', top: 12, left: 12, background: '#EC1940', color: '#fff', padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                      {post.category}
                    </span>
                  </div>
                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9ca3af' }}><Calendar size={12} />{post.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9ca3af' }}><Clock size={12} />{post.readTime}</span>
                    </div>
                    <h3 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.title}
                    </h3>
                    <p style={{ margin: '0 0 18px', fontSize: 13.5, color: '#6b7280', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>By {post.author}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#EC1940', fontWeight: 700, fontSize: 13 }}>
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </>
  );
}