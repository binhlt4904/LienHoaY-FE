import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  document.title = "FORGOT-PASSWORD";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      Swal.fire('Thành công', 'Mã OTP đã được gửi qua email.', 'success');
      navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      Swal.fire('Lỗi', err.response?.data || 'Không thể gửi OTP', 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#3b0606] via-[#6b0f0f] to-[#a83232] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#6b0f0f]">Quên mật khẩu</h2>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Nhập email đã đăng ký"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8f1d1d] transition"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#8f1d1d] text-white py-3 rounded-md hover:bg-[#6b0f0f] active:bg-[#520909] transition duration-200"
          >
            Gửi mã OTP
          </button>
        </form>
      </div>
    </div>
  );
}
