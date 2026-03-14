import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';
import AdminSidebar from '../components/admin/AdminSidebar'
import Navbar from './Navbar';
import Footer from './Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaLock } from "react-icons/fa";
export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [user] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  document.title = "CHANGE-PASSWORD";

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('Lỗi', 'Mật khẩu mới không khớp', 'error');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/change-password`,
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      Swal.fire('Thành công', 'Đổi mật khẩu thành công', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data || 'Đổi mật khẩu thất bại', 'error');
    }
  };

  const renderInput = (label, value, setValue, show, setShow, placeholder) => (
    <div>
      
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 " />
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8f1d1d] transition"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7a1414]"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f1e7] mt-16">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {user.role == 'ADMIN' && (
        <AdminSidebar user={user} isOpen={sidebarOpen} />
      )}

      <main className="flex-1 mt-[72px] p-8 space-y-8 overflow-y-auto">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-md border border-red-100">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#7a1414]">
            Đổi mật khẩu
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-5">
            {renderInput('Mật khẩu hiện tại', currentPassword, setCurrentPassword, showCurrent, setShowCurrent, 'Nhập mật khẩu hiện tại')}
            {renderInput('Mật khẩu mới', newPassword, setNewPassword, showNew, setShowNew, 'Nhập mật khẩu mới')}
            {renderInput('Xác nhận mật khẩu mới', confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, 'Nhập lại mật khẩu mới')}

            <button
              type="submit"
              className="w-full bg-[#7a1414] text-white py-3 rounded-lg hover:bg-[#5e0f0f] transition font-semibold"
            >
              Cập nhật mật khẩu
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
