import React, { useState } from 'react';
import Modal from 'react-modal';

const EditVariantModal = ({
  isOpen,
  onRequestClose,
  variant,
  setVariant,
  handleUpdateVariant
}) => {

  const [errors, setErrors] = useState({});

  const validateVariant = () => {
    const newErrors = {};



    if (!variant.price || isNaN(variant.price) || variant.price <= 0) {
      newErrors.price = "Giá phải là số lớn hơn 0.";
    }

    if (!variant.quantity || isNaN(variant.quantity) || variant.quantity < 0) {
      newErrors.quantity = "Số lượng phải là số không âm.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateVariant()) {
      handleUpdateVariant(); // gọi hàm gốc nếu hợp lệ
    }
  };

  return (
    <Modal
  isOpen={isOpen}
  onRequestClose={onRequestClose}
  style={{
    overlay: { backgroundColor: "rgba(0,0,0,0.4)" },
    content: {
      maxWidth: "500px",
      margin: "60px auto",
      borderRadius: "12px",
      padding: "24px",
      background: "#fffaf0",
      border: "1px solid rgba(207,163,74,0.4)"
    }
  }}
>
  <h2 className="text-2xl font-bold mb-6 text-[#7B1E16]">
    Chỉnh sửa mẫu
  </h2>

  <div className="space-y-5">

    {/* COLOR */}
    <div className="flex justify-between bg-[#f8edd6] p-3 rounded border border-[#cfa34a]/30">
      <span className="font-semibold text-[#7B1E16]">Màu</span>
      <span className="text-[#cfa34a] font-medium">{variant?.color}</span>
    </div>

    {/* SIZE */}
    <div className="flex justify-between bg-[#f8edd6] p-3 rounded border border-[#cfa34a]/30">
      <span className="font-semibold text-[#7B1E16]">Size</span>
      <span className="text-[#cfa34a] font-medium">{variant?.size}</span>
    </div>


    {/* PRICE */}
    <div>
      <input
        type="number"
        placeholder="Giá"
        className="w-full border border-[#cfa34a]/40 bg-white rounded-lg p-2 
        focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
        value={variant?.price}
        onChange={(e) =>
          setVariant(prev => ({ ...prev, price: e.target.value }))
        }
      />

      {errors.price && (
        <p className="text-red-600 text-sm mt-1">{errors.price}</p>
      )}
    </div>


    {/* QUANTITY */}
    <div>
      <input
        type="number"
        placeholder="Số lượng"
        className="w-full border border-[#cfa34a]/40 bg-white rounded-lg p-2 
        focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
        value={variant?.quantity}
        onChange={(e) =>
          setVariant(prev => ({ ...prev, quantity: e.target.value }))
        }
      />

      {errors.quantity && (
        <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
      )}
    </div>

  </div>


  {/* BUTTONS */}
  <div className="mt-8 flex justify-end gap-3">

    <button
      type="button"
      onClick={onRequestClose}
      className="px-4 py-2 border border-[#cfa34a]/40 text-[#7B1E16] rounded-lg hover:bg-[#f3e2c2]"
    >
      Hủy
    </button>

    <button
      type="button"
      onClick={handleSubmit}
      className="px-4 py-2 bg-[#7B1E16] text-[#f7e8b0] rounded-lg hover:bg-[#9B2C20]"
    >
      Lưu
    </button>

  </div>
</Modal>
  );
};

export default EditVariantModal;