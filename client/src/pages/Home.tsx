// src/pages/Home.tsx
import toast from "react-hot-toast";
import { useUser } from "../context/authContext";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { 
  CakeIcon, 
  ShoppingBagIcon, 
  Squares2X2Icon,
  GiftIcon,
  StarIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import "../styles/home.css";   

const Home = () => {
  const { user } = useUser();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    if (user) {
      toast.success(`Chào mừng ${user.fullName} (${user.type}) trở lại trang chủ!`, {
        duration: 10000,
        icon: "Welcome",
      });
    }
  }, [user]);

  return (
    <>
      <div>Trang chủ</div>;
    </>
  )
};

export default HomePage;
  // Dữ liệu banner quảng cáo
  const banners = [
    {
      title: "TRỌN NGỌT NGÀO",
      subtitle: "BÁNH NGON",
      text: "Bánh Tiramisu chỉ từ",
      price: "315.000 VNĐ",
      image: "/images/tiramisu.jpg",
      buttonText: "Đặt hàng ngay"
    },
    {
      title: "HƯƠNG VỊ ĐẶC BIỆT",
      subtitle: "BÁNH KEM",
      text: "Bánh Matcha chỉ từ",
      price: "280.000 VNĐ",
      image: "/images/tiramisu.jpg",
      buttonText: "Khám phá ngay"
    },
    {
      title: "COMBO ƯU ĐÃI",
      subtitle: "SIÊU HOT",
      text: "Combo 3 bánh chỉ từ",
      price: "750.000 VNĐ",
      image: "/images/tiramisu.jpg",
      buttonText: "Mua ngay"
    }
  ];

  // Dữ liệu món được yêu thích
  const popularItems = [
    {
      name: "Bánh Tiramisu",
      price: 315000,
      image: "/images/tiramisu.jpg",
      rating: 5,
      reviews: 128
    },
    {
      name: "Bánh Matcha",
      price: 280000,
      image: "/images/tiramisu.jpg",
      rating: 5,
      reviews: 95
    },
    {
      name: "Bánh Socola",
      price: 320000,
      image: "/images/tiramisu.jpg",
      rating: 4,
      reviews: 112
    },
    {
      name: "Bánh Dâu tây",
      price: 295000,
      image: "/images/tiramisu.jpg",
      rating: 5,
      reviews: 87
    },
    {
      name: "Bánh Cam sữa",
      price: 275000,
      image: "/images/tiramisu.jpg",
      rating: 4,
      reviews: 76
    },
    {
      name: "Bánh Trà xanh",
      price: 290000,
      image: "/images/tiramisu.jpg",
      rating: 5,
      reviews: 103
    }
  ];

  // Dữ liệu các loại sản phẩm
  const categories = [
    {
      name: "BÁNH KEM",
      icon: CakeIcon,
      description: "Bánh kem tươi ngon",
      image: "/images/nhan-1.jpg",
      count: 25,
      color: "from-pink-100 to-pink-200"
    },
    {
      name: "BÁNH MÌ",
      icon: ShoppingBagIcon,
      description: "Bánh mì thơm ngon",
      image: "/images/nhan-2.jpg",
      count: 18,
      color: "from-amber-100 to-amber-200"
    },
    {
      name: "BÁNH QUY",
      icon: Squares2X2Icon,
      description: "Bánh quy giòn tan",
      image: "/images/nhan-3.jpg",
      count: 32,
      color: "from-yellow-100 to-yellow-200"
    },
    {
      name: "KHÁC",
      icon: GiftIcon,
      description: "Các loại bánh khác",
      image: "/images/nhan-4.jpg",
      count: 15,
      color: "from-purple-100 to-purple-200"
    }
  ];

  // Dữ liệu chương trình khuyến mãi
  const promotions = [
    {t:"Combo Matcha", d:"3 Ngôi sao mới", discount: "15%", image: "/images/chuongtrinh-1.jpg"},
    {t:"CROM", d:"Combo 4 vị", discount: "20%", image: "/images/chuongtrinh-2.jpg"},
    {t:"Combo Tiramisu", d:"Mua 2 tặng 1", discount: "30%", image: "/images/chuongtrinh-3.jpg"},
    {t:"Tiramisu", d:"Mua cho bé gái", discount: "10%", image: "/images/chuongtrinh-4.jpg"},
    {t:"Chương Trình", d:"Hàng Thân Thiết", discount: "25%", image: "/images/chuongtrinh-5.jpg"},
    {t:"SIÊU KHỦNG 8/3", d:"Hoa kem + Trái cây", discount: "35%", image: "/images/chuongtrinh-6.jpg"},
  ];

  // Dữ liệu tin tức
  const newsItems = [
    {
      title: "Bí quyết chọn bánh kem sinh nhật hoàn hảo",
      excerpt: "Khám phá những mẹo nhỏ để chọn được chiếc bánh kem sinh nhật đẹp mắt và ngon miệng nhất...",
      image: "/images/chuongtrinh-1.jpg",
      date: "15/03/2024",
      category: "Mẹo vặt"
    },
    {
      title: "Xu hướng bánh kem năm 2024",
      excerpt: "Những xu hướng thiết kế bánh kem hot nhất trong năm 2024 mà bạn không thể bỏ lỡ...",
      image: "/images/chuongtrinh-2.jpg",
      date: "12/03/2024",
      category: "Xu hướng"
    },
    {
      title: "Công thức làm bánh tại nhà đơn giản",
      excerpt: "Hướng dẫn chi tiết cách làm bánh kem tại nhà với nguyên liệu dễ tìm, đơn giản...",
      image: "/images/chuongtrinh-3.jpg",
      date: "10/03/2024",
      category: "Công thức"
    },
    {
      title: "Lợi ích của việc ăn bánh handmade",
      excerpt: "Tìm hiểu về những lợi ích sức khỏe và giá trị dinh dưỡng của bánh kem handmade...",
      image: "/images/chuongtrinh-4.jpg",
      date: "08/03/2024",
      category: "Sức khỏe"
    }
  ];

  // Chuyển banner tự động
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="page">
      {/* 1. BANNER QUẢNG CÁO */}
      <section className="banner">
        <div className="bannerWrapper">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`bannerSlide ${index === currentBanner ? 'active' : ''}`}
            >
              <div className="bannerContent">
                <h1 className="bannerTitle">
                  {banner.title}<br />
                  <span>{banner.subtitle}</span>
                </h1>
                <p className="bannerText">{banner.text}</p>
                <p className="bannerPrice">{banner.price}</p>
                <div className="bannerBtns">
                  <button className="btnGreen">{banner.buttonText}</button>
                  <button className="btnOutline">Xem chi tiết</button>
                </div>
              </div>
              <div className="bannerImageContainer">
                <img 
                  src={banner.image}      
                  alt={banner.title} 
                  className="bannerImg" 
                />
              </div>
            </div>
          ))}
        </div>
        <div className="bannerControls">
          <button onClick={prevBanner} className="bannerControlBtn" aria-label="Previous banner">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div className="bannerDots">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`bannerDot ${index === currentBanner ? 'active' : ''}`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={nextBanner} className="bannerControlBtn" aria-label="Next banner">
            <ArrowRightIcon className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* 2. CÁC MÓN ĐƯỢC YÊU THÍCH NHẤT */}
      <section className="sectionWhite">
        <div className="max-w-7xl mx-auto px-4">
          <div className="sectionHeader">
            <h2 className="titleBrown">CÁC MÓN ĐƯỢC YÊU THÍCH NHẤT</h2>
            <p className="sectionSubtitle">Khám phá những món bánh được khách hàng yêu thích nhất</p>
          </div>
          <div className="popularGrid">
            {popularItems.map((item, index) => (
              <div key={index} className="popularCard">
                <div className="popularImageWrapper">
                  <img src={item.image} alt={item.name} className="popularImage" />
                  <div className="popularBadge">YÊU THÍCH</div>
                </div>
                <div className="popularContent">
                  <h3 className="popularName">{item.name}</h3>
                  <div className="popularRating">
                    {[...Array(5)].map((_, i) => (
                      i < item.rating ? (
                        <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <StarIcon key={i} className="w-5 h-5 text-gray-300" />
                      )
                    ))}
                    <span className="popularReviews">({item.reviews})</span>
                  </div>
                  <div className="popularPrice">{formatPrice(item.price)} VNĐ</div>
                  <button className="popularButton">Thêm vào giỏ</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CÁC LOẠI CÓ Ở CỬA HÀNG */}
      <section className="sectionGray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="sectionHeader">
            <h2 className="titleBrown">CÁC LOẠI CÓ Ở CỬA HÀNG</h2>
            <p className="sectionSubtitle">Khám phá đa dạng các loại bánh tại cửa hàng chúng tôi</p>
          </div>
          <div className="categoryGrid">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="categoryCard">
                  <div className={`categoryIconWrapper bg-gradient-to-br ${category.color}`}>
                    <IconComponent className="categoryIcon" />
                  </div>
                  <img src={category.image} alt={category.name} className="categoryImage" />
                  <div className="categoryContent">
                    <h3 className="categoryName">{category.name}</h3>
                    <p className="categoryDescription">{category.description}</p>
                    <div className="categoryCount">{category.count} sản phẩm</div>
                    <button className="categoryButton">
                      Xem tất cả <ChevronRightIcon className="w-5 h-5 inline ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CÁC CHƯƠNG TRÌNH KHUYẾN MÃI */}
      <section className="sectionWhite">
        <div className="max-w-7xl mx-auto px-4">
          <div className="sectionHeader">
            <h2 className="titleGreen">CÁC CHƯƠNG TRÌNH KHUYẾN MÃI</h2>
            <p className="sectionSubtitle">Ưu đãi hấp dẫn đang chờ bạn</p>
          </div>
          <div className="promotionGrid">
            {promotions.map((promo, index) => (
              <div key={index} className="promotionCard">
                <div className="promotionImageWrapper">
                  <img src={promo.image} alt={promo.t} className="promotionImage" />
                  <div className="promotionBadge">{promo.discount} OFF</div>
                </div>
                <div className="promotionContent">
                  <h3 className="promotionTitle">{promo.t}</h3>
                  <p className="promotionDesc">{promo.d}</p>
                  <button className="promotionButton">
                    Áp dụng ngay <ArrowRightIcon className="w-5 h-5 inline ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
