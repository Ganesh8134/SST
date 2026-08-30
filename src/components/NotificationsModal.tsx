import React from 'react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full sm:max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e6ecf5] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#caead6] text-[#006c49] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </span>
            <div>
              <h2 className="text-[17px] font-extrabold text-[#141b2b]">
                Notifications
              </h2>
              <p className="text-[11px] text-[#5b6b62]">
                Hyderabad Deals & Order Updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[11px] font-bold text-[#006c49] hover:underline cursor-pointer"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f1f3ff] hover:bg-[#e4ebfc] text-[#141b2b] flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto p-4 flex flex-col gap-2.5 no-scrollbar">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                notif.read
                  ? 'bg-white border-[#e6ecf5]'
                  : 'bg-[#f1f8f4] border-[#006c49]/40 shadow-xs'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'order'
                    ? 'bg-[#006c49] text-white'
                    : notif.type === 'discount'
                    ? 'bg-[#fef08a] text-[#854d0e]'
                    : 'bg-[#caead6] text-[#00422b]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {notif.type === 'order' ? 'bolt' : notif.type === 'discount' ? 'percent' : 'inventory'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-[13px] font-extrabold text-[#141b2b]">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#5b6b62] shrink-0">{notif.time}</span>
                </div>
                <p className="text-[12px] text-[#3c4a42] mt-0.5 leading-snug">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
