-- 1. Create Profile Roles Enum
CREATE TYPE user_role AS ENUM ('candidate', 'interviewer');

-- 2. Profiles Table (Linked to Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'candidate',
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security) on Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Trigger to sync auth.users with public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'candidate'::user_role),
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. CV Vault Table
CREATE TABLE cv_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE cv_vault ENABLE ROW LEVEL SECURITY;

-- 4. Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    industry_domain VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- 5. Question Banks Table
CREATE TABLE question_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    level VARCHAR(50) CHECK (level IN ('ez', 'medium', 'hard')) NOT NULL,
    title VARCHAR(255) NOT NULL,
    questions JSONB NOT NULL, -- JSON array of 10 questions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;

-- 6. Interview Sessions Table
CREATE TABLE interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    cv_id UUID REFERENCES cv_vault(id) ON DELETE SET NULL,
    question_bank_id UUID REFERENCES question_banks(id) ON DELETE SET NULL,
    current_question_index INT NOT NULL DEFAULT 0,
    chat_history JSONB NOT NULL DEFAULT '[]'::jsonb, -- JSON array storing the chat stream
    status VARCHAR(50) CHECK (status IN ('ongoing', 'completed')) DEFAULT 'ongoing',
    recruiter_joined BOOLEAN DEFAULT FALSE,
    scores JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies for Profiles
CREATE POLICY "Allow users to view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Basic RLS Policies for CV Vault
CREATE POLICY "Allow candidates to manage their own CVs"
    ON cv_vault FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Allow recruiters to view CVs"
    ON cv_vault FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'interviewer'
        )
    );

-- Basic RLS Policies for Companies (Public read)
CREATE POLICY "Allow public read access to companies"
    ON companies FOR SELECT
    USING (true);

-- Basic RLS Policies for Question Banks (Interviewer write, public read)
CREATE POLICY "Allow public read access to question banks"
    ON question_banks FOR SELECT
    USING (true);

CREATE POLICY "Allow interviewers to manage question banks"
    ON question_banks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'interviewer'
        )
    );

-- Basic RLS Policies for Interview Sessions (Candidate reads/writes their own, interviewer manages all)
CREATE POLICY "Allow candidates to view and update their own sessions"
    ON interview_sessions FOR ALL
    USING (auth.uid() = candidate_id);

CREATE POLICY "Allow interviewers to manage all sessions"
    ON interview_sessions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'interviewer'
        )
    );

-- 7. Seed Data for Companies (Real Vietnamese & Global Corporations)
INSERT INTO companies (id, name, industry_domain) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Viettel Cyber Security (VCS)', 'Cybersecurity (SOC, Pentest, Red Team)'),
    ('22222222-2222-2222-2222-222222222222', 'NCS Group (An ninh mạng Quốc gia)', 'Cybersecurity (Security Auditing, Pentest)'),
    ('33333333-3333-3333-3333-333333333333', 'VNG Corporation', 'Software Development (Backend, Fullstack, Data)'),
    ('44444444-4444-4444-4444-444444444444', 'FPT Software', 'Software Development (Frontend, Backend, QC)'),
    ('55555555-5555-5555-5555-555555555555', 'NVIDIA Vietnam', 'DevOps & GPU Cloud Engineering'),
    ('66666666-6666-6666-6666-666666666666', 'FPT Smart Cloud', 'Cloud Systems, DevOps & SRE')
ON CONFLICT (name) DO UPDATE SET industry_domain = EXCLUDED.industry_domain;

-- 8. Seed Data for Question Banks
INSERT INTO question_banks (id, company_id, level, title, questions) VALUES
    (
        '11111111-2222-3333-4444-555555555555',
        '11111111-1111-1111-1111-111111111111',
        'medium',
        'Viettel Cyber Security - Security Analyst & Pentest Quiz',
        '[
            "1. Làm thế nào để phát hiện và ngăn chặn lỗ hổng SQL Injection trên ứng dụng web?",
            "2. Giải thích sự khác nhau giữa tấn công XSS (Reflected, Stored, DOM-based)?",
            "3. Quy trình phản ứng sự cố (Incident Response) khi phát hiện cảnh báo mã độc từ SOC là gì?",
            "4. Port knocking là gì và nó giúp ích gì cho bảo mật hệ thống?",
            "5. Giải thích cơ chế mã hóa bất đối xứng và ứng dụng của nó trong SSL/TLS?",
            "6. Bạn sẽ kiểm thử bảo mật (pentest) một API Endpoint không có tài liệu như thế nào?",
            "7. Lỗ hổng IDOR (Insecure Direct Object Reference) là gì và cách phòng tránh?",
            "8. Làm thế nào để phân tích một file log web server nhằm xác định dấu vết của một cuộc tấn công?",
            "9. Giải thích khái niệm Zero Trust Architecture?",
            "10. Cách thức hoạt động của một cuộc tấn công CSRF (Cross-Site Request Forgery)?"
        ]'::jsonb
    ),
    (
        '22222222-3333-4444-5555-666666666666',
        '33333333-3333-3333-3333-333333333333',
        'medium',
        'VNG Corporation - Fullstack/Backend Engineer Interview',
        '[
            "1. Sự khác nhau giữa RESTful API và GraphQL là gì? Khi nào nên sử dụng loại nào?",
            "2. Làm thế nào để tối ưu hóa truy vấn SQL có thời gian phản hồi chậm?",
            "3. Giải thích cơ chế Event Loop trong Node.js?",
            "4. Làm thế nào để quản lý state phức tạp trong React App mà không gây re-render liên tục?",
            "5. Microservices khác gì Monolithic và các thách thức lớn nhất khi chuyển đổi là gì?",
            "6. Giải thích các chiến lược cache (Cache-Aside, Write-Through, Write-Behind) và cách áp dụng Redis?",
            "7. Làm thế nào để xử lý Race Condition khi nhiều request cùng cập nhật một tài nguyên?",
            "8. Giải thích nguyên lý SOLID và nêu ví dụ thực tế về chữ S (Single Responsibility)?",
            "9. JWT (JSON Web Token) hoạt động thế nào và làm sao bảo mật refresh token?",
            "10. Cách thiết kế hệ thống chat thời gian thực (Real-time chat) cho hàng triệu user?"
        ]'::jsonb
    ),
    (
        '33333333-4444-5555-6666-777777777777',
        '55555555-5555-5555-5555-555555555555',
        'medium',
        'NVIDIA Vietnam - DevOps & Cloud Platform Quiz',
        '[
            "1. Docker container khác gì so với Virtual Machine về mặt kiến trúc tài nguyên?",
            "2. Làm thế nào để tối ưu hóa kích thước của một Docker Image?",
            "3. Hãy giải thích quy trình triển khai ứng dụng bằng Kubernetes Helm Chart?",
            "4. Blue-Green Deployment và Canary Deployment khác nhau thế nào?",
            "5. Cách thức hoạt động của GitOps và giới thiệu công cụ ArgoCD?",
            "6. Giải thích cơ chế Load Balancer hoạt động ở Layer 4 và Layer 7?",
            "7. Làm thế nào để giám sát sức khỏe hệ thống bằng Prometheus và Grafana?",
            "8. Bạn xử lý sự cố nghẽn mạng hoặc tài nguyên GPU trên cụm Kubernetes như thế nào?",
            "9. Infrastructure as Code (IaC) là gì và lợi ích của việc sử dụng Terraform?",
            "10. Giải thích quy trình CI/CD hoàn chỉnh để đưa mã nguồn từ GitHub lên Kubernetes?"
        ]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;
