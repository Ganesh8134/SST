import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { normalizeOrderStatus, subscribeToRealtimeEvents } from '../utils/realtime';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order: initialOrder,
  onClose
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder);
  const [minutesLeft, setMinutesLeft] = useState<number>(12);
  const [riderProgress, setRiderProgress] = useState<number>(60); // Percentage for animation

  // Sync initial order props
  useEffect(() => {
    setCurrentOrder(initialOrder);
  }, [initialOrder]);

  // Real-time event subscription: Listen for status updates on this order live without reloading
  useEffect(() => {
    if (!currentOrder) return;

    const unsubscribe = subscribeToRealtimeEvents((payload) => {
      if (payload.type === 'ORDER_STATUS_UPDATED' && payload.orderId === currentOrder.id) {
        if (payload.order) {
          setCurrentOrder(payload.order);
        } else if (payload.newStatus) {
          setCurrentOrder(prev => prev ? { ...prev, status: payload.newStatus! } : null);
        }
      }
    });

    return () => unsubscribe();
  }, [currentOrder?.id]);

  // Dynamic ETA & Rider movement simulator
  useEffect(() => {
    if (!currentOrder) return;
    const norm = normalizeOrderStatus(currentOrder.status);

    if (norm === 'DELIVERED') {
      setMinutesLeft(0);
      setRiderProgress(100);
      return;
    }

    if (norm === 'OUT FOR DELIVERY') {
      setMinutesLeft(8);
      const interval = setInterval(() => {
        setRiderProgress(prev => (prev < 92 ? prev + 1 : 92));
      }, 3000);
      return () => clearInterval(interval);
    }

    if (norm === 'ORDER BEING PACKED') {
      setMinutesLeft(14);
      setRiderProgress(25);
    } else if (norm === 'ORDER CONFIRMED') {
      setMinutesLeft(18);
      setRiderProgress(10);
    } else {
      setMinutesLeft(20);
      setRiderProgress(5);
    }
  }, [currentOrder?.status]);

  if (!currentOrder) return null;

  const currentStatusNorm = normalizeOrderStatus(currentOrder.status);

  // Stepper definition according to exact user specification
  const TRACKING_STEPS: { id: OrderStatus; label: string; icon: string; time: string }[] = [
    { id: 'ORDER PLACED', label: 'Order Placed', icon: 'receipt_long', time: '11:30 AM' },
    { id: 'ORDER CONFIRMED', label: 'Order Confirmed', icon: 'check_circle', time: '11:31 AM' },
    { id: 'ORDER BEING PACKED', label: 'Packing', icon: 'inventory_2', time: '11:33 AM' },
    { id: 'OUT FOR DELIVERY', label: 'Out for Delivery', icon: 'two_wheeler', time: '11:36 AM' },
    { id: 'DELIVERED', label: 'Delivered', icon: 'task_alt', time: 'Est. 11:45 AM' }
  ];

  // Helper to determine status state (done, current, pending)
  const getStepState = (stepId: OrderStatus, index: number) => {
    const statusOrder: OrderStatus[] = [
      'ORDER PLACED',
      'ORDER CONFIRMED',
      'ORDER BEING PACKED',
      'READY FOR DELIVERY',
      'OUT FOR DELIVERY',
      'DELIVERED'
    ];

    const currentIdx = statusOrder.indexOf(currentStatusNorm);
    const stepTargetIdx = statusOrder.indexOf(stepId);

    if (currentStatusNorm === 'CANCELLED') {
      return { isDone: false, isCurrent: false, isCancelled: true };
    }

    if (currentIdx > stepTargetIdx) {
      return { isDone: true, isCurrent: false };
    } else if (currentIdx === stepTargetIdx) {
      return { isDone: false, isCurrent: true };
    } else {
      return { isDone: false, isCurrent: false };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full sm:max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Order ID & Amount */}
        <div className="p-4 border-b border-[#e6ecf5] flex items-center justify-between sticky top-0 bg-white z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-extrabold text-[#141b2b] tracking-tight">
                Order #{currentOrder.id}
              </span>
              <span className="text-[14px] font-black text-[#006c49] bg-[#caead6] px-2 py-0.5 rounded-lg">
                ₹{currentOrder.grandTotal}
              </span>
            </div>
            <p className="text-[11px] text-[#5b6b62]">
              {currentOrder.date} • {currentOrder.items.reduce((a, b) => a + b.quantity, 0)} items
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f1f3ff] hover:bg-[#e4ebfc] text-[#141b2b] flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 no-scrollbar">
          {/* Real-time Status Alert Banner */}
          <div className="bg-gradient-to-r from-[#00422b] to-[#006c49] text-white p-4 sm:p-5 rounded-3xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse shrink-0">
                <span className="material-symbols-outlined text-[28px] text-white">
                  {currentStatusNorm === 'DELIVERED' ? 'celebration' : 'two_wheeler'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-[#4edea3] uppercase tracking-wider">
                  {currentStatusNorm === 'DELIVERED' ? 'DELIVERY COMPLETED' : 'REAL-TIME DISPATCH'}
                </span>
                <h3 className="text-[19px] sm:text-[21px] font-black leading-tight mt-0.5">
                  {currentStatusNorm === 'DELIVERED'
                    ? '🎉 Delivered Successfully'
                    : `Arriving in ${minutesLeft} minutes`}
                </h3>
                <p className="text-[11px] text-white/85 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  Delivering to {currentOrder.address.locality}, Hyderabad
                </p>
              </div>
            </div>
          </div>

          {/* Hyderabad Dark Store Visual Route Map */}
          <div className="relative w-full h-44 rounded-3xl bg-[#e5eef7] border border-[#d1e0f0] overflow-hidden p-3.5 flex flex-col justify-between shadow-inner">
            {/* SVG Roads Blueprint */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M 30,40 Q 180,85 420,35" stroke="#94a3b8" strokeWidth="12" fill="transparent" strokeLinecap="round" />
                <path d="M 40,140 Q 200,60 380,130" stroke="#cbd5e1" strokeWidth="8" fill="transparent" strokeLinecap="round" />
                <path d="M 70,30 L 90,150" stroke="#cbd5e1" strokeWidth="6" fill="transparent" strokeDasharray="6" />
                <path d="M 320,20 L 300,160" stroke="#006c49" strokeWidth="4" fill="transparent" strokeDasharray="4" />
              </svg>
            </div>

            {/* Dark Store Node */}
            <div className="relative z-10 flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-xl shadow-xs border border-[#e6ecf5] w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] animate-ping" />
              <span className="text-[11px] font-extrabold text-[#141b2b]">
                🏢 {currentOrder.darkStore || 'Himayatnagar Dark Store #04'}
              </span>
            </div>

            {/* Animated Delivery Rider Icon */}
            <div
              className="relative z-10 flex items-center gap-2 bg-[#006c49] text-white px-3 py-1.5 rounded-full shadow-lg transition-all duration-1000 w-fit"
              style={{ marginLeft: `${Math.min(riderProgress, 68)}%` }}
            >
              <span className="material-symbols-outlined text-[16px] animate-bounce">
                two_wheeler
              </span>
              <span className="text-[11px] font-extrabold whitespace-nowrap">
                {currentStatusNorm === 'DELIVERED' ? 'Arrived' : 'On the way'}
              </span>
            </div>

            {/* Destination Node */}
            <div className="relative z-10 flex items-center justify-between bg-white/95 px-3 py-1.5 rounded-2xl shadow-xs border border-[#e6ecf5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006c49]">home_pin</span>
                <div>
                  <p className="text-[11px] font-extrabold text-[#141b2b]">
                    {currentOrder.address.recipientName} • {currentOrder.address.tag}
                  </p>
                  <p className="text-[10px] text-[#5b6b62] truncate max-w-[210px]">
                    {currentOrder.address.fullAddress}, {currentOrder.address.locality}, Hyderabad
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-[#006c49] bg-[#caead6] px-2 py-0.5 rounded-full">
                Hyderabad
              </span>
            </div>
          </div>

          {/* EXACT ORDER STATUS STEPPER (Per Specification 18) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#e6ecf5] shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
              <span className="text-[12px] font-extrabold text-[#141b2b] uppercase tracking-wider">
                ORDER STATUS
              </span>
              <span className="text-[11px] font-bold text-[#006c49] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse" />
                Live Updates Enabled
              </span>
            </div>

            <div className="flex flex-col gap-3 relative pl-2 pt-1">
              {TRACKING_STEPS.map((step, idx) => {
                const { isDone, isCurrent } = getStepState(step.id, idx);

                return (
                  <div key={step.id} className="flex items-start gap-3 relative">
                    {/* Vertical Connector line */}
                    {idx < TRACKING_STEPS.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-6 bottom-0 w-0.5 ${
                          isDone ? 'bg-[#006c49]' : 'bg-[#e2e8f0]'
                        }`}
                      />
                    )}

                    {/* Step Icon Badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        isDone
                          ? 'bg-[#006c49] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#006c49] text-white ring-4 ring-[#caead6] shadow-sm animate-pulse'
                          : 'bg-[#f1f5f9] text-[#94a3b8]'
                      }`}
                    >
                      {isDone ? (
                        <span className="text-[13px] font-black">✓</span>
                      ) : isCurrent ? (
                        <span className="text-[14px] font-black">●</span>
                      ) : (
                        <span className="text-[14px] text-slate-400">○</span>
                      )}
                    </div>

                    {/* Step Label & Timestamp */}
                    <div className="flex-1 min-w-0 flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[13px] font-extrabold ${
                            isDone || isCurrent ? 'text-[#141b2b]' : 'text-[#94a3b8]'
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-[#caead6] text-[#00422b] px-1.5 py-0.2 rounded-full uppercase">
                            In Progress
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-[#5b6b62]">
                        {isDone ? step.time : isCurrent ? 'Now' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Partner Contact Card */}
          <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e6ecf5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#006c49] to-[#10b981] text-white flex items-center justify-center font-bold text-[14px] shadow-xs">
                SR
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[13px] font-extrabold text-[#141b2b]">
                    {currentOrder.riderName || 'Suresh Reddy'}
                  </h4>
                  <span className="text-[10px] font-bold bg-[#caead6] text-[#00422b] px-1.5 py-0.2 rounded">
                    ★ 4.9
                  </span>
                </div>
                <p className="text-[11px] text-[#5b6b62]">
                  Hyderabad Dark Store Rider • Vaccinated
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Calling rider ${currentOrder.riderName || 'Suresh Reddy'} at ${currentOrder.riderPhone || '+91 98450 78901'}`)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Call Rider</span>
            </button>
          </div>

          {/* Items Breakdown */}
          <div className="p-4 rounded-3xl bg-white border border-[#e6ecf5] space-y-2.5">
            <h4 className="text-[13px] font-extrabold text-[#141b2b]">
              Items Ordered ({currentOrder.items.reduce((a, b) => a + b.quantity, 0)})
            </h4>

            <div className="flex flex-col divide-y divide-[#f1f5f9]">
              {currentOrder.items.map((i, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={i.product.image}
                      alt={i.product.name}
                      className="w-10 h-10 object-contain mix-blend-multiply bg-[#f8fafc] rounded-lg p-1 border border-slate-100"
                    />
                    <div>
                      <span className="font-bold text-[#141b2b]">{i.product.name}</span>
                      <p className="text-[11px] text-[#5b6b62]">
                        {i.product.weight} × {i.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-[#141b2b]">
                    ₹{i.product.price * i.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Total */}
            <div className="pt-2 border-t border-[#f1f5f9] flex justify-between items-center text-xs">
              <span className="font-bold text-[#5b6b62]">Grand Total ({currentOrder.paymentMethod}):</span>
              <span className="font-black text-[15px] text-[#006c49]">₹{currentOrder.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e6ecf5] bg-white flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#006c49] hover:bg-[#005236] text-white font-extrabold text-[14px] shadow-md shadow-[#006c49]/20 transition-all cursor-pointer"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
