import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import AdminChatBox from "./AdminChatBox";
import axios from "axios";
import Swal from "sweetalert2";

function BuddhistPage() {
    const navigate = useNavigate();
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });
    const [setShowUserDropdown] = useState(false);
    const dropdownContainerRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    document.title = "Pháp Phục - Liên Hoa Y";

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [selectedImage, setSelectedImage] = useState(null); // Modal image

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
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/admin/products/buddhists?page=${currentPage - 1}&size=${itemsPerPage}`
                );
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };
        fetchProducts();
    }, [currentPage]);

    const handleView = (product) => {
        navigate(`/admin/product/${product.id}`);
    };

    const handleRemove = async (id) => {
        const result = await Swal.fire({
            title: "Bạn chắc chắn muốn xóa?",
            text: "Sản phẩm sẽ bị xóa vĩnh viễn!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#7B1E16",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {

                await fetch(`/api/products/${id}`, { method: "DELETE" });
                setProducts(products.filter((p) => p.id !== id));

                Swal.fire({
                    icon: "success",
                    title: "Đã xóa!",
                    text: "Sản phẩm đã được xóa.",
                    confirmButtonColor: "#7B1E16"
                });

            } catch (error) {

                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Không thể xóa sản phẩm.",
                });

            }
        }
    };

    return (
        <div className="flex h-screen bg-[#f5f1e8]">

            <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <AdminSidebar user={user} isOpen={sidebarOpen} />

            <div className="flex-1 p-8 mt-16 overflow-y-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-3xl font-bold text-[#7B1E16]">
                        Danh sách sản phẩm Pháp Phục
                    </h2>

                    <button
                        onClick={() => navigate("/admin/product/buddhist/add")}
                        className="flex items-center gap-2 bg-[#7B1E16] text-[#f7e8b0]
        px-5 py-2 rounded-lg hover:bg-[#9B2C20] transition"
                    >
                        <FaPlus />
                        <span>Thêm sản phẩm</span>
                    </button>

                </div>


                {/* TABLE */}
                <div className="overflow-x-auto bg-[#fffaf0] rounded-xl border border-[#cfa34a]/30 shadow">

                    <table className="min-w-full">

                        <thead className="bg-[#f3e2c2] text-[#7B1E16]">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Hình ảnh</th>
                                <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                                <th className="py-3 px-4 text-left">Giá</th>
                                <th className="py-3 px-4 text-left">Kho</th>
                                <th className="py-3 px-4 text-center">Hành động</th>
                            </tr>
                        </thead>


                        <tbody>

                            {products.map((product) => (

                                <tr
                                    key={product.id}
                                    className="border-t hover:bg-[#f8edd6] transition"
                                >

                                    <td className="py-3 px-4">{product.id}</td>


                                    <td className="py-3 px-4">
                                        <img
                                            src={product.thumbnailImage}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded cursor-pointer
                  hover:scale-105 transition"
                                            onClick={() => setSelectedImage(product.thumbnailImage)}
                                        />
                                    </td>


                                    <td className="py-3 px-4 font-medium">
                                        {product.name}
                                    </td>


                                    <td className="py-3 px-4 text-[#7B1E16] font-semibold">
                                        {Number(product.price).toLocaleString("vi-VN")}₫
                                    </td>


                                    <td className="py-3 px-4">
                                        {product.totalQuantity}
                                    </td>


                                    <td className="py-3 px-4 text-center">

                                        <button
                                            onClick={() => handleView(product)}
                                            className="text-[#cfa34a] hover:text-[#7B1E16] mr-4 text-lg"
                                        >
                                            <FaEye />
                                        </button>

                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className="text-red-600 hover:text-red-800 text-lg"
                                        >
                                            <FaTrash />
                                        </button>

                                    </td>

                                </tr>

                            ))}


                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>



                {/* PAGINATION */}
                <div className="flex justify-center mt-6 gap-2">

                    {[...Array(totalPages)].map((_, i) => (

                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-1 rounded-lg border
          ${currentPage === i + 1
                                    ? "bg-[#7B1E16] text-[#f7e8b0]"
                                    : "bg-[#f3e2c2] text-[#7B1E16] hover:bg-[#e7d0a5]"
                                }`}
                        >
                            {i + 1}
                        </button>

                    ))}

                </div>

            </div>



            {/* IMAGE MODAL */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
                    onClick={() => setSelectedImage(null)}
                >

                    <img
                        src={selectedImage}
                        alt="Ảnh sản phẩm"
                        className="max-w-[90%] max-h-[80%] object-contain rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                </div>
            )}

            <AdminChatBox />

        </div>
    );
}

export default BuddhistPage;