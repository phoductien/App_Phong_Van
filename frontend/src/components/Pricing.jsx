import React, { useState } from 'react';

export default function Pricing({ user, onUpgradeTier }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1); // 1: details/QR, 2: processing, 3: success
  const [paymentMethod, setPaymentMethod] = useState('qr'); // 'qr', 'card', 'momo'

  const currentTier = user?.tier || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Gói Cơ Bản (Free)',
      price: '0đ',
      period: '/ vĩnh viễn',
      desc: 'Phù hợp cho ứng viên luyện tập làm quen.',
      features: [
        '3 lượt phỏng vấn AI mỗi tháng',
        'Đề thi từ ngân hàng câu hỏi công cộng',
        'Chấm điểm kỹ thuật cơ bản',
        'Xem nhận xét từ AI dạng tóm tắt'
      ],
      cta: currentTier === 'free' ? 'Đang Sử Dụng' : 'Hạ Cấp (Free)',
      disabled: currentTier === 'free',
      popular: false
    },
    {
      id: 'pro',
      name: 'Gói Chuyên Nghiệp (Pro)',
      price: '199.000đ',
      period: '/ tháng',
      desc: 'Lựa chọn tốt nhất cho ứng viên đang tìm việc gấp.',
      features: [
        'Không giới hạn lượt phỏng vấn AI',
        'Tự động cào JD và phân tích từ link tuyển dụng',
        'Chấm điểm chi tiết 3 khía cạnh (Tech, Comm, Conf)',
        'Xoay vòng hội đồng phỏng vấn (Tech Lead, HR, PM)',
        'Báo cáo phân tích điểm mạnh/yếu chi tiết'
      ],
      cta: currentTier === 'pro' ? 'Đang Sử Dụng' : 'Nâng Cấp Ngay',
      disabled: currentTier === 'pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Gói Doanh Nghiệp (Enterprise)',
      price: '5.990.000đ',
      period: '/ năm',
      desc: 'Dành cho các HR và quản trị viên tuyển dụng.',
      features: [
        'Cấu hình bộ câu hỏi độc quyền cho doanh nghiệp',
        'Theo dõi trực quan ứng viên làm bài thời gian thực',
        'Xem bản ghi webcam ứng viên kèm phân tích hành vi AI',
        'Xếp hạng ứng viên tự động dựa trên kết quả phỏng vấn',
        'Hỗ trợ tích hợp cổng ATS của doanh nghiệp'
      ],
      cta: currentTier === 'enterprise' ? 'Đang Sử Dụng' : 'Nâng Cấp Doanh Nghiệp',
      disabled: currentTier === 'enterprise',
      popular: false
    }
  ];

  const handleOpenPayment = (plan) => {
    if (plan.id === 'free') {
      if (onUpgradeTier) onUpgradeTier('free');
      alert('Đã chuyển tài khoản về gói Free thành công!');
      return;
    }
    setSelectedPlan(plan);
    setPaymentStep(1);
    setPaymentMethod('qr');
  };

  const handleSimulatePayment = () => {
    setPaymentStep(2);
    setTimeout(() => {
      setPaymentStep(3);
      if (onUpgradeTier && selectedPlan) {
        onUpgradeTier(selectedPlan.id);
        
        // Sync local users database as well so it persists
        const localUsers = JSON.parse(localStorage.getItem('x_local_users') || '[]');
        const updated = localUsers.map(u => {
          if (u.email.toLowerCase() === user?.email?.toLowerCase()) {
            return { ...u, tier: selectedPlan.id };
          }
          return u;
        });
        localStorage.setItem('x_local_users', JSON.stringify(updated));
      }
    }, 2000);
  };

  return (
    <div className="py-6 sm:py-8 font-sans bg-slate-50/20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Gói Dịch Vụ & Bảng Giá
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 sm:mt-3">
            Mở khóa đầy đủ tính năng thông minh để chuẩn bị tốt nhất cho buổi phỏng vấn của bạn.
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl shadow-sm border p-8 flex flex-col justify-between transition duration-200 hover:shadow-md ${
                plan.id === currentTier
                  ? 'border-indigo-600 ring-2 ring-indigo-600/10 bg-indigo-50/10 relative'
                  : plan.popular
                  ? 'border-indigo-500 bg-white relative'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.id === currentTier && (
                <span className="absolute top-0 right-6 transform -translate-y-1/2 bg-indigo-600 text-white px-3 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider">
                  Gói hiện tại
                </span>
              )}
              {plan.popular && plan.id !== currentTier && (
                <span className="absolute top-0 right-6 transform -translate-y-1/2 bg-amber-500 text-white px-3 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider">
                  Phổ biến nhất
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-sm font-semibold text-slate-500">{plan.period}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-slate-600">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => handleOpenPayment(plan)}
                  disabled={plan.disabled}
                  className={`w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold transition duration-150 ${
                    plan.disabled
                      ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200'
                      : plan.id === 'free'
                      ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      : plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Payment Modal */}
      {selectedPlan && (
        <div className="fixed z-50 inset-0 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 relative">
            
            {/* Close button */}
            {paymentStep !== 2 && (
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* STEP 1: PAYMENT FORM & DETAILS */}
            {paymentStep === 1 && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 border-b pb-3 flex items-center gap-2">
                  <span>💳 Cổng Thanh Toán Giả Lập</span>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-600 rounded-md border border-amber-200">Sandbox / Demo</span>
                </h3>

                <div className="mt-4 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                    <div>
                      <p className="text-slate-500 font-medium">Giao dịch:</p>
                      <p className="font-bold text-slate-800 text-base">{selectedPlan.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 font-medium">Tổng tiền:</p>
                      <p className="font-extrabold text-indigo-600 text-xl">{selectedPlan.price}</p>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Chọn phương thức thanh toán giả lập</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('qr')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition duration-150 ${
                          paymentMethod === 'qr'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xl">📲</span>
                        <span>Quét mã QR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition duration-150 ${
                          paymentMethod === 'card'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xl">💳 Thẻ Quốc Tế</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('momo')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 transition duration-150 ${
                          paymentMethod === 'momo'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xl">💗</span>
                        <span>Ví MoMo</span>
                      </button>
                    </div>
                  </div>

                  {/* Method Content */}
                  {paymentMethod === 'qr' && (
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      {/* Fake QR code using SVG */}
                      <div className="w-32 h-32 bg-white p-2 border border-slate-200 rounded-xl shadow-inner flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        <svg className="w-28 h-28 text-slate-800" viewBox="0 0 100 100" fill="none">
                          {/* Corner Squares */}
                          <rect x="5" y="5" width="25" height="25" stroke="currentColor" strokeWidth="6" fill="none" />
                          <rect x="11" y="11" width="13" height="13" fill="currentColor" />
                          
                          <rect x="70" y="5" width="25" height="25" stroke="currentColor" strokeWidth="6" fill="none" />
                          <rect x="76" y="11" width="13" height="13" fill="currentColor" />
                          
                          <rect x="5" y="70" width="25" height="25" stroke="currentColor" strokeWidth="6" fill="none" />
                          <rect x="11" y="76" width="13" height="13" fill="currentColor" />

                          {/* Random QR noise dots */}
                          <rect x="35" y="10" width="8" height="8" fill="currentColor" />
                          <rect x="50" y="5" width="12" height="12" fill="currentColor" />
                          <rect x="40" y="25" width="15" height="8" fill="currentColor" />
                          <rect x="5" y="40" width="8" height="15" fill="currentColor" />
                          <rect x="25" y="45" width="12" height="12" fill="currentColor" />
                          
                          <rect x="70" y="45" width="15" height="8" fill="currentColor" />
                          <rect x="85" y="35" width="8" height="20" fill="currentColor" />
                          <rect x="45" y="55" width="20" height="12" fill="currentColor" />
                          <rect x="55" y="75" width="10" height="15" fill="currentColor" />
                          <rect x="80" y="70" width="15" height="15" fill="currentColor" />
                          
                          {/* Center Viet-Interview Logo Symbol */}
                          <rect x="40" y="40" width="20" height="20" fill="#6366f1" rx="4" />
                          <path d="M45 45L55 55M55 45L45 55" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none"></div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 flex-1">
                        <p className="font-bold text-slate-800 text-sm">Hướng dẫn chuyển khoản QR:</p>
                        <p>🏦 Ngân hàng: **MB Bank (Giả lập)**</p>
                        <p>👤 Chủ tài khoản: **CÔNG TY HKT SOFTWARE**</p>
                        <p>🔢 Số tài khoản: **0909123456 (Giả lập)**</p>
                        <p>📝 Nội dung: **VIETINTERVIEW PRO {user?.email.split('@')[0].toUpperCase()}**</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Số thẻ Visa / Mastercard (Mô phỏng)</label>
                        <input
                          type="text"
                          readOnly
                          value="4111 2222 3333 4444"
                          className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none bg-white font-mono font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hạn dùng (MM/YY)</label>
                          <input
                            type="text"
                            readOnly
                            value="12/29"
                            className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none bg-white font-mono font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mã bảo mật (CVV)</label>
                          <input
                            type="text"
                            readOnly
                            value="321"
                            className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none bg-white font-mono font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'momo' && (
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#a20067] text-white flex items-center justify-center font-extrabold text-lg shadow-inner">
                          momo
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Thanh toán qua Ví MoMo</p>
                          <p className="text-xs text-slate-500">Số điện thoại kết nối: **{user?.email.split('@')[0]} (Giả lập)**</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">Đã kết nối</span>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 text-center italic">
                    * Lưu ý: Đây hoàn toàn là giao dịch mô phỏng phục vụ mục đích kiểm thử phần mềm MVP. Bạn sẽ không bị trừ bất kỳ khoản phí nào thật.
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition duration-150"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition duration-150"
                  >
                    ⚡ Xác nhận Thanh toán
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PROCESSING TRANSACTION */}
            {paymentStep === 2 && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center space-y-2">
                  <h4 className="text-lg font-bold text-slate-800">Đang xác thực giao dịch</h4>
                  <p className="text-xs text-slate-500 max-w-xs">Hệ thống đang kết nối ngân hàng để kiểm tra số dư và trạng thái chuyển khoản...</p>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT SUCCESS */}
            {paymentStep === 3 && (
              <div className="py-8 flex flex-col items-center justify-center space-y-6">
                {/* Success Animation Tick */}
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 text-4xl shadow-inner animate-bounce">
                  ✓
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-2xl font-bold text-emerald-600">Thanh Toán Thành Công!</h4>
                  <p className="text-sm text-slate-600">
                    Tài khoản của bạn đã được nâng cấp lên **{selectedPlan.name}** thành công.
                  </p>
                  <p className="text-xs text-slate-400">
                    Bạn hiện tại đã có toàn quyền truy cập các tính năng VIP thông minh.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition duration-150 mt-4"
                >
                  Tuyệt vời! Quay lại Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
