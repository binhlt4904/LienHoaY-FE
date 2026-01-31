import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import UserDropdown from "./UserSidebar";
import {
  FaUser,
  FaSearch,
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaWallet,
  FaTshirt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./client/CartContext";
import Swal from "sweetalert2";
import SidebarToggleButton from "./SidebarToggleButton";

function Navbar({ onToggleSidebar }) {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownContainerRef = useRef(null);
  const cartRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [typing, setTyping] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  /* ================= FETCH PROFILE + CLICK OUTSIDE ================= */
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          return;
        }
        const res = await axios.post(
          `${API_BASE_URL}/user/profile`,
          {},
          { withCredentials: true }
        );
        if (res.status === 200) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const handleClickOutside = (event) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };

    fetchProfile();
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = async (query) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/search`, {
        params: { query },
      });
      if (res.status === 200) setSearchResults(res.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== "") handleSearch(searchQuery);
      else setSearchResults([]);
    }, 150);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() === "") return;
    setTyping(true);
    const timeout = setTimeout(() => setTyping(false), 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  /* ================= CART ================= */
  const toggleSelectItem = (productVariantId) => {
    setSelectedItems((prev) =>
      prev.includes(productVariantId)
        ? prev.filter((id) => id !== productVariantId)
        : [...prev, productVariantId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.productVariantId));
    }
  };

  const handleCheckout = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.productVariantId)
    );
    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Chưa chọn sản phẩm",
        text: "Vui lòng chọn ít nhất một sản phẩm để mua.",
        confirmButtonText: "OK",
        confirmButtonColor: "#8b0000",
      });
      return;
    }
    navigate("/checkout", { state: { selectedProducts } });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#6b0f0f] border-b border-[#cfa34a]/40 shadow-xl">
      {/* ===== TOP BAR ===== */}
      <div className="flex items-center justify-between h-[72px] px-6 max-w-[1400px] mx-auto">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <div className="mr-2 lg:hidden">
              <SidebarToggleButton onClick={onToggleSidebar} />
            </div>
          )}

          <Link
            to={user && user.role === "ADMIN" ? "/admin" : "/"}
            className="flex items-center gap-3 group"
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-[42px] object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-widest text-[#f5d27a]">
                PHÁP PHỤC
              </div>
              <div className="text-xs tracking-widest text-[#f7e8b0]">
                LIÊN HOA Y
              </div>
            </div>
          </Link>
        </div>

        {/* CENTER: Search */}
        <div className="relative hidden md:block w-[420px]">
          {((user?.role === "USER") || !user) && (
            <>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#7a1a1a] 
                text-white placeholder-[#f3d7a3] border border-[#cfa34a]/50 
                focus:outline-none focus:ring-2 focus:ring-[#cfa34a] transition"
              />
              <FaSearch
                className={`absolute left-4 top-3.5 text-[#f3d7a3] ${typing ? "animate-spin" : ""
                  }`}
              />
            </>
          )}

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-[#5c0d0d] border border-[#cfa34a]/40 shadow-xl rounded-xl z-50 max-h-64 overflow-y-auto">
              {searchResults.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[#7a1a1a] border-b border-[#cfa34a]/20"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <img
                    src={product.thumbnailImage}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-white">
                      {product.name}
                    </div>
                    <div className="text-xs text-[#f3d7a3]">
                      {Number(product.price).toLocaleString()} ₫
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-5 text-[#f7e8b0]">
          {user?.role === "USER" && (
            <>
              <FaTshirt
                className="text-lg cursor-pointer hover:text-white transition"
                title="Thử đồ ảo"
                onClick={() => navigate("/fitcheck")}
              />
              
            </>
          )}

          {/* Cart */}
          {user?.role === "USER" && (
            <div className="relative" ref={cartRef}>
              <FaShoppingCart
                className="text-lg cursor-pointer hover:text-white transition"
                onClick={() => setShowCart(!showCart)}
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#cfa34a] text-[#6b0f0f] text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}

              {showCart && (
                <div className="absolute right-0 mt-4 w-[380px] bg-[#5c0d0d] border border-[#cfa34a]/40 shadow-xl rounded-2xl z-50 p-4 max-h-[420px] overflow-y-auto">
                  <h3 className="font-bold mb-3 flex justify-between items-center text-[#f7e8b0]">
                    Giỏ hàng
                    {cartItems.length > 0 && (
                      <button
                        onClick={toggleSelectAll}
                        className="text-sm text-[#f3d7a3] hover:underline"
                      >
                        {selectedItems.length === cartItems.length
                          ? "Bỏ chọn tất cả"
                          : "Chọn tất cả"}
                      </button>
                    )}
                  </h3>

                  {cartItems.length === 0 ? (
                    <p className="text-[#f3d7a3]/70">Chưa có sản phẩm</p>
                  ) : (
                    <>
                      <ul className="space-y-3">
                        {cartItems.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 border-b border-[#cfa34a]/20 pb-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(
                                item.productVariantId
                              )}
                              onChange={() =>
                                toggleSelectItem(item.productVariantId)
                              }
                              className="mt-1"
                            />
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white line-clamp-2">
                                {item.productName}
                              </div>
                              <div className="text-xs text-[#f3d7a3]/80">
                                Màu:{" "}
                                <span className="font-medium">
                                  {item.color}
                                </span>{" "}
                                — Size:{" "}
                                <span className="font-medium">
                                  {item.size}
                                </span>
                              </div>
                              <div className="text-sm text-[#f3d7a3]">
                                {Number(item.price).toLocaleString()} ₫
                              </div>
                              <div className="flex items-center mt-1 gap-2 text-sm text-white">
                                <button
                                  onClick={() =>
                                    decreaseQuantity(item.productVariantId)
                                  }
                                  className="p-1 bg-white/10 rounded hover:bg-white/20"
                                >
                                  <FaMinus size={10} />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() =>
                                    increaseQuantity(item.productVariantId)
                                  }
                                  className="p-1 bg-white/10 rounded hover:bg-white/20"
                                >
                                  <FaPlus size={10} />
                                </button>
                              </div>
                            </div>
                            <button
                              className="text-[#f3d7a3] hover:text-red-300"
                              onClick={() =>
                                removeFromCart(item.productVariantId)
                              }
                              title="Xóa sản phẩm"
                            >
                              <FaTrash />
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 pt-3 border-t border-[#cfa34a]/30 text-sm">
                        <div className="flex justify-between items-center mb-3 text-white">
                          <span className="font-semibold">Tổng:</span>
                          <span className="font-semibold text-[#f3d7a3]">
                            {cartItems
                              .filter((item) =>
                                selectedItems.includes(item.productVariantId)
                              )
                              .reduce(
                                (sum, item) =>
                                  sum + item.price * item.quantity,
                                0
                              )
                              .toLocaleString("vi-VN")}{" "}
                            ₫
                          </span>
                        </div>
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-gradient-to-r from-[#cfa34a] to-[#e6b95c] text-[#6b0f0f] font-bold py-2 rounded-lg hover:brightness-110 transition"
                        >
                          Mua hàng
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User */}
          <div className="relative" ref={dropdownContainerRef}>
            <FaUser
              className="text-lg cursor-pointer hover:text-white transition"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            />
            <UserDropdown
              user={user}
              isOpen={showUserDropdown}
              onClose={() => setShowUserDropdown(false)}
            />
          </div>
        </div>
      </div>

      {/* ===== MENU BAR ===== */}
      <nav className="hidden lg:block bg-[#5c0d0d] border-t border-[#cfa34a]/40">
        <ul className="flex items-center justify-center gap-10 h-[46px] text-sm font-semibold tracking-widest text-[#f7e8b0]">

          <li>
            <Link to="/" className="hover:text-white transition">
              Trang Chủ
            </Link>
          </li>

          <li>
            <Link to="/product" className="hover:text-white transition">
              Tất Cả Sản Phẩm
            </Link>
          </li>

          {/* ===== ÁO TRÀNG DROPDOWN ===== */}
          <li className="relative group">
            <Link
              to="/product/robe"
              className="hover:text-white transition flex items-center gap-1"
            >
              Áo Tràng
              <span className="text-xs">▼</span>
            </Link>

            <ul
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
        min-w-[200px] bg-[#5c0d0d] border border-[#cfa34a]/40 rounded-lg shadow-lg
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200 z-50"
            >
              <li>
                <Link to="/product/top/ao-trang-nam" className="block px-4 py-2 hover:bg-[#7a1414] transition">
                  Áo Tràng Nam
                </Link>
              </li>
              <li>
                <Link to="/product/top/ao-trang-nu" className="block px-4 py-2 hover:bg-[#7a1414] transition">
                  Áo Tràng Nữ
                </Link>
              </li>
              <li>
                <Link to="/product/top/ao-trang-tre-em" className="block px-4 py-2 hover:bg-[#7a1414] transition">
                  Áo Tràng Trẻ Em
                </Link>
              </li>
              <li>
                <Link to="/product/top/ao-trang-di-chua" className="block px-4 py-2 hover:bg-[#7a1414] transition">
                  Áo Tràng Đi Chùa
                </Link>
              </li>
            </ul>
          </li>

          {/* ===== PHÁP PHỤC DROPDOWN ===== */}
          <li className="relative group">
            <Link
              to="/product/buddhist"
              className="hover:text-white transition flex items-center gap-1"
            >
              Pháp Phục
              <span className="text-xs">▼</span>
            </Link>

            <ul
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
        min-w-[220px] bg-[#5c0d0d] border border-[#cfa34a]/40 rounded-lg shadow-lg
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200 z-50"
            >
              <li>
                <Link to="/product/bottom/ao-lam-di" className="block px-4 py-2 hover:bg-[#7a1414] transition">
                  Áo Lam Đi Chùa
                </Link>
              </li>
              <li>
                <Link to="/product/bottom/phap-phuc-tu-si" className="block px-4 py-2 hover:bg-[#7a1414] transition">
                  Pháp Phục Tu Sĩ
                </Link>
              </li>
              <li>
                <Link to="/product/bottom/y-ca-sa" className="block px-4 py-2 hover:bg-[#7a1414] transition">
                  Y Ca Sa
                </Link>
              </li>
              <li>
                <Link to="/product/bottom/ao-hau-le" className="block px-4 py-2 hover:bg-[#7a1414] transition">
                  Áo Hậu Lễ
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/product/accessory" className="hover:text-white transition">
              Vật Phẩm Phật Giáo
            </Link>
          </li>


          <li>
            <Link to="/about" className="hover:text-white transition">
              Về Chúng Tôi
            </Link>
          </li>

          <li>
            <Link to="/contact" className="hover:text-white transition">
              Liên Hệ
            </Link>
          </li>

        </ul>
      </nav>

    </header>
  );
}

export default Navbar;
