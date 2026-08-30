import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder
}) => {
  const [eta, setEta] = useState(9);

  useEffect(() => {
    if (order) {
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#006c49', '#10b981', '#4edea3', '#ffb95f', '#ffffff']
      });

      const timer = setInterval(() => {
        setEta((prev) => (prev > 1 ? prev - 1 : 1));
      }, 45000);
      return () => clearInterval(timer);
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#caead6] text-[#006c49] flex items-center justify-center mb-3 shadow-inner">
            <span className="material-symbols-outlined text-[36px] font-bold">
              check_circle
            </span>
          </div>

          <span className="text-[12px] font-bold uppercase tracking-wider text-[#006c49] bg-[#caead6] px-3 py-1 rounded-full mb-1">
            Order #{order.id}
          </span>
          <h2 className="text-[22px] font-bold text-[#141b2b]">
            Order Placed Successfully!
          </h2>
          <p className="text-[14px] text-[#3c4a42] mt-1">
            Arriving in <strong className="text-[#006c49]">{eta} minutes</strong> at {order.address.tag}
          </p>
        </div>

        {/* Live Tracking Visual Card */}
        <div className="mt-5 p-4 bg-[#f9f9ff] border border-[#e1e8fd] rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
              <span className="text-[13px] font-bold text-[#141b2b]">Packing at Dark Store</span>
            </div>
            <span className="text-[11px] font-semibold text-[#006c49] bg-[#caead6] px-2 py-0.5 rounded-md">
              ⚡ 10 Min Guarantee
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="relative flex items-center justify-between my-4 px-2">
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-[#e1e8fd] -z-0">
              <div className="h-full bg-[#006c49] w-1/3 transition-all duration-1000" />
            </div>

            <div className="relative z-10 w-8 h-8 rounded-full bg-[#006c49] text-white flex items-center justify-center text-[12px] font-bold">
              ✓
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-[#006c49] text-white flex items-center justify-center text-[12px] font-bold ring-4 ring-[#caead6]">
              📦
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-[#bbcabf] text-[#3c4a42] flex items-center justify-center text-[12px] font-bold">
              🛵
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-[#bbcabf] text-[#3c4a42] flex items-center justify-center text-[12px] font-bold">
              📍
            </div>
          </div>

          {/* Delivery Hero Info */}
          <div className="flex items-center justify-between pt-3 border-t border-[#e1e8fd] text-[12px]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#006c49] text-white flex items-center justify-center font-bold">
                RK
              </div>
              <div>
                <p className="font-bold text-[#141b2b]">Ramesh Kumar</p>
                <p className="text-[10px] text-[#3c4a42]">Delivery Partner (4.9 ★)</p>
              </div>
            </div>
            <span className="text-[#006c49] font-bold text-[11px] bg-white px-2 py-1 rounded-lg border border-[#e1e8fd]">
              Eco EV Scooter
            </span>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mt-4">
          <h4 className="text-[12px] font-bold text-[#3c4a42]/80 uppercase tracking-wider mb-2">
            Items Ordered ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
          </h4>
          <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-[13px] py-1 border-b border-[#f1f3ff] last:border-none">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#006c49]">{item.quantity}x</span>
                  <span className="truncate max-w-[200px] text-[#141b2b]">{item.product.name}</span>
                </div>
                <span className="font-bold text-[#141b2b]">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="mt-4 p-3.5 bg-[#f1f3ff] rounded-2xl text-[13px] space-y-1.5">
          <div className="flex justify-between text-[#3c4a42]">
            <span>Item Total</span>
            <span>₹{order.itemTotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#006c49] font-semibold">
              <span>Promo Discount</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-[#3c4a42]">
            <span>Delivery Fee</span>
            <span>{order.deliveryFee === 0 ? <strong className="text-[#006c49]">FREE</strong> : `₹${order.deliveryFee}`}</span>
          </div>
          <div className="flex justify-between text-[#3c4a42]">
            <span>Handling Fee</span>
            <span>₹{order.handlingFee}</span>
          </div>
          <div className="flex justify-between text-[15px] font-bold text-[#141b2b] pt-2 border-t border-[#e1e8fd]">
            <span>Paid ({order.paymentMethod})</span>
            <span>₹{order.grandTotal}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full border border-[#bbcabf] text-[#141b2b] font-bold text-[13px] hover:bg-[#f1f3ff] transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              onTrackOrder();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-full bg-[#006c49] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(0,108,73,0.2)] hover:bg-[#005236] transition-all"
          >
            Track in Profile
          </button>
        </div>
      </div>
    </div>
  );
};
