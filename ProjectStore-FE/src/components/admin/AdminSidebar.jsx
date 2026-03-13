// src/components/Sidebar.js
// import thêm Link
import { Link, useLocation } from "react-router-dom";

import React from "react";
import { FaHome, FaChartLine, FaBoxOpen, FaClipboardList, FaUserAlt } from "react-icons/fa";

const menu = [
  { label: "Dashboard", icon: <FaHome />, path: "/admin" },
  { label: "Doanh Thu", icon: <FaChartLine />, path: "/admin/revenue" },
  { label: "Quản lí sản phẩm", icon: <FaBoxOpen />, path: "/admin/product" },
  { label: "Đơn hàng", icon: <FaClipboardList />, path: "/admin/order" },
];



const Sidebar = ({ user, isOpen }) => {
  const location = useLocation(); // để highlight menu đang active

  return (
    <>
      {/* backdrop trên mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 top-[72px] z-20 transition-opacity duration-300 md:hidden ${isOpen ? "block" : "hidden"
          }`}
      ></div>

      <aside
        className={`fixed md:static left-0 top-[72px] z-20 h-screen w-64 
  bg-[#7B1E16] text-[#F5D7A1] shadow-lg flex flex-col justify-between
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          <div className="p-6 text-xl font-bold border-b border-[#9B2C20]">
          </div>

          <nav className="mt-12">
            {menu.map((item, index) => (
              <Link to={item.path} key={index}>
                <div
                  className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all
            ${location.pathname === item.path
                      ? "bg-[#9B2C20] text-[#F5D7A1] font-semibold"
                      : "text-[#F5D7A1] hover:bg-[#9B2C20]"
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-[#9B2C20]">
          <img
            src={user?.username ? user.avatar : "/images/avatar.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{user?.name || "Guest"}</p>
          </div>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;
