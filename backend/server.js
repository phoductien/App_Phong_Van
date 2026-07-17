require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const cheerio = require('cheerio');

const getInterviewerRole = (index) => {
  if (index >= 0 && index <= 3) {
    return { role: 'Tech Lead', name: 'Anh Hùng (Tech Lead)' };
  } else if (index >= 4 && index <= 6) {
    return { role: 'PM', name: 'Chị Mai (Project Manager)' };
  } else {
    return { role: 'HR', name: 'Chị Lan (HR Manager)' };
  }
};

const evaluateAnswerWithAI = async (currentQuestion, level, answer, chatHistory, companyName, positionTitle, currentIndex) => {
  const interviewer = getInterviewerRole(currentIndex);
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return rich simulated score breakdown if no API key is set
    const isOffTopic = answer.trim().length < 5 || 
                       (!answer.toLowerCase().includes('react') && 
                        !answer.toLowerCase().includes('node') && 
                        !answer.toLowerCase().includes('java') && 
                        !answer.toLowerCase().includes('devops') && 
                        !answer.toLowerCase().includes('docker') && 
                        !answer.toLowerCase().includes('git') && 
                        !answer.toLowerCase().includes('hệ thống') && 
                        !answer.toLowerCase().includes('luật') && 
                        !answer.toLowerCase().includes('kinh nghiệm') &&
                        answer.toLowerCase().split(' ').length < 3);

    if (isOffTopic) {
      return {
        score: 0,
        techScore: 0,
        commScore: 0,
        confScore: 0,
        feedback: `[Hội đồng Phỏng vấn] Cảnh báo: Vui lòng trả lời tập trung vào chuyên môn phỏng vấn và câu hỏi đặt ra. Tránh trả lời lạc đề hoặc phiếm chuyện ngoài lề.`,
        sampleAnswer: `Ví dụ câu trả lời tham khảo: Em sẽ giải thích khái niệm này một cách ngắn gọn, tập trung vào lợi ích kỹ thuật...`
      };
    }

    const score = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const techScore = score;
    const commScore = Math.min(10, score + (Math.random() > 0.5 ? 1 : -1));
    const confScore = Math.min(10, score + (Math.random() > 0.5 ? 2 : 0));
    const feedback = `[Giả lập - ${interviewer.name}] Phản hồi khá tốt câu hỏi: "${currentQuestion}". Bạn cần trả lời tự tin và lấy thêm nhiều ví dụ dự án thực tế hơn nữa.`;
    return { score, techScore, commScore, confScore, feedback, sampleAnswer: "Em đã ứng dụng kiến thức này trong dự án X bằng cách..." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const formattedHistory = chatHistory.slice(-4).map(h => {
      if (h.role === 'candidate') return `Candidate: ${h.content}`;
      if (h.role === 'ai_evaluation') return `Interviewer Feedback: ${h.feedback}`;
      return `Interviewer: ${h.content}`;
    }).join('\n');

    const prompt = `Bạn đang đóng vai là thành viên của Hội đồng phỏng vấn tại công ty "${companyName}" cho vị trí "${positionTitle}".
Người phỏng vấn hiện tại: "${interviewer.name}" (Vai trò: ${interviewer.role}).
Độ khó câu hỏi: "${level}" (easy = Intern/Fresher, medium = Junior, hard = Senior).

Câu hỏi vừa đặt: "${currentQuestion}"
Câu trả lời của ứng viên: "${answer}"

Lịch sử đối thoại gần đây:
${formattedHistory}

Nhiệm vụ của bạn là:
1. Đánh giá xem câu trả lời của ứng viên có bị lạc đề hoàn toàn hoặc đùa giỡn, nói nhảm nhí hay không. Nếu lạc đề/nói nhảm nhí: set score, techScore, commScore, confScore đồng loạt bằng 0, viết nhận xét nhắc nhở ứng viên tập trung (Anti-derailment).
2. Nếu ứng viên trả lời nghiêm túc, hãy chấm điểm chi tiết trên thang điểm 10 cho:
   - techScore (Kiến thức chuyên môn kỹ thuật)
   - commScore (Khả năng diễn đạt, giao tiếp truyền tải thông tin)
   - confScore (Độ tự tin, sự quyết đoán trong câu trả lời)
   - score (Điểm trung bình cộng của 3 điểm trên)
3. Viết nhận xét (feedback) bằng Tiếng Việt thân thiện, mang tính xây dựng dưới góc nhìn của "${interviewer.name}".
4. Đưa ra một câu trả lời mẫu tối ưu (sampleAnswer) bằng Tiếng Việt để ứng viên có thể học hỏi và tham khảo.

Hãy trả về một đối tượng JSON duy nhất có cấu trúc sau:
{
  "score": 8,
  "techScore": 8,
  "commScore": 9,
  "confScore": 7,
  "feedback": "Nhận xét chi tiết...",
  "sampleAnswer": "Câu trả lời mẫu tối ưu..."
}
Chú ý: Chỉ trả về JSON hợp lệ, không bọc trong thẻ markdown \`\`\`json.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = JSON.parse(response.text().trim());
    return {
      score: parsed.score || 7,
      techScore: parsed.techScore || 7,
      commScore: parsed.commScore || 7,
      confScore: parsed.confScore || 7,
      feedback: parsed.feedback || "Cảm ơn câu trả lời của bạn.",
      sampleAnswer: parsed.sampleAnswer || "Em sẽ tìm hiểu thêm về chủ đề này."
    };
  } catch (err) {
    console.error("Gemini API error, falling back to mock evaluation:", err.message);
    const score = 7;
    return {
      score,
      techScore: 7,
      commScore: 7,
      confScore: 8,
      feedback: `Đã nhận câu trả lời. [Lỗi kết nối Gemini API: ${err.message}]`,
      sampleAnswer: "Ví dụ: Em sẽ tiếp cận vấn đề theo cấu trúc..."
    };
  }
};

const compression = require('compression');

const app = express();
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.path.toLowerCase().endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
  }
  next();
}, express.static(path.join(__dirname, 'public', 'uploads')));

global.recruiterJoinedSessions = {};

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// Detect if we should use Mock Database fallback (when credentials are empty or placeholders)
const isMock = !SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('placeholder');

let supabase = null;
if (!isMock) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Connected to Supabase Client.");
  } catch (err) {
    console.error("Supabase creation failed. Defaulting to mock local database.", err.message);
  }
} else {
  console.log("Supabase credentials not provided or placeholder. Starting with Mock Local DB mode.");
}

// ==========================================
// MOCK DATABASE STORAGE (Memory Fallback)
// ==========================================
const mockCompanies = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Viettel Cyber Security (VCS)', industry_domain: 'Cybersecurity (SOC, Pentest, Red Team)' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'NCS Group (An ninh mạng Quốc gia)', industry_domain: 'Cybersecurity (Security Auditing, Pentest)' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'VNG Corporation', industry_domain: 'Software Development (Backend, Fullstack, Data)' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'FPT Software', industry_domain: 'Software Development (Frontend, Backend, QC)' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'NVIDIA Vietnam', industry_domain: 'DevOps & GPU Cloud Engineering' },
  { id: '66666666-6666-6666-6666-666666666666', name: 'FPT Smart Cloud', industry_domain: 'Cloud Systems, DevOps & SRE' }
];

const mockCvs = [
  { id: 'cv-101', user_id: '00000000-0000-0000-0000-000000000000', file_url: 'https://example.com/CV_NguyenVanA_DevOps.pdf', uploaded_at: new Date().toISOString() },
  { id: 'cv-102', user_id: '00000000-0000-0000-0000-000000000000', file_url: 'https://example.com/CV_TranThiB_CyberSecurity.pdf', uploaded_at: new Date().toISOString() }
];

const mockQuestionBanks = [
  {
    id: '11111111-2222-3333-4444-555555555555',
    company_id: '11111111-1111-1111-1111-111111111111',
    level: 'medium',
    title: 'Viettel Cyber Security - SOC Analyst & Pentest Interview',
    questions: [
      "1. Phân biệt sự khác nhau giữa Security Operations Center (SOC) và Network Operations Center (NOC)?",
      "2. Giải thích cơ chế hoạt động của hệ thống SIEM trong việc tương quan dữ liệu log để phát hiện mối đe dọa?",
      "3. Khi phát hiện cảnh báo Brute-Force SSH thành công trên một server nội bộ, bạn sẽ thực hiện các bước điều tra ban đầu nào trong 15 phút đầu tiên?",
      "4. Trình bày quy trình Ứng cứu sự cố (Incident Response) theo tiêu chuẩn NIST SP 800-61?",
      "5. Port knocking là gì? Nó giúp ích gì cho bảo mật và làm cách nào để phát hiện dấu vết qua phân tích log?",
      "6. Giải thích các lỗ hổng OWASP Top 10 phổ biến như SQL Injection, XSS, CSRF, IDOR và cách phòng chống từng loại?",
      "7. Làm thế nào để phân tích file log Apache/Nginx web server để phát hiện dấu hiệu của cuộc tấn công SQL Injection?",
      "8. Giải thích khái niệm Threat Hunting và sự khác biệt của nó so với giám sát an ninh (Security Monitoring) thông thường?",
      "9. Giao thức DNSSEC giải quyết điểm yếu nào của hệ thống DNS truyền thống và cơ chế xác thực của nó là gì?",
      "10. Bạn sẽ xử lý thế nào khi một máy tính của nhân viên gửi liên tục các gói tin DNS Request bất thường ra ngoài internet (nghi ngờ DNS Tunneling)?"
    ]
  },
  {
    id: '22222222-3333-4444-5555-666666666666',
    company_id: '33333333-3333-3333-3333-333333333333',
    level: 'medium',
    title: 'VNG Corporation - Software Engineer (Backend/Frontend) Interview',
    questions: [
      "1. Hãy giải thích chi tiết cơ chế hoạt động của Event Loop trong Node.js (các pha Poll, Check, Close callbacks...)?",
      "2. Điểm khác biệt chính giữa RESTful API và GraphQL là gì? Trong trường hợp nào việc sử dụng GraphQL sẽ tối ưu hơn RESTful?",
      "3. Làm thế nào để xử lý triệt để lỗi N+1 Query khi truy vấn dữ liệu quan hệ trong các thư viện ORM?",
      "4. Giải thích cơ chế hoạt động của Database Indexing (B-Tree vs Hash Index) và nêu các tác động tiêu cực của nó đối với thao tác WRITE?",
      "5. Kể tên các chiến lược Caching phổ biến (Cache-Aside, Write-Through, Write-Behind). Khi nào nên áp dụng Redis cho hệ thống High Concurrency?",
      "6. Microservices khác gì Monolithic và các giải pháp để xử lý việc đồng bộ hóa dữ liệu (Data Consistency) giữa các service?",
      "7. Làm thế nào để giải quyết vấn đề Race Condition khi nhiều client cùng lúc thực hiện thao tác giảm số lượng sản phẩm trong kho (Inventory)?",
      "8. Trình bày quy trình xử lý lỗi CORS (Cross-Origin Resource Sharing) ở cả phía Client và Server?",
      "9. Thiết kế hệ thống Xác thực (Authentication) sử dụng Access Token và Refresh Token bảo mật. Làm cách nào để hủy (revoke) token trước thời hạn?",
      "10. Bạn sẽ tối ưu hóa hiệu năng render của một React Application bằng cách sử dụng các hook như useMemo, useCallback, và React.memo như thế nào?"
    ]
  },
  {
    id: '33333333-4444-5555-6666-777777777777',
    company_id: '55555555-5555-5555-5555-555555555555',
    level: 'medium',
    title: 'NVIDIA Vietnam - DevOps & Cloud Infrastructure Interview',
    questions: [
      "1. Giải thích sự khác biệt về mặt kiến trúc tài nguyên và ảo hóa giữa Docker Container và Virtual Machine (VM)?",
      "2. Để tối ưu hóa kích thước Docker Image, bạn sẽ áp dụng những phương pháp nào (Multi-stage build, Alpine image, .dockerignore)?",
      "3. Quy trình triển khai ứng dụng bằng Helm Chart trong Kubernetes hoạt động như thế nào? Lợi ích của Helm so với YAML thông thường là gì?",
      "4. Trình bày sự khác biệt giữa hai chiến duyệt triển khai: Blue-Green Deployment và Canary Deployment? Nêu trường hợp áp dụng phù hợp?",
      "5. GitOps là gì? Trình bày cách tích hợp công cụ ArgoCD để đồng bộ hóa mã nguồn Git với cụm Kubernetes?",
      "6. Phân biệt cơ chế Load Balancing hoạt động ở tầng giao vận Layer 4 (TCP/UDP) và tầng ứng dụng Layer 7 (HTTP/HTTPS)?",
      "7. Làm thế nào để xây dựng hệ thống giám sát tài nguyên GPU chuyên sâu trên cụm Kubernetes sử dụng Prometheus và Grafana?",
      "8. Khi nhận được cảnh báo một node Kubernetes bị quá tải CPU/RAM, bạn sẽ thực hiện các lệnh hoặc quy trình nào để kiểm tra và khắc phục?",
      "9. Infrastructure as Code (IaC) là gì? Tại sao Terraform được ưa chuộng hơn các công cụ viết kịch bản Bash/Python truyền thống?",
      "10. Thiết kế pipeline CI/CD hoàn chỉnh để tự động build, scan bảo mật image (ví dụ bằng Trivy) và deploy lên Kubernetes sử dụng GitHub Actions?"
    ]
  }
];

// Fallback question banks for other company / level combinations
const getFallbackQuestionBank = (companyId, level) => {
  const company = mockCompanies.find(c => c.id === companyId);
  const companyName = company ? company.name : "Company";
  return {
    id: `fallback-${companyId}-${level}`,
    company_id: companyId,
    level: level,
    title: `${companyName} Quiz (${level.toUpperCase()})`,
    questions: [
      `1. [${level.toUpperCase()}] Giới thiệu tổng quan về kỹ năng của bạn liên quan đến công ty ${companyName}?`,
      `2. [${level.toUpperCase()}] Nêu một lỗi phổ biến bạn hay gặp phải ở vị trí này và cách khắc phục?`,
      `3. [${level.toUpperCase()}] Làm thế nào để kiểm tra tính ổn định của hệ thống?`,
      `4. [${level.toUpperCase()}] Nêu điểm khác biệt của bạn so với các ứng viên khác?`,
      `5. [${level.toUpperCase()}] Hãy trình bày hiểu biết của bạn về văn hóa làm việc tại ${companyName}?`,
      `6. [${level.toUpperCase()}] Giải thích các công nghệ cốt lõi thường được dùng cho vị trí này?`,
      `7. [${level.toUpperCase()}] Bạn thiết kế quy trình xử lý lỗi tự động như thế nào?`,
      `8. [${level.toUpperCase()}] Làm cách nào để tối ưu hóa quy trình làm việc?`,
      `9. [${level.toUpperCase()}] Làm thế nào để bảo mật thông tin dự án tốt nhất?`,
      `10. [${level.toUpperCase()}] Bạn có câu hỏi nào dành cho người phỏng vấn không?`
    ]
  };
};

const mockSessions = {};

// ==========================================
// ROUTES IMPLEMENTATION
// ==========================================

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: "AI Interview Platform Backend API running.",
    mode: isMock ? "MOCK_LOCAL_DATABASE" : "PRODUCTION_SUPABASE"
  });
});

function isValidUUID(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

// API: Get list of CVs
app.get('/api/cv', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId query parameter" });

  if (isMock || !isValidUUID(userId)) {
    const list = mockCvs.filter(cv => cv.user_id === userId);
    return res.json(list);
  }

  try {
    const { data, error } = await supabase
      .from('cv_vault')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.warn("Supabase /api/cv select failed, falling back to mock:", error.message);
      const list = mockCvs.filter(cv => cv.user_id === userId);
      return res.json(list);
    }
    const mockList = mockCvs.filter(cv => cv.user_id === userId);
    return res.json([...data, ...mockList]);
  } catch (err) {
    console.warn("Supabase /api/cv exception, falling back to mock:", err.message);
    const list = mockCvs.filter(cv => cv.user_id === userId);
    return res.json(list);
  }
});

// API: Actual Device File Upload for CV (Base64)
app.post('/api/cv/upload', async (req, res) => {
  const { userId, filename, base64Data } = req.body;
  if (!userId || !filename || !base64Data) {
    return res.status(400).json({ error: "Missing userId, filename, or base64Data" });
  }

  try {
    // Strip data header from base64 string
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let fileBuffer;
    if (matches && matches.length === 3) {
      fileBuffer = Buffer.from(matches[2], 'base64');
    } else {
      fileBuffer = Buffer.from(base64Data, 'base64');
    }

    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    fs.writeFileSync(filePath, fileBuffer);

    let protocol = req.protocol;
    if (!req.get('host').includes('localhost')) {
      protocol = 'https';
    }
    const fileUrl = `${protocol}://${req.get('host')}/uploads/${uniqueFilename}`;

    if (isMock || !isValidUUID(userId)) {
      const newCv = {
        id: `cv-${Date.now()}`,
        user_id: userId,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString()
      };
      mockCvs.push(newCv);
      return res.status(201).json(newCv);
    }

    try {
      const { data, error } = await supabase
        .from('cv_vault')
        .insert([{ user_id: userId, file_url: fileUrl }])
        .select()
        .single();

      if (error) {
        console.warn("Supabase CV insert failed, falling back to mock:", error.message);
        const newCv = {
          id: `cv-${Date.now()}`,
          user_id: userId,
          file_url: fileUrl,
          uploaded_at: new Date().toISOString()
        };
        mockCvs.push(newCv);
        return res.status(201).json(newCv);
      }
      return res.status(201).json(data);
    } catch (dbErr) {
      console.warn("Supabase CV exception, falling back to mock:", dbErr.message);
      const newCv = {
        id: `cv-${Date.now()}`,
        user_id: userId,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString()
      };
      mockCvs.push(newCv);
      return res.status(201).json(newCv);
    }

  } catch (err) {
    console.error("CV file write error:", err);
    return res.status(500).json({ error: "Lỗi ghi file CV lên máy chủ" });
  }
});

