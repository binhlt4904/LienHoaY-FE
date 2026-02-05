import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ScrollToTopButton from "../ScrollToTopButton";
import { FiFilter, FiSearch } from "react-icons/fi";

function NewArrivalPage() {
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const mainRef = useRef(null);
  const navigate = useNavigate();

  document.title = "Sản phẩm mới - Liên Hoa Y";

  const pageSize = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/products/sort/new-arrivals`,
          {
            params: {
              page: currentPage,
              size: pageSize,
              sort: sortBy,
              name: searchTerm,
              priceRange: priceFilter,
            },
          }
        );

        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm new arrival:", err);
      }
    };

    fetchProducts();
  }, [sortBy, currentPage, searchTerm, priceFilter]);

  const handleProductClick = (product) => {
    if (product.category === "top") navigate(`/product/top/${product.id}`);
    if (product.category === "bottom") navigate(`/product/bottom/${product.id}`);
    if (product.category === "accessory")
      navigate(`/product/accessory/${product.id}`);
  };

  return (
    <div className="flex h-screen bg-[#fff7f3]">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
     

      <main
        ref={mainRef}
        className="flex-1 mt-[72px] px-6 py-8 overflow-y-auto space-y-10"
         style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE
        }}
      >
        {/* ===== HEADER ===== */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold tracking-widest text-red-700 uppercase relative">
              Sản phẩm mới
              <span className="absolute left-0 -bottom-2 w-10 h-[3px] bg-red-600 rounded-full"></span>
            </h2>

            {/* Breadcrumb */}
            <div className="text-gray-500 text-sm flex items-center gap-2">
              <Link to="/" className="hover:text-red-700 transition">
                Home
              </Link>
              <span>›</span>
              <Link to="/product" className="hover:text-red-700 transition">
                Tất cả sản phẩm
              </Link>
              <span>›</span>
              <span className="text-black font-semibold">New Arrival</span>
            </div>

            <div className="text-base text-gray-500">
              ({products.length} sản phẩm / trang {currentPage + 1}/{totalPages})
            </div>
          </div>

          {/* ===== FILTER BAR ===== */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="pl-10 pr-4 py-2.5 w-full rounded-full border border-gray-200 
                focus:ring-2 focus:ring-red-300 focus:outline-none transition-all"
              />
            </div>

            {/* Price filter */}
            <div className="relative w-full sm:w-56">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="pl-10 pr-4 py-2.5 w-full rounded-full border border-gray-200 
                focus:ring-2 focus:ring-red-300 focus:outline-none transition-all bg-white"
              >
                <option value="">Lọc theo giá</option>
                <option value="0-300000">Dưới 300.000₫</option>
                <option value="300000-500000">300.000₫ – 500.000₫</option>
                <option value="500000-1000000">Trên 500.000₫</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative w-full sm:w-56">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="pl-10 pr-4 py-2.5 w-full rounded-full border border-gray-200 
                focus:ring-2 focus:ring-red-300 focus:outline-none transition-all bg-white"
              >
                <option value="">Sắp xếp</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== PRODUCT GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group relative bg-white border border-red-100 rounded-2xl shadow-sm 
              hover:shadow-xl transition-all duration-300 hover:-translate-y-1 
              cursor-pointer overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                  src={product.thumbnailImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 
                  group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="text-[15px] font-semibold line-clamp-2 min-h-[40px] text-gray-800">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-bold">
                    {Number(product.price).toLocaleString("vi-VN")} ₫
                  </span>

                  <span className="text-xs text-gray-400 group-hover:text-red-500 transition">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-full border text-sm 
              hover:bg-red-50 disabled:opacity-40 transition"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all
                ${
                  i === currentPage
                    ? "bg-red-600 text-white shadow"
                    : "border hover:bg-red-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 rounded-full border text-sm 
              hover:bg-red-50 disabled:opacity-40 transition"
            >
              →
            </button>
          </div>
        )}

        <ScrollToTopButton targetRef={mainRef} />
        <Footer />
      </main>
    </div>
  );
}

export default NewArrivalPage;
