import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import Slider from 'react-slick';
import AdminSidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import AdminChatBox from "./AdminChatBox";
import { FaChevronLeft, FaChevronRight, FaTimes, FaEdit, FaEyeSlash } from 'react-icons/fa';
import AddVariantModel from './AddVariantModel';
import AddSizeModel from './AddSizeModel';
import EditVariantModel from './EditVariantModel';
import EditColorImagesModel from './EditColorImagesModel';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColor, setActiveColor] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSizeModalOpen, setIsAddSizeModalOpen] = useState(false);
  const [selectedColorForSize, setSelectedColorForSize] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [variantToEdit, setVariantToEdit] = useState(null);
  const [isEditColorModalOpen, setIsEditColorModalOpen] = useState(false);
  const [editColorImages, setEditColorImages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;



  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });


  const colorOptions = [
    'Trắng', 'Đen', 'Xám', 'Xanh navy', 'Xanh dương', 'Xanh lá',
    'Hồng', 'Đỏ', 'Nâu', 'Cam', 'Vàng', 'Be', 'Tím'
  ];



  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

  const [newVariant, setNewVariant] = useState({
    color: '',
    size: '',
    price: '',
    quantity: '',
    images: [],
    imageFiles: []
  });

  useEffect(() => {
    if (!activeColor && variants.length > 0) {
      setActiveColor(variants[0].color);
    }
  }, [variants]); //todo

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewVariant(prev => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files]
    }));
  };

  const uploadImages = async (files) => {
    const formData = new FormData();
    console.log(files);
    files.forEach(file => {
      console.log("Appending file:", file.name);
      formData.append("files", file)
    });
    for (let [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return response.data; // Expect: List<String> URLs
  };

  // const handleAddVariant = async () => {
  //   try {

  //     let imageUrls = [];

  //     const payload = {
  //       ...newVariant,
  //       images: imageUrls,
  //       productId: id,
  //     };

  //     await axios.post(`${API_BASE_URL}/productVariant/add-new`, payload).then((res) => {
  //       const newPrice = res.data.newPrice;
  //       setProduct(prev => ({ ...prev, price: newPrice })); // Cập nhật giá trong UI
  //     });;


  //     setIsAddModalOpen(false);
  //     setNewVariant({ color: '', size: '', price: '', quantity: '', images: [], imageFiles: [] });

  //     const variantRes = await axios.get(`${API_BASE_URL}/productVariant/product/${id}`);
  //     const variantList = (variantRes.data || []).sort((a, b) => {
  //       const colorDiff = colorOptions.indexOf(a.color) - colorOptions.indexOf(b.color);

  //       if (colorDiff !== 0) return colorDiff;
  //       return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
  //     });

  //     setVariants(variantList);
  //   } catch (error) {
  //     console.error("Lỗi khi thêm mẫu:", error);
  //   }
  // };

  const handleAddVariant = async () => {
    try {
      let imageUrls = [];
      if (newVariant.imageFiles.length > 0) {
        imageUrls = await uploadImages(newVariant.imageFiles);
      }

      const payload = {
        color: newVariant.color,
        size: newVariant.size,
        price: parseInt(newVariant.price),
        quantity: parseInt(newVariant.quantity),
        images: imageUrls,
        productId: id,
      };

      await axios.post(`${API_BASE_URL}/productVariant/add-new`, payload);

      setIsAddModalOpen(false);
      setNewVariant({
        color: '',
        size: '',
        price: '',
        quantity: '',
        images: [],
        imageFiles: []
      });

      const variantRes = await axios.get(`${API_BASE_URL}/productVariant/product/${id}`);
      setVariants(variantRes.data || []);

    } catch (error) {
      console.error("Lỗi khi thêm mẫu:", error);
    }
  };

  const handleAddSize = async () => {
    try {
      const price = parseInt(newVariant.price);
      const quantity = parseInt(newVariant.quantity);


      const existing = variants.find(
        v => v.color === selectedColorForSize && v.size === newVariant.size
      );

      if (existing) {
        if (existing.price !== price) {
          alert("Size này đã tồn tại nhưng có giá khác!");
          return;
        }

        const updated = { ...existing, quantity: existing.quantity + quantity };
        console.log(updated);
        await axios.put(`${API_BASE_URL}/productVariant/add-existing/${existing.id}`, updated);
      } else {
        const imagesToUse =
          variants.find(v => v.color === selectedColorForSize)?.images || [];

        const payload = {
          ...newVariant,
          color: selectedColorForSize,
          images: imagesToUse,
          productId: id,
          price,
          quantity
        };
        await axios.post(`${API_BASE_URL}/productVariant/add-new`, payload).then((res) => {
          const newPrice = res.data.newPrice;
          setProduct(prev => ({ ...prev, price: newPrice })); // Cập nhật giá trong UI
        });;
      }

      setIsAddSizeModalOpen(false);
      setNewVariant({ color: '', size: '', price: '', quantity: '', images: [], imageFiles: [] });

      const variantRes = await axios.get(`${API_BASE_URL}/productVariant/product/${id}`);
      const variantList = (variantRes.data || []).sort((a, b) => {
        const colorDiff = colorOptions.indexOf(a.color) - colorOptions.indexOf(b.color);
        if (colorDiff !== 0) return colorDiff;
        return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
      });
      setVariants(variantList);
    } catch (e) {
      console.error("Lỗi khi thêm size:", e);
    }
  };

  const handleHideVariant = async (variantId) => {
    try {
      await axios.put(`${API_BASE_URL}/productVariant/hide/${variantId}`);
      const refreshed = await axios.get(`${API_BASE_URL}/productVariant/product/${id}`);
      setVariants(refreshed.data || []);
    } catch (err) {
      console.error("Lỗi khi ẩn mẫu:", err);
    }
  };

  const openEditModal = (variant) => {
    setVariantToEdit({ ...variant });
    setIsEditModalOpen(true);
  };

  const handleUpdateVariant = async () => {
    try {
      const payload = {
        ...variantToEdit,
        price: parseInt(variantToEdit.price),
        quantity: parseInt(variantToEdit.quantity),
      };

      console.log(variantToEdit.id);

      await axios.put(`${API_BASE_URL}/productVariant/update/${variantToEdit.id}`, payload);
      setIsEditModalOpen(false);
      const refreshed = await axios.get(`${API_BASE_URL}/productVariant/product/${id}`);
      setVariants(refreshed.data || []);
    } catch (e) {
      console.error("Lỗi khi cập nhật mẫu:", e);
    }
  };







  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${API_BASE_URL}/products/${id}`);
        const productData = productRes.data;
        setProduct(productData);
        document.title = productData.name;

        const variantRes = await axios.get(`${API_BASE_URL}/productVariant/product/${id}`);
        const variantList = (variantRes.data || []).sort((a, b) => {
          const colorDiff = colorOptions.indexOf(a.color) - colorOptions.indexOf(b.color);
          if (colorDiff !== 0) return colorDiff;
          return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
        });


        setVariants(variantList);

        const lowestPrice = variantList.length > 0
          ? Math.min(...variantList.map(v => v.price))
          : null;

        setProduct({ ...productData, price: lowestPrice });

        if (variantList.length > 0) {
          setActiveColor(variantList[0].color);
        }
      } catch (err) {
        console.error("Error fetching product or variants:", err);
      }
    };

    fetchData();
  }, [id]);

  const openModalWithImages = (images) => {
    setSelectedImages(images);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
  };

  console.log(newVariant);

  const SampleNextArrow = ({ onClick }) => (
    <div onClick={onClick} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 cursor-pointer">
      <FaChevronRight className="text-black text-3xl" />
    </div>
  );

  const SamplePrevArrow = ({ onClick }) => (
    <div onClick={onClick} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 cursor-pointer">
      <FaChevronLeft className="text-black text-3xl" />
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: selectedImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const groupedByColor = variants.reduce((acc, v) => {
    if (!acc[v.color]) acc[v.color] = [];
    acc[v.color].push(v);
    return acc;
  }, {});

  const usedColors = Object.keys(groupedByColor);



  return (
    <div className="flex min-h-screen bg-[#f6f1e7]">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar user={user} isOpen={sidebarOpen} />

      <main className="flex-1 pt-[90px] p-8 overflow-y-auto">
        <div className="flex gap-8">
          <div className="w-1/2 bg-[#fffaf0] border border-[#cfa34a]/40 p-6 rounded-xl shadow flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4 text-[#7B1E16]">{product?.name}</h1>
            {activeColor && groupedByColor[activeColor]?.[0]?.images?.length > 0 && (
              <img
                src={groupedByColor[activeColor][0].images[0]}
                alt="Ảnh màu"
                onClick={() => openModalWithImages(groupedByColor[activeColor][0].images)}
                className="w-full max-w-md h-auto rounded border shadow-lg mb-4 cursor-pointer"
              />
            )}

            <p className="text-lg text-[#7B1E16]"><strong>Giá trưng bày: </strong>
              <span className="text-[#cfa34a] font-semibold">
                {product?.price?.toLocaleString()}đ
              </span></p>
          </div>

          <div className="w-1/2 bg-[#fffaf0] border border-[#cfa34a]/40 p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-[#7B1E16]">Các mẫu hiện có</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#7B1E16] hover:bg-[#9B2C20] text-[#f7e8b0] px-4 py-2 rounded shadow text-sm"
              >
                + Nhập thêm mẫu
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {usedColors.map(color => (
                <button
                  key={color}
                  onClick={() => setActiveColor(color)}
                  className={`px-4 py-2 rounded border transition
${activeColor === color
                      ? 'bg-[#7B1E16] text-[#f7e8b0] border-[#7B1E16]'
                      : 'bg-[#f8edd6] text-[#7B1E16] border-[#cfa34a]/40 hover:bg-[#f3e2c2]'
                    }`}
                >
                  {color}
                </button>
              ))}
            </div>

            {activeColor && groupedByColor[activeColor] && (
              <div className="space-y-4">
                {groupedByColor[activeColor].map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#f8edd6] p-4 rounded border border-[#cfa34a]/30">
                    <div>
                      <p><strong>Size:</strong> {v.size}</p>
                      <p><strong>Giá:</strong> {v.price.toLocaleString()}đ</p>
                      <p><strong>Số lượng:</strong> {v.quantity}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => openEditModal(v)}
                        className="px-3 py-1 text-sm bg-[#cfa34a] hover:bg-[#d9b15f] text-white rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleHideVariant(v.id)}
                        className="px-3 py-1 text-sm bg-[#7B1E16] hover:bg-[#9B2C20] text-white rounded"
                      >
                        <FaEyeSlash />
                      </button>
                    </div>
                  </div>
                ))}


                {/* ✅ Nút thêm size — chỉ 1 lần sau các mẫu size của màu đang xem */}
                <button
                  onClick={() => {
                    setSelectedColorForSize(activeColor);
                    setIsAddSizeModalOpen(true);
                  }}
                  className="mt-4 bg-[#7B1E16] text-[#f7e8b0] px-4 py-2 rounded hover:bg-[#9B2C20]"
                >
                  + Thêm size cho màu này
                </button>
                <button
                  onClick={() => {
                    const variant = groupedByColor[activeColor]?.[0];
                    setEditColorImages(variant?.images || []);
                    setIsEditColorModalOpen(true);
                  }}
                  className="bg-yellow-500 ml-4 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  ✏️ Chỉnh sửa ảnh màu này
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal thêm mẫu */}
        <AddVariantModel
          isOpen={isAddModalOpen}
          onRequestClose={() => setIsAddModalOpen(false)}
          colorOptions={colorOptions}
          sizeOptions={sizeOptions}
          usedColors={usedColors}
          newVariant={newVariant}
          setNewVariant={setNewVariant}
          handleImageChange={handleImageChange}
          handleAddVariant={handleAddVariant}
        />

        {/* Modal xem ảnh */}
        <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  style={{
    overlay: {
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    content: {
      position: "relative",
      inset: "unset",
      width: "80%",
      maxWidth: "900px",
      height: "80vh",
      padding: "20px",
      borderRadius: "10px",
      overflow: "hidden"
    }
  }}
>
          <button
  onClick={closeModal}
  className="absolute top-3 right-4 text-2xl hover:text-red-500 z-10"
>
  <FaTimes />
</button>

<Slider {...sliderSettings} className="h-full">
  {selectedImages.map((img, i) => (
    <div key={i}>
      <div className="flex justify-center items-center h-[70vh]">
        <img
          src={img}
          className="max-h-[70vh] object-contain"
        />
      </div>
    </div>
  ))}
</Slider>
        </Modal>
        <AddSizeModel
          isOpen={isAddSizeModalOpen}
          onRequestClose={() => setIsAddSizeModalOpen(false)}
          selectedColor={selectedColorForSize}
          sizeOptions={sizeOptions}
          newVariant={newVariant}
          setNewVariant={setNewVariant}
          handleAddSize={handleAddSize}
        />

        <EditVariantModel
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          variant={variantToEdit}
          setVariant={setVariantToEdit}
          handleUpdateVariant={handleUpdateVariant}
        />

        <EditColorImagesModel
          isOpen={isEditColorModalOpen}
          onRequestClose={() => setIsEditColorModalOpen(false)}
          initialImages={editColorImages}
          onSave={async (updatedImages) => {
            const color = activeColor;
            const colorVariants = variants.filter(v => v.color === color);
            for (const v of colorVariants) {
              await axios.put(`${API_BASE_URL}/productVariant/update-images/${v.id}`, updatedImages, {
                headers: { 'Content-Type': 'application/json' },
              });
            }

            const refreshed = await axios.get(`${API_BASE_URL}/productVariant/product/${id}`);
            setVariants(refreshed.data || []);
            setIsEditColorModalOpen(false);
          }}
        />

        <AdminChatBox />
      </main>
    </div>
  );
};

export default ProductDetail;
