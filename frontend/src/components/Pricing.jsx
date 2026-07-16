import React from 'react';

export default function Pricing() {
  const plans = [
    {
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
      cta: 'Đang Sử Dụng',
      current: true,
      popular: false
    },
    {
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
      cta: 'Nâng Cấp Ngay',
      current: false,
      popular: true
    },
    {
      name: 'Gói Doanh Nghiệp (Enterprise)',
      price: 'Liên hệ',
      period: '',
      desc: 'Dành cho các HR và quản trị viên tuyển dụng.',
      features: [
        'Cấu hình bộ câu hỏi độc quyền cho doanh nghiệp',
        'Theo dõi trực quan ứng viên làm bài thời gian thực',
        'Xem bản ghi webcam ứng viên kèm phân tích hành vi AI',
        'Xếp hạng ứng viên tự động dựa trên kết quả phỏng vấn',
        'Hỗ trợ tích hợp cổng ATS của doanh nghiệp'
      ],
      cta: 'Liên Hệ Ngay',
      current: false,
      popular: false
    }
  ];

  return (
    <div className="py-6 sm:py-8 font-sans bg-slate-50/20">
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
                plan.popular
                  ? 'border-indigo-600 ring-2 ring-indigo-600/10 bg-white relative'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-6 transform -translate-y-1/2 bg-indigo-600 text-white px-3 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider">
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
                        {/* Check icon */}
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
                  onClick={() => alert(`Cảm ơn bạn đã quan tâm đến ${plan.name}!`)}
                  className={`w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold transition duration-150 ${
                    plan.current
                      ? 'bg-slate-100 text-slate-600 cursor-default'
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
    </div>
  );
}
