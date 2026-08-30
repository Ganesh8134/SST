import React, { useState } from 'react';
import { Product, Category, CategoryId } from '../../types';
import { ProductCard } from '../ProductCard';

interface SearchScreenProps {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemsMap: Record<string, number>;
  wishlistIds: string[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onVoiceSearchClick: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  products,
  categories,
  searchQuery,
  onSearchChange,
  cartItemsMap,
  wishlistIds,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  onToggleWishlist,
  onVoiceSearchClick
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating' | 'discount'>('relevance');

  const popularSearches = [
    'Amul Milk',
    'Basmati Rice',
    'Toor Dal',
    'Ghee',
    'Sunflower Oil',
    'Parle-G',
    'Lays',
    'Aashirvaad Atta'
  ];

  // Filtering
  const filtered = products.filter((p) => {
    const matchesQuery =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    const matchesCategory =
      selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;

    return matchesQuery && matchesCategory;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') {
      const discA = a.originalPrice ? (a.originalPrice - a.price) : 0;
      const discB = b.originalPrice ? (b.originalPrice - b.price) : 0;
      return discB - discA;
    }
    return 0; // relevance
  });

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in flex flex-col gap-4 pt-2">
      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#e6ecf5] shadow-xs flex flex-col gap-3">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-[#006c49] text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search milk, rice, dal, oil, ghee, biscuits, snacks..."
            className="w-full pl-11 pr-20 py-3 rounded-2xl bg-[#f8fafc] border border-[#e6ecf5] text-[14px] font-medium outline-none focus:border-[#006c49] focus:bg-white transition-all"
            autoFocus
          />
          <div className="absolute right-2.5 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="w-7 h-7 rounded-full bg-[#e2e8f0] text-[#475569] flex items-center justify-center hover:bg-[#cbd5e1]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <button
              type="button"
              onClick={onVoiceSearchClick}
              className="w-8 h-8 rounded-xl bg-[#caead6] text-[#00422b] flex items-center justify-center hover:bg-[#a6d8b8] transition-colors"
              title="Voice Search"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
          </div>
        </div>

        {/* Popular searches quick tap tags */}
        {!searchQuery && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#5b6b62] mr-1">Trending:</span>
            {popularSearches.map((item) => (
              <button
                key={item}
                onClick={() => onSearchChange(item)}
                className="px-2.5 py-1 rounded-full bg-[#f1f3ff] hover:bg-[#caead6] text-[11px] font-bold text-[#141b2b] transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-[#e6ecf5]">
        {/* Category Pills (Strictly the 6 categories) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#006c49] text-white shadow-xs'
                : 'bg-[#f8fafc] text-[#5b6b62] border border-[#e6ecf5] hover:bg-[#f1f3ff]'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategoryFilter === cat.id
                  ? 'bg-[#006c49] text-white shadow-xs'
                  : 'bg-[#f8fafc] text-[#5b6b62] border border-[#e6ecf5] hover:bg-[#f1f3ff]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] font-bold text-[#5b6b62]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-[#f8fafc] border border-[#e6ecf5] text-[12px] font-bold text-[#141b2b] outline-none focus:border-[#006c49]"
          >
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-[13px] text-[#5b6b62]">
        <span>
          Showing <strong className="text-[#141b2b]">{sorted.length}</strong> products
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </span>
      </div>

      {/* Products Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {sorted.map((product) => (
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
        <div className="p-12 text-center bg-white rounded-3xl border border-[#e6ecf5] flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#5b6b62] mb-3">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h3 className="text-[17px] font-extrabold text-[#141b2b]">
            No groceries found for "{searchQuery}"
          </h3>
          <p className="text-[13px] text-[#5b6b62] max-w-sm mt-1">
            Try searching for common staples like "Milk", "Basmati", "Toor Dal", or "Sunflower Oil".
          </p>
        </div>
      )}
    </div>
  );
};