// API: Save/upload CV reference
app.post('/api/cv', async (req, res) => {
  const { userId, fileUrl } = req.body;
  if (!userId || !fileUrl) {
    return res.status(400).json({ error: "Missing userId or fileUrl" });
  }

  if (isMock || !isValidUUID(userId)) {
    const newCv = {
      id: `cv-${Date.now()}`,
      user_id: userId,
      file_url: fileUrl,
      uploaded_at: new Date().toISOString()
    };
    mockCvs.push(newCv);
    return res.status(201).json(newCv);
  }

  try {
    const { data, error } = await supabase
      .from('cv_vault')
      .insert([{ user_id: userId, file_url: fileUrl }])
      .select();

    if (error) {
      console.warn("Supabase /api/cv insert failed, falling back to mock:", error.message);
      const newCv = {
        id: `cv-${Date.now()}`,
        user_id: userId,
        file_url: fileUrl,
        uploaded_at: new Date().toISOString()
      };
      mockCvs.push(newCv);
      return res.status(201).json(newCv);
    }
    return res.status(201).json(data[0]);
  } catch (dbErr) {
    console.warn("Supabase /api/cv exception, falling back to mock:", dbErr.message);
    const newCv = {
      id: `cv-${Date.now()}`,
      user_id: userId,
      file_url: fileUrl,
      uploaded_at: new Date().toISOString()
    };
    mockCvs.push(newCv);
    return res.status(201).json(newCv);
  }
});

