import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  quantity: number;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  similarProducts?: Product[];
  onSelectSimilarProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  quantity,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  onBuyNow,
  similarProducts = [],
  onSelectSimilarProduct
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'nutrition' | 'reviews'>('details');

  if (!product) return null;

  const currentVariant = product.variants && product.variants.length > 0 
    ? product.variants[selectedVariantIndex] 
    : null;

  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentOriginalPrice = currentVariant?.originalPrice || product.originalPrice;
  const currentWeight = currentVariant ? currentVariant.weight : product.weight;
  const hasDiscount = currentOriginalPrice && currentOriginalPrice > currentPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((currentOriginalPrice! - currentPrice) / currentOriginalPrice!) * 100) 
    : (product.discountPercentage || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-[#e6ecf5] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#006c49] bg-[#caead6] px-2.5 py-1 rounded-full">
              {product.categoryName}
            </span>
            <span className="text-[12px] font-bold text-[#5b6b62]">
              {product.brand}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f3ff] hover:bg-[#e4ebfc] text-[#141b2b] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 no-scrollbar">
          {/* Main Product Hero Image */}
          <div className="relative w-full aspect-4/3 rounded-3xl bg-[#f8fafc] flex items-center justify-center p-6 border border-[#e6ecf5]">
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 text-[11px] font-extrabold text-[#00422b] bg-[#caead6] px-2.5 py-1 rounded-full shadow-xs uppercase">
                {discountPercent}% OFF
              </span>
            )}

            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-[#e6ecf5] px-2.5 py-1 rounded-full shadow-xs text-[11px] font-bold text-[#006c49]">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>15–20 Mins</span>
            </div>

            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Product Header */}
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-extrabold text-[#141b2b] leading-snug">
              {product.name}
            </h1>

            {/* Rating and Stock Indicator */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#caead6] text-[#00422b] px-2 py-0.5 rounded-lg text-[11px] font-extrabold">
                  <span>★</span>
                  <span>{product.rating}</span>
                </div>
                <span className="text-[12px] font-medium text-[#5b6b62]">
                  {product.reviewCount.toLocaleString()} verified ratings
                </span>
              </div>

              <div className="flex items-center gap-1 text-[12px] font-bold text-[#006c49]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>In Stock (Himayatnagar Hub)</span>
              </div>
            </div>
          </div>

          {/* Weight Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-extrabold text-[#141b2b] uppercase tracking-wider">
                Select Pack Size / Weight:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={variant.weight}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-3.5 py-2 rounded-2xl text-[12px] font-bold border transition-all cursor-pointer flex flex-col items-start ${
                        isSelected
                          ? 'bg-[#caead6]/40 border-[#006c49] text-[#00422b] shadow-xs'
                          : 'bg-[#f8fafc] border-[#e6ecf5] text-[#5b6b62] hover:bg-[#f1f3ff]'
                      }`}
                    >
                      <span className="font-extrabold">{variant.weight}</span>
                      <span className="text-[11px] opacity-80">₹{variant.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Stack */}
          <div className="p-3.5 rounded-2xl bg-[#f1f8f4] border border-[#006c49]/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#006c49]">
                Special Hyderabad Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-extrabold text-[#141b2b]">
                  ₹{currentPrice}
                </span>
                {hasDiscount && (
                  <span className="text-[14px] text-[#5b6b62] line-through">
                    ₹{currentOriginalPrice}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[12px] font-bold text-[#006c49]">
                    Save ₹{currentOriginalPrice! - currentPrice}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#5b6b62]">
                (Inclusive of all taxes) • {currentWeight}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-[#006c49] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                100% Genuine
              </span>
            </div>
          </div>

          {/* Detail Tabs */}
          <div className="flex border-b border-[#e6ecf5] gap-4">
            <button
              onClick={() => setActiveDetailTab('details')}
              className={`pb-2 text-[13px] font-extrabold transition-all cursor-pointer ${
                activeDetailTab === 'details'
                  ? 'text-[#006c49] border-b-2 border-[#006c49]'
                  : 'text-[#5b6b62] hover:text-[#141b2b]'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveDetailTab('nutrition')}
              className={`pb-2 text-[13px] font-extrabold transition-all cursor-pointer ${
                activeDetailTab === 'nutrition'
                  ? 'text-[#006c49] border-b-2 border-[#006c49]'
                  : 'text-[#5b6b62] hover:text-[#141b2b]'
              }`}
            >
              Nutritional Info
            </button>
            <button
              onClick={() => setActiveDetailTab('reviews')}
              className={`pb-2 text-[13px] font-extrabold transition-all cursor-pointer ${
                activeDetailTab === 'reviews'
                  ? 'text-[#006c49] border-b-2 border-[#006c49]'
                  : 'text-[#5b6b62] hover:text-[#141b2b]'
              }`}
            >
              Customer Reviews
            </button>
          </div>

          {/* Tab Content */}
          {activeDetailTab === 'details' && (
            <div className="flex flex-col gap-3 text-[13px] text-[#3c4a42]">
              <p className="leading-relaxed">{product.description}</p>
              {product.ingredients && (
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e6ecf5]">
                  <span className="font-bold text-[#141b2b] block mb-0.5">Ingredients:</span>
                  <p className="text-[12px]">{product.ingredients}</p>
                </div>
              )}
              {product.storageInfo && (
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e6ecf5]">
                  <span className="font-bold text-[#141b2b] block mb-0.5">Storage Instructions:</span>
                  <p className="text-[12px]">{product.storageInfo}</p>
                </div>
              )}
            </div>
          )}

          {activeDetailTab === 'nutrition' && (
            <div className="flex flex-col gap-2">
              {product.nutritionalInfo ? (
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  {Object.entries(product.nutritionalInfo).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e6ecf5]">
                      <span className="text-[#5b6b62] uppercase text-[10px] font-bold block">
                        {key}
                      </span>
                      <span className="text-[#141b2b] font-extrabold text-[13px]">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#5b6b62]">
                  Standard nutritional values per 100g as stated on manufacturer package.
                </p>
              )}
            </div>
          )}

          {activeDetailTab === 'reviews' && (
            <div className="flex flex-col gap-3">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-[#f8fafc] border border-[#e6ecf5] flex flex-col gap-1 text-[12px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#141b2b]">{rev.userName}</span>
                        <span className="text-[10px] text-[#006c49] font-bold bg-[#caead6] px-1.5 py-0.2 rounded">
                          ✓ Verified Buyer
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5b6b62]">{rev.date}</span>
                    </div>
                    <span className="text-[10px] text-[#5b6b62]">📍 {rev.location}</span>
                    <p className="text-[#141b2b] mt-1 italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-[#5b6b62] text-[13px]">
                  <p>⭐ 4.8 / 5.0 from {product.reviewCount.toLocaleString()} Hyderabad customers.</p>
                </div>
              )}
            </div>
          )}

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="pt-3 border-t border-[#e6ecf5]">
              <h3 className="text-[14px] font-extrabold text-[#141b2b] mb-3">
                Similar Items in {product.categoryName}
              </h3>
              <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                {similarProducts.slice(0, 4).map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => onSelectSimilarProduct && onSelectSimilarProduct(sim)}
                    className="w-28 shrink-0 p-2 rounded-2xl bg-[#f8fafc] border border-[#e6ecf5] hover:border-[#006c49] text-left transition-all cursor-pointer"
                  >
                    <img src={sim.image} alt={sim.name} className="w-full h-16 object-contain mix-blend-multiply mb-1" />
                    <p className="text-[11px] font-bold text-[#141b2b] truncate">{sim.name}</p>
                    <p className="text-[11px] font-extrabold text-[#006c49]">₹{sim.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Fixed Action Sticky Footer */}
        <div className="p-4 border-t border-[#e6ecf5] bg-white flex items-center gap-3">
          {/* Quantity Stepper */}
          {quantity > 0 ? (
            <div className="h-12 rounded-2xl bg-[#006c49] text-white flex items-center justify-between px-3 w-32 shrink-0 shadow-md">
              <button
                type="button"
                onClick={() => onRemoveFromCart(product)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="text-[14px] font-extrabold">{quantity}</span>
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="h-12 px-5 rounded-2xl bg-[#f1f8f4] hover:bg-[#caead6] text-[#00422b] font-extrabold text-[13px] border border-[#006c49]/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>ADD TO CART</span>
            </button>
          )}

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={() => {
              if (quantity === 0) onAddToCart(product);
              onBuyNow(product);
            }}
            className="flex-1 h-12 rounded-2xl bg-[#006c49] hover:bg-[#005236] text-white font-extrabold text-[14px] shadow-lg shadow-[#006c49]/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <span>BUY NOW</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
