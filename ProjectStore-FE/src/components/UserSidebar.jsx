import React from "react";
import { FaUserCircle, FaKey, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserDropdown = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        localStorage.removeItem("user");

        await Swal.fire({
          icon: "success",
          title: "Đăng xuất thành công",
          timer: 1200,
          showConfirmButton: false,
        });

        onClose();
        navigate("/");
      }
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Đăng xuất thất bại",
        text: err.response?.data?.message || "Vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl border border-red-100 shadow-lg z-50 overflow-hidden">

      {user?.username ? (
        <>
          {user.role === "USER" && (
            <>
              <button
                onClick={() => handleNavigate("/user/profile")}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#3d2c22] hover:bg-[#fdf2f2] transition"
              >
                <FaUserCircle className="text-[#7a1414]" />
                Thông tin cá nhân
              </button>

              <button
                onClick={() => handleNavigate("/my-orders")}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#3d2c22] hover:bg-[#fdf2f2] transition"
              >
                <FaClipboardList className="text-[#7a1414]" />
                Đơn hàng của tôi
              </button>
            </>
          )}

          <button
            onClick={() => handleNavigate("/change-password")}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#3d2c22] hover:bg-[#fdf2f2] transition"
          >
            <FaKey className="text-[#7a1414]" />
            Đổi mật khẩu
          </button>

          <div className="border-t border-gray-100"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-[#fdf2f2] transition"
          >
            <FaSignOutAlt />
            Đăng xuất
          </button>
        </>
      ) : (
        <button
          onClick={() => handleNavigate("/login")}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#3d2c22] hover:bg-[#fdf2f2] transition"
        >
          <FaSignOutAlt className="text-[#7a1414]" />
          Đăng nhập
        </button>
      )}
    </div>
  );
};

export default UserDropdown;