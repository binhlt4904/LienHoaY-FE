import React, { useState } from 'react';
import Modal from 'react-modal';

const AddSizeModal = ({
  isOpen,
  onRequestClose,
  selectedColor,
  sizeOptions,
  newVariant,
  setNewVariant,
  handleAddSize
}) => {

  const [errors, setErrors] = useState({});
  const validateSize = () => {
    const newErrors = {};
    if (!newVariant.size) {
      newErrors.size = "Vui lòng chọn size.";
    }

    if (!newVariant.price || isNaN(newVariant.price) || newVariant.price <= 0) {
      newErrors.price = "Giá phải là số lớn hơn 0.";
    }

    if (!newVariant.quantity || isNaN(newVariant.quantity) || newVariant.quantity < 0) {
      newErrors.quantity = "Số lượng phải là số không âm.";
    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateSize()) {
      handleAddSize();
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
    Thêm size cho màu:
    <span className="ml-2 text-[#cfa34a]">{selectedColor}</span>
  </h2>

  <div className="space-y-5">

    {/* SIZE */}
    <div>
      <label className="block font-semibold mb-2 text-[#7B1E16]">
        Chọn size:
      </label>

      <div className="flex flex-wrap gap-2">
        {sizeOptions.map(size => (
          <button
            key={size}
            type="button"
            onClick={() => setNewVariant(prev => ({ ...prev, size }))}
            className={`px-3 py-1 rounded border transition
            ${newVariant.size === size
                ? "bg-[#7B1E16] text-[#f7e8b0] border-[#7B1E16]"
                : "bg-[#f8edd6] text-[#7B1E16] border-[#cfa34a]/40 hover:bg-[#f3e2c2]"
              }`}
          >
            {size}
          </button>
        ))}
      </div>

      {errors.size && (
        <p className="text-red-600 font-medium mt-1">{errors.size}</p>
      )}
    </div>


    {/* PRICE */}
    <div>
      <input
        type="number"
        placeholder="Giá"
        className="w-full border border-[#cfa34a]/40 bg-white rounded-lg p-2 
        focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
        value={newVariant.price}
        onChange={(e) =>
          setNewVariant({ ...newVariant, price: e.target.value })
        }
      />

      {errors.price && (
        <p className="text-red-600 font-medium mt-1">{errors.price}</p>
      )}
    </div>


    {/* QUANTITY */}
    <div>
      <input
        type="number"
        placeholder="Số lượng"
        className="w-full border border-[#cfa34a]/40 bg-white rounded-lg p-2 
        focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
        value={newVariant.quantity}
        onChange={(e) =>
          setNewVariant({ ...newVariant, quantity: e.target.value })
        }
      />

      {errors.quantity && (
        <p className="text-red-600 font-medium mt-1">{errors.quantity}</p>
      )}
    </div>

  </div>


  {/* BUTTON */}
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
      Lưu size
    </button>

  </div>
</Modal>
  );
};

export default AddSizeModal;
