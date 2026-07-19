import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  FormField,
  Select,
  Button,
  Container,
  Header,
  SpaceBetween,
  Alert,
  Input,
  Spinner,
  Grid,
  Box,
  ProgressBar,
  Badge
} from '@cloudscape-design/components';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function StartInterview({ onStartSession, user, userId = '00000000-0000-0000-0000-000000000000' }) {
  const [cvOptions, setCvOptions] = useState([]);
  const [selectedCv, setSelectedCv] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [companyOptions, setCompanyOptions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);
  
  // Quick CV upload
  const [newCvUrl, setNewCvUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Simulated CV analysis results
  const [cvAnalysis, setCvAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // --- Device Check States ---
  const [showCameraCheck, setShowCameraCheck] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [micLevel, setMicLevel] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/sessions?candidateId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          const completed = data.filter(s => s.status === 'completed').length;
          setCompletedSessionsCount(completed);
        }
      } catch (err) {
        console.error("Failed to fetch sessions count:", err);
      }
    };
    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const cvRes = await fetch(`${API_BASE}/api/cv?userId=${userId}`);
        let cvs = [];
        if (cvRes.ok) {
          cvs = await cvRes.json();
        }
        
        const compRes = await fetch(`${API_BASE}/api/companies`);
        let comps = [];
        if (compRes.ok) {
          comps = await compRes.json();
        }

        const formattedCvs = cvs.map(cv => ({
          label: cv.file_url.split('/').pop() || 'CV Document',
          value: cv.id
        }));
        setCvOptions(formattedCvs);

        const formattedComps = comps.map(c => ({
          label: c.name,
          description: c.industry_domain,
          value: c.id
        }));
        setCompanyOptions(formattedComps);
        
        setErrorMsg('');
      } catch (err) {
        console.error(err);
        setErrorMsg('Không thể kết nối đến server API. Vui lòng kiểm tra backend.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  // Simulate CV analysis when CV and Company are both selected
  useEffect(() => {
    if (selectedCv && selectedCompany) {
      setAnalyzing(true);
      const timer = setTimeout(() => {
        const nameLower = selectedCompany.label.toLowerCase();
        const isCybersecurity = nameLower.includes('viettel') || nameLower.includes('ncs');
        const isCloudDevOps = nameLower.includes('nvidia') || nameLower.includes('smart cloud');
        const isSoftware = nameLower.includes('vng') || nameLower.includes('fpt software');
        
        let matchRate = 72;
        let skills = ['Git', 'REST API', 'SQL'];
        let missing = ['System Design'];

        if (isCloudDevOps) {
          matchRate = 88;
          skills = ['Docker', 'Kubernetes', 'CI/CD', 'Linux Shell', 'Python', 'Prometheus', 'Terraform'];
          missing = ['AWS Cloud Security', 'GPU Hardware optimization'];
        } else if (isCybersecurity) {
          matchRate = 81;
          skills = ['Linux Security', 'Wireshark', 'Metasploit', 'Network Security', 'OWASP Top 10'];
          missing = ['SIEM tools', 'Incident Response playbooks'];
        } else if (isSoftware) {
          matchRate = 79;
          skills = ['React.js', 'Node.js', 'Express', 'MongoDB', 'Javascript', 'HTML5/CSS3'];
          missing = ['GraphQL', 'Microservices Architecture'];
        }

        setCvAnalysis({
          matchRate,
          skills,
          missing,
          scorecard: {
            experience: 'Phù hợp (2 năm kinh nghiệm thực tế)',
            language: 'Tiếng Anh tốt (đọc tài liệu, giao tiếp cơ bản)',
            fit: 'Tư duy giải thuật vững vàng'
          }
        });
        setAnalyzing(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCvAnalysis(null);
    }
  }, [selectedCv, selectedCompany]);

  // --- Device Check Stream Logic ---
  useEffect(() => {
    if (!showCameraCheck) return;

    let activeStream = null;
    let audioCtx = null;
    let analyserNode = null;
    let animationFrameId = null;

    async function initMedia() {
      try {
        // Enumerate devices
        const devList = await navigator.mediaDevices.enumerateDevices().catch(() => []);
        const videoInput = devList.filter(d => d.kind === 'videoinput');
        const audioInput = devList.filter(d => d.kind === 'audioinput');

        setVideoDevices(videoInput.map(d => ({ label: d.label || `Camera ${videoInput.indexOf(d) + 1}`, value: d.deviceId })));
        setAudioDevices(audioInput.map(d => ({ label: d.label || `Microphone ${audioInput.indexOf(d) + 1}`, value: d.deviceId })));

        // Request stream
        const videoConstraints = isCameraOn
          ? (selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice.value } } : true)
          : false;

        const audioConstraints = isMicOn
          ? (selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice.value } } : true)
          : false;

        if (videoConstraints || audioConstraints) {
          activeStream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: audioConstraints
          });

          setCameraStream(activeStream);

          if (videoRef.current && activeStream.getVideoTracks().length > 0) {
            videoRef.current.srcObject = activeStream;
          }

          // Visual Audio Level (Web Audio API)
          if (isMicOn && activeStream.getAudioTracks().length > 0) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(activeStream);
            analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 256;
            source.connect(analyserNode);
            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVolume = () => {
              if (!analyserNode) return;
              analyserNode.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const average = sum / bufferLength;
              setMicLevel(average);
              animationFrameId = requestAnimationFrame(updateVolume);
            };
            updateVolume();
          }
        }
      } catch (err) {
        console.error("Camera/Mic access error:", err);
      }
    }

    initMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
      if (audioCtx) {
        audioCtx.close();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setCameraStream(null);
      setMicLevel(0);
    };
  }, [showCameraCheck, isCameraOn, isMicOn, selectedVideoDevice, selectedAudioDevice]);

  const handleAddCv = async () => {
    if (!newCvUrl) return;
    try {
      setUploading(true);
      const res = await fetch(`${API_BASE}/api/cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fileUrl: newCvUrl })
      });
      if (res.ok) {
        const newCv = await res.json();
        const option = { label: newCv.file_url.split('/').pop(), value: newCv.id };
        setCvOptions(prev => [option, ...prev]);
        setSelectedCv(option);
        setNewCvUrl('');
      } else {
        setErrorMsg('Không thể lưu CV mới.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối khi tải CV.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadSelectedFile = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      try {
        setUploading(true);
        setErrorMsg('');
        const res = await fetch(`${API_BASE}/api/cv/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            filename: selectedFile.name,
            base64Data: base64Data
          })
        });

        if (res.ok) {
          const newCv = await res.json();
          const option = { label: `📁 ${newCv.file_url.split('/').pop()}`, value: newCv.id };
          setCvOptions(prev => [option, ...prev]);
          setSelectedCv(option);
          setSelectedFile(null);
        } else {
          const errData = await res.json();
          setErrorMsg(errData.error || 'Lỗi khi tải file CV lên.');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Lỗi kết nối máy chủ khi upload file.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!selectedCompany || !selectedLevel) {
      setErrorMsg('Vui lòng chọn Công ty và Vị trí/Cấp độ.');
      return;
    }

    // Check Free tier limit
    const userTier = user?.tier || 'free';
    if (userTier === 'free' && completedSessionsCount >= 3) {
      setErrorMsg('Bạn đã hết lượt phỏng vấn miễn phí. Vui lòng nâng cấp tài khoản để luyện tập không giới hạn!');
      return;
    }

    // Trigger Device Check Screen
    setShowCameraCheck(true);
  };

  const startSessionAfterCheck = async () => {
    // Stop check camera stream before entering session
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await fetch(`${API_BASE}/api/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: userId,
          cvId: selectedCv ? selectedCv.value : null,
          companyId: selectedCompany.value,
          level: selectedLevel.value
        })
      });

      if (res.ok) {
        const sessionInfo = await res.json();
        onStartSession({
          sessionId: sessionInfo.sessionId,
          questions: sessionInfo.questions,
          currentQuestionIndex: sessionInfo.currentQuestionIndex,
          firstQuestion: sessionInfo.firstQuestion,
          companyName: selectedCompany.label,
          level: selectedLevel.value
        });
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Không tìm thấy bộ đề câu hỏi phù hợp cho công ty này.');
        setShowCameraCheck(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Lỗi kết nối khi khởi tạo phiên phỏng vấn.');
      setShowCameraCheck(false);
    } finally {
      setLoading(false);
    }
  };

  // Render Device Check Screen
  if (showCameraCheck) {
    return (
      <Container
        header={
          <Header
            variant="h2"
            description="Vui lòng cấu hình các thiết bị thu hình và ghi âm của bạn trước khi bắt đầu phỏng vấn."
          >
            📹 Kiểm Tra Thiết Bị (Camera & Microphone)
          </Header>
        }
      >
        <Grid gridDefinition={[{ colspan: 7 }, { colspan: 5 }]}>
          {/* Left Panel: Camera Stream & Audio level meter */}
          <div className="space-y-4 pr-4">
            <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-750 overflow-hidden flex items-center justify-center shadow-inner">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="text-center text-slate-400 p-6">
                  <div className="text-5xl mb-3">🎥</div>
                  <p className="text-sm font-semibold">Camera của bạn đang tắt</p>
                  <p className="text-xs text-slate-500 mt-1">Bật camera để chuẩn bị cho giao tiếp hình ảnh</p>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cameraStream ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {cameraStream ? 'Camera Hoạt Động' : 'Chưa Kết Nối'}
              </div>
            </div>

            {/* Device Toggles */}
            <div className="flex gap-4">
              <Button
                variant={isCameraOn ? "normal" : "primary"}
                onClick={() => setIsCameraOn(!isCameraOn)}
              >
                {isCameraOn ? '🔇 Tắt Camera' : '🎥 Bật Camera'}
              </Button>
              <Button
                variant={isMicOn ? "normal" : "primary"}
                onClick={() => setIsMicOn(!isMicOn)}
              >
                {isMicOn ? '🔇 Tắt Microphone' : '🎙️ Bật Microphone'}
              </Button>
            </div>

            {/* Microphone Volume Meter */}
            <div className="bg-slate-100/80 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-350 mb-2">
                <span>🎙️ Tín hiệu âm thanh (Microphone):</span>
                <span>{isMicOn ? (micLevel > 15 ? 'Hoạt động tốt' : 'Không có âm thanh') : 'Đã tắt'}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-75 ${micLevel > 60 ? 'bg-green-500' : 'bg-indigo-500'}`}
                  style={{ width: `${isMicOn ? Math.min(100, (micLevel / 150) * 100) : 0}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">Nói thử để kiểm tra xem thanh tín hiệu âm thanh có phản hồi hay không.</p>
            </div>
          </div>

          {/* Right Panel: Settings and Confirmation */}
          <div className="space-y-6 pl-4 border-l border-slate-200 dark:border-slate-800/80">
            <SpaceBetween direction="vertical" size="m">
              <FormField label="Chọn Thiết bị Camera">
                <Select
                  selectedOption={selectedVideoDevice}
                  onChange={({ detail }) => setSelectedVideoDevice(detail.selectedOption)}
                  options={videoDevices}
                  placeholder={videoDevices.length > 0 ? "Chọn Camera..." : "Không tìm thấy Camera"}
                  disabled={!isCameraOn}
                />
              </FormField>

              <FormField label="Chọn Thiết bị Microphone">
                <Select
                  selectedOption={selectedAudioDevice}
                  onChange={({ detail }) => setSelectedAudioDevice(detail.selectedOption)}
                  options={audioDevices}
                  placeholder={audioDevices.length > 0 ? "Chọn Microphone..." : "Không tìm thấy Microphone"}
                  disabled={!isMicOn}
                />
              </FormField>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
                <h4 className="text-xs font-extrabold uppercase text-slate-450 tracking-wider mb-2">Thông tin buổi phỏng vấn</h4>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-350 leading-relaxed">
                  <li>🏢 <strong>Doanh nghiệp mục tiêu:</strong> {selectedCompany.label}</li>
                  <li>🏆 <strong>Cấp độ phỏng vấn:</strong> {selectedLevel.label}</li>
                  {selectedCv && <li>📄 <strong>CV sử dụng:</strong> {selectedCv.label}</li>}
                </ul>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button
                  variant="primary"
                  onClick={startSessionAfterCheck}
                  disabled={loading}
                >
                  {loading ? <Spinner size="normal" /> : 'Xác nhận & Vào phòng phỏng vấn 🚀'}
                </Button>
                <Button
                  variant="link"
                  onClick={() => {
                    setShowCameraCheck(false);
                  }}
                  disabled={loading}
                >
                  Quay lại thiết lập
                </Button>
              </div>
            </SpaceBetween>
          </div>
        </Grid>
      </Container>
    );
  }

  return (
    <Grid gridDefinition={[{ colspan: 7 }, { colspan: 5 }]}>
      <Container header={<Header variant="h2" description="Lập cấu hình phỏng vấn cá nhân hóa">Thiết Lập Phiên Luyện Tập</Header>}>
        {errorMsg && (
          <Alert type="error" dismissible onDismiss={() => setErrorMsg('')} header="Lỗi hệ thống">
            {errorMsg}
          </Alert>
        )}

        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => {
                setSelectedCv(null);
                setSelectedCompany(null);
                setSelectedLevel(null);
              }}>Hủy</Button>
              <Button 
                variant="primary" 
                onClick={handleStart}
                disabled={loading || !selectedCompany || !selectedLevel}
              >
                Bắt Đầu Ngay
              </Button>
            </SpaceBetween>
          }
        >
          <SpaceBetween direction="vertical" size="l">
            {/* Quick CV Section */}
            <div style={{ border: '1px dashed #d1d5db', padding: '16px', borderRadius: '8px', background: '#fafafa' }}>
              <FormField label="1. Tải lên CV mới của bạn">
                <SpaceBetween direction="vertical" size="s">
                  {/* File Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      id="cv-file-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      onClick={() => document.getElementById('cv-file-upload').click()}
                      disabled={uploading}
                      iconName="upload"
                    >
                      Chọn file từ thiết bị (.pdf, .doc, .docx)
                    </Button>
                    {selectedFile && (
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📁 {selectedFile.name}
                      </span>
                    )}
                    {selectedFile && (
                      <Button
                        onClick={handleUploadSelectedFile}
                        disabled={uploading}
                        variant="primary"
                      >
                        {uploading ? <Spinner size="normal" /> : 'Tải lên'}
                      </Button>
                    )}
                  </div>

                  <div style={{ position: 'relative', margin: '8px 0', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: 'full', borderTop: '1px solid #e2e8f0', flexGrow: 1 }}></div>
                    </div>
                    <span style={{ position: 'relative', padding: '0 8px', backgroundColor: '#fafafa', fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>
                      Hoặc nhập link trực tiếp
                    </span>
                  </div>

                  <SpaceBetween direction="horizontal" size="xs">
                    <div style={{ flexGrow: 1 }}>
                      <Input
                        value={newCvUrl}
                        onChange={({ detail }) => setNewCvUrl(detail.value)}
                        placeholder="https://supabase-storage-url.com/cv.pdf"
                      />
                    </div>
                    <Button onClick={handleAddCv} disabled={uploading || !newCvUrl}>
                      {uploading ? <Spinner size="normal" /> : 'Nhập Link'}
                    </Button>
                  </SpaceBetween>
                </SpaceBetween>
              </FormField>
            </div>

            <FormField label="2. Chọn CV trong hồ sơ để phân tích">
              <Select
                selectedOption={selectedCv}
                onChange={({ detail }) => setSelectedCv(detail.selectedOption)}
                options={cvOptions}
                placeholder="Chọn CV đã lưu..."
                empty="Không tìm thấy CV. Vui lòng thêm CV ở khung trên."
              />
            </FormField>

            <FormField label="3. Chọn Công ty & Vị trí mục tiêu">
              <Select
                selectedOption={selectedCompany}
                onChange={({ detail }) => setSelectedCompany(detail.selectedOption)}
                options={companyOptions}
                placeholder="Chọn công ty tuyển dụng..."
              />
            </FormField>

            <FormField label="4. Chọn Cấp độ Thử thách">
              <Select
                selectedOption={selectedLevel}
                onChange={({ detail }) => setSelectedLevel(detail.selectedOption)}
                options={[
                  { label: "Intern / Fresher (Cấp độ Dễ - ez)", value: "ez" },
                  { label: "Junior (Cấp độ Trung bình - medium)", value: "medium" },
                  { label: "Senior (Cấp độ Khó - hard)", value: "hard" }
                ]}
                placeholder="Chọn cấp độ phỏng vấn..."
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </Container>

      {/* CV matching panel inspired by X-Interview */}
      <div style={{ paddingLeft: '16px' }}>
        <Container header={<Header variant="h2">AI Analysis & Match Rate</Header>}>
          {analyzing ? (
            <SpaceBetween size="m" direction="vertical" align="center">
              <Spinner size="large" />
              <div>AI đang phân tích độ phù hợp CV của bạn...</div>
            </SpaceBetween>
          ) : cvAnalysis ? (
            <SpaceBetween size="l" direction="vertical">
              <div>
                <Box variant="h3" style={{ marginBottom: '8px' }}>Tỷ Lệ Khớp Yêu Cầu Công Việc</Box>
                <ProgressBar
                  value={cvAnalysis.matchRate}
                  label={`${cvAnalysis.matchRate}% Match Rate`}
                  variant="success"
                />
              </div>

              <div>
                <Box variant="awsui-key-label" style={{ marginBottom: '6px' }}>Kỹ năng phù hợp phát hiện trong CV:</Box>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {cvAnalysis.skills.map((skill, idx) => (
                    <Badge key={idx} color="green">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Box variant="awsui-key-label" style={{ marginBottom: '6px' }}>Kỹ năng cần bổ sung / cải thiện:</Box>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {cvAnalysis.missing.map((item, idx) => (
                    <Badge key={idx} color="red">{item}</Badge>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e9e9e9', paddingTop: '12px' }}>
                <Box variant="h4" style={{ marginBottom: '8px' }}>Tóm tắt đánh giá sơ bộ</Box>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', lineHeight: '1.8' }}>
                  <li><strong>Kinh nghiệm:</strong> {cvAnalysis.scorecard.experience}</li>
                  <li><strong>Ngoại ngữ:</strong> {cvAnalysis.scorecard.language}</li>
                  <li><strong>Tư duy:</strong> {cvAnalysis.scorecard.fit}</li>
                </ul>
              </div>
            </SpaceBetween>
          ) : (
            <Box variant="p" color="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
              Vui lòng chọn cả <strong>CV</strong> và <strong>Công ty mục tiêu</strong> để kích hoạt phân tích trích xuất kỹ năng từ hệ thống X-Interview AI.
            </Box>
          )}
        </Container>
      </div>
    </Grid>
  );
}
