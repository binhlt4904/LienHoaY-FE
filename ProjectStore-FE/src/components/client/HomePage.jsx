import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Navbar from "../Navbar";
import ChatBox from "./ChatBox";
import ScrollToTopButton from "../ScrollToTopButton";

function HomePage() {
  const [setShowUserDropdown] = useState(false);
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const [sets, setSets] = useState([]);
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const dropdownContainerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res1 = await axios.get(`${API_BASE_URL}/products/tops`);
        const res2 = await axios.get(`${API_BASE_URL}/products/bottoms`);
        const res3 = await axios.get(`${API_BASE_URL}/products/accessories`);
        const res4 = await axios.get(`${API_BASE_URL}/products/new-arrivals`);
        const res5 = await axios.get(`${API_BASE_URL}/products/sets`);

        setTops(res1.data);
        setBottoms(res2.data);
        setAccessories(res3.data);
        setNewArrivals(res4.data);
        setSets(res5.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.title = "PHÁP PHỤC LIÊN HOA Y";
  }, []);

  const ProductDetail = ({ product, isNew }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (product.category === 'top') navigate(`/product/top/${product.id}`);
      if (product.category === 'bottom') navigate(`/product/bottom/${product.id}`);
      if (product.category === 'accessory') navigate(`/product/accessory/${product.id}`);
      if (product.category === 'set') navigate(`/product/set/${product.id}`);
    };

    return (
      <div
        onClick={handleClick}
        className="group relative bg-white border border-red-100 rounded-2xl shadow-sm hover:shadow-xl 
        transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <img
            src={product.thumbnailImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {isNew && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              NEW
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-[15px] font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem] group-hover:text-red-700 transition">
            {product.name}
          </h3>
          <p className="text-red-600 font-bold text-[15px]">
            {Number(product.price).toLocaleString('vi-VN')} ₫
          </p>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, onViewAll }) => (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-[22px] font-bold tracking-widest text-red-700 uppercase relative">
        {title}
        <span className="absolute left-0 -bottom-2 w-10 h-[3px] bg-red-600 rounded-full"></span>
      </h2>
      <button
        onClick={onViewAll}
        className="bg-gradient-to-r from-red-600 to-red-500 text-white 
        text-sm font-semibold uppercase px-6 py-2 rounded-full shadow 
        hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:scale-105 
        transition-all duration-300"
      >
        Xem tất cả
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fff7f3]">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    

      <main
        ref={mainRef}
        className="flex-1 mt-[102px] px-10 py-8 overflow-y-auto space-y-14"
      >
        {/* Banner */}
        <div className="relative">
          <img
            src="/images/anhnen.png"
            alt="Banner"
            className="rounded-3xl w-full h-[72vh] object-cover shadow-xl"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        {/* New Arrival */}
        <section>
          <SectionHeader title="NEW ARRIVAL" onViewAll={() => navigate("/product/new-arrival")} />
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {newArrivals.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} isNew />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Set */}
        <section>
          <SectionHeader title="SET" onViewAll={() => navigate("/product/set")} />
          <Swiper
            modules={[Navigation]}
            navigation
            loop
            grabCursor
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {sets.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Top */}
        <section>
          <SectionHeader title="TOP" onViewAll={() => navigate("/product/top")} />
          <Swiper
            modules={[Navigation]}
            navigation
            loop
            grabCursor
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {tops.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Bottom */}
        <section>
          <SectionHeader title="BOTTOM" onViewAll={() => navigate("/product/bottom")} />
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {bottoms.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Accessory */}
        <section>
          <SectionHeader title="ACCESSORY" onViewAll={() => navigate("/product/accessory")} />
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {accessories.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductDetail product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <ChatBox />
        <ScrollToTopButton targetRef={mainRef} />
        <Footer />
      </main>
    </div>
  );
}

export default HomePage;
