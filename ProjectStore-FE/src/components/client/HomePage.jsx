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
        const res3 = await axios.get(`${API_BASE_URL}/products/accessories`);
        const res4 = await axios.get(`${API_BASE_URL}/products/new-arrivals`);
        console.log(res4)
        setAccessories(res3.data);
        setNewArrivals(res4.data);
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
      if (product.category === 'robe') navigate(`/product/robe/${product.id}`);
      if (product.category === 'buddhist') navigate(`/product/buddhist/${product.id}`);
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

  const categories = [
    {
      title: "Pháp Phục Nam",
      image: "/images/mau1.png",
      link: "/product/phap-phuc-nam",
      discount: "15%",
    },
    {
      title: "Pháp Phục Nữ",
      image: "/images/mau2.png",
      link: "/product/phap-phuc-nu",
      discount: "10%",
    },
    {
      title: "Áo Tràng Cao Cấp",
      image: "/images/mau3.png",
      link: "/product/ao-trang-cao-cap",
      discount: "15%",
    },
    {
      title: "Túi Đi Chùa",
      image: "/images/mau4.png",
      link: "/product/tui-di-chua",
      discount: "5%",
    },
  ];




  return (
    <div className="flex flex-col min-h-screen bg-[#fff7f3] overflow-hidden">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />


      <main
        ref={mainRef}
        className="flex-1 mt-[50px] px-10 py-8 overflow-y-auto space-y-14"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE
        }}
      >
      {/* Banner */}
      <div className="relative pt-6">
          <img
            src="/images/anhnen.png"
            alt="Banner"
            className="rounded-3xl w-full h-[72vh] object-cover shadow-xl"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {categories.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.link)}
              className="relative h-[300px] rounded-[36px] bg-[#fdf1e7] shadow-lg hover:shadow-2xl 
      transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-110 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#7a1414]/85 via-[#7a1414]/40 to-transparent" />

              <div className="relative z-10 p-7 h-full flex flex-col justify-between text-[#fff5d6]">
                <div>
                  <h3 className="text-xl font-extrabold leading-snug">
                    {item.title}
                  </h3>
                  
                </div>

                <button className="self-start bg-[#b22a2a] hover:bg-[#951f1f] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg transition">
                  MUA NGAY
                </button>
              </div>
            </div>
          ))}
        </section>

       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {categories.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.link)}
              className="relative h-[300px] rounded-[36px] bg-[#fdf1e7] shadow-lg hover:shadow-2xl 
      transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-110 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#7a1414]/85 via-[#7a1414]/40 to-transparent" />

              <div className="relative z-10 p-7 h-full flex flex-col justify-between text-[#fff5d6]">
                <div>
                  <h3 className="text-xl font-extrabold leading-snug">
                    {item.title}
                  </h3>
                  
                </div>

                <button className="self-start bg-[#b22a2a] hover:bg-[#951f1f] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg transition">
                  MUA NGAY
                </button>
              </div>
            </div>
          ))}
        </section>



        <ChatBox />
        <ScrollToTopButton targetRef={mainRef} />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
