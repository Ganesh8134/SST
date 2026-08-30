import React from 'react';
import { CategoryId } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  selectedPriceMax: number;
  onSelectPriceMax: (max: number) => void;
  minRating: number;
  onSelectMinRating: (rating: number) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: (val: boolean) => void;
  brands: string[];
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  selectedPriceMax,
  onSelectPriceMax,
  minRating,
  onSelectMinRating,
  inStockOnly,
  onToggleInStockOnly,
  brands,
  onResetFilters,
  totalResultsCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-5 py-4 border-b border-[#e1e8fd] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[22px]">tune</span>
            <h3 className="text-[18px] font-bold text-[#141b2b]">Filter Products</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f3ff] hover:bg-[#e1e8fd] flex items-center justify-center text-[#141b2b] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-5 flex flex-col gap-6">
          {/* Category Filter */}
          <div>
            <h4 className="text-[13px] font-bold text-[#141b2b] uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'bakery', label: 'Bakery & Bread' },
                { id: 'dairy', label: 'Dairy & Eggs' },
                { id: 'fruits-veg', label: 'Fruits & Veggies' },
                { id: 'beverages', label: 'Beverages' },
                { id: 'snacks', label: 'Snacks & Munchies' },
                { id: 'pantry', label: 'Pantry Essentials' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id as CategoryId)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all border ${
                    selectedCategory === c.id
                      ? 'bg-[#006c49] text-white border-[#006c49] shadow-sm'
                      : 'bg-[#f1f3ff] text-[#3c4a42] border-[#e1e8fd] hover:bg-[#e9edff]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[13px] font-bold text-[#141b2b] uppercase tracking-wider">
                Max Price
              </h4>
              <span className="text-[14px] font-bold text-[#006c49] bg-[#caead6] px-2.5 py-0.5 rounded-full">
                ₹{selectedPriceMax}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={selectedPriceMax}
              onChange={(e) => onSelectPriceMax(Number(e.target.value))}
              className="w-full h-2 bg-[#e1e8fd] rounded-lg appearance-none cursor-pointer accent-[#006c49]"
            />
            <div className="flex justify-between text-[11px] text-[#3c4a42]/70 font-semibold mt-1">
              <span>₹50</span>
              <span>₹150</span>
              <span>₹300</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#f9f9ff] border border-[#e1e8fd] rounded-2xl">
            <div>
              <p className="text-[14px] font-bold text-[#141b2b]">In-Stock Items Only</p>
              <p className="text-[11px] text-[#3c4a42]/70">Hide temporarily unavailable items</p>
            </div>
            <button
              onClick={() => onToggleInStockOnly(!inStockOnly)}
              className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                inStockOnly ? 'bg-[#006c49]' : 'bg-[#bbcabf]'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  inStockOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="text-[13px] font-bold text-[#141b2b] uppercase tracking-wider mb-2.5">
              Brands
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSelectBrand('all')}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all border ${
                  selectedBrand === 'all'
                    ? 'bg-[#006c49] text-white border-[#006c49]'
                    : 'bg-[#f1f3ff] text-[#3c4a42] border-[#e1e8fd]'
                }`}
              >
                All Brands
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => onSelectBrand(brand)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all border ${
                    selectedBrand === brand
                      ? 'bg-[#006c49] text-white border-[#006c49]'
                      : 'bg-[#f1f3ff] text-[#3c4a42] border-[#e1e8fd]'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <h4 className="text-[13px] font-bold text-[#141b2b] uppercase tracking-wider mb-2.5">
              Customer Rating
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: 0, label: 'All' },
                { val: 4.0, label: '4.0★+' },
                { val: 4.5, label: '4.5★+' },
                { val: 4.8, label: '4.8★+' }
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => onSelectMinRating(r.val)}
                  className={`py-2 px-1 rounded-xl text-[12px] font-bold transition-all border text-center ${
                    minRating === r.val
                      ? 'bg-[#caead6] text-[#00422b] border-[#006c49]'
                      : 'bg-[#f9f9ff] text-[#3c4a42] border-[#e1e8fd]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-[#e1e8fd] p-4 flex items-center gap-3 mt-auto">
          <button
            onClick={onResetFilters}
            className="px-5 py-3 rounded-full text-[#ba1a1a] font-bold text-[13px] hover:bg-[#ffdad6]/40 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-6 rounded-full bg-[#006c49] hover:bg-[#005236] text-white font-bold text-[14px] shadow-[0_4px_16px_rgba(0,108,73,0.25)] transition-all text-center"
          >
            View {totalResultsCount} Results
          </button>
        </div>
      </div>
    </div>
  );
};
