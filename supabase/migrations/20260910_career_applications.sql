-- ========================================================================
-- QMD-Tech Database Migration: Career Applications with PDF Resumes
-- ========================================================================

CREATE TABLE IF NOT EXISTS career_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
    job_title VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    experience VARCHAR(100),
    introduction TEXT,
    resume_url TEXT NOT NULL,
    resume_filename VARCHAR(255) NOT NULL,
    resume_file_size INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for rapid sorting and filtering
CREATE INDEX IF NOT EXISTS idx_career_apps_job ON career_applications(job_title);
CREATE INDEX IF NOT EXISTS idx_career_apps_status ON career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_apps_created_at ON career_applications(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- Allow public submission of applications
CREATE POLICY "Allow public insert on career_applications"
    ON career_applications FOR INSERT
    WITH CHECK (true);

-- Allow service role full administrative access
CREATE POLICY "Allow service role all on career_applications"
    ON career_applications FOR ALL
    USING (true);
