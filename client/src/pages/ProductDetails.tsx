import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import itemService, { Item } from "../services/items.service";
import { addToCart } from "../services/cart.services";
import { Header } from "../components/Header";
import { useInventory } from "../context/inventoryContext";
import "../styles/productDetails.css";
import { ShoppingCartIcon} from "@heroicons/react/24/solid"; // Heroicons solid
import { ClockIcon } from "lucide-react";

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "Liên hệ";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

const formatCategoryLabel = (category?: string) => {
  switch (category) {
    case "CAKE": return "Bánh ngọt";
    case "BREAD": return "Bánh mì";
    case "COOKIE": return "Bánh quy";
    default: return "Khác";
  }
};

// const formatCakeSubtype = (subType?: string) => {
//   switch (subType) {
//     case "CHEESECAKE": return "Cheesecake";
//     case "MOUSSE": return "Mousse";
//     case "BIRTHDAYCAKE": return "Bánh sinh nhật";
//     default: return undefined;
//   }
// };

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const branchFromQuery = useMemo(() => {
    const value = searchParams.get("branch");
    if (!value) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  const [item, setItem] = useState<Item | null>(null);
  const [loadingItem, setLoadingItem] = useState<boolean>(true);
  const { getItemQuantity, loadInventory } = useInventory();
  const navigate = useNavigate();

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        setLoadingItem(true);
        const res = await itemService.getById(Number(id));
        const data = (res as any)?.data ?? res;
        setItem(data);
      } catch (error) {
        toast.error("Không tải được chi tiết sản phẩm");
      } finally {
        setLoadingItem(false);
      }
    };
    fetchItem();
  }, [id]);

  const tags = useMemo(() => {
    if (!item) return [];
    const detail = item.itemDetail || {};
    const computedTags: string[] = [];

    // Tag chính: category tiếng Việt
    computedTags.push(formatCategoryLabel(item.category));

    // Tag phụ cho CAKE - đọc đúng key "cakeType"
    if (item.category === "CAKE") {
      const cakeType = detail.cakeType || (item as any).cakeType;
      if (cakeType) {
        switch (cakeType) {
          case "CHEESECAKE":
            computedTags.push("Cheesecake");
            break;
          case "BIRTHDAYCAKE":
            computedTags.push("Bánh sinh nhật");
            break;
          case "MOUSE": // có thể là typo trong DB, nếu có thì map
            computedTags.push("Mousse");
            break;
          default:
            computedTags.push(cakeType);
        }
      }
    }

    // Tag cho BREAD - flourType tiếng Việt
    if (item.category === "BREAD") {
      const flourType = detail.flourType || (item as any).flourType;
      if (flourType) {
        switch (flourType) {
          case "wheat":
            computedTags.push("Bột mì");
            break;
          case "whole_wheat":
            computedTags.push("Bột mì nguyên cám");
            break;
          default:
            computedTags.push(flourType);
        }
      }
    }

    // Tag cho COOKIE - trọng lượng
    if (item.category === "COOKIE") {
      const weight = detail.weight || (item as any).weight;
      if (weight) computedTags.push(`${weight}g`);
    }

    return computedTags;
  }, [item]);

  const currentQuantity = useMemo(() => {
    if (!item?.id || !branchFromQuery) return null;
    return getItemQuantity(item.id, branchFromQuery);
  }, [getItemQuantity, item?.id, branchFromQuery]);

  const handleAddToCart = async () => {
    if (!item?.id) return;
    try {
      await addToCart(item.id);
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err: any) {
      if (err?.message === "NEED_LOGIN") {
        navigate("/login");
        toast.error("Vui lòng đăng nhập để thêm vào giỏ");
        return;
      }
      toast.error("Thêm thất bại, vui lòng thử lại");
    }
  };

  if (loadingItem) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-xl" />
              <div className="h-32 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-lg text-gray-600">Không tìm thấy sản phẩm.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="productDetailsPage">
        <div className="productDetailsContainer">
          <div className="productDetailsGrid">
            {/* Hình ảnh */}
            <div className="productImageWrapper">
              {item.imageURL ? (
                <img src={item.imageURL} alt={item.name} className="productImage" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200/60 backdrop-blur-sm rounded-3xl">
                  <span className="text-gray-600 text-xl font-medium">Chưa có hình ảnh</span>
                </div>
              )}
            </div>

            {/* Thông tin */}
            <div className="productInfoSection">
              <div className="space-y-5">
                <h1 className="productTitle">{item.name}</h1>
                <p className="productPrice">{formatPrice(item.price)}</p>

                {/* Tags loại bánh - nằm trên */}
                {tags.length > 0 && (
                  <div className="productTags">
                    {tags.map((tag) => (
                      <span key={tag} className="productTag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag số lượng - vàng ấm, nằm riêng dưới giá */}
                <div className="stockAvailabilityTag">
                  Còn {currentQuantity ?? "-"} sản phẩm
                </div>
              </div>

              {/* Mô tả + Hạn sử dụng */}
              <div className="descriptionCard">
                <h2 className="descriptionTitle">Mô tả sản phẩm</h2>
                <p className="descriptionText mb-6">
                  {item.description || "Sản phẩm chưa có mô tả chi tiết."}
                </p>

                {/* Phần Hạn sử dụng - chỉ hiển thị nếu có dữ liệu */}
                {(item.itemDetail?.expiryNote || item.itemDetail?.expiryDays) && (
                  <div className="mt-6 pt-6 border-t border-amber-200">
                    <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      <ClockIcon className="w-6 h-6 text-amber-700" />
                      Hạn sử dụng & Bảo quản
                    </h3>
                    <p className="descriptionText text-green-700 font-medium flex items-start gap-2">
                      <span className="mt-0.5">
                        {item.itemDetail.expiryNote ||
                          (item.itemDetail.expiryDays ? `Sử dụng tốt nhất trong ${item.itemDetail.expiryDays} ngày kể từ ngày nhận hàng.` : "")
                        }
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Nút thêm giỏ hàng */}
              <div className="addToCartWrapper">
                <button onClick={handleAddToCart} className="addToCartButton">
                  <ShoppingCartIcon className="w-6 h-6 icon" />
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;