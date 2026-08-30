import React from 'react';

export type TabType = 'home' | 'categories' | 'search' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartItemCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  cartItemCount
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'categories', label: 'Categories', icon: 'grid_view' },
    { id: 'search', label: 'Search', icon: 'search' },
    { id: 'cart', label: 'Cart', icon: 'shopping_bag' },
    { id: 'profile', label: 'Profile', icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e6ecf5] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCart = tab.id === 'cart';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#006c49] font-extrabold scale-105'
                  : 'text-[#5b6b62] hover:text-[#141b2b] font-medium'
              }`}
            >
              {/* Active Background Pill */}
              {isActive && (
                <span className="absolute inset-0 bg-[#caead6]/40 rounded-2xl -z-10 animate-fade-in" />
              )}

              {/* Icon with Cart Badge */}
              <div className="relative flex items-center justify-center w-6 h-6">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'font-bold scale-110' : ''
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>

                {isCart && cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#006c49] text-white text-[10px] font-extrabold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-xs ring-2 ring-white animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
