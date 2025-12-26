import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getCart,
  addToCart as addToCartService,
  updateCartItem,
  removeCartItem,
} from "../services/cart.service";
import { useUser } from "./AuthContext";

/* ================= TYPES ================= */

export type CartItem = {
  id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    price: number;
    imageURL?: string;
  };
};

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  totalItems: number;

  checkedItems: number[];
  toggleItem: (id: number) => void;
  toggleAll: () => void;

  addToCart: (itemId: number, quantity?: number) => Promise<void>;
  increase: (item: CartItem) => Promise<void>;
  decrease: (item: CartItem) => Promise<void>;

  askRemove: (id: number) => void;
  confirmRemove: () => Promise<void>;
  cancelRemove: () => void;
  confirmOpen: boolean;

  reloadCart: () => Promise<void>;
  resetCart: () => void; // 👈 THÊM
};

/* ================= CONTEXT ================= */

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removeId, setRemoveId] = useState<number | null>(null);

  /* ---------- LOAD CART ---------- */
  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      const cartItems = data.items || [];

      setItems(cartItems);
      setCheckedItems(cartItems.map((i) => i.id));
    } catch {
      setItems([]);
      setCheckedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      //
      setItems([]);
      setCheckedItems([]);
    }
  }, [user]);

  /* ---------- DERIVED ---------- */
  const totalItems = items.length;

  //   const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  //   const totalProducts = items.length;

  /* ---------- SELECT ---------- */
  const toggleItem = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setCheckedItems(
      checkedItems.length === items.length ? [] : items.map((i) => i.id)
    );
  };

  /* ---------- ADD TO CART ---------- */
  const addToCart = async (itemId: number, quantity = 1) => {
    if (!user) {
      throw new Error("NEED_LOGIN");
    }
    try {
      await addToCartService(itemId, quantity);
      await loadCart();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (err: any) {
      if (err.message === "NEED_LOGIN") throw err;
      toast.error("Không thể thêm vào giỏ");
    }
  };

  /* ---------- OPTIMISTIC UPDATE ---------- */
  const updateLocalQty = (id: number, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const increase = async (item: CartItem) => {
    const oldQty = item.quantity;
    const newQty = oldQty + 1;

    updateLocalQty(item.id, newQty);

    try {
      await updateCartItem(item.id, newQty);
    } catch {
      updateLocalQty(item.id, oldQty);
      toast.error("Không thể tăng số lượng");
    }
  };

  const decrease = async (item: CartItem) => {
    if (item.quantity === 1) {
      askRemove(item.id);
      return;
    }

    const oldQty = item.quantity;
    const newQty = oldQty - 1;

    updateLocalQty(item.id, newQty);

    try {
      await updateCartItem(item.id, newQty);
    } catch {
      updateLocalQty(item.id, oldQty);
      toast.error("Không thể giảm số lượng");
    }
  };

  /* ---------- CONFIRM REMOVE ---------- */
  const askRemove = (id: number) => {
    setRemoveId(id);
    setConfirmOpen(true);
  };

  const cancelRemove = () => {
    setRemoveId(null);
    setConfirmOpen(false);
  };

  const confirmRemove = async () => {
    if (removeId == null) return;

    const backup = items;

    setItems((prev) => prev.filter((i) => i.id !== removeId));
    setCheckedItems((prev) => prev.filter((i) => i !== removeId));
    setConfirmOpen(false);

    try {
      await removeCartItem(removeId);
      toast.success("Xoá sản phẩm thành công");
    } catch {
      setItems(backup);
      toast.error("Không thể xoá sản phẩm");
    } finally {
      setRemoveId(null);
    }
  };

  const resetCart = () => {
    setItems([]);
    setCheckedItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        totalItems,
        checkedItems,
        toggleItem,
        toggleAll,
        addToCart,
        increase,
        decrease,
        askRemove,
        confirmRemove,
        cancelRemove,
        confirmOpen,
        reloadCart: loadCart,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
