import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ContactPage = () => {
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    document.title = "Liên hệ - Liên Hoa Y";

    return (
        <div className="flex flex-col min-h-screen bg-[#fff7f3]">
            <Navbar user={user} />

            {/* Header */}
            <div className="pt-24 pb-10 text-center">
                <h1
                    className="text-4xl font-bold text-gray-800"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Liên Hệ
                </h1>
                <div className="w-16 h-1 bg-gray-300 mx-auto mt-4 rounded-full" />
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left */}
                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <h2
                        className="text-2xl font-bold text-gray-800"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Thông Tin Liên Hệ – Pháp Phục Liên Hoa Y:
                    </h2>

                    <p>Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn để mang đến trải nghiệm mua sắm tốt nhất cho quý khách.
                    </p>

                    <div className="space-y-1">
                        <p>
                            <strong>Địa chỉ:</strong> Trường Đại học FPT Hà Nội, Thạch Thất, Hà Nội
                        </p>
                        <p>
                            <strong>Phone – Zalo:</strong> 039 348 1970
                        </p>
                        <p>
                            <strong>Email:</strong> lienhoay.vn@gmail.com
                        </p>
                    </div>

                    <p>
                        Shop phục vụ giao hàng toàn quốc bằng hình thức:
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            Giao hàng nhanh nội thành trong ngày (có phí).

                        </li>
                        <li>Giao hàng tiêu chuẩn toàn quốc từ 2 – 4 ngày làm việc.
                        </li>
                    </ul>

                    <div className="pt-6 border-t border-gray-300">
                        <h3 className="text-lg font-semibold mb-3">
                            Các Kênh Mạng Xã Hội:
                        </h3>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition"
                            >
                                <FaFacebookF />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 text-white flex items-center justify-center hover:scale-110 transition"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition"
                            >
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right - Map */}
                <div className="w-full h-[420px] rounded-xl overflow-hidden shadow-lg border">
                    <iframe
                        title="Đại học FPT Hà Nội"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.485409294682!2d105.523106!3d21.013026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b2c44e8d7ff%3A0x45e2d48b8eabf3a2!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000000"
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />

                </div>
                
            </div>
        <Footer />
        </div>
    );
};

export default ContactPage;
