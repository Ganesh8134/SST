import React, { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  onViewCart?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, onViewCart }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none animate-slide-up">
      <div className="pointer-events-auto bg-[#141b2b] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-full bg-[#caead6] text-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[16px]">check</span>
          </span>
          <span className="text-[12px] sm:text-[13px] font-bold truncate">
            {message}
          </span>
        </div>

        {onViewCart && (
          <button
            type="button"
            onClick={onViewCart}
            className="text-[12px] font-extrabold text-[#4edea3] hover:underline shrink-0 cursor-pointer"
          >
            View Cart →
          </button>
        )}
      </div>
    </div>
  );
};
