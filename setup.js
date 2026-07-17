const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=====================================================');
console.log('🚀 KHỞI TẠO CẤU HÌNH DỰ ÁN VIET-INTERVIEW AI MVP');
console.log('=====================================================\n');

// 1. Sao chép các tệp .env
const envsToCreate = [
  {
    src: path.join(__dirname, 'backend', '.env.example'),
    dest: path.join(__dirname, 'backend', '.env'),
    name: 'Backend .env'
  },
  {
    src: path.join(__dirname, 'frontend', '.env.example'),
    dest: path.join(__dirname, 'frontend', '.env'),
    name: 'Frontend .env'
  }
];

envsToCreate.forEach((item) => {
  if (fs.existsSync(item.dest)) {
    console.log(`✅ ${item.name} đã tồn tại. Bỏ qua sao chép.`);
  } else {
    try {
      fs.copyFileSync(item.src, item.dest);
      console.log(`(o) Đã tạo file cấu hình mới: ${item.name}`);
    } catch (err) {
      console.error(`❌ Không thể tạo ${item.name}:`, err.message);
    }
  }
});

console.log('\n-----------------------------------------------------');
console.log('📦 ĐANG CÀI ĐẶT CÁC THƯ VIỆN LIÊN QUAN (NPM INSTALL)');
console.log('-----------------------------------------------------\n');

const dirsToInstall = [
  { path: path.join(__dirname, 'backend'), name: 'Backend' },
  { path: path.join(__dirname, 'frontend'), name: 'Frontend' }
];

dirsToInstall.forEach((dir) => {
  console.log(`⏳ Đang chạy 'npm install' trong thư mục ${dir.name}...`);
  try {
    execSync('npm install', { cwd: dir.path, stdio: 'inherit' });
    console.log(`✅ Cài đặt thành công thư viện ${dir.name}!\n`);
  } catch (err) {
    console.error(`❌ Lỗi khi cài đặt thư viện ${dir.name}:`, err.message);
  }
});

console.log('=====================================================');
console.log('🎉 TOÀN BỘ QUÁ TRÌNH SETUP HOÀN TẤT!');
console.log('=====================================================');
console.log('\n💡 HƯỚNG DẪN TIẾP THEO:');
console.log('1. Mở file "backend/.env" và điền GEMINI_API_KEY để sử dụng AI thật.');
console.log('2. Mở 2 terminal riêng biệt:');
console.log('   - Terminal 1 (chạy Backend):');
console.log('     cd backend');
console.log('     npm start');
console.log('   - Terminal 2 (chạy Frontend):');
console.log('     cd frontend');
console.log('     npm run dev');
console.log('3. Truy cập địa chỉ http://localhost:5173 trên trình duyệt để trải nghiệm!\n');
