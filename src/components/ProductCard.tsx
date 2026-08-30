import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  isWishlisted = false,
  onToggleWishlist
}) => {
  const isOutOfStock = (product.stock !== undefined && product.stock <= 0) || product.isOutOfStock;
  const isLowStock = !isOutOfStock && product.stock !== undefined && product.stock > 0 && product.stock <= 5;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = product.discount || product.discountPercentage || 
    (hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0);

  return (
    <div className="group relative bg-white rounded-3xl p-3 sm:p-3.5 border border-[#e6ecf5] hover:border-[#006c49]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Badges & Wishlist */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        {/* Discount / Low Stock / Bestseller Badge */}
        {isOutOfStock ? (
          <span className="text-[10px] font-black text-white bg-[#ba1a1a] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-tight">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="text-[10px] font-black text-[#7a4100] bg-[#ffeed0] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-tight flex items-center gap-0.5">
            <span>⚡</span>
            <span>Only {product.stock} Left</span>
          </span>
        ) : discountPercent > 0 ? (
          <span className="text-[10px] font-extrabold text-[#00422b] bg-[#caead6] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-tight">
            {discountPercent}% OFF
          </span>
        ) : product.badge ? (
          <span className="text-[10px] font-extrabold text-white bg-[#006c49] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-tight">
            {product.badge}
          </span>
        ) : (
          <span />
        )}

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-[#e6ecf5] flex items-center justify-center pointer-events-auto text-[#5b6b62] hover:text-[#ba1a1a] transition-all hover:scale-110 shadow-xs cursor-pointer"
            aria-label="Wishlist"
          >
            <span
              className={`material-symbols-outlined text-[16px] transition-colors ${
                isWishlisted ? 'text-[#ba1a1a]' : ''
              }`}
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        )}
      </div>

      {/* Product Image Area */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative w-full aspect-square rounded-2xl bg-[#f8fafc] flex items-center justify-center p-2.5 mb-2.5 cursor-pointer overflow-hidden group-hover:bg-[#f1f8f4]/60 transition-colors"
      >
        <img
          src={product.image}
          alt={product.altText || product.name}
          loading="lazy"
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center gap-1 p-2 text-center rounded-2xl">
            <span className="bg-[#ba1a1a] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Out of Stock
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Restocking shortly</span>
          </div>
        )}
      </div>

      {/* Product Meta & Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Weight */}
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[10px] font-extrabold text-[#006c49] uppercase tracking-wider truncate">
              {product.brand}
            </span>
            <span className="text-[11px] font-bold text-[#5b6b62] bg-[#f1f3ff] px-1.5 py-0.2 rounded-md shrink-0">
              {product.weight}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-[13px] font-bold text-[#141b2b] line-clamp-2 leading-snug cursor-pointer hover:text-[#006c49] transition-colors mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating & Stock pill */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="flex items-center gap-0.5 bg-[#caead6]/70 text-[#00422b] px-1.5 py-0.2 rounded-md text-[10px] font-extrabold">
              <span>★</span>
              <span>{product.rating}</span>
            </div>
            <span className="text-[10px] text-[#5b6b62] truncate">
              ({product.reviewCount.toLocaleString()} ratings)
            </span>
          </div>
        </div>

        {/* Price & Add Action Container */}
        <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
          {/* Price stack */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] sm:text-[16px] font-black text-[#141b2b]">
                ₹{product.price}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-[#5b6b62] line-through font-medium">
                  ₹{product.originalPrice || product.mrp}
                </span>
              )}
            </div>
          </div>

          {/* Add / Stepper Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-[11px] cursor-not-allowed uppercase"
            >
              Sold Out
            </button>
          ) : quantity === 0 ? (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="px-3.5 py-1.5 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white font-black text-[12px] shadow-sm hover:shadow-md hover:scale-102 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>+</span>
              <span>ADD</span>
            </button>
          ) : (
            <div className="h-8 rounded-xl bg-[#006c49] text-white flex items-center justify-between px-1 shadow-sm w-20 shrink-0">
              <button
                type="button"
                onClick={() => onRemoveFromCart(product)}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <span className="text-[12px] font-black select-none">
                {quantity}
              </span>
              <button
                type="button"
                disabled={product.stock !== undefined && quantity >= product.stock}
                onClick={() => onAddToCart(product)}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
