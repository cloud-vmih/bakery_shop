import React from "react";

interface WishlistIconProps {
  liked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  size?: number; // px
}

export default function WishlistIcon({
  liked,
  disabled = false,
  onToggle,
  size = 24,
}: WishlistIconProps) {
  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onToggle();
      }}
      className={`
        wishlistButton relative overflow-hidden
        ${liked ? "liked" : ""}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
      aria-label="Wishlist"
    >
      <span
        className="block transition-all duration-300"
        style={{ fontSize: size }}
      >
        {liked ? "❤️" : "🤍"}
      </span>
    </button>
  );
}