// API: Delete a CV
app.delete('/api/cv/:id', async (req, res) => {
  const { id } = req.params;

  let fileUrl = '';

  // 1. Delete from mock list if it exists there
  const mockCvIndex = mockCvs.findIndex(c => c.id === id);
  if (mockCvIndex !== -1) {
    fileUrl = mockCvs[mockCvIndex].file_url;
    mockCvs.splice(mockCvIndex, 1);
  }

  // 2. Delete from Supabase if active and is a valid UUID
  if (!isMock && isValidUUID(id)) {
    try {
      const { data: cvData } = await supabase
        .from('cv_vault')
        .select('file_url')
        .eq('id', id)
        .single();
      
      if (cvData) {
        fileUrl = cvData.file_url;
      }

      const { error } = await supabase
        .from('cv_vault')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn("Supabase delete failed, proceeding to disk check:", error.message);
      }
    } catch (err) {
      console.warn("Supabase delete exception:", err.message);
    }
  }

  // 3. Delete file from local disk if it was stored locally
  if (fileUrl && fileUrl.includes('/uploads/')) {
    try {
      const filename = fileUrl.split('/').pop();
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Successfully deleted local CV file from disk:", filename);
      }
    } catch (diskErr) {
      console.error("Failed to delete CV file from local disk:", diskErr.message);
    }
  }

  return res.json({ success: true, message: "Đã xóa CV thành công." });
});

