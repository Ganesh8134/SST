import React, { useState, useEffect } from 'react';
import { Product, Category, CategoryId, Address } from '../../types';
import { ProductCard } from '../ProductCard';
import { PROMOTIONAL_BANNERS } from '../../data/products';

interface HomeScreenProps {
  categories: Category[];
  products: Product[];
  currentAddress: Address;
  cartItemsMap: Record<string, number>;
  wishlistIds: string[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onSelectCategory: (categoryId: CategoryId) => void;
  onSearchClick: () => void;
  onVoiceSearchClick: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  categories,
  products,
  currentAddress,
  cartItemsMap,
  wishlistIds,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  onToggleWishlist,
  onSelectCategory,
  onSearchClick,
  onVoiceSearchClick
}) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % PROMOTIONAL_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = PROMOTIONAL_BANNERS[currentBannerIndex];

  // Curated lists
  const popularProducts = products.filter(p => p.isPopular).slice(0, 8);
  const bestDeals = products.filter(p => p.isBestDeal || (p.discount && p.discount > 15)).slice(0, 8);
  const dairyProducts = products.filter(p => p.category === 'dairy' || p.categoryId === 'dairy');
  const staplesProducts = products.filter(p => 
    p.category === 'rice_flour' || p.categoryId === 'rice_flour' || 
    p.category === 'dal_pulses' || p.categoryId === 'dal_pulses'
  );

  return (
    <div className="flex flex-col gap-6 pb-24 animate-fade-in">
      {/* Top Search Input Bar (Sticky feel) */}
      <div className="pt-2 px-4 max-w-6xl mx-auto w-full">
        <div
          onClick={onSearchClick}
          className="w-full bg-[#f1f3ff] hover:bg-[#e4ebfc] border border-[#e6ecf5] rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5 text-[#5b6b62]">
            <span className="material-symbols-outlined text-[20px] text-[#006c49] group-hover:scale-110 transition-transform">
              search
            </span>
            <span className="text-[13px] font-medium text-[#141b2b]/80 truncate">
              Search "Amul milk", "Basmati rice", "Toor dal", "Oil"...
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006c49] bg-[#caead6] px-2 py-0.5 rounded-full hidden xs:inline">
              15 Min
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onVoiceSearchClick();
              }}
              className="w-8 h-8 rounded-xl bg-white text-[#006c49] flex items-center justify-center shadow-xs hover:bg-[#caead6] transition-colors"
              title="Voice Search"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Promotional Carousel Banner */}
      <div className="px-4 max-w-6xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-md">
          <div
            className={`p-6 sm:p-8 bg-gradient-to-r ${currentBanner.bgColor} text-white flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-500`}
          >
            <div className="flex-1 flex flex-col items-start text-left z-10">
              <span className="text-[11px] font-extrabold tracking-widest uppercase bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full mb-2">
                {currentBanner.subtitle}
              </span>
              <h2 className="text-[22px] sm:text-[28px] font-black leading-tight mb-2 tracking-tight">
                {currentBanner.title}
              </h2>
              <p className="text-[13px] text-white/90 mb-4 max-w-md">
                {currentBanner.description}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectCategory(currentBanner.category as CategoryId)}
                  className="px-5 py-2.5 rounded-full bg-white text-[#00422b] font-extrabold text-[13px] shadow-lg hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
                >
                  {currentBanner.buttonText} →
                </button>

                {currentBanner.code && (
                  <span className="text-[11px] font-mono font-bold bg-black/30 border border-white/30 px-3 py-1.5 rounded-full">
                    CODE: {currentBanner.code}
                  </span>
                )}
              </div>
            </div>

            {/* Banner Image */}
            <div className="w-40 sm:w-56 h-36 sm:h-44 shrink-0 flex items-center justify-center z-10">
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="max-h-full max-w-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-6 flex items-center gap-1.5 z-20">
            {PROMOTIONAL_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentBannerIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Category Bar (Only the 6 Mandatory Categories) */}
      <div className="px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#141b2b]">
              Shop By Category
            </h2>
            <p className="text-[11px] text-[#5b6b62]">
              Fresh groceries delivered in 15 mins to {currentAddress.locality}
            </p>
          </div>
        </div>

        {/* 6 Category Grid Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white hover:bg-[#f1f8f4] p-3 rounded-2xl sm:rounded-3xl border border-[#e6ecf5] hover:border-[#006c49]/40 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#f8fafc] group-hover:bg-white flex items-center justify-center p-2 mb-2 transition-colors overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <span className="text-[12px] font-extrabold text-[#141b2b] group-hover:text-[#006c49] leading-tight line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-[#5b6b62] mt-0.5">
                {cat.itemCount}+ Items
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Popular Near You in Hyderabad */}
      <section className="px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#caead6] text-[#006c49] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            </span>
            <div>
              <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#141b2b]">
                Popular in {currentAddress.locality}, Hyderabad
              </h2>
              <p className="text-[11px] text-[#5b6b62]">
                Most ordered essentials in your neighborhood
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartItemsMap[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Best Deals & Super Savers */}
      <section className="px-4 max-w-6xl mx-auto w-full">
        <div className="p-4 sm:p-5 rounded-3xl bg-[#f1f8f4] border border-[#006c49]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#006c49] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">percent</span>
              </span>
              <div>
                <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#00422b]">
                  Best Deals & Super Savers
                </h2>
                <p className="text-[11px] text-[#3c4a42]">
                  Unbeatable wholesale rates on premium brands
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {bestDeals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={cartItemsMap[product.id] || 0}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onOpenDetails={onOpenDetails}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Morning Dairy & Breakfast */}
      <section className="px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#caead6] text-[#006c49] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">egg_alt</span>
            </span>
            <div>
              <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#141b2b]">
                Fresh Dairy & Milk Daily
              </h2>
              <p className="text-[11px] text-[#5b6b62]">
                Amul, Vijaya, Nandini & fresh paneer dispatched cold
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('dairy')}
            className="text-[12px] font-extrabold text-[#006c49] hover:underline"
          >
            See All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {dairyProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartItemsMap[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* Section 4: Authentic Rice, Dals & Cooking Staples */}
      <section className="px-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#caead6] text-[#006c49] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">rice_bowl</span>
            </span>
            <div>
              <h2 className="text-[17px] sm:text-[19px] font-extrabold text-[#141b2b]">
                Kitchen Staples: Rice, Atta & Dals
              </h2>
              <p className="text-[11px] text-[#5b6b62]">
                Unpolished, stone-ground & farm direct quality
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('rice_flour')}
            className="text-[12px] font-extrabold text-[#006c49] hover:underline"
          >
            See All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {staplesProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartItemsMap[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
