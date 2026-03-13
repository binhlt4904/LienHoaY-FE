import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Navbar from '../Navbar';
import axios from 'axios';
import { FaRegClock } from 'react-icons/fa';
import { MdOutlinePayment } from 'react-icons/md';
import { BiSolidUser, BiSolidPhone } from 'react-icons/bi';
import { PiMapPinLineBold } from 'react-icons/pi';
import AdminChatBox from './AdminChatBox';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [user] = useState(() => {
        const cached = localStorage.getItem('user');
        return cached ? JSON.parse(cached) : null;
    });
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    document.title = "ORDER - Levents";

    const [parsedAddress, setParsedAddress] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Modal image
    const [setShowUserDropdown] = useState(false);
    const dropdownContainerRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClickOutside = (event) => {
        if (
            dropdownContainerRef.current &&
            !dropdownContainerRef.current.contains(event.target)
        ) {
            setShowUserDropdown(false);
        }
    };

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/admin/order/detail/${id}`)
            .then(res => {
                setOrder(res.data);

                try {
                    const address = JSON.parse(res.data.userAddress);
                    setParsedAddress(address);
                } catch (err) {
                    console.error('Lỗi parse địa chỉ:', err);
                    setParsedAddress(null);
                }
            })
            .catch(err => console.error(err));
    }, [id]);
    if (!order) return <div className="text-center mt-20 text-xl">Đang tải đơn hàng...</div>;

    return (
        <div className="flex min-h-screen bg-[#f6f1e7]">
            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <AdminSidebar user={user} isOpen={sidebarOpen} />

            <div className="flex-1 p-6 mt-16 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-[#fffaf0] border border-[#cfa34a]/40 rounded-2xl shadow-sm p-8">
                    <h2 className="text-3xl font-bold mb-8 text-center text-[#7B1E16]">
                        Chi tiết đơn hàng #{order.id}
                    </h2>

                    <div className="grid grid-cols-2 gap-6 mb-8 text-[#7a5c2e]">

                        <div className="flex items-center gap-3">
                            <BiSolidUser className="text-[#7B1E16] text-xl" />
                            <span><strong>Người nhận:</strong> {parsedAddress?.fullName}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <BiSolidPhone className="text-[#7B1E16] text-xl" />
                            <span><strong>SĐT:</strong> {parsedAddress?.phone}</span>
                        </div>

                        <div className="flex items-start gap-3 col-span-2">
                            <PiMapPinLineBold className="text-[#7B1E16] text-xl mt-1" />
                            <span>
                                <strong>Địa chỉ:</strong>{" "}
                                {
                                    parsedAddress
                                        ? [
                                            parsedAddress.addressDetail,
                                            parsedAddress.ward,
                                            parsedAddress.district,
                                            parsedAddress.province
                                        ].filter(Boolean).join(", ")
                                        : order.userAddress
                                }
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <MdOutlinePayment className="text-[#7B1E16] text-xl" />
                            <span><strong>Thanh toán:</strong> {order.paymentMethod}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <FaRegClock className="text-[#7B1E16] text-xl" />
                            <span>
                                <strong>Ngày đặt:</strong>{" "}
                                {new Date(order.orderDate).toLocaleString()}
                            </span>
                        </div>

                    </div>

                    <h3 className="text-lg font-semibold mb-3 border-b pb-1">Sản phẩm trong đơn:</h3>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (

                            <div
                                key={index}
                                className="flex items-center justify-between
            bg-[#fdf6e3]
            border border-[#e5d3a1]
            rounded-xl
            p-4
            hover:bg-[#f3e6c9]
            transition"
                            >

                                <div className="flex items-center gap-4">

                                    <img
                                        src={item.image}
                                        alt={item.productName}
                                        className="w-14 h-14 object-cover rounded cursor-pointer hover:scale-105 transition"
                                        onClick={() => setSelectedImage(item.image)}
                                    />

                                    <div>
                                        <p className="font-semibold text-[#7B1E16]">
                                            {item.productName}
                                        </p>

                                        <p className="text-sm text-[#7a5c2e]">
                                            Màu: {item.color} | Size: {item.size}
                                        </p>
                                    </div>

                                </div>

                                <div className="text-right">

                                    <p className="text-sm text-[#7a5c2e]">
                                        Số lượng: <strong>{item.quantity}</strong>
                                    </p>

                                    <p className="text-sm font-semibold text-[#7B1E16]">
                                        {item.productPrice?.toLocaleString()}₫
                                    </p>

                                </div>

                            </div>

                        ))}
                    </div>
                </div>
            </div>
            {/* Modal hiển thị ảnh */}
            {selectedImage && (
    <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
        onClick={() => setSelectedImage(null)}
    >
        <img
            src={selectedImage}
            alt="Ảnh sản phẩm"
            className="max-w-[90%] max-h-[85%] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        />
    </div>
)}
            <AdminChatBox />
        </div>
    );
};

export default OrderDetailPage;
