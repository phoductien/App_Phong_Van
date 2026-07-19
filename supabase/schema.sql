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
  -- Delete existing profile with same email to avoid unique key conflicts from previous registrations
  DELETE FROM public.profiles WHERE email = new.email;

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

CREATE POLICY "Allow public insert access to cv_vault"
    ON cv_vault FOR INSERT
    WITH CHECK (true);

-- Basic RLS Policies for Companies (Public read)
CREATE POLICY "Allow public read access to companies"
    ON companies FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access to companies"
    ON companies FOR INSERT
    WITH CHECK (true);

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

CREATE POLICY "Allow public insert access to question banks"
    ON question_banks FOR INSERT
    WITH CHECK (true);

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

CREATE POLICY "Allow public insert access to interview_sessions"
    ON interview_sessions FOR INSERT
    WITH CHECK (true);

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
    ),
    -- --- Viettel Cyber Security (VCS) ---
    (
        '11111111-2222-3333-4444-666666666666',
        '11111111-1111-1111-1111-111111111111',
        'ez',
        'Viettel Cyber Security - SOC Operator Intern Quiz',
        '[
            "1. Cảnh báo (Alert) từ hệ thống SIEM là gì và bạn sẽ làm gì đầu tiên khi nhận được nó?",
            "2. Sự khác nhau cơ bản giữa địa chỉ IP Public và IP Private?",
            "3. Port 80 và Port 443 dùng cho giao thức nào, sự khác biệt lớn nhất là gì?",
            "4. Mã độc (Malware) có những loại phổ biến nào bạn biết?",
            "5. Phishing email là gì và dấu hiệu nhận biết email lừa đảo?",
            "6. Hệ điều hành Linux lệnh nào dùng để kiểm tra các kết nối mạng đang hoạt động?",
            "7. Khái niệm tường lửa (Firewall) hoạt động ở tầng nào của mô hình OSI?",
            "8. VPN là gì và tại sao doanh nghiệp cần sử dụng VPN?",
            "9. Bạn hiểu thế nào về vai trò của một SOC Analyst trong doanh nghiệp?",
            "10. Khi máy tính cá nhân bị nghi ngờ nhiễm mã độc, bước xử lý khẩn cấp đầu tiên là gì?"
        ]'::jsonb
    ),
    (
        '11111111-2222-3333-4444-777777777777',
        '11111111-1111-1111-1111-111111111111',
        'hard',
        'Viettel Cyber Security - Expert Red Teamer & Lead Pentester Quiz',
        '[
            "1. Làm thế nào để bypass cơ chế AMSI (Antimalware Scan Interface) của Windows khi thực thi PowerShell scripts?",
            "2. Giải thích quy trình tấn công Kerberoasting trong môi trường Active Directory và cách phòng chống?",
            "3. Phân tích cách bạn phát hiện và khai thác lỗ hổng deserialization trong ứng dụng Java Enterprise?",
            "4. Trình bày phương pháp bypass cơ chế bảo vệ WAF (Web Application Firewall) nâng cao?",
            "5. Làm thế nào để thực hiện kỹ thuật DLL Side-Loading nhằm duy trì quyền truy cập trên hệ thống mục tiêu?",
            "6. Kỹ thuật đào hầm mạng (Chisel, SSH Tunneling) qua các lớp mạng nội bộ (Pivotting) hoạt động như thế nào?",
            "7. Giải thích lỗ hổng Zerologon (CVE-2020-1472) và tác động của nó đối với Domain Controller?",
            "8. Làm thế nào để phân tích mã độc đã bị obfuscate và pack bằng kỹ thuật dịch ngược (Reverse Engineering)?",
            "9. Phương thức tấn công chuỗi cung ứng (Supply Chain Attack) là gì và làm thế nào để giảm thiểu rủi ro?",
            "10. Viết một kịch bản tấn công leo thang đặc quyền (Privilege Escalation) từ User thường lên SYSTEM trên Windows Server?"
        ]'::jsonb
    ),
    -- --- VNG Corporation ---
    (
        '22222222-3333-4444-5555-777777777777',
        '33333333-3333-3333-3333-333333333333',
        'ez',
        'VNG Corporation - Intern QA/QC Game Tester Quiz',
        '[
            "1. Khái niệm lỗi phần mềm (Bug) là gì và quy trình báo cáo lỗi (Bug Report) tiêu chuẩn gồm những thông tin nào?",
            "2. Sự khác nhau giữa Regression Testing (Kiểm thử hồi quy) và Sanity Testing là gì?",
            "3. Bạn hiểu thế nào là kiểm thử hộp đen (Black-box Testing) và kiểm thử hộp trắng?",
            "4. Hãy thiết lập các Test Case để kiểm thử chức năng Đăng ký tài khoản mới?",
            "5. Khi kiểm thử một game mobile, những yếu tố nào về trải nghiệm người dùng (UX) bạn cần đặc biệt chú ý?",
            "6. Làm thế nào để tái hiện một lỗi không xảy ra thường xuyên (Intermittent Bug)?",
            "7. Sự khác biệt giữa mức độ nghiêm trọng (Severity) và độ ưu tiên (Priority) của một bug?",
            "8. Bạn sử dụng công cụ nào để quản lý tiến độ kiểm thử và log lỗi (ví dụ: Jira, Trello)?",
            "9. Khi phát hiện game bị giật lag (Drop FPS), bạn sẽ phân tích nguyên nhân từ đâu đầu tiên?",
            "10. Tại sao cần viết tài liệu Test Plan trước khi tiến hành kiểm thử một dự án?"
        ]'::jsonb
    ),
    (
        '22222222-3333-4444-5555-888888888888',
        '33333333-3333-3333-3333-333333333333',
        'hard',
        'VNG Corporation - Senior React & System Architect Quiz',
        '[
            "1. Giải thích cơ chế Reconciliation và thuật toán Diffing của React 18?",
            "2. Làm thế nào để tối ưu hóa hiệu năng render cho danh sách cực lớn (trên 10,000 phần tử) mà không gây giật khung hình?",
            "3. Thiết kế kiến trúc chịu tải cho hệ thống Real-time Dashboard phục vụ 50,000 kết nối đồng thời?",
            "4. Cách thức hoạt động của Server-Side Rendering (SSR) so với Static Site Generation (SSG) trong Next.js?",
            "5. Làm thế nào để xử lý rò rỉ bộ nhớ (Memory Leak) trong ứng dụng Single Page Application lớn?",
            "6. Giải thích cách triển khai cơ chế Distributed Lock sử dụng Redis để bảo vệ tài nguyên chia sẻ?",
            "7. Bạn sẽ chia nhỏ mã nguồn (Code Splitting) và áp dụng Lazy Loading như thế nào để giảm 50% chỉ số FCP?",
            "8. Giải thích nguyên lý hoạt động của CDN và các chiến lược cấu hình cache header (Cache-Control, ETag)?",
            "9. Làm thế nào để đảm bảo tính nhất quán dữ liệu giữa Web Client và Database qua môi trường WebSocket có kết nối chập chờn?",
            "10. Trình bày phương án thiết kế hệ thống Micro-frontend cho một portal doanh nghiệp gồm nhiều đội phát triển độc lập?"
        ]'::jsonb
    ),
    -- --- NVIDIA Vietnam ---
    (
        '33333333-4444-5555-6666-888888888888',
        '55555555-5555-5555-5555-555555555555',
        'ez',
        'NVIDIA Vietnam - Junior Python/C++ Developer Quiz',
        '[
            "1. Sự khác nhau giữa con trỏ (Pointer) và tham chiếu (Reference) trong C++?",
            "2. Giải thích cơ chế quản lý bộ nhớ tự động (Garbage Collection) trong Python?",
            "3. Khái niệm đa luồng (Multi-threading) và đa tiến trình (Multi-processing) khác nhau thế nào?",
            "4. Lớp ảo (Virtual Class) và Hàm ảo (Virtual Function) trong C++ dùng để làm gì?",
            "5. Giải thích từ khóa ''self'' trong các class của Python?",
            "6. Cú pháp quản lý ngữ cảnh ''with'' trong Python hoạt động như thế nào và lợi ích của nó?",
            "7. Làm thế nào để tối ưu hóa thời gian biên dịch (Compile time) của một dự án C++ lớn?",
            "8. Trình bày các cấu trúc dữ liệu cơ bản: Array, Linked List, Stack, Queue và độ phức tạp truy xuất?",
            "9. List Comprehension trong Python là gì? Cho ví dụ minh họa?",
            "10. Giải thích tầm quan trọng của việc quản lý bộ nhớ thủ công và lỗi rò rỉ bộ nhớ (Memory Leak) trong C++?"
        ]'::jsonb
    ),
    (
        '33333333-4444-5555-6666-999999999999',
        '55555555-5555-5555-5555-555555555555',
        'hard',
        'NVIDIA Vietnam - Senior SRE & GPU Optimization Expert Quiz',
        '[
            "1. Cơ chế giao tiếp bộ nhớ qua PCIe giữa CPU và GPU hoạt động thế nào, và làm sao để giảm thiểu bottleneck truyền tải dữ liệu?",
            "2. Giải thích mô hình lập trình song song CUDA và cách thiết kế Thread Blocks, Grids để tận dụng tối đa GPU Cores?",
            "3. Làm thế nào để tối ưu hóa việc phân bổ bộ nhớ dùng chung (Shared Memory) và bộ nhớ toàn cục (Global Memory) trên kiến trúc NVIDIA Ampere?",
            "4. Trình bày cơ chế hoạt động của GPU Direct RDMA trong các cụm máy chủ AI lớn?",
            "5. Làm thế nào để giám sát và chẩn đoán hiệu năng GPU thời gian thực sử dụng các công cụ như Nsight Systems và Nsight Compute?",
            "6. Hãy thiết kế hệ thống tự động co giãn (Auto-scaling) cho các Kubernetes Node chứa GPU dựa trên chỉ số sử dụng GPU thực tế?",
            "7. Giải thích sự khác biệt và tối ưu hiệu năng giữa tính toán độ chính xác đơn (FP32), độ chính xác nửa (FP16) và TensorFloat-32 (TF32)?",
            "8. Làm thế nào để triển khai mô hình học sâu lớn (ví dụ: LLM) trên cụm đa GPU sử dụng kỹ thuật Tensor Parallelism và Pipeline Parallelism?",
            "9. Bạn xử lý lỗi mất kết nối phần cứng GPU (GPU Dropped, XID Error) trên hệ thống đám mây tự động như thế nào?",
            "10. Viết kịch bản tối ưu hóa mã nguồn CUDA kernel để giảm thiểu rò rỉ băng thông (Memory Bandwidth Saturation)?"
        ]'::jsonb
    ),
    -- --- FPT Software (company_id: 44444444-4444-4444-4444-444444444444) ---
    (
        '44444444-5555-6666-7777-111111111111',
        '44444444-4444-4444-4444-444444444444',
        'ez',
        'FPT Software - Junior Frontend Developer Intern Quiz',
        '[
            "1. HTML5 Semantic Elements là gì và tại sao chúng ta nên sử dụng chúng thay vì thẻ div?",
            "2. Giải thích cơ chế CSS Box Model?",
            "3. Sự khác nhau giữa flex-direction: row và flex-direction: column trong CSS Flexbox?",
            "4. Giải thích cơ chế Event Bubbling và Event Capturing trong Javascript?",
            "5. Giao thức HTTP/HTTPS hoạt động thế nào và SSL certificate đóng vai trò gì?",
            "6. Sự khác biệt giữa từ khóa var, let và const trong ES6?",
            "7. Giải thích sự khác biệt giữa cookie, localStorage và sessionStorage?",
            "8. Callback function là gì và cách sử dụng nó trong các tác vụ bất đồng bộ?",
            "9. Viết một đoạn CSS để căn giữa một phần tử tuyệt đối (absolute element) cả chiều ngang lẫn chiều dọc?",
            "10. Responsive Web Design là gì và Media Queries đóng vai trò thế nào?"
        ]'::jsonb
    ),
    (
        '44444444-5555-6666-7777-222222222222',
        '44444444-4444-4444-4444-444444444444',
        'medium',
        'FPT Software - Mid-Level QC Tester (Manual & Automation) Quiz',
        '[
            "1. Trình bày quy trình kiểm thử phần mềm (STLC) và các giai đoạn quan trọng nhất?",
            "2. Sự khác biệt giữa Black-box Testing, White-box Testing và Gray-box Testing?",
            "3. Làm thế nào để viết một kịch bản kiểm thử tự động (Automation Script) bằng Selenium WebDriver với mô hình Page Object Model (POM)?",
            "4. Giải thích các mức độ kiểm thử: Unit Test, Integration Test, System Test, Acceptance Test?",
            "5. Cách bạn thiết kế và thực thi kiểm thử bảo mật cơ bản cho các API Endpoint?",
            "6. Sự khác biệt giữa kiểm thử tải (Load Testing) và kiểm thử độ bền chịu tải (Stress Testing)?",
            "7. Làm thế nào để tích hợp các kịch bản kiểm thử tự động vào quy trình CI/CD sử dụng Jenkins hoặc GitHub Actions?",
            "8. Kiểm thử hồi quy (Regression Testing) là gì và khi nào nên áp dụng kiểm thử tự động cho nó?",
            "9. Bạn xử lý các phần tử động (Dynamic Elements) hoặc chờ đợi trang load xong (Implicit Wait, Explicit Wait) trong Selenium thế nào?",
            "10. Giải thích cấu trúc của một câu lệnh SQL dùng để truy vấn kiểm tra dữ liệu giữa UI và Database?"
        ]'::jsonb
    ),
    (
        '44444444-5555-6666-7777-333333333333',
        '44444444-4444-4444-4444-444444444444',
        'hard',
        'FPT Software - Solutions Architect & Principal Cloud Engineer Quiz',
        '[
            "1. Thiết kế kiến trúc đám mây đa vùng (Multi-region Cloud Architecture) có tính dự phòng cao và tự động khôi phục sau thảm họa (Disaster Recovery)?",
            "2. Giải thích sự khác biệt giữa các mô hình dịch vụ đám mây: IaaS, PaaS, SaaS và Serverless? Khi nào lựa chọn mô hình nào?",
            "3. Làm thế nào để bảo mật dữ liệu nhạy cảm ở trạng thái lưu trữ (Encryption at Rest) và trạng thái truyền tải (Encryption in Transit) trên AWS/Azure?",
            "4. Thiết kế hệ thống Microservices sử dụng API Gateway, Service Mesh (Istio) và cơ chế bảo mật OAuth2/OIDC?",
            "5. Làm thế nào để tối ưu hóa chi phí hạ tầng đám mây cho doanh nghiệp đang tiêu tốn $50,000 mỗi tháng?",
            "6. Trình bày phương án di chuyển cơ sở dữ liệu lớn (Database Migration) từ On-Premises lên Cloud mà không gây gián đoạn dịch vụ (Zero-Downtime)?",
            "7. Thiết kế hệ thống CI/CD hoàn chỉnh hỗ trợ triển khai tự động hạ tầng (IaC) bằng Terraform và mã nguồn ứng dụng bằng GitOps (ArgoCD)?",
            "8. Giải thích các chiến lược xử lý dữ liệu lớn (Data Partitioning, Sharding) và lựa chọn giữa SQL vs NoSQL Database?",
            "9. Cách xử lý sự cố nghẽn cổ chai (Bottleneck) về I/O hoặc CPU trên hệ thống phân tán phục vụ hàng triệu người dùng?",
            "10. Trình bày nguyên lý thiết kế hệ thống theo tiêu chuẩn AWS Well-Architected Framework?"
        ]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;