// API: Get list of companies
app.get('/api/companies', async (req, res) => {
  if (isMock) {
    return res.json(mockCompanies);
  }

  const { data, error } = await supabase.from('companies').select('*');
  if (error) return res.status(400).json(error);
  return res.json(data);
});

// API: Get list of question banks
app.get('/api/questions', async (req, res) => {
  const { companyId, level } = req.query;

  if (isMock) {
    let list = [...mockQuestionBanks];
    if (companyId) {
      list = list.filter(qb => qb.company_id === companyId);
    }
    if (level) {
      list = list.filter(qb => qb.level === level);
    }
    return res.json(list);
  }

  let query = supabase.from('question_banks').select('*, companies(*)');
  if (companyId) {
    query = query.eq('company_id', companyId);
  }
  if (level) {
    query = query.eq('level', level);
  }

  const { data, error } = await query;
  if (error) return res.status(400).json(error);
  return res.json(data);
});

// API: Save a question bank
app.post('/api/questions', async (req, res) => {
  const { interviewerId, companyId, level, title, questions } = req.body;
  if (!companyId || !level || !title || !questions) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (isMock) {
    const newQb = {
      id: `qb-${Date.now()}`,
      company_id: companyId,
      level,
      title,
      questions
    };
    mockQuestionBanks.push(newQb);
    return res.status(201).json({ success: true, data: newQb });
  }

  const { data, error } = await supabase
    .from('question_banks')
    .insert([{ interviewer_id: interviewerId || null, company_id: companyId, level, title, questions }])
    .select();

  if (error) return res.status(400).json(error);
  return res.status(201).json({ success: true, data: data[0] });
});

// API: Start an interview session
app.post('/api/sessions/start', async (req, res) => {
  const { candidateId, cvId, companyId, level } = req.body;
  if (!candidateId || !companyId || !level) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (isMock) {
    let qBank = mockQuestionBanks.find(qb => qb.company_id === companyId && qb.level === level);
    if (!qBank) {
      // Generate fallback question bank dynamically
      qBank = getFallbackQuestionBank(companyId, level);
      mockQuestionBanks.push(qBank);
    }

    const sessionId = `session-${Date.now()}`;
    mockSessions[sessionId] = {
      id: sessionId,
      candidate_id: candidateId,
      cv_id: cvId,
      question_bank: qBank,
      current_question_index: 0,
      chat_history: [],
      status: 'ongoing'
    };

    return res.status(201).json({
      sessionId,
      questions: qBank.questions,
      currentQuestionIndex: 0,
      firstQuestion: qBank.questions[0]
    });
  }

  // Production Supabase flow
  const { data: qBanks, error: qError } = await supabase
    .from('question_banks')
    .select('*')
    .eq('company_id', companyId)
    .eq('level', level)
    .limit(1);

  if (qError || !qBanks || qBanks.length === 0) {
    return res.status(404).json({ error: "No question bank found for selected company & level" });
  }

  const qBank = qBanks[0];
  const { data: sessionData, error: sError } = await supabase
    .from('interview_sessions')
    .insert([{ candidate_id: candidateId, cv_id: cvId || null, question_bank_id: qBank.id }])
    .select();

  if (sError) return res.status(400).json(sError);

  const session = sessionData[0];
  return res.status(201).json({
    sessionId: session.id,
    questions: qBank.questions,
    currentQuestionIndex: 0,
    firstQuestion: qBank.questions[0]
  });
});

