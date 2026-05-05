import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag } from 'lucide-react';


import { BLOG_POSTS } from '../data/blogData';

// Simple markdown-like renderer for the content
function RenderContent({ content }) {
  const lines = content.trim().split('\n');
  const elements = [];
  let i = 0;
  let tableBuffer = [];
  let inTable = false;

  const flushTable = () => {
    if (tableBuffer.length < 2) { tableBuffer = []; inTable = false; return; }
    const headers = tableBuffer[0].split('|').map(h => h.trim()).filter(Boolean);
    const rows    = tableBuffer.slice(2).map(r => r.split('|').map(c => c.trim()).filter(Boolean));
    elements.push(
      <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '24px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#fef2f2' }}>
              {headers.map((h, hi) => (
                <th key={hi} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#111827', border: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#f9fafb' }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: '9px 14px', border: '1px solid #e5e7eb', color: '#374151', lineHeight: 1.5 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = []; inTable = false;
  };

  while (i < lines.length) {
    const line = lines[i];

    // Table detection
    if (line.trim().startsWith('|')) {
      inTable = true;
      tableBuffer.push(line.trim());
      i++;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Checkbox list
    if (line.trim().startsWith('- [ ]')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- [ ]')) {
        items.push(lines[i].trim().slice(5).trim());
        i++;
      }
      elements.push(
        <ul key={`check-${i}`} style={{ listStyle: 'none', padding: 0, margin: '12px 0' }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', fontSize: 15, color: '#374151', lineHeight: 1.6 }}>
              <span style={{ width: 18, height: 18, border: '2px solid #d1d5db', borderRadius: 4, flexShrink: 0, marginTop: 2, display: 'block' }} />
              {item}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '36px 0 16px', borderBottom: '2px solid #EC1940', paddingBottom: 10 }}>{line.slice(3)}</h2>);
      i++; continue;
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', margin: '28px 0 12px' }}>{line.slice(4)}</h3>);
      i++; continue;
    }

    // H4
    if (line.startsWith('#### ')) {
      elements.push(<h4 key={i} style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '20px 0 8px' }}>{line.slice(5)}</h4>);
      i++; continue;
    }

    // Bullet list
    if (line.trim().startsWith('- ') && !line.trim().startsWith('- [ ]')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ') && !lines[i].trim().startsWith('- [ ]')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: '12px 0 20px', paddingLeft: 24 }}>
          {items.map((item, idx) => {
            const parts = item.split(/\*\*(.*?)\*\*/g);
            return (
              <li key={idx} style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, marginBottom: 6 }}>
                {parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi}>{p}</strong> : p)}
              </li>
            );
          })}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line.trim())) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ margin: '12px 0 20px', paddingLeft: 24 }}>
          {items.map((item, idx) => {
            const parts = item.split(/\*\*(.*?)\*\*/g);
            return (
              <li key={idx} style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, marginBottom: 6 }}>
                {parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi}>{p}</strong> : p)}
              </li>
            );
          })}
        </ol>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) { i++; continue; }

    // Paragraph with bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    elements.push(
      <p key={i} style={{ fontSize: 15.5, color: '#374151', lineHeight: 1.85, margin: '0 0 16px' }}>
        {parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi} style={{ color: '#111827' }}>{p}</strong> : p)}
      </p>
    );
    i++;
  }

  if (inTable) flushTable();
  return <>{elements}</>;
}

export default function BlogPost() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const post       = BLOG_POSTS.find(p => p.slug === slug);
  const others     = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

  if (!post) return (
    <>
      
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 48 }}>📄</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Article not found</div>
        <button onClick={() => navigate('/blogs')} style={{ padding: '10px 24px', background: '#EC1940', color: '#fff', border: 'none', borderRadius: 25, cursor: 'pointer', fontWeight: 600 }}>
          ← Back to Blogs
        </button>
      </div>
      
    </>
  );

  const currentIndex = BLOG_POSTS.findIndex(p => p.slug === slug);
  const prev = BLOG_POSTS[currentIndex - 1];
  const next = BLOG_POSTS[currentIndex + 1];

  return (
    <>
      
      <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'inherit' }}>

        {/* ── Hero ──────────────────────────────────────────── */}
        <div style={{ position: 'relative', height: 'clamp(280px, 45vw, 480px)', overflow: 'hidden' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(20px, 4vw, 48px)' }}>
            <button
              onClick={() => navigate('/blogs')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 16, backdropFilter: 'blur(8px)', fontFamily: 'inherit' }}
            >
              <ArrowLeft size={14} /> All Articles
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ background: '#EC1940', color: '#fff', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{post.category}</span>
              {post.tags.slice(1).map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, backdropFilter: 'blur(4px)' }}>{tag}</span>
              ))}
            </div>
            <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(22px, 4vw, 38px)', fontWeight: 900, color: '#fff', lineHeight: 1.25, maxWidth: 760 }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#EC1940,#F89C1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>
                  {post.author[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{post.author}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{post.authorRole}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                <Calendar size={13} /> {post.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                <Clock size={13} /> {post.readTime}
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr min(680px, 100%) 1fr', gap: 0 }}>
          <div /> {/* Left spacer */}
          <div>
            {/* Article body */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(24px, 4vw, 48px)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginBottom: 32 }}>
              <p style={{ fontSize: 17, color: '#4b5563', lineHeight: 1.85, margin: '0 0 28px', fontStyle: 'italic', borderLeft: '4px solid #EC1940', paddingLeft: 16 }}>
                {post.excerpt}
              </p>
              <RenderContent content={post.content} />
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
              <Tag size={14} style={{ color: '#9ca3af' }} />
              {post.tags.map(tag => (
                <span key={tag} style={{ background: '#f3f4f6', color: '#374151', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{tag}</span>
              ))}
            </div>

            {/* Prev / Next navigation */}
            <div style={{ display: 'grid', gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr', gap: 16, marginBottom: 48 }}>
              {prev && (
                <button
                  onClick={() => navigate(`/blogs/${prev.slug}`)}
                  style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 20px', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#EC1940'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><ArrowLeft size={12} /> Previous</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.4 }}>{prev.title}</span>
                </button>
              )}
              {next && (
                <button
                  onClick={() => navigate(`/blogs/${next.slug}`)}
                  style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '16px 20px', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit', transition: 'border-color 0.15s', marginLeft: prev ? 'auto' : 0, width: '100%' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#EC1940'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>Next <ArrowRight size={12} /></span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.4 }}>{next.title}</span>
                </button>
              )}
            </div>

            {/* More articles */}
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 20px' }}>More Articles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {others.map(other => (
                  <div
                    key={other.id}
                    onClick={() => { navigate(`/blogs/${other.slug}`); window.scrollTo(0,0); }}
                    style={{ display: 'flex', gap: 14, background: '#fff', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: '1px solid #f0f0f0', transition: 'box-shadow 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <img src={other.image} alt={other.title} style={{ width: 100, height: 80, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ padding: '12px 14px 12px 0', flex: 1 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#EC1940', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{other.category}</span>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.4, marginTop: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {other.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>{other.readTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div /> {/* Right spacer */}
        </div>
      </div>
      
    </>
  );
}