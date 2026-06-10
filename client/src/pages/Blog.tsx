import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useDocTitle } from '../hooks/useDocTitle';
import { getAllPosts } from '../lib/blog';

export function Blog() {
  useDocTitle('Blog', 'Articles on AI communication, email productivity, and meeting management for Nigerian professionals.');
  const posts = getAllPosts();

  return (
    <div className="home">
      <Navbar />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '120px 24px 80px' }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, marginBottom: 8 }}>Blog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 48 }}>
          Guides on AI communication, email productivity, and meeting management.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {posts.map(post => (
            <article key={post.slug} style={{
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: 32,
            }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
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
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
                <Link to={`/blog/${post.slug}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>{new Date(post.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
