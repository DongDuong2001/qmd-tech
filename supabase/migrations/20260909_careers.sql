-- ========================================================================
-- QMD-Tech Database Migration: Careers & Job Openings Management
-- ========================================================================

CREATE TABLE IF NOT EXISTS careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL DEFAULT 'Hà Nội',
    employment_type VARCHAR(50) NOT NULL DEFAULT 'Toàn thời gian',
    salary VARCHAR(100) NOT NULL,
    experience VARCHAR(100) DEFAULT '1 năm kinh nghiệm',
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    benefits TEXT,
    contact_email VARCHAR(100) NOT NULL DEFAULT 'tuyendung@qmdtech.vn',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);
CREATE INDEX IF NOT EXISTS idx_careers_department ON careers(department);
CREATE INDEX IF NOT EXISTS idx_careers_active ON careers(is_active);
CREATE INDEX IF NOT EXISTS idx_careers_created_at ON careers(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Public read access for active job openings
CREATE POLICY "Allow public read on active careers"
    ON careers FOR SELECT
    USING (is_active = true);

-- Service role full access for admin backend
CREATE POLICY "Allow all on careers for service role"
    ON careers FOR ALL
    USING (true);
