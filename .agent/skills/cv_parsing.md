# Phân Tích CV (cv_parsing.md)

Hướng dẫn AI cách đọc, trích xuất thông tin từ file CV (PDF/Text) và đề xuất Lĩnh vực/Công ty phù hợp.

## Quy Trình Phân Tích CV

1.  **Trích xuất từ khóa chính (Keyword Extraction)**:
    *   **Kỹ năng kỹ thuật**: Ngôn ngữ lập trình, Frameworks, Cloud, Database, công cụ bảo mật, công cụ kiểm thử.
    *   **Kinh nghiệm làm việc**: Số năm kinh nghiệm, các dự án đã tham gia.
    *   **Vị trí mong muốn**: Định vị mục tiêu nghề nghiệp (Dev, QA, DevOps, Security).

2.  **Khớp Lĩnh Vực & Công Ty (Matching Logic)**:

    *   **VNG Corporation & FPT Software**:
        *   *Từ khóa*: React, Angular, Vue, Node.js, Python, Java, Django, Spring Boot, SQL, NoSQL, Pandas, NumPy, Machine Learning.
        *   *Vị trí phù hợp*: Full Stack, Backend, Frontend, Data Analysis.

    *   **Viettel Cyber Security (VCS) & NCS Group**:
        *   *Từ khóa*: Kali Linux, Metasploit, Wireshark, SOC, Pentest, OWASP, ISO 27001, Firewall, SIEM, CISSP, CEH.
        *   *Vị trí phù hợp*: Security, SOC, Pentest, Red Team.

    *   **NVIDIA Vietnam & FPT Smart Cloud**:
        *   *Từ khóa*: Docker, Kubernetes, CI/CD, Jenkins, GitHub Actions, AWS, Azure, GCP, QA/QC, Selenium, Jest, Automation Test, TCP/IP, Routing, Switching, GPU, CUDA.
        *   *Vị trí phù hợp*: DevOps, Cloud Systems, Site Reliability Engineer, Network Engineer.

3.  **Khớp Cấp Độ Sơ Bộ**:
    *   Dựa trên số năm kinh nghiệm hoặc cấp bậc ghi trong CV để gợi ý cấp độ:
        *   < 1 năm hoặc Thực tập -> **Intern / Fresher**.
        *   1 - 3 năm -> **Junior**.
        *   > 3 - 5 năm trở lên -> **Senior**.