// API: Answer a question
app.post('/api/sessions/answer', async (req, res) => {
  const { sessionId, answer } = req.body;
  if (!sessionId || answer === undefined) {
    return res.status(400).json({ error: "Missing sessionId or answer" });
  }

  if (isMock) {
    const session = mockSessions[sessionId];
    if (!session) return res.status(404).json({ error: "Session not found" });

    const questions = session.question_bank.questions;
    const currentIndex = session.current_question_index;

    if (currentIndex >= questions.length) {
      return res.status(400).json({ error: "Interview session already completed" });
    }

    const currentQuestion = questions[currentIndex];
    
    // Find mock company name
    const comp = mockCompanies.find(c => c.id === session.question_bank.company_id);
    const targetCompany = comp ? comp.name : "Doanh nghiệp đối tác";
    const targetPosition = session.question_bank.title || "Lập trình viên";

    // Call AI evaluator with complete context, memory history, and index
    const evaluation = await evaluateAnswerWithAI(
      currentQuestion, 
      session.question_bank.level || 'medium', 
      answer,
      session.chat_history || [],
      targetCompany,
      targetPosition,
      currentIndex
    );

    session.chat_history.push({
      role: 'candidate',
      content: answer,
      question: currentQuestion,
      timestamp: new Date().toISOString()
    });

    session.chat_history.push({
      role: 'ai_evaluation',
      score: evaluation.score,
      techScore: evaluation.techScore,
      commScore: evaluation.commScore,
      confScore: evaluation.confScore,
      feedback: evaluation.feedback,
      sampleAnswer: evaluation.sampleAnswer,
      timestamp: new Date().toISOString()
    });

    const nextIndex = currentIndex + 1;
    const isCompleted = nextIndex >= questions.length;
    session.current_question_index = nextIndex;
    if (isCompleted) {
      session.status = 'completed';
    }

    return res.json({
      currentQuestionIndex: nextIndex,
      isCompleted,
      feedback: evaluation.feedback,
      sampleAnswer: evaluation.sampleAnswer,
      scores: {
        techScore: evaluation.techScore,
        commScore: evaluation.commScore,
        confScore: evaluation.confScore
      },
      nextQuestion: isCompleted ? null : questions[nextIndex]
    });
  }

  // Production Supabase flow with relational joins for target details
  const { data: sessions, error: sError } = await supabase
    .from('interview_sessions')
    .select('*, question_banks(*, companies(*))')
    .eq('id', sessionId)
    .limit(1);

  if (sError || !sessions || sessions.length === 0) {
    return res.status(404).json({ error: "Session not found" });
  }

  const session = sessions[0];
  const questions = session.question_banks.questions;
  const currentIndex = session.current_question_index;

  if (currentIndex >= questions.length) {
    return res.status(400).json({ error: "Session already completed" });
  }

  const currentQuestion = questions[currentIndex];
  
  const targetCompany = session.question_banks && session.question_banks.companies ? session.question_banks.companies.name : "Doanh nghiệp đối tác";
  const targetPosition = session.question_banks ? session.question_banks.title : "Lập trình viên";

  // Call AI evaluator with complete context, memory history, and index
  const evaluation = await evaluateAnswerWithAI(
    currentQuestion, 
    session.question_banks.level || 'medium', 
    answer,
    session.chat_history || [],
    targetCompany,
    targetPosition,
    currentIndex
  );

  const updatedHistory = [...session.chat_history];
  updatedHistory.push({ role: 'candidate', content: answer, question: currentQuestion, timestamp: new Date().toISOString() });
  updatedHistory.push({ 
    role: 'ai_evaluation', 
    score: evaluation.score, 
    techScore: evaluation.techScore,
    commScore: evaluation.commScore,
    confScore: evaluation.confScore,
    feedback: evaluation.feedback, 
    sampleAnswer: evaluation.sampleAnswer,
    timestamp: new Date().toISOString() 
  });

  const nextIndex = currentIndex + 1;
  const isCompleted = nextIndex >= questions.length;

  let finalScores = null;
  if (isCompleted) {
    const evaluations = updatedHistory.filter(h => h.role === 'ai_evaluation');
    const totalTech = evaluations.reduce((acc, curr) => acc + (curr.techScore || 0), 0);
    const totalComm = evaluations.reduce((acc, curr) => acc + (curr.commScore || 0), 0);
    const totalConf = evaluations.reduce((acc, curr) => acc + (curr.confScore || 0), 0);
    const count = evaluations.length || 1;
    finalScores = {
      techScore: parseFloat((totalTech / count).toFixed(1)),
      commScore: parseFloat((totalComm / count).toFixed(1)),
      confScore: parseFloat((totalConf / count).toFixed(1))
    };
  }

  const { data: updatedSession, error: uError } = await supabase
    .from('interview_sessions')
    .update({ 
      current_question_index: nextIndex, 
      chat_history: updatedHistory, 
      status: isCompleted ? 'completed' : 'ongoing',
      scores: finalScores
    })
    .eq('id', sessionId)
    .select();

  if (uError) return res.status(400).json(uError);

  return res.json({
    currentQuestionIndex: nextIndex,
    isCompleted,
    feedback: evaluation.feedback,
    sampleAnswer: evaluation.sampleAnswer,
    scores: {
      techScore: evaluation.techScore,
      commScore: evaluation.commScore,
      confScore: evaluation.confScore
    },
    nextQuestion: isCompleted ? null : questions[nextIndex]
  });
});

// API: Get list of interview sessions for a candidate
app.get('/api/sessions', async (req, res) => {
  const { candidateId } = req.query;
  if (!candidateId) return res.status(400).json({ error: "Missing candidateId query parameter" });

  if (isMock) {
    const list = Object.values(mockSessions).filter(s => s.candidate_id === candidateId);
    return res.json(list.map(s => {
      const comp = mockCompanies.find(c => c.id === s.question_bank.company_id);
      
      const evaluations = s.chat_history.filter(h => h.role === 'ai_evaluation');
      const avgScore = evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) / (evaluations.length || 1);

      return {
        id: s.id,
        created_at: new Date().toISOString(), // Mock value
        status: s.status,
        company_name: comp ? comp.name : "Doanh nghiệp đối tác",
        title: s.question_bank.title || "Lập trình viên",
        score: evaluations.length > 0 ? avgScore.toFixed(1) : "0.0"
      };
    }));
  }

  const { data, error } = await supabase
    .from('interview_sessions')
    .select(`
      id,
      created_at,
      status,
      chat_history,
      question_banks (
        title,
        companies (
          name
        )
      )
    `)
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json(error);

  return res.json(data.map(s => {
    const evaluations = s.chat_history ? s.chat_history.filter(h => h.role === 'ai_evaluation') : [];
    const avgScore = evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) / (evaluations.length || 1);
    return {
      id: s.id,
      created_at: s.created_at,
      status: s.status,
      company_name: s.question_banks && s.question_banks.companies ? s.question_banks.companies.name : "Doanh nghiệp đối tác",
      title: s.question_banks ? s.question_banks.title : "Lập trình viên",
      score: evaluations.length > 0 ? avgScore.toFixed(1) : "0.0"
    };
  }));
});

// Initialize global tracker for recruiter presence
if (!global.recruiterJoinedSessions) {
  global.recruiterJoinedSessions = {};
}

// API: Get status of a session (check if recruiter joined)
app.get('/api/sessions/status/:id', (req, res) => {
  const { id } = req.params;
  const joined = !!global.recruiterJoinedSessions[id];
  return res.json({ recruiterJoined: joined });
});

// API: Recruiter joins an active session
app.post('/api/sessions/join-recruiter', (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });
  global.recruiterJoinedSessions[sessionId] = true;
  return res.json({ success: true, recruiterJoined: true });
});

// API: Get list of active ongoing sessions
app.get('/api/sessions/active', async (req, res) => {
  if (isMock) {
    const list = Object.values(mockSessions).filter(s => s.status === 'ongoing');
    return res.json(list.map(s => {
      const comp = mockCompanies.find(c => c.id === s.question_bank.company_id);
      return {
        id: s.id,
        created_at: new Date().toISOString(),
        status: s.status,
        company_name: comp ? comp.name : "Doanh nghiệp đối tác",
        title: s.question_bank.title || "Lập trình viên",
        level: s.question_bank.level || "medium",
        recruiterJoined: !!global.recruiterJoinedSessions[s.id]
      };
    }));
  }

  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*, question_banks(*, companies(*))')
    .eq('status', 'ongoing')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json(error);

  return res.json(data.map(s => ({
    id: s.id,
    created_at: s.created_at,
    status: s.status,
    company_name: s.question_banks && s.question_banks.companies ? s.question_banks.companies.name : "Doanh nghiệp đối tác",
    title: s.question_banks ? s.question_banks.title : "Lập trình viên",
    level: s.question_banks ? s.question_banks.level : "medium",
    recruiterJoined: !!global.recruiterJoinedSessions[s.id]
  })));
});

