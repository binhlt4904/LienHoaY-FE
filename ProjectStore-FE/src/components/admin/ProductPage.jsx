import React, { useState, useRef, useEffect } from "react";
import {
  FaTshirt,
  FaShoppingBag
} from "react-icons/fa";
import { GiArmoredPants } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import AdminChatBox from "./AdminChatBox";
import axios from 'axios';

function ProductPage() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [buddhists, setBuddhists] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [robes, setRobes] = useState([]);
  const [setShowUserDropdown] = useState(false);
  const dropdownContainerRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  document.title = "PRODUCT - Levents";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res1 = await axios.get(`${API_BASE_URL}/admin/products/getAllBuddhists`);
        const res2 = await axios.get(`${API_BASE_URL}/admin/products/getAllBottoms`);
        const res3 = await axios.get(`${API_BASE_URL}/admin/products/getAllAccessories`);
        const res4 = await axios.get(`${API_BASE_URL}/admin/products/getAllRobes`);



        setBuddhists(res1.data); // Lưu vào state đã có price
        console.log(buddhists);
        setBottoms(res2.data);
        setAccessories(res3.data);
        setRobes(res4.data);

      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);


  const categories = [
    {
      name: "Pháp Phục",
      description: "Quản lý các sản phẩm pháp phục",
      icon: <FaTshirt className="text-3xl text-[#7B1E16]" />,
      bg: "bg-white border border-[#cfa34a]/40",
      hover: "hover:bg-[#f8edd6]",
      onClick: () => navigate("/admin/product/buddhist"),
      total: buddhists.length,
    },
    {
      name: "Áo Tràng",
      description: "Quản lý các sản phẩm áo tràng",
      icon: <GiArmoredPants className="text-3xl text-[#7B1E16]" />,
      bg: "bg-white border border-[#cfa34a]/40",
      hover: "hover:bg-[#f8edd6]",
      onClick: () => navigate("/admin/product/robe"),
      total: robes.length,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f1e7]">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar user={user} isOpen={sidebarOpen} />

      <main className="flex-1 pt-[90px]  p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#7B1E16] text-center mt-12 mb-10">
          Danh Mục Sản Phẩm
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto mt-[60px]">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-sm ${cat.bg} transition-all duration-200
  cursor-pointer hover:shadow-lg hover:border-[#cfa34a]
  transform hover:-translate-y-1 p-6 min-h-[180px]
  flex flex-col items-center justify-center text-center`}
              onClick={cat.onClick}
            >
              {/* Icon trong vòng tròn */}<div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f8edd6] mb-4">
                {cat.icon}
              </div>

              {/* Nội dung */}
              <h2 className="text-xl font-semibold text-[#7B1E16]">{cat.name}</h2>
              <p className="text-[#7a5c2e] text-sm mt-1">{cat.description}</p>
              <p className="text-[#cfa34a] text-sm font-semibold mt-2">
                Tổng sản phẩm: {cat.total}
              </p>
            </div>
          ))}
        </div>


        <AdminChatBox />
      </main>
    </div>
  );
}

export default ProductPage;
