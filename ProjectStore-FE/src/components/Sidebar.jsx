// src/components/Sidebar.js
// import thêm Link
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import React from "react";
import { FaHome, FaStar, FaTshirt, FaUsers, FaShoppingBag } from "react-icons/fa";
import { GiArmoredPants, GiClothes } from 'react-icons/gi';
import { MdNewReleases } from "react-icons/md";


const menu = [
  { label: "Trang chủ", icon: <FaHome />, path: "/" },
  { label: "About", icon: <FaUsers />, path: "/about" },
  { label: "Top Seller", icon: <FaStar />, path: "/product/top-seller" },
  { label: "New Arrival", icon: <MdNewReleases />, path: "/product/new-arrival" },
  { label: "Set", icon: <GiClothes />, path: "/product/set" },
  { label: "Top", icon: <FaTshirt />, path: "/product/top" },
  { label: "Bottom", icon: <GiArmoredPants />, path: "/product/bottom" },
  { label: "Accessory", icon: <FaShoppingBag />, path: "/product/accessory" },

];





const Sidebar = ({ user, isOpen }) => {
  const location = useLocation(); // để highlight menu đang active
  const [wallet, setWallet] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        if (!user || !user.id) return;
        const res = await axios.get(`${API_BASE_URL}/wallet/get`, {
          params: {
            userId: user.id
          }
        });
        console.log('aaaa' + res.data);
        setWallet(res.data);
      } catch (err) {
        console.error("Lỗi lấy ví:", err);
      }
    };

    fetchWallet();
  }, [user]);

  return (
    <>
      {/* backdrop trên mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 top-[0px] z-20 transition-opacity duration-300 md:hidden ${isOpen ? "block" : "hidden"
          }`}
      ></div>

      <aside
        className={`fixed md:static left-0 top-[0px] z-20 h-screen w-64 
  bg-red-50 shadow-lg flex flex-col justify-between
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        <div>
          <div className="p-6 text-2xl font-bold text-blue-600 border-b border-gray-200">
            {/* Logo hoặc gì đó */}
          </div>
          <nav className="mt-10">
            {menu.map((item, index) => (
              <Link to={item.path} key={index}>
                <div
                  className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all rounded-md mx-2 ${location.pathname === item.path
                      ? "bg-red-600 text-white font-semibold shadow"
                      : "text-gray-700 hover:bg-red-100 hover:text-red-700"
                    }`}
                >

                  <span className="text-lg">{item.icon}</span>
                  <span className="text-base">{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-red-200 bg-red-50">

          <img
            src={user?.username ? user.avatar : "/images/avatar.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-red-600">
              {wallet ? wallet.balance.toLocaleString() + " ₫" : "0 ₫"}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;
