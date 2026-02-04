import React from "react";

function Footer() {
  return (
    <footer className="w-full">
      <div
        className="w-full text-left text-white"
        style={{ backgroundColor: "#122617" }}
      >
        {/* Full width, không padding trái/phải/bottom */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 pt-12">
          <div className="col-span-1">
            <div className="mb-4">
              <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="70" height="94" rx="6" stroke="#dcd7c6" strokeWidth="1.5" />
                <path d="M14 56c8-12 34-12 44 0" stroke="#dcd7c6" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M36 18v20" stroke="#dcd7c6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <ul className="text-sm text-gray-200 space-y-2">
              <li>✻ Địa chỉ cửa hàng: 65 Kim Mã, Ba Đình, Hà Nội</li>
              <li>✻ Mua online: 0702.690.884</li>
              <li>✻ Email: cskh@nhalua.vn</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif text-yellow-400 mb-4">Quan Trọng</h3>
            <ul className="text-gray-200 space-y-2">
              <li>Trang chủ</li>
              <li>Cửa hàng Nhà Lụa</li>
              <li>Về chúng tôi</li>
              <li>Liên hệ</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif text-yellow-400 mb-4">Hỗ Trợ Khách Hàng</h3>
            <ul className="text-gray-200 space-y-2">
              <li>Chính sách đổi hàng</li>
              <li>Chính sách giao nhận hàng</li>
              <li>Chính sách bảo mật thông tin</li>
              <li>Chính sách thanh toán</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <div className="w-full bg-white rounded overflow-hidden" style={{ height: 220 }}>
              <iframe
                title="map"
                src="https://www.google.com/maps?q=65%20Kim%20Ma%20Ba%20Dinh%20Hanoi&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full" style={{ backgroundColor: "#e9e0d0" }}>
        {/* Full width, không padding trái/phải/bottom */}
        <div className="w-full pt-6 text-center text-gray-800 text-sm">
          <div className="font-semibold">CÔNG TY TNHH THƯƠNG MẠI VÀ SẢN XUẤT KINA</div>
          <div className="mt-1">Địa chỉ: 654/4B Trung Nữ Vương, Phường Hòa Cường, TP Đà Nẵng, Việt Nam</div>
          <div className="mt-1">Mã số doanh nghiệp: 0402299830</div>
          <div className="mt-2">© 2025 Nhà Lụa</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
