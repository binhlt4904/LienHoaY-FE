import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../Navbar";

import "./TetCollectionPage.css";


const ProductCard = ({ product }) => (
  <div className="tet-product-card">
    <img src={product.thumbnailImage} alt={product.name} />
    <h4>{product.name}</h4>
    <span className="price">{product.price}</span>
  </div>
);

export default function TetCollectionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [robeProducts, setRobeProducts] = useState([]);
  const [buddhistProducts, setBuddhistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef(null);
  const [user] = useState(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/collection/sac-xuan`);

        const robe = res.data.filter(p => p.category === "robe");
        const buddhist = res.data.filter(p => p.category === "buddhist");

        setRobeProducts(robe);
        setBuddhistProducts(buddhist);
      } catch (err) {
        console.error("Failed to load Tết collection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  if (loading) {
    return <div className="tet-loading">Đang tải bộ sưu tập...</div>;
  }
  console.log(buddhistProducts)

  return (

    <div className="flex  bg-[#fff7f3] overflow-hidden tet-page">
      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />


      <main
        ref={mainRef}
        className="flex-1 mt-[50px]  overflow-y-auto "
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE
        }}
      >
        <section className="tet-hero">
          <div className="hero-card">
            {/* VIỀN 4 GÓC */}
          <span className="cloud tl"></span>
          <span className="cloud tr"></span>

          <div className="hero-left">
            <img src="/images/banner-left.png" alt="" />
          </div>

          <div className="hero-center">
            <img
              src="/images/title.png"
              alt="Săn deal đón Tết"
              className="title-img"
            />
          </div>

          <div className="hero-right">
            <img src="/images/banner-right.png" alt="" />
          </div>
          </div>
        </section>



        {/* ===== LIEN HOA Y CARD ===== */}
        <section className="lienhoa-wrapper">
          <div className="lienhoa-card ">
            {/* LEFT TEXT */}
            <div className="lienhoa-content">
              <h3 className="lienhoa-title">Lời ngỏ từ Pháp Phục Liên Hoa Y</h3>
              <p className="lienhoa-greeting">Gửi đạo hữu,</p>

              <p>
                Nhân dịp xuân về, Pháp Phục Liên Hoa Y kính chúc đạo hữu thân tâm an lạc,
                phước duyên viên mãn.
              </p>

              <p>
                Liên Hoa Y trân trọng giới thiệu những pháp phục mới mang tinh thần thanh
                tịnh, trang nghiêm và thuần khiết, đồng hành cùng đạo hữu trên hành trình
                tu tập và chiêm nghiệm nội tâm.
              </p>

              <p>
                Với từng đường kim mũi chỉ, Liên Hoa Y gửi gắm sự cung kính và tâm thành,
                mong mỗi pháp phục sẽ trở thành trợ duyên cho sự an trú và tỉnh thức của
                đạo hữu.
              </p>

              <p className="lienhoa-sign">
                Nam mô Bổn Sư Thích Ca Mâu Ni Phật.
              </p>
            </div>

            {/* RIGHT IMAGE */}
            <div className="lienhoa-image">
              <img src="/images/lienhoay-title.png" alt="Liên Hoa Y" />
            </div>

            {/* ORNAMENT CORNERS */}
            <span className="corner tl" />
            <span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" />
          </div>
        </section>


        {/* ===== ROBE COLLECTION ===== */}
        <section className="relative tet-section">
          <div className="section-title">Hương Sắc Hội Xuân</div>
          <div className="product-grid">
            {robeProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <button className="view-more">Xem thêm sản phẩm</button>
        </section>

        {/* ===== BUDDHIST COLLECTION ===== */}
        <section className="relative tet-section">
          <div className="section-title">Sắc Xuân Xum Vầy – Pháp Phục</div>
          <div className="product-grid">
            {buddhistProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <button className="view-more">Xem thêm sản phẩm</button>
        </section>

      </main>
    </div>
  );
}
