import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  onOpenVoiceSearch: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onOpenVoiceSearch,
  placeholder = "Search groceries, essentials...",
  autoFocus = false
}) => {
  return (
    <div className="sticky top-[80px] z-30 bg-[#f9f9ff]/90 backdrop-blur-md pt-2 pb-3 -mx-4 px-4">
      <div className="relative w-full shadow-sm rounded-full overflow-hidden bg-[#f1f3ff] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#006c49] focus-within:bg-white focus-within:shadow-md flex items-center border border-[#e1e8fd]">
        {/* Search Icon */}
        <span className="material-symbols-outlined text-[#3c4a42]/70 ml-4 shrink-0 text-[22px]">
          search
        </span>

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent border-none outline-none py-3 px-3 text-[15px] font-normal text-[#141b2b] placeholder:text-[#3c4a42]/60 focus:ring-0"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear search"
            className="shrink-0 p-2 mr-1 text-[#3c4a42] hover:text-[#006c49] hover:bg-[#e9edff] transition-colors flex items-center justify-center rounded-full active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[#bbcabf]/40 shrink-0 mx-1" />

        {/* Voice Search Button */}
        <button
          type="button"
          onClick={onOpenVoiceSearch}
          aria-label="Voice search"
          className="shrink-0 p-2.5 mr-1 text-[#006c49] hover:bg-[#006c49]/10 transition-colors flex items-center justify-center rounded-full active:scale-95"
          title="Voice Search"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mic
          </span>
        </button>
      </div>
    </div>
  );
};