// API: Get list of completed sessions (Interviewer view)
app.get('/api/sessions/completed', async (req, res) => {
  if (isMock) {
    const list = Object.values(mockSessions).filter(s => s.status === 'completed');
    return res.json(list.map(s => {
      const comp = mockCompanies.find(c => c.id === s.question_bank.company_id);
      const evaluations = s.chat_history.filter(h => h.role === 'ai_evaluation');
      const avgScore = evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) / (evaluations.length || 1);
      return {
        id: s.id,
        created_at: new Date().toISOString(),
        status: s.status,
        company_name: comp ? comp.name : "Doanh nghiệp đối tác",
        title: s.question_bank.title || "Lập trình viên",
        score: evaluations.length > 0 ? avgScore.toFixed(1) : "0.0",
        chat_history: s.chat_history
      };
    }));
  }

  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*, question_banks(*, companies(*))')
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json(error);

  return res.json(data.map(s => {
    const evaluations = s.chat_history ? s.chat_history.filter(h => h.role === 'ai_evaluation') : [];
    const avgScore = evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) / (evaluations.length || 1);
    return {
      id: s.id,
      created_at: s.created_at,
      status: s.status,
      company_name: s.question_banks && s.question_banks.companies ? s.question_banks.companies.name : "Doanh nghiệp đối tác",
      title: s.question_banks ? s.question_banks.title : "Lập trình viên",
      score: evaluations.length > 0 ? avgScore.toFixed(1) : "0.0",
      chat_history: s.chat_history
    };
  }));
});

// API: Get list of candidate CVs
app.get('/api/cvs', async (req, res) => {
  if (isMock) {
    return res.json(mockCvs);
  }

  const { data, error } = await supabase
    .from('cv_vault')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) return res.status(400).json(error);
  return res.json(data);
});

// Seed initial jobs matching the VietInterview AI jobs list
// Seed initial jobs matching the VietInterview AI jobs list (Strictly IT vacancies in Vietnam)
const seedJobs = [
  {
    id: 'job-x-1',
    title: 'Lập trình viên ReactJS / Frontend Developer',
    company: 'VNG Corporation',
    companyId: '33333333-3333-3333-3333-333333333333',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    salary: '18 - 30 triệu/tháng',
    jobType: 'Toàn thời gian',
    experience: '1 - 3 năm kinh nghiệm',
    posted: 'Đăng vào 2 ngày trước',
    level: 'medium',
    desc: 'Phát triển giao diện web cho các dịch vụ Zalo, Zing. Xây dựng các component ReactJS tối ưu hiệu suất tải trang, tương thích đa thiết bị và tích hợp API hệ thống backend.'
  },
  {
    id: 'job-x-2',
    title: 'Kỹ sư DevOps (Cloud & Infrastructure)',
    company: 'FPT Smart Cloud',
    companyId: '66666666-6666-6666-6666-666666666666',
    location: 'Hà Nội, Việt Nam',
    salary: '25 - 45 triệu/tháng',
    jobType: 'Toàn thời gian',
    experience: '2 - 4 năm kinh nghiệm',
    posted: 'Đăng vào 1 ngày trước',
    level: 'medium',
    desc: 'Thiết lập quy trình CI/CD tự động hóa việc build và deploy mã nguồn. Quản trị hạ tầng điện toán đám mây Kubernetes, AWS, Azure và FPT Cloud, đảm bảo tính ổn định và bảo mật của hệ thống.'
  },
  {
    id: 'job-x-3',
    title: 'Chuyên viên Kiểm thử Phần mềm (QA/QC Test Engineer)',
    company: 'FPT Software',
    companyId: '44444444-4444-4444-4444-444444444444',
    location: 'Đà Nẵng, Việt Nam',
    salary: '12 - 22 triệu/tháng',
    jobType: 'Toàn thời gian',
    experience: '1 - 2 năm kinh nghiệm',
    posted: 'Đăng vào 3 ngày trước',
    level: 'medium',
    desc: 'Lập kế hoạch kiểm thử sản phẩm phần mềm cho khách hàng toàn cầu. Viết testcase chi tiết, thực hiện kiểm thử thủ công (manual test), ghi nhận báo cáo lỗi trên Jira và phối hợp với đội dev khắc phục.'
  },
  {
    id: 'job-x-4',
    title: 'SOC Analyst (Giám sát An ninh mạng)',
    company: 'Viettel Cyber Security (VCS)',
    companyId: '11111111-1111-1111-1111-111111111111',
    location: 'Hà Nội, Việt Nam',
    salary: 'Thỏa thuận',
    jobType: 'Toàn thời gian',
    experience: 'Fresher / Junior',
    posted: 'Đăng vào 5 ngày trước',
    level: 'medium',
    desc: 'Giám sát và phân tích các cảnh báo bảo mật từ hệ thống SIEM. Thực hiện ứng cứu sự cố bước đầu đối với các cuộc tấn công DDoS, Phishing, Malware. Hỗ trợ xây dựng các playbook ứng phó sự cố an ninh thông tin.'
  }
];

let crawledJobs = [...seedJobs];

