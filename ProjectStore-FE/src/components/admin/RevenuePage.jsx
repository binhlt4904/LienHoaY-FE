import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import AdminChatBox from "./AdminChatBox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const RevenuePage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  document.title = "REVENUE - Levents";

  const [filter, setFilter] = useState({
    year: "",
    month: "",
    day: ""
  });

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/revenue/get`, {
        params: {
          year: filter.year || undefined,
          month: filter.month || undefined,
          day: filter.day || undefined
        }
      });
      setTotalRevenue(res.data.totalRevenue);
      setDailyRevenue(res.data.dailyRevenue);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
    }
  };


  return (
    <div className="flex h-screen bg-[#f6f1e7]">
      {/* Sidebar */}
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar user={user} isOpen={sidebarOpen} />
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden mt-12 ml-12">
        {/* Navbar */}


        {/* Page content */}
        <div className="p-6 mt-6 overflow-auto">
          <h2 className="text-3xl font-bold mb-6 text-[#7B1E16]">
            Thống kê doanh thu
          </h2>
          <div className="flex gap-4 mb-6">
            <select
              className="border border-[#cfa34a]/40 bg-[#fffaf0] px-3 py-2 rounded-lg text-[#7B1E16]"
            >
              <option value="">Chọn năm</option>
              {[2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select
              className="border border-[#cfa34a]/40 bg-[#fffaf0] px-3 py-2 rounded-lg text-[#7B1E16]"
              value={filter.month}
              onChange={(e) => setFilter({ ...filter, month: e.target.value })}
            >
              <option value="">Chọn tháng</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <select
              className="border border-[#cfa34a]/40 bg-[#fffaf0] px-3 py-2 rounded-lg text-[#7B1E16]"
              value={filter.day}
              onChange={(e) => setFilter({ ...filter, day: e.target.value })}
            >
              <option value="">Chọn ngày</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>

            <button
              onClick={fetchRevenue}
              className="bg-[#7B1E16] text-[#f7e8b0] px-5 py-2 rounded-lg 
  hover:bg-[#9B2C20] transition"
            >
              Lọc
            </button>
          </div>

          {/* Tổng doanh thu */}
          <div className="bg-[#fffaf0] border border-[#cfa34a]/40 p-5 rounded-xl shadow mb-6">
            <h3 className="text-xl font-semibold text-[#7B1E16]">
              Tổng doanh thu:
              <span className="text-[#cfa34a] ml-2">
                {totalRevenue.toLocaleString()} VND
              </span>
            </h3>
          </div>
          {/* Biểu đồ doanh thu */}
          <div className="w-full h-96 bg-[#fffaf0] border border-[#cfa34a]/40 rounded-xl shadow mb-6">  
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyRevenue}
                margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="orderDay"
                  tick={{ fontSize: 12, dy: 10 }} // đẩy chữ X xuống
                  padding={{ left: 20, right: 20 }}
                />

                <YAxis
                  tickFormatter={(val) => `${val / 1000}k`}
                  tick={{ fontSize: 12, dx: -5 }} // đẩy chữ Y ra xa trục
                />

                <Tooltip formatter={(val) => `${val.toLocaleString()} VND`} />

                <Line
  type="monotone"
  dataKey="totalRevenue"
  stroke="#7B1E16"
  strokeWidth={3}
  dot={{ r: 4, fill: "#cfa34a" }}
  activeDot={{ r: 6 }}
/>
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* Bảng thống kê */}
          <div className="overflow-x-auto">
           <table className="min-w-full border border-[#cfa34a]/40 text-sm bg-[#fffaf0] rounded-xl shadow">
              <thead className="bg-[#f6e9d0] text-[#7B1E16]">
                <tr className="hover:bg-[#f8edd6] transition">
                  <th className="border px-6 py-3 text-left font-semibold text-gray-600">Ngày</th>
                  <th className="border px-6 py-3 text-right font-semibold text-gray-600">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dailyRevenue.map((item) => (
                  <tr key={item.orderDay} className="hover:bg-gray-50 transition-all">
                    <td className="border px-6 py-3">{item.orderDay}</td>
                    <td className="border px-6 py-3 text-right font-medium">
                      {item.totalRevenue.toLocaleString()} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Chatbox admin (nếu cần) */}
        <AdminChatBox />
      </div>
    </div>
  );
};

export default RevenuePage;
