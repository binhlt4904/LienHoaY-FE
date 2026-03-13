import React, { useState } from 'react';
import Modal from 'react-modal';

const AddVariantModal = ({
  isOpen,
  onRequestClose,
  colorOptions,
  sizeOptions,
  usedColors,
  newVariant,
  setNewVariant,
  handleImageChange,
  handleAddVariant
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [errors, setErrors] = useState({});


  const handleRemoveImage = (index) => {
    setNewVariant(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setNewVariant(prev => {
      const updated = [...prev.imageFiles];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return { ...prev, imageFiles: updated };
    });
    setDraggedIndex(null);
  };

  const validateVariant = () => {
    const newErrors = {};

    if (!newVariant.color) {
      newErrors.color = "Vui lòng chọn màu.";
    }

    if (!newVariant.size) {
      newErrors.size = "Vui lòng chọn size.";
    }

    if (!newVariant.price || isNaN(newVariant.price) || newVariant.price <= 0) {
      newErrors.price = "Giá phải là số lớn hơn 0.";
    }

    if (!newVariant.quantity || isNaN(newVariant.quantity) || newVariant.quantity < 0) {
      newErrors.quantity = "Số lượng phải là số không âm.";
    }

    if (!newVariant.imageFiles || newVariant.imageFiles.length === 0) {
      newErrors.imageFiles = "Vui lòng chọn ít nhất 1 ảnh.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateVariant()) {
      handleAddVariant(); 
    }
  };



  return (
    <Modal
  isOpen={isOpen}
  onRequestClose={onRequestClose}
  style={{
    overlay: { backgroundColor: "rgba(0,0,0,0.4)" },
    content: {
      maxWidth: "520px",
      margin: "60px auto",
      borderRadius: "12px",
      padding: "24px",
      background: "#fffaf0",
      border: "1px solid rgba(207,163,74,0.4)"
    }
  }}
>
  <h2 className="text-2xl font-bold mb-6 text-[#7B1E16]">
    Thêm mẫu mới
  </h2>

  <div className="space-y-5">

    {/* COLOR */}
    <div>
      <label className="block font-semibold mb-2 text-[#7B1E16]">
        Chọn màu:
      </label>

      <div className="flex flex-wrap gap-2">
        {colorOptions
          .filter(color => !usedColors.includes(color))
          .map(color => (
            <button
              key={color}
              onClick={() => setNewVariant(prev => ({ ...prev, color }))}
              className={`px-3 py-1 rounded border transition
              ${newVariant.color === color
                  ? "bg-[#7B1E16] text-[#f7e8b0] border-[#7B1E16]"
                  : "bg-[#f8edd6] text-[#7B1E16] border-[#cfa34a]/40 hover:bg-[#f3e2c2]"
                }`}
            >
              {color}
            </button>
          ))}
      </div>

      {errors.color && (
        <p className="text-red-600 font-medium mt-1">{errors.color}</p>
      )}
    </div>


    {/* SIZE */}
    <div>
      <label className="block font-semibold mb-2 text-[#7B1E16]">
        Chọn size:
      </label>

      <div className="flex flex-wrap gap-2">
        {sizeOptions.map(size => (
          <button
            key={size}
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
        className="w-full border border-[#cfa34a]/40 bg-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
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
        className="w-full border border-[#cfa34a]/40 bg-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#cfa34a]"
        value={newVariant.quantity}
        onChange={(e) =>
          setNewVariant({ ...newVariant, quantity: e.target.value })
        }
      />

      {errors.quantity && (
        <p className="text-red-600 font-medium mt-1">{errors.quantity}</p>
      )}
    </div>


    {/* IMAGE UPLOAD */}
    <div>
      <input
        type="file"
        name="files"
        multiple
        accept="image/*"
        className="w-full border border-[#cfa34a]/40 rounded-lg p-2 bg-white
            file:bg-[#7B1E16] file:text-[#f7e8b0] file:border-0 file:px-3 file:py-1 file:rounded file:mr-3"
        onChange={handleImageChange}
      />

      {errors.imageFiles && (
        <p className="text-red-600 font-medium mt-1">
          {errors.imageFiles}
        </p>
      )}
    </div>


    {/* IMAGE PREVIEW */}
    <div className="flex gap-2 flex-wrap">
      {newVariant.imageFiles.map((file, i) => (
        <div
          key={i}
          className="relative"
          draggable
          onDragStart={() => setDraggedIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(i)}
        >
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-16 h-16 object-cover rounded border border-[#cfa34a]/40"
          />

          <button
            className="absolute -top-2 -right-2 w-5 h-5 bg-[#7B1E16] text-white rounded-full flex items-center justify-center text-xs"
            onClick={() => handleRemoveImage(i)}
          >
            ×
          </button>
        </div>
      ))}
    </div>

  </div>


  {/* BUTTONS */}
  <div className="mt-8 flex justify-end gap-3">

    <button
      onClick={onRequestClose}
      className="px-4 py-2 border border-[#cfa34a]/40 text-[#7B1E16] rounded-lg hover:bg-[#f3e2c2]"
    >
      Hủy
    </button>

    <button
      onClick={handleSubmit}
      className="px-4 py-2 bg-[#7B1E16] text-[#f7e8b0] rounded-lg hover:bg-[#9B2C20]"
    >
      Lưu mẫu
    </button>

  </div>
</Modal>
  );
};

export default AddVariantModal;