// Function to fetch real IT jobs from awesome-jobs/vietnam open issue board
const fetchRealITJobsFromGithub = () => {
  return new Promise((resolve) => {
    const https = require('https');
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: '/repos/awesome-jobs/vietnam/issues?state=open&per_page=30',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    https.get(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const issues = JSON.parse(data);
            const parsedJobs = issues.map((issue) => {
              const rawTitle = issue.title || "";
              
              // 1. Extract location
              let location = "Việt Nam";
              if (/hà nội|ha noi|hn/i.test(rawTitle)) location = "Hà Nội, Việt Nam";
              else if (/hồ chí minh|hcm|ho chi minh|sài gòn|sai gon/i.test(rawTitle)) location = "TP. Hồ Chí Minh, Việt Nam";
              else if (/đà nẵng|da nang/i.test(rawTitle)) location = "Đà Nẵng, Việt Nam";

              // 2. Extract salary
              let salary = "Thỏa thuận";
              const salaryMatch = rawTitle.match(/(?:up to|tới|lên đến|salary:?|lương:?)\s*(\d+(?:\s*-\s*\d+)?\s*(?:M|m|tr|triệu|USD|\$|K|k))/i) || rawTitle.match(/(\d+(?:\s*-\s*\d+)?\s*(?:M|m|tr|triệu|USD|\$|K|k))/i);
              if (salaryMatch) {
                salary = salaryMatch[1];
              }

              // 3. Extract company
              let company = "Doanh nghiệp đối tác (IT)";
              const companyMatch = rawTitle.match(/(?:at|for|join|@)\s*([A-Za-z0-9\s\.\,\-]+)/i);
              if (companyMatch) {
                company = companyMatch[1].trim();
              } else {
                company = issue.user ? issue.user.login : "Doanh nghiệp đối tác (IT)";
              }

              // Clean up title (remove bracket tags like [Hà Nội], [HCM])
              let cleanTitle = rawTitle.replace(/\[[^\]]+\]/g, "").replace(/\([^)]+\)/g, "").trim();
              if (cleanTitle.startsWith("-")) cleanTitle = cleanTitle.substring(1).trim();

              // 4. Extract difficulty level
              let level = "medium";
              if (/senior|lead|manager|expert/i.test(rawTitle)) level = "hard";
              else if (/junior|fresher|intern/i.test(rawTitle)) level = "easy";

              const desc = issue.body ? issue.body.substring(0, 800) + "..." : "Không có mô tả chi tiết.";

              return {
                id: `job-real-${issue.id}`,
                title: cleanTitle || rawTitle,
                company: company,
                companyId: `comp-real-${issue.id}`,
                location: location,
                salary: salary,
                jobType: "Toàn thời gian",
                experience: level === 'hard' ? 'Khó (Senior)' : level === 'easy' ? 'Dễ (Junior/Fresher)' : 'Trung bình (Mid-level)',
                posted: 'Cập nhật trực tiếp từ Vietnam IT Jobs',
                level: level,
                desc: desc
              };
            });
            resolve(parsedJobs);
          } catch (err) {
            console.error("Failed to parse GitHub jobs:", err);
            resolve([]);
          }
        } else {
          console.error("GitHub jobs API status:", response.statusCode);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.error("Failed to fetch GitHub jobs:", err);
      resolve([]);
    });
  });
};

// Seed initial jobs on startup from GitHub
fetchRealITJobsFromGithub().then((jobs) => {
  if (jobs && jobs.length > 0) {
    crawledJobs = jobs;
    console.log(`Successfully pre-loaded ${jobs.length} real IT jobs from GitHub on startup!`);
  }
});

// API: Get list of jobs
app.get('/api/jobs', (req, res) => {
  res.json(crawledJobs);
});

