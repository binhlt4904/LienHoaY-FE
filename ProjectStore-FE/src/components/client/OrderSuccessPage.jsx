import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";

const OrderSuccessPage = () => {
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    document.title = "Đặt hàng thành công - Liên Hoa Y";

    return (
        <div className="flex flex-col min-h-screen bg-[#f6f1e7]">
            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl border border-red-100 p-8 text-center mt-20">
                        <CheckCircle className="mx-auto text-[#7a1414] w-20 h-20" />
                        <h2 className="text-3xl font-bold text-[#7a1414] mt-4">
                            Đặt hàng thành công
                        </h2>
                        <p className="text-[#5a4636] mt-2 text-lg">
                            Cảm ơn bạn đã đặt hàng tại Liên Hoa Y.
                            Đơn hàng của bạn đang được chúng tôi xác nhận và chuẩn bị giao.
                        </p>
                        <div className="mt-6 text-left bg-[#faf7f2] rounded-xl p-5 border border-red-100">
                            <h3 className="font-semibold text-[#7a1414] mb-3">
                                Thông tin giao hàng
                            </h3>
                            <p className="text-[#5a4636]">
                                <strong>Người nhận:</strong> {user?.fullname || "Nguyễn Văn A"}
                            </p>

                            <p className="text-[#5a4636]">
                                <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP. Hồ Chí Minh
                            </p>

                            <p className="text-[#5a4636]">
                                <strong>SĐT:</strong> 0909 123 456
                            </p>

                            <p className="text-[#5a4636]">
                                <strong>Dự kiến giao:</strong> 2 – 3 ngày làm việc
                            </p>
                        </div>


                        {/* Nút điều hướng */}
                        <div className="mt-8 space-x-4">
                            <Link
                                to="/"
                                className="bg-[#7a1414] hover:bg-[#5c0f0f] text-white px-6 py-2.5 rounded-lg transition"
                            >
                                Về trang chủ
                            </Link>
                            <Link
                                to="/my-orders"
                                className="border border-[#7a1414] text-[#7a1414] px-6 py-2.5 rounded-lg hover:bg-red-50 transition"
                            >
                                Xem đơn hàng
                            </Link>
                        </div>
                    </div>
                    <div className="mt-12">
                    </div>
                </main>
            </div>
            <Footer user={user} />
        </div>
    );
};

export default OrderSuccessPage;
