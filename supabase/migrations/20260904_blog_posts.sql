-- ========================================================================
-- QMD-Tech Database Migration: Technology Blog Posts & Hardware Insights
-- ========================================================================

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title_vi VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    excerpt_vi TEXT NOT NULL,
    excerpt_en TEXT,
    content_html_vi TEXT NOT NULL,
    content_html_en TEXT,
    cover_image TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL DEFAULT 'QMD Hardware Team',
    category VARCHAR(100) NOT NULL DEFAULT 'Kiến Thức Phần Cứng',
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE,
    reading_time_mins INT DEFAULT 5,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 1. Allow public read on published articles
CREATE POLICY "Allow public read on published blog posts"
    ON blog_posts FOR SELECT
    USING (is_published = true);

-- 2. Allow all operations for service role (Admin backend)
CREATE POLICY "Allow all on blog_posts for service role"
    ON blog_posts FOR ALL
    USING (true);