// API: Scrape active IT job vacancies in Vietnam
app.post('/api/jobs/crawl', async (req, res) => {
  try {
    const realJobs = await fetchRealITJobsFromGithub();
    if (realJobs && realJobs.length > 0) {
      crawledJobs = realJobs;
      return res.json({ success: true, count: realJobs.length, jobs: crawledJobs });
    } else {
      return res.status(500).json({ error: "Failed to scrape jobs from feed." });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// API: Automatically analyze job description and generate question bank using Gemini
app.post('/api/questions/generate-from-jd', async (req, res) => {
  const { candidateId, companyName, positionTitle, jobDescription, level } = req.body;
  if (!companyName || !positionTitle || !jobDescription) {
    return res.status(400).json({ error: "Missing required fields: companyName, positionTitle, jobDescription" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  let parsedContent = null;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `You are a professional hiring manager and technical interviewer.
Analyze the following job description for the company "${companyName}" and position "${positionTitle}".
Difficulty Level: "${level || 'medium'}"
Job Description: "${jobDescription}"

Compile a high-fidelity list of exactly 10 typical technical and behavioral interview questions tailored to this job description.
Return a JSON object containing:
- title: string (e.g. "Viettel Cyber Security SOC Analyst Interview")
- questions: array of exactly 10 strings (each being a clear, comprehensive interview question)`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      parsedContent = JSON.parse(response.text().trim());
    } catch (err) {
      console.error("Gemini JD generation error:", err.message);
    }
  }

  // Fallback if Gemini failed or no API key
  if (!parsedContent) {
    parsedContent = {
      title: `${companyName} - ${positionTitle} Interview Quiz`,
      questions: [
        `1. Hãy giới thiệu bản thân và kinh nghiệm của bạn liên quan đến vai trò ${positionTitle} tại ${companyName}?`,
        `2. Theo bạn, kỹ năng quan trọng nhất cần có cho công việc ${positionTitle} này là gì?`,
        `3. Bạn giải quyết vấn đề kỹ thuật phức tạp như thế nào trong môi trường thực chiến?`,
        `4. Làm thế nào để đảm bảo sản phẩm đạt chất lượng cao nhất?`,
        `5. Hãy kể lại một sự cố hệ thống bạn từng xử lý và bài học rút ra?`,
        `6. Bạn thiết lập quy trình tự động hóa kiểm thử hoặc deployment như thế nào?`,
        `7. Làm thế nào để phối hợp làm việc nhóm hiệu quả khi có bất đồng ý kiến?`,
        `8. Bạn cập nhật các xu hướng công nghệ mới như thế nào trong ngành?`,
        `9. Bạn tối ưu hiệu năng làm việc cá nhân của mình bằng công cụ nào?`,
        `10. Bạn có câu hỏi hay kỳ vọng gì về môi trường làm việc tại ${companyName}?`
      ]
    };
  }

  // Save the question bank
  let qbId = "";
  if (isMock) {
    let company = mockCompanies.find(c => c.name.toLowerCase().includes(companyName.toLowerCase()));
    if (!company) {
      company = {
        id: `c-${Date.now()}`,
        name: companyName,
        industry_domain: "Software & Technology"
      };
      mockCompanies.push(company);
    }
    qbId = `qb-jd-${Date.now()}`;
    const newQb = {
      id: qbId,
      company_id: company.id,
      level: level || 'medium',
      title: parsedContent.title,
      questions: parsedContent.questions
    };
    mockQuestionBanks.push(newQb);

    const sessionId = `session-jd-${Date.now()}`;
    mockSessions[sessionId] = {
      id: sessionId,
      candidate_id: candidateId || '00000000-0000-0000-0000-000000000000',
      cv_id: null,
      question_bank: newQb,
      current_question_index: 0,
      chat_history: [],
      level: level || 'medium',
      status: 'ongoing'
    };

    return res.status(201).json({
      sessionId,
      questions: newQb.questions,
      currentQuestionIndex: 0,
      firstQuestion: newQb.questions[0],
      companyName: companyName,
      level: level || 'medium'
    });
  }

  // Production Supabase flow
  try {
    let companyId = "";
    const { data: companies, error: cErr } = await supabase
      .from('companies')
      .select('id')
      .ilike('name', `%${companyName}%`)
      .limit(1);

    if (!cErr && companies && companies.length > 0) {
      companyId = companies[0].id;
    } else {
      const { data: newCompany, error: ncErr } = await supabase
        .from('companies')
        .insert([{ name: companyName, industry_domain: "Technology & Software" }])
        .select();
      if (ncErr || !newCompany || newCompany.length === 0) {
        const { data: fallbackCompanies } = await supabase.from('companies').select('id').limit(1);
        companyId = fallbackCompanies[0].id;
      } else {
        companyId = newCompany[0].id;
      }
    }

    const { data: newQBs, error: qbErr } = await supabase
      .from('question_banks')
      .insert([{
        company_id: companyId,
        level: level || 'medium',
        title: parsedContent.title,
        questions: parsedContent.questions
      }])
      .select();

    if (qbErr || !newQBs || newQBs.length === 0) {
      return res.status(400).json({ error: qbErr ? qbErr.message : "Failed to create question bank" });
    }

    const newQb = newQBs[0];

    const { data: sessionData, error: sError } = await supabase
      .from('interview_sessions')
      .insert([{
        candidate_id: candidateId || '00000000-0000-0000-0000-000000000000',
        cv_id: null,
        question_bank_id: newQb.id
      }])
      .select();

    if (sError || !sessionData || sessionData.length === 0) {
      return res.status(400).json({ error: sError ? sError.message : "Failed to create session" });
    }

    const session = sessionData[0];
    return res.status(201).json({
      sessionId: session.id,
      questions: newQb.questions,
      currentQuestionIndex: 0,
      firstQuestion: newQb.questions[0],
      companyName: companyName,
      level: level || 'medium'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// API: Generate questions only (for recruiter review)
app.post('/api/questions/generate-only', async (req, res) => {
  const { companyName, positionTitle, jobDescription, level } = req.body;
  if (!companyName || !positionTitle || !jobDescription) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  let parsedContent = null;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `You are a professional hiring manager and technical interviewer.
Analyze the following job description for the company "${companyName}" and position "${positionTitle}".
Difficulty Level: "${level || 'medium'}"
Job Description: "${jobDescription}"

Compile a list of exactly 10 typical technical and behavioral interview questions tailored to this job description.
Return a JSON object containing:
- title: string (e.g. "Viettel Cyber Security SOC Analyst Interview")
- questions: array of exactly 10 strings (each being a clear, comprehensive interview question)`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      parsedContent = JSON.parse(response.text().trim());
    } catch (err) {
      console.error("Gemini JD generation error:", err.message);
    }
  }

  if (!parsedContent) {
    parsedContent = {
      title: `${companyName} - ${positionTitle} Interview Quiz`,
      questions: [
        `Hãy giới thiệu bản thân và kinh nghiệm của bạn liên quan đến vai trò ${positionTitle} tại ${companyName}?`,
        `Theo bạn, kỹ năng quan trọng nhất cần có cho công việc ${positionTitle} này là gì?`,
        `Bạn giải quyết vấn đề kỹ thuật phức tạp như thế nào trong môi trường thực chiến?`,
        `Làm thế nào để đảm bảo sản phẩm đạt chất lượng cao nhất?`,
        `Hãy kể lại một sự cố hệ thống bạn từng xử lý và bài học rút ra?`,
        `Bạn thiết lập quy trình tự động hóa kiểm thử hoặc deployment như thế nào?`,
        `Làm thế nào để phối hợp làm việc nhóm hiệu quả khi có bất đồng ý kiến?`,
        `Bạn cập nhật các xu hướng công nghệ mới như thế nào trong ngành?`,
        `Bạn tối ưu hiệu năng làm việc cá nhân của mình bằng công cụ nào?`,
        `Bạn có câu hỏi hay kỳ vọng gì về môi trường làm việc tại ${companyName}?`
      ]
    };
  }

  return res.json(parsedContent);
});

// API: Crawl and parse JD from URL
app.post('/api/crawl-jd', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    // 1. Fetch raw HTML
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    const html = response.data;
    
    // 2. Load and parse with Cheerio
    const $ = cheerio.load(html);
    
    // Remove unwanted script & style elements
    $('script, style, nav, footer, header, iframe, noscript').remove();
    
    // Extract raw text
    const rawText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 10000);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Mock/fallback parser when Gemini key is missing
      const titleMatch = rawText.match(/(frontend|backend|fullstack|devops|security|engineer|developer|luật|trợ lý)/i);
      const companyMatch = url.match(/https?:\/\/(?:www\.)?([^\/\.]+)/i);
      
      const parsedMock = {
        company_name: companyMatch ? companyMatch[1].toUpperCase() : "Doanh nghiệp đối tác",
        job_title: titleMatch ? `${titleMatch[0]} Developer` : "Kỹ sư lập trình chuyên nghiệp",
        level: rawText.toLowerCase().includes('senior') ? 'hard' : rawText.toLowerCase().includes('intern') ? 'easy' : 'medium',
        requirements: ["Hiểu sâu về kiến trúc ứng dụng & tối ưu hiệu năng", "Khả năng tư duy logic và kỹ năng giải quyết vấn đề tốt", "Tiếng Anh chuyên ngành đọc hiểu tài liệu kỹ thuật"],
        desc: rawText.substring(0, 500) + "..."
      };
      
      return res.json({ success: true, data: parsedMock });
    }

    // 3. AI Extraction
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Hãy phân tích nội dung tuyển dụng dưới đây và trích xuất ra thông tin có cấu trúc dưới định dạng JSON.
Chỉ trả về JSON hợp lệ, không chứa mã markdown hoặc văn bản giải thích ngoài lề.

Cấu trúc JSON mong muốn:
{
  "company_name": "Tên công ty tuyển dụng",
  "job_title": "Tiêu đề công việc (ví dụ: Frontend Developer, Node.js Engineer...)",
  "level": "Cấp độ yêu cầu: easy (Intern/Fresher), medium (Junior/Mid), hard (Senior/Lead)",
  "requirements": ["Yêu cầu 1", "Yêu cầu 2", "Yêu cầu 3", ...],
  "desc": "Tóm tắt ngắn gọn mô tả công việc (khoảng 3-4 câu)"
}

Nội dung tuyển dụng:
${rawText}`;

    const result = await model.generateContent(prompt);
    const textResponse = await result.response;
    const parsed = JSON.parse(textResponse.text().trim());

    return res.json({ success: true, data: parsed });

  } catch (err) {
    console.error("Smart scraping error:", err.message);
    return res.status(500).json({ error: `Không thể tải hoặc phân tích nội dung từ liên kết: ${err.message}` });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
