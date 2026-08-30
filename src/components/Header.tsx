import React from 'react';
import { Address, NotificationItem } from '../types';

interface HeaderProps {
  currentAddress: Address;
  onOpenAddressModal: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  notifications: NotificationItem[];
}

export const Header: React.FC<HeaderProps> = ({
  currentAddress,
  onOpenAddressModal,
  onOpenNotifications,
  onOpenProfile,
  onOpenAdmin,
  isAdminLoggedIn,
  notifications
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e6ecf5] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Location Selector */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#006c49] to-[#049669] flex items-center justify-center text-white shadow-md shadow-[#006c49]/20">
              <span className="material-symbols-outlined text-[24px]">storefront</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[16px] font-extrabold text-[#006c49] tracking-tight leading-tight">
                Sai Santosh
              </span>
              <span className="text-[10px] font-bold text-[#3c4a42] uppercase tracking-wider">
                Traders • Hyderabad
              </span>
            </div>
          </div>

          <div className="h-7 w-px bg-[#e6ecf5] hidden sm:block" />

          {/* Clickable Location Address Selector */}
          <button
            type="button"
            onClick={onOpenAddressModal}
            className="flex flex-col items-start text-left group hover:bg-[#f1f8f4] py-1 px-2 rounded-xl transition-all cursor-pointer min-w-0"
            title="Click to change Hyderabad delivery address"
          >
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-extrabold text-[#006c49] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006c49] animate-pulse">location_on</span>
                Delivering to {currentAddress.tag}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#3c4a42] group-hover:translate-y-0.5 transition-transform">
                expand_more
              </span>
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[13px] font-bold text-[#141b2b] truncate max-w-[170px] sm:max-w-[240px] md:max-w-[320px]">
                {currentAddress.locality}, Hyderabad
              </span>
              <span className="text-[11px] text-[#3c4a42]/70 hidden md:inline truncate max-w-[200px]">
                • {currentAddress.fullAddress}
              </span>
            </div>
          </button>
        </div>

        {/* Right Side: Speed Badge, Admin Switcher, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Admin Portal Gateway Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
              isAdminLoggedIn
                ? 'bg-slate-900 text-emerald-400 border-slate-700 hover:bg-slate-800 shadow-xs'
                : 'bg-[#f1f3ff] text-[#006c49] border-[#e6ecf5] hover:bg-[#caead6]'
            }`}
            title="Open Sai Santosh Admin & Live Dispatch Hub"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdminLoggedIn ? 'dashboard' : 'admin_panel_settings'}
            </span>
            <span className="hidden sm:inline">
              {isAdminLoggedIn ? 'Admin Hub' : 'Admin'}
            </span>
          </button>

          {/* 15-20 min Delivery Pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#caead6]/70 border border-[#006c49]/20 px-2.5 py-1 rounded-full text-[#00422b]">
            <span className="material-symbols-outlined text-[15px] text-[#006c49] animate-bounce">bolt</span>
            <span className="text-[11px] font-extrabold whitespace-nowrap">
              15–20 mins
            </span>
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f1f3ff] hover:bg-[#e4ebfc] text-[#141b2b] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Avatar Button */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full bg-[#f1f8f4] hover:bg-[#caead6]/60 border border-[#006c49]/20 transition-all cursor-pointer"
            aria-label="User Profile"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#006c49] to-[#10b981] text-white flex items-center justify-center text-[12px] font-bold shadow-xs">
              SS
            </div>
            <span className="hidden sm:inline text-[12px] font-bold text-[#141b2b]">
              Sai Santosh
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
