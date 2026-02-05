import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCart } from "./CartContext";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ScrollToTopButton from "../ScrollToTopButton";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const mainRef = useRef(null);
  const navigate = useNavigate();

  const colorOptions = [
    'Trắng', 'Đen', 'Xám', 'Xanh navy', 'Xanh dương', 'Xanh lá',
    'Hồng', 'Đỏ', 'Nâu', 'Cam', 'Vàng', 'Be', 'Tím'
  ];

  const colorMap = {
    "Trắng": "#ffffff",
    "Đen": "#000000",
    "Xám": "#9ca3af",
    "Xanh navy": "#1f2937",
    "Xanh dương": "#2563eb",
    "Xanh lá": "#16a34a",
    "Hồng": "#f9a8d4",
    "Đỏ": "#dc2626",
    "Nâu": "#92400e",
    "Cam": "#f97316",
    "Vàng": "#facc15",
    "Be": "#f5f5dc",
    "Tím": "#a855f7"
  };
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const allColors = [...new Set(variants.map(v => v.color))].sort(
    (a, b) => colorOptions.indexOf(a) - colorOptions.indexOf(b)
  );
  const allSizes = [...new Set(variants.map(v => v.size))].sort((a, b) => {
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    return order.indexOf(a) - order.indexOf(b);
  });

  const isColorAvailable = (color) => {
    if (!selectedSize) return true;
    return variants.some(v => v.color === color && v.size === selectedSize);
  };

  const isSizeAvailable = (size) => {
    if (!selectedColor) return true;
    return variants.some(v => v.size === size && v.color === selectedColor);
  };

  const selectedVariant = variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const imagesToDisplay =
    selectedVariant?.images ||
    variants.find(v => v.color === selectedColor)?.images ||
    [];

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productRes = await axios.get(`${API_BASE_URL}/products/${id}`);
        const productData = productRes.data;
        setProduct(productData);
        document.title = productData.name;

        const variantRes = await axios.get(`${API_BASE_URL}/productVariant/product/${id}`);
        const variantList = (variantRes.data || []).sort((a, b) => {
          const colorDiff = colorOptions.indexOf(a.color) - colorOptions.indexOf(b.color);
          if (colorDiff !== 0) return colorDiff;
          return sizeOptions.indexOf(a.size) - sizeOptions.indexOf(b.size);
        });

        if (variantList.length > 0) {
          const allImages = variantList.flatMap(v => v.images || []);
          if (allImages.length > 0) setCurrentImage(allImages[0]);
        }

        setVariants(variantList);

        const lowestPrice = variantList.length > 0
          ? Math.min(...variantList.map(v => v.price))
          : null;

        setProduct({
          ...productData,
          price: lowestPrice
        });
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedColor) {
      const variant = variants.find(v => v.color === selectedColor);
      if (variant && variant.images?.length > 0) {
        setCurrentImage(variant.images[0]);
      }
    }
  }, [selectedColor]);

  const handleAddToCart = () => {
    if (!user || user.role !== 'USER') {
      Swal.fire({
        icon: 'warning',
        title: 'Bạn phải đăng nhập!',
        text: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        confirmButtonText: 'OK'
      });
      return;
    }

    const selectedVariant = variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    );

    if (!selectedVariant) {
      alert("Vui lòng chọn màu và size.");
      return;
    }

    addToCart({
      userId: user.id,
      productVariantId: selectedVariant.id,
      quantity: 1
    });
  };

  const detectCategoryForFitCheck = (prod) => {
    if (prod.category?.name) {
      const cName = prod.category.name.toLowerCase();
      if (cName.includes('áo') || cName.includes('top') || cName.includes('shirt') || cName.includes('hoodie')) return 'top';
      if (cName.includes('quần') || cName.includes('váy') || cName.includes('bottom') || cName.includes('short') || cName.includes('jeans')) return 'bottom';
      if (cName.includes('phụ kiện') || cName.includes('accessory') || cName.includes('túi') || cName.includes('nón')) return 'accessory';
    }

    const name = (prod.name || '').toLowerCase();
    if (name.includes('quần') || name.includes('váy') || name.includes('short') || name.includes('jeans') || name.includes('skirt') || name.includes('jogger')) return 'bottom';
    if (name.includes('túi') || name.includes('nón') || name.includes('mũ') || name.includes('kính') || name.includes('đồng hồ') || name.includes('nhẫn') || name.includes('bag') || name.includes('hat') || name.includes('cap')) return 'accessory';

    return 'top';
  };

  /* =======================
     🌟 Skeleton Loading UI
     ======================= */
  const ProductDetailSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-md animate-pulse">
      {/* Left - Images */}
      <div className="grid grid-cols-6 gap-6">
        <div className="flex flex-col col-span-1 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-24 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="col-span-5 flex items-center justify-center">
          <div className="w-full h-[600px] bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Right - Info */}
      <div className="flex flex-col justify-between">
        <div>
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-6" />

          <div className="h-6 w-32 bg-gray-200 rounded mb-6" />

          {/* Colors */}
          <div className="mb-6">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-16 h-9 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-12 h-9 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <div className="flex-1 h-12 bg-gray-300 rounded-full" />
          <div className="flex-1 h-12 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fff7f3]">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main
        ref={mainRef}
        className="flex-1 mt-[72px] p-8 overflow-y-auto space-y-8"
      >
        {/* ===== HEADER / BREADCRUMB ===== */}
        <div className="flex flex-col gap-3">
          

          <div className="text-gray-500 text-sm flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-red-700 transition">
              Home
            </Link>
            <span>›</span>
            <Link to="/product" className="hover:text-red-700 transition">
              Tất cả sản phẩm
            </Link>
            <span>›</span>
            <Link
              to={`/product/${product?.category}`}
              className="hover:text-red-700 transition capitalize"
            >
              {product?.category === "buddhist"
                ? "Pháp Phục"
                : product?.category === "robe"
                  ? "Áo Robe"
                  : product?.category === "accessory"
                    ? "Phụ Kiện"
                    : "Sản phẩm"}
            </Link>
            <span>›</span>
            <span className="text-black font-semibold line-clamp-1">
              {product?.name}
            </span>
          </div>
        </div>
        {loading ? (
          <ProductDetailSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-md">
            <div className="grid grid-cols-6 gap-6">
              {/* Thumbnails */}
              <div className="flex flex-col col-span-1 gap-3">
                {imagesToDisplay.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`variant image ${index}`}
                    className={`w-full h-24 object-cover rounded cursor-pointer border 
                    ${currentImage === img ? 'border-black' : 'border-gray-200'}`}
                    onClick={() => setCurrentImage(img)}
                  />
                ))}
              </div>

              {/* Main image */}
              <div className="col-span-5 flex items-center justify-center">
                <img
                  src={currentImage || product?.thumbnailImage}
                  alt="main product"
                  className="w-full h-[600px] object-contain rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>

                {selectedVariant ? (
                  <p className="text-2xl text-red-600 font-semibold mt-2">
                    {Number(selectedVariant.price).toLocaleString('vi-VN')} ₫
                  </p>
                ) : (
                  <p className="text-2xl text-red-600 font-semibold mt-2">
                    {Number(product.price).toLocaleString('vi-VN')} ₫
                  </p>
                )}

                {/* Colors */}
                <div className="mt-6">
                  <p className="text-lg font-semibold text-gray-700 mb-3">
                    Màu:{" "}
                    <span className="font-bold text-black">{selectedColor || "-"}</span>
                  </p>

                  <div className="flex gap-3">
                    {allColors.map(color => {
                      const isSelected = selectedColor === color;
                      const isAvailable = isColorAvailable(color);

                      return (
                        <button
                          key={color}
                          disabled={!isAvailable}
                          onClick={() => isAvailable && setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition
            ${isSelected ? "border-black scale-110" : "border-gray-300"}
            ${!isAvailable ? "opacity-40 cursor-not-allowed" : ""}
          `}
                          style={{ backgroundColor: colorMap[color] || "#e5e7eb" }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
                {/* Sizes */}
                <div className="mt-6">
                  <p className="text-lg font-semibold text-gray-700 mb-3">
                    Kích Thước:{" "}
                    <span className="font-bold text-black">{selectedSize || "-"}</span>
                  </p>

                  <div className="flex gap-3">
                    {allSizes.map(size => {
                      const isSelected = selectedSize === size;
                      const isAvailable = isSizeAvailable(size);

                      return (
                        <button
                          key={size}
                          disabled={!isAvailable}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          className={`w-12 h-12 rounded-full border flex items-center justify-center font-semibold transition
            ${isSelected ? "bg-[#6b0f0f] text-white border-[#2f4f3f]" : "bg-white text-gray-700 border-gray-300 hover:border-black"}
            ${!isAvailable ? "opacity-40 cursor-not-allowed line-through" : ""}
          `}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white 
                  font-semibold py-3 rounded-full shadow 
                  hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:scale-105 
                  transition-all duration-300"
                >
                  Thêm vào giỏ hàng
                </button>

                <button
                  onClick={() => {
                    const category = detectCategoryForFitCheck(product);
                    const productToTry = {
                      id: product.id,
                      name: product.name,
                      url: currentImage || product.thumbnailImage,
                      price: product.price,
                      category: category
                    };
                    localStorage.setItem('fitcheck_pending_product', JSON.stringify(productToTry));
                    navigate("/fitcheck")
                  }}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white 
                  font-semibold py-3 rounded-full shadow 
                  hover:from-rose-600 hover:to-pink-600 hover:shadow-lg hover:scale-105 
                  transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Thử Đồ
                </button>
              </div>
            </div>
          </div>
        )}

        <ScrollToTopButton targetRef={mainRef} />
      </main>
      <Footer />
    </div>
  );
}

export default ProductDetail;
