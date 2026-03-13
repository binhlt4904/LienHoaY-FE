import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const EditColorImagesModel = ({
  isOpen,
  onRequestClose,
  initialImages = [],
  onSave
}) => {
  const [images, setImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedNewFileIndex, setDraggedNewFileIndex] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



  useEffect(() => {
    if (isOpen) {
      setImages(initialImages);
      setNewFiles([]);
    }
  }, [initialImages, isOpen]);

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
  };

  const handleSave = async () => {
    let uploaded = [];
    if (newFiles.length > 0) {
      const formData = new FormData();
      newFiles.forEach(file => formData.append("files", file));

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData
      });

      uploaded = await response.json();
    }

    const updated = [...images, ...uploaded];
    onSave(updated);
    setNewFiles([]);
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setImages(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
    setDraggedIndex(null);
  };

  const handleDropNewFile = (targetIndex) => {
    if (draggedNewFileIndex === null || draggedNewFileIndex === targetIndex) return;
    setNewFiles(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedNewFileIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
    setDraggedNewFileIndex(null);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <Modal
  isOpen={isOpen}
  onRequestClose={onRequestClose}
  style={{
    overlay: { backgroundColor: "rgba(0,0,0,0.4)" },
    content: {
      maxWidth: "620px",
      margin: "60px auto",
      borderRadius: "12px",
      padding: "24px",
      background: "#fffaf0",
      border: "1px solid rgba(207,163,74,0.4)"
    }
  }}
>
  <h2 className="text-2xl font-bold mb-6 text-[#7B1E16]">
    Chỉnh sửa ảnh cho màu
  </h2>

  <div className="space-y-6">

    {/* OLD IMAGES */}
    <div>
      <p className="font-semibold text-[#7B1E16] mb-2">
        Ảnh hiện tại
      </p>

      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-move"
            draggable
            onDragStart={() => setDraggedIndex(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
          >
            <img
              src={img}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#cfa34a]/40 shadow-sm"
            />

            <button
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white 
              rounded-full flex items-center justify-center text-xs"
              onClick={() => handleRemoveImage(idx)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>


    {/* UPLOAD */}
    <div>
      <label className="block font-semibold text-[#7B1E16] mb-2">
        Thêm ảnh mới
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-[#cfa34a]/40 rounded-lg p-2 bg-white
        file:bg-[#7B1E16] file:text-[#f7e8b0] file:border-0 file:px-3 file:py-1 file:rounded file:mr-3"
      />
    </div>


    {/* NEW FILE PREVIEW */}
    {newFiles.length > 0 && (
      <div>
        <p className="font-semibold text-[#7B1E16] mb-2">
          Ảnh mới
        </p>

        <div className="flex flex-wrap gap-3">
          {newFiles.map((file, i) => (
            <div
              key={i}
              className="relative cursor-move"
              draggable
              onDragStart={() => setDraggedNewFileIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropNewFile(i)}
            >
              <img
                src={URL.createObjectURL(file)}
                alt="new"
                className="w-20 h-20 object-cover rounded-lg border border-[#cfa34a]/40 shadow-sm"
              />

              <button
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white 
                rounded-full flex items-center justify-center text-xs"
                onClick={() => handleRemoveNewFile(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    )}


    {/* BUTTONS */}
    <div className="flex justify-end gap-3 pt-4 border-t border-[#cfa34a]/30">

      <button
        onClick={onRequestClose}
        className="px-4 py-2 border border-[#cfa34a]/40 text-[#7B1E16] 
        rounded-lg hover:bg-[#f3e2c2]"
      >
        Hủy
      </button>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-[#7B1E16] text-[#f7e8b0] rounded-lg hover:bg-[#9B2C20]"
      >
        Lưu ảnh
      </button>

    </div>

  </div>
</Modal>
  );
};

export default EditColorImagesModel;
