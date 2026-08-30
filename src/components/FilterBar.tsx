import React from 'react';
import { CategoryId } from '../types';

export type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating' | 'discount';

interface FilterBarProps {
  onOpenFilterModal: () => void;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  selectedPriceMax: number;
  onSelectPriceMax: (max: number) => void;
  minRating: number;
  onSelectMinRating: (rating: number) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeFilterCount: number;
  brands: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onOpenFilterModal,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  selectedPriceMax,
  onSelectPriceMax,
  minRating,
  onSelectMinRating,
  sortBy,
  onSortChange,
  activeFilterCount,
  brands
}) => {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      {/* Horizontal Scrollable Filter Chips */}
      <div className="flex overflow-x-auto gap-2 pb-1 -mx-4 px-4 snap-x scroll-smooth no-scrollbar">
        {/* Main Filters Button */}
        <button
          onClick={onOpenFilterModal}
          className="snap-start shrink-0 h-9 px-4 rounded-full bg-[#006c49] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,108,73,0.2)] hover:bg-[#005236] transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-0.5 bg-[#4edea3] text-[#002113] text-[11px] font-bold px-1.5 py-0.2 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Category Chip */}
        <div className="relative shrink-0 snap-start">
          <button
            onClick={() => toggleDropdown('category')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-semibold flex items-center gap-1 transition-all border cursor-pointer ${
              selectedCategory !== 'all'
                ? 'bg-[#caead6] text-[#00422b] border-[#006c49]/30 font-bold'
                : 'bg-[#e9edff] text-[#3c4a42] border-[#bbcabf]/30 hover:bg-[#e1e8fd]'
            }`}
          >
            <span>{selectedCategory !== 'all' ? selectedCategory.toUpperCase() : 'Category'}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {openDropdown === 'category' && (
            <div className="absolute top-11 left-0 z-50 bg-white rounded-2xl shadow-xl border border-[#e1e8fd] p-2 min-w-[170px] flex flex-col gap-1">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'bakery', label: 'Bakery & Bread' },
                { id: 'dairy', label: 'Dairy & Eggs' },
                { id: 'fruits-veg', label: 'Fruits & Veggies' },
                { id: 'beverages', label: 'Beverages' },
                { id: 'snacks', label: 'Snacks' },
                { id: 'pantry', label: 'Pantry' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id as CategoryId);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 text-left rounded-xl text-[13px] transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-[#caead6] text-[#00422b] font-semibold'
                      : 'hover:bg-[#f1f3ff] text-[#141b2b]'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && (
                    <span className="material-symbols-outlined text-[16px] text-[#006c49]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Brand Chip */}
        <div className="relative shrink-0 snap-start">
          <button
            onClick={() => toggleDropdown('brand')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-semibold flex items-center gap-1 transition-all border cursor-pointer ${
              selectedBrand !== 'all'
                ? 'bg-[#caead6] text-[#00422b] border-[#006c49]/30 font-bold'
                : 'bg-[#e9edff] text-[#3c4a42] border-[#bbcabf]/30 hover:bg-[#e1e8fd]'
            }`}
          >
            <span className="truncate max-w-[90px]">{selectedBrand !== 'all' ? selectedBrand : 'Brand'}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {openDropdown === 'brand' && (
            <div className="absolute top-11 left-0 z-50 bg-white rounded-2xl shadow-xl border border-[#e1e8fd] p-2 min-w-[190px] max-h-56 overflow-y-auto flex flex-col gap-1">
              <button
                onClick={() => {
                  onSelectBrand('all');
                  setOpenDropdown(null);
                }}
                className={`px-3 py-2 text-left rounded-xl text-[13px] transition-colors flex items-center justify-between ${
                  selectedBrand === 'all'
                    ? 'bg-[#caead6] text-[#00422b] font-semibold'
                    : 'hover:bg-[#f1f3ff] text-[#141b2b]'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === 'all' && (
                  <span className="material-symbols-outlined text-[16px] text-[#006c49]">check</span>
                )}
              </button>
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => {
                    onSelectBrand(b);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 text-left rounded-xl text-[13px] transition-colors flex items-center justify-between ${
                    selectedBrand === b
                      ? 'bg-[#caead6] text-[#00422b] font-semibold'
                      : 'hover:bg-[#f1f3ff] text-[#141b2b]'
                  }`}
                >
                  <span className="truncate">{b}</span>
                  {selectedBrand === b && (
                    <span className="material-symbols-outlined text-[16px] text-[#006c49]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Chip */}
        <div className="relative shrink-0 snap-start">
          <button
            onClick={() => toggleDropdown('price')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-semibold flex items-center gap-1 transition-all border cursor-pointer ${
              selectedPriceMax < 300
                ? 'bg-[#caead6] text-[#00422b] border-[#006c49]/30 font-bold'
                : 'bg-[#e9edff] text-[#3c4a42] border-[#bbcabf]/30 hover:bg-[#e1e8fd]'
            }`}
          >
            <span>{selectedPriceMax < 300 ? `Under ₹${selectedPriceMax}` : 'Price'}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {openDropdown === 'price' && (
            <div className="absolute top-11 left-0 z-50 bg-white rounded-2xl shadow-xl border border-[#e1e8fd] p-2 min-w-[160px] flex flex-col gap-1">
              {[
                { max: 300, label: 'Any Price' },
                { max: 100, label: 'Under ₹100' },
                { max: 150, label: 'Under ₹150' },
                { max: 200, label: 'Under ₹200' }
              ].map(p => (
                <button
                  key={p.max}
                  onClick={() => {
                    onSelectPriceMax(p.max);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 text-left rounded-xl text-[13px] transition-colors flex items-center justify-between ${
                    selectedPriceMax === p.max
                      ? 'bg-[#caead6] text-[#00422b] font-semibold'
                      : 'hover:bg-[#f1f3ff] text-[#141b2b]'
                  }`}
                >
                  <span>{p.label}</span>
                  {selectedPriceMax === p.max && (
                    <span className="material-symbols-outlined text-[16px] text-[#006c49]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rating Chip */}
        <div className="relative shrink-0 snap-start">
          <button
            onClick={() => toggleDropdown('rating')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-semibold flex items-center gap-1 transition-all border cursor-pointer ${
              minRating > 0
                ? 'bg-[#caead6] text-[#00422b] border-[#006c49]/30 font-bold'
                : 'bg-[#e9edff] text-[#3c4a42] border-[#bbcabf]/30 hover:bg-[#e1e8fd]'
            }`}
          >
            <span>{minRating > 0 ? `${minRating}★+` : 'Rating'}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {openDropdown === 'rating' && (
            <div className="absolute top-11 right-0 z-50 bg-white rounded-2xl shadow-xl border border-[#e1e8fd] p-2 min-w-[150px] flex flex-col gap-1">
              {[
                { val: 0, label: 'All Ratings' },
                { val: 4.8, label: '4.8★ and above' },
                { val: 4.5, label: '4.5★ and above' },
                { val: 4.0, label: '4.0★ and above' }
              ].map(r => (
                <button
                  key={r.val}
                  onClick={() => {
                    onSelectMinRating(r.val);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 text-left rounded-xl text-[13px] transition-colors flex items-center justify-between ${
                    minRating === r.val
                      ? 'bg-[#caead6] text-[#00422b] font-semibold'
                      : 'hover:bg-[#f1f3ff] text-[#141b2b]'
                  }`}
                >
                  <span>{r.label}</span>
                  {minRating === r.val && (
                    <span className="material-symbols-outlined text-[16px] text-[#006c49]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for open dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Sorting Row */}
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-[20px] font-semibold text-[#141b2b]">
          Search Results
        </h2>

        {/* Sort Selector */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('sort')}
            className="flex items-center gap-1 text-[#3c4a42] text-[12px] font-semibold bg-transparent hover:bg-[#e9edff] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <span>
              Sort by:{' '}
              <span className="text-[#006c49] font-bold">
                {sortBy === 'relevance'
                  ? 'Relevance'
                  : sortBy === 'price_low'
                  ? 'Price: Low to High'
                  : sortBy === 'price_high'
                  ? 'Price: High to Low'
                  : sortBy === 'rating'
                  ? 'Rating'
                  : 'Discount'}
              </span>
            </span>
            <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          </button>

          {openDropdown === 'sort' && (
            <div className="absolute right-0 top-9 z-50 bg-white rounded-2xl shadow-xl border border-[#e1e8fd] p-2 min-w-[190px] flex flex-col gap-1">
              {[
                { id: 'relevance', label: 'Relevance' },
                { id: 'price_low', label: 'Price: Low to High' },
                { id: 'price_high', label: 'Price: High to Low' },
                { id: 'rating', label: 'Top Customer Rating' },
                { id: 'discount', label: 'Highest Discount' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSortChange(opt.id as SortOption);
                    setOpenDropdown(null);
                  }}
                  className={`px-3 py-2 text-left rounded-xl text-[13px] transition-colors flex items-center justify-between ${
                    sortBy === opt.id
                      ? 'bg-[#caead6] text-[#00422b] font-semibold'
                      : 'hover:bg-[#f1f3ff] text-[#141b2b]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.id && (
                    <span className="material-symbols-outlined text-[16px] text-[#006c49]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
