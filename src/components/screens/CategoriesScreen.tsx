import React, { useState } from 'react';
import { Product, Category, CategoryId } from '../../types';
import { ProductCard } from '../ProductCard';

interface CategoriesScreenProps {
  categories: Category[];
  products: Product[];
  selectedCategoryId: CategoryId;
  cartItemsMap: Record<string, number>;
  wishlistIds: string[];
  onSelectCategory: (categoryId: CategoryId) => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  categories,
  products,
  selectedCategoryId,
  cartItemsMap,
  wishlistIds,
  onSelectCategory,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  onToggleWishlist
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const activeCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];

  // Filter products by selected category and optional subcategory
  const filteredProducts = products.filter(p => {
    const pCat = p.category || p.categoryId;
    if (pCat !== selectedCategoryId) return false;
    if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) return false;
    return true;
  });

  const handleCategoryClick = (catId: CategoryId) => {
    onSelectCategory(catId);
    setSelectedSubcategory('all');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in flex flex-col md:flex-row gap-5 pt-2">
      {/* Category Sidebar Navigation (Desktop: vertical list / Mobile: horizontal scrollable pills) */}
      <aside className="md:w-64 shrink-0">
        <div className="bg-white rounded-3xl p-3 md:p-4 border border-[#e6ecf5] shadow-xs md:sticky md:top-20">
          <h3 className="hidden md:block text-[14px] font-extrabold text-[#141b2b] uppercase tracking-wider mb-3 px-2">
            Categories (6)
          </h3>

          {/* 6 Category Items */}
          <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex items-center gap-2.5 p-2 md:p-2.5 rounded-2xl transition-all cursor-pointer text-left shrink-0 ${
                    isSelected
                      ? 'bg-[#caead6]/60 text-[#00422b] font-extrabold shadow-xs ring-1 ring-[#006c49]/30'
                      : 'hover:bg-[#f8fafc] text-[#5b6b62] hover:text-[#141b2b]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#f8fafc] flex items-center justify-center p-1 shrink-0 overflow-hidden border border-[#e6ecf5]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="min-w-0 pr-1">
                    <p className="text-[12px] md:text-[13px] leading-tight truncate">
                      {cat.name}
                    </p>
                    <span className="hidden md:inline text-[10px] text-[#5b6b62]">
                      {cat.itemCount} items
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Category Content & Products Grid */}
      <main className="flex-1 flex flex-col gap-4">
        {/* Category Header Card */}
        <div className="bg-gradient-to-r from-[#f1f8f4] to-[#f8fafc] p-4 sm:p-5 rounded-3xl border border-[#006c49]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 border border-[#006c49]/30 flex items-center justify-center shadow-xs">
              <img
                src={activeCategory.image}
                alt={activeCategory.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div>
              <h1 className="text-[18px] sm:text-[20px] font-extrabold text-[#141b2b]">
                {activeCategory.name}
              </h1>
              <p className="text-[12px] text-[#5b6b62]">
                {activeCategory.description} • {filteredProducts.length} items available
              </p>
            </div>
          </div>
        </div>

        {/* Subcategory Filter Pills */}
        {activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-[#006c49] text-white shadow-xs'
                  : 'bg-white text-[#5b6b62] border border-[#e6ecf5] hover:bg-[#f1f3ff]'
              }`}
            >
              All {activeCategory.name}
            </button>
            {activeCategory.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedSubcategory === sub
                    ? 'bg-[#006c49] text-white shadow-xs'
                    : 'bg-white text-[#5b6b62] border border-[#e6ecf5] hover:bg-[#f1f3ff]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
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
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#e6ecf5]">
            <span className="material-symbols-outlined text-[48px] text-[#5b6b62]/50 mb-2">
              inventory_2
            </span>
            <h4 className="text-[15px] font-bold text-[#141b2b]">No products in this subcategory</h4>
            <p className="text-[12px] text-[#5b6b62] mt-1">Please select "All" or browse other categories.</p>
          </div>
        )}
      </main>
    </div>
  );
};
