import React, { useState, useRef } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import ChatBox from "./ChatBox";
import ScrollToTopButton from "../ScrollToTopButton";
import { FaCheckCircle, FaTshirt, FaHeadset, FaLeaf } from "react-icons/fa";

const AboutPage = () => {
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const mainRef = useRef(null);
  document.title = "Giới thiệu - Liên Hoa Y";

  return (
    <div className="flex h-screen bg-[#fff7f3] overflow-hidden">
      <Navbar user={user} />

      <main
        ref={mainRef}
        className="flex-1 pt-12 overflow-y-auto space-y-20"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE
        }}
      >
        {/* hide scrollbar Chrome/Safari */}
        <style>
          {`
            main::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {/* ================= GIỚI THIỆU ================= */}
        <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu chuyện của chúng tôi
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Pháp Phục Liên Hoa Y ra đời từ mong muốn mang đến những bộ trang phục
              giản dị, tinh tế, giúp người mặc cảm nhận được sự an lạc trong từng
              chuyển động thường nhật.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi kết hợp chất liệu tự nhiên, thiết kế tối giản và kỹ thuật
              may đo tỉ mỉ để tạo nên những sản phẩm vừa đẹp, vừa bền, vừa phù hợp
              với đời sống tu tập và thiền định.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl group">
            <img
              src="/images/mau1.png"
              alt="Giới thiệu"
              className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <p className="text-sm uppercase tracking-widest">
                Tinh tế · Thanh tịnh
              </p>
              <h3 className="text-xl font-semibold">
                Pháp phục cho đời sống thiền
              </h3>
            </div>
          </div>
        </section>

        {/* ================= SỨ MỆNH ================= */}
        <section className="bg-gradient-to-br from-[#fff1e6] to-[#fff9f4] py-20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/images/mau7.png"
                alt="Mission"
                className="w-full h-[360px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Chúng tôi mong muốn lan tỏa tinh thần an lạc thông qua từng thiết
                kế, giúp người mặc cảm nhận được sự thư thái, tĩnh lặng và hài hòa
                trong đời sống hiện đại.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Mỗi bộ pháp phục không chỉ là trang phục, mà còn là một người bạn
                đồng hành trên hành trình tu tập và phát triển nội tâm.
              </p>

              <div className="mt-6 flex items-center gap-3 text-[#8b5e3c] font-semibold">
                <FaLeaf />
                <span>Giản dị – Bền vững – Tỉnh thức</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= GIÁ TRỊ CỐT LÕI ================= */}
        <section className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Vì sao khách hàng chọn chúng tôi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#fde8d8] text-[#b45c2e] text-2xl mb-4 mx-auto">
                <FaCheckCircle />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Chất lượng tuyển chọn
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Chất liệu tự nhiên, đường may chắc chắn, form dáng thoải mái, bền
                đẹp theo thời gian.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#e8f3ff] text-[#3b82f6] text-2xl mb-4 mx-auto">
                <FaTshirt />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Thiết kế tinh tế
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Kiểu dáng tối giản, trang nhã, phù hợp cả trong thiền viện lẫn đời
                sống thường nhật.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#e9f9ef] text-[#22c55e] text-2xl mb-4 mx-auto">
                <FaHeadset />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Đồng hành tận tâm
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Tư vấn kỹ lưỡng, hỗ trợ nhanh chóng trước – trong – sau khi mua
                hàng.
              </p>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="relative rounded-[36px] overflow-hidden shadow-xl bg-gradient-to-r from-[#7a1414] to-[#b22a2a]">
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/anhnen.png')" }}
            />

            <div className="relative z-10 px-10 py-14 text-center text-white">
              <h3 className="text-3xl font-bold mb-4">
                Đồng hành cùng bạn trên hành trình an lạc
              </h3>
              <p className="max-w-xl mx-auto text-white/90 mb-6">
                Khám phá bộ sưu tập pháp phục tinh tế, nhẹ nhàng và đầy chánh niệm
                ngay hôm nay.
              </p>
              <button className="bg-white text-[#7a1414] font-semibold px-8 py-3 rounded-full shadow hover:scale-105 transition">
                Khám phá ngay
              </button>
            </div>
          </div>
        </section>

        <ScrollToTopButton targetRef={mainRef} />
        <ChatBox />
        <Footer />
      </main>
    </div>
  );
};

export default AboutPage;
