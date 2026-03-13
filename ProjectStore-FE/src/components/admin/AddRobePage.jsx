import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminChatBox from "./AdminChatBox";
import Navbar from "../Navbar";

function AddRobePage() {
    const [user] = useState(() => {
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });

    const [errors, setErrors] = useState({});
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    document.title = "Áo Tràng - Liên Hoa Y";

    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "robe",
        arrivedDate: "",
        price: "",
        thumbnailImage: null,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setFormData((prev) => ({
            ...prev,
            thumbnailImage: e.target.files[0],
        }));
        console.log(formData);
    };

    const uploadImages = async (file) => {
        const formData = new FormData();
        console.log(file);

        formData.append("file", file)

        for (let [key, value] of formData.entries()) {
            console.log("FormData entry:", key, value);
        }

        const response = await axios.post(`${API_BASE_URL}/upload/single`, formData);
        console.log(response.data);

        return response.data; // Expect: List<String> URLs
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên sản phẩm không được để trống.";
        }

        if (!formData.arrivedDate) {
            newErrors.arrivedDate = "Vui lòng chọn ngày nhập hàng.";
        }

        if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
            newErrors.price = "Giá phải là số lớn hơn 0.";
        }

        if (!formData.thumbnailImage) {
            newErrors.thumbnailImage = "Vui lòng chọn ảnh sản phẩm.";
        }

        setErrors(newErrors);

        // Trả về true nếu không có lỗi
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const imageUrls = await uploadImages(formData.thumbnailImage);

            const productData = {
                name: formData.name,
                category: formData.category,
                arrivedDate: formData.arrivedDate,
                price: formData.price,
                thumbnailImage: imageUrls,
            };

            await axios.post(`${API_BASE_URL}/products/add-product`, productData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            alert("Thêm sản phẩm thành công!");
            navigate("/admin/product/robe");
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            alert("Có lỗi xảy ra khi thêm sản phẩm.");
        }
    };




    return (
        <div className="flex h-screen bg-[#f5f1e8]">

  <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
  <AdminSidebar user={user} isOpen={sidebarOpen} />

  <div className="flex-1 mt-28 p-6 overflow-y-auto">

    <div className="max-w-3xl mx-auto bg-[#fffaf0] p-8 rounded-2xl shadow-lg border border-[#cfa34a]/30">

      <h2 className="text-3xl font-bold mb-8 text-center text-[#7B1E16]">
        Thêm sản phẩm Áo Tràng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* NAME */}
        <div>
          <label className="block text-[#7B1E16] font-semibold mb-1">
            Tên sản phẩm
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#cfa34a]/40 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
          />

          {errors.name && (
            <p className="text-red-600 font-medium mt-1">{errors.name}</p>
          )}
        </div>



        {/* DATE */}
        <div>
          <label className="block text-[#7B1E16] font-semibold mb-1">
            Ngày nhập hàng
          </label>

          <input
            type="datetime-local"
            name="arrivedDate"
            value={formData.arrivedDate}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#cfa34a]/40 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
          />

          {errors.arrivedDate && (
            <p className="text-red-600 font-medium mt-1">{errors.arrivedDate}</p>
          )}
        </div>



        {/* PRICE */}
        <div>
          <label className="block text-[#7B1E16] font-semibold mb-1">
            Giá (VNĐ)
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#cfa34a]/40 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
          />

          {errors.price && (
            <p className="text-red-600 font-medium mt-1">{errors.price}</p>
          )}
        </div>



        {/* THUMBNAIL */}
        <div>
          <label className="block text-[#7B1E16] font-semibold mb-2">
            Ảnh đại diện
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-[#cfa34a]/40 rounded-lg p-2 bg-white
            file:bg-[#7B1E16] file:text-[#f7e8b0] file:border-0 file:px-3 file:py-1 file:rounded file:mr-3"
          />

          {formData.thumbnailImage && (
            <div className="mt-3 flex">
              <img
                src={URL.createObjectURL(formData.thumbnailImage)}
                alt="Ảnh đại diện"
                className="w-24 h-24 object-cover rounded-lg border border-[#cfa34a]/40 shadow"
              />
            </div>
          )}
        </div>



        {/* BUTTONS */}
        <div className="flex justify-between pt-4 border-t border-[#cfa34a]/30">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-[#cfa34a]/40 text-[#7B1E16]
            rounded-lg hover:bg-[#f3e2c2]"
          >
            Quay lại
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-[#7B1E16] text-[#f7e8b0]
            rounded-lg hover:bg-[#9B2C20]"
          >
            Thêm sản phẩm
          </button>

        </div>

      </form>

    </div>

  </div>

  <AdminChatBox />

</div>
    );
}

export default AddRobePage;
