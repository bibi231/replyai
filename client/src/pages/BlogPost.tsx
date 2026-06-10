import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Navbar } from '../components/layout/Navbar';
import { useDocTitle } from '../hooks/useDocTitle';
import { getPostBySlug } from '../lib/blog';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useDocTitle(post?.title ?? 'Blog Post', post?.excerpt ?? '');

  useEffect(() => {
    if (!post) return;
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      author: { '@type': 'Person', name: post.author },
      publisher: {
        '@type': 'Organization',
        name: 'ReplyAI',
        logo: { '@type': 'ImageObject', url: 'https://replyai.com.ng/logo.png' },
      },
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://replyai.com.ng/blog/${slug}` },
      image: 'https://replyai.com.ng/og.png',
      keywords: post.tags.join(', '),
    };
    const old = document.getElementById('blog-jsonld');
    if (old) old.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-jsonld';
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [post, slug]);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="home">
      <Navbar />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 80px' }}>
        <Link to="/blog" style={{ color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          ← All posts
        </Link>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              background: 'rgba(var(--accent-rgb), 0.1)',
              padding: '2px 8px',
              borderRadius: 4,
            }}>{tag}</span>
          ))}
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: 1.2, marginBottom: 16 }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 48 }}>
          <span>{post.author}</span>
          <span>·</span>
          <span>{new Date(post.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>

        <div className="rai-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div style={{
          marginTop: 64,
          padding: '32px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
            Save hours on emails and meeting notes
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 24 }}>
            ReplyAI generates professional email replies and structured meeting summaries in seconds.
          </p>
          <Link to="/" style={{
            display: 'inline-block',
            background: 'var(--accent)',
            color: '#000',
            fontWeight: 700,
            padding: '12px 28px',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 15,
          }}>
            Try ReplyAI free →
          </Link>
        </div>

        <div style={{ marginTop: 40 }}>
          <Link to="/blog" style={{ color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none' }}>
            ← Back to all posts
          </Link>
        </div>
      </main>

      <style>{`
        .rai-prose { color: var(--text-secondary); font-size: 16px; line-height: 1.75; }
        .rai-prose h2 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; color: var(--text-primary); margin: 40px 0 12px; }
        .rai-prose h3 { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 18px; color: var(--text-primary); margin: 28px 0 10px; }
        .rai-prose p { margin-bottom: 18px; }
        .rai-prose a { color: var(--accent); }
        .rai-prose strong { color: var(--text-primary); }
        .rai-prose ul, .rai-prose ol { padding-left: 24px; margin-bottom: 18px; }
        .rai-prose li { margin-bottom: 6px; }
        .rai-prose code { background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; font-size: 14px; }
        .rai-prose pre { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px; overflow-x: auto; margin-bottom: 24px; }
        .rai-prose pre code { background: none; padding: 0; }
        .rai-prose table { display: block; overflow-x: auto; width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 15px; }
        .rai-prose th { text-align: left; padding: 10px 14px; background: rgba(255,255,255,0.06); color: var(--text-primary); font-weight: 600; }
        .rai-prose td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .rai-prose blockquote { border-left: 3px solid var(--accent); padding-left: 16px; margin: 0 0 18px; color: var(--text-secondary); font-style: italic; }
        @media (max-width: 640px) {
          .rai-prose { font-size: 15px; }
          .rai-prose h2 { font-size: 19px; }
          .rai-prose h3 { font-size: 16px; }
          .rai-prose table { font-size: 13px; }
          .rai-prose th, .rai-prose td { padding: 8px 10px; }
        }
      `}</style>
    </div>
  );
}
