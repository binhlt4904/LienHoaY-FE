import React from "react";
import "./TetCollectionPage.css";

const womenProducts = [
  {
    id: 1,
    name: "Áo Dài Dao Quỳnh Màu Hồng Ánh Tím",
    price: "2.040.000 VND",
    image: "/assets/images/ao1.jpg",
  },
  {
    id: 2,
    name: "Áo Dài Ý Yên Màu Hồng Sen Đậm",
    price: "2.590.000 VND",
    image: "/assets/images/ao2.jpg",
  },
  {
    id: 3,
    name: "Áo Dài Xuân Nghi Lụa Màu Đỏ Hồng",
    price: "1.295.000 VND",
    image: "/assets/images/ao3.jpg",
  },
  {
    id: 4,
    name: "Áo Dài Châu Nghiêm Màu Hồng",
    price: "2.590.000 VND",
    image: "/assets/images/ao4.jpg",
  },
];

const kidsProducts = [...womenProducts];

const accessories = [
  {
    id: 1,
    name: "Kẹp lụa thêu tay",
    image: "/assets/images/phukien1.jpg",
  },
  {
    id: 2,
    name: "Dép chiếu",
    image: "/assets/images/phukien2.jpg",
  },
  {
    id: 3,
    name: "Băng đô lụa",
    image: "/assets/images/phukien3.jpg",
  },
];

const ProductCard = ({ product }) => (
  <div className="tet-product-card">
    <img src={product.image} alt={product.name} />
    <h4>{product.name}</h4>
    <span className="price">{product.price}</span>
  </div>
);

export default function TetCollectionPage() {
  return (
    <div className="tet-page">
      {/* ===== HERO BANNER ===== */}
      <section className="tet-hero">
        <div className="hero-left">
          <img src="/images/banner.png" alt="" />
        </div>

        <div className="hero-center">
          <h1>SĂN DEAL ĐÓN TẾT</h1>
          <h2>ĐÓN XUÂN SANG</h2>
          <h2>CHỌN LỤA VÀNG</h2>
        </div>

        <div className="hero-right">
          <img src="/assets/images/banner-right.png" alt="" />
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="tet-intro">
        <div className="intro-box">
          <div className="intro-text">
            <h3>Lời ngỏ từ Nhà Lụa</h3>
            <p>Gửi nàng,</p>
            <p>
              Nhân dịp năm cũ khép lại, Nhà Lụa gửi đến nàng lời chúc an yên và
              đủ đầy.
            </p>
            <p>
              Nhà Lụa cùng đem đến những bộ sưu tập mới cho sắc xuân này. Mong
              rằng những thiết kế, đường may tinh tế sẽ đồng hành cùng nàng
              trong những khoảnh khắc sum vầy đầu xuân.
            </p>
            <p>
              Nhẹ nhàng, thanh tao và sang trọng, Nhà Lụa trân trọng sự tin yêu
              và đồng hành của nàng suốt một năm qua.
            </p>
          </div>
          <div className="intro-image">
            <img src="/assets/images/intro-model.png" alt="" />
          </div>
        </div>
      </section>

      {/* ===== WOMEN COLLECTION ===== */}
      <section className="tet-section">
        <div className="section-title">Hương Sắc Hội Xuân</div>
        <div className="product-grid">
          {womenProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <button className="view-more">Xem thêm sản phẩm</button>
      </section>

      {/* ===== KIDS COLLECTION ===== */}
      <section className="tet-section">
        <div className="section-title">Sắc Xuân Xum Vầy – Áo Bé</div>
        <div className="product-grid">
          {kidsProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <button className="view-more">Xem thêm sản phẩm</button>
      </section>

      {/* ===== ACCESSORIES ===== */}
      <section className="tet-section">
        <div className="section-title">Cùng Phụ Kiện Miễn Phí</div>
        <div className="accessory-grid">
          {accessories.map((a) => (
            <div key={a.id} className="accessory-card">
              <img src={a.image} alt={a.name} />
              <p>{a.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
