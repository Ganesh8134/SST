import React, { useState } from 'react';
import { CartItem, Address, Order, Coupon } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentAddress: Address;
  onOpenAddressModal: () => void;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  deliveryFee: number;
  handlingFee: number;
  deliveryTip: number;
  grandTotal: number;
  itemTotal: number;
  onConfirmOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentAddress,
  onOpenAddressModal,
  appliedCoupon,
  discountAmount,
  deliveryFee,
  handlingFee,
  deliveryTip,
  grandTotal,
  itemTotal,
  onConfirmOrder
}) => {
  const [selectedSlot, setSelectedSlot] = useState<'express' | 'evening' | 'morning'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm'>('GPay');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isOpen) return null;

  const totalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const handlePlaceOrder = () => {
    setIsPlacing(true);
    setTimeout(() => {
      const orderNumber = `SS-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: orderNumber,
        date: 'Just Now, ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        items: [...cartItems],
        itemTotal,
        discount: discountAmount,
        deliveryFee,
        handlingFee,
        deliveryTip,
        grandTotal,
        address: currentAddress,
        customerId: 'cust-1',
        customerName: currentAddress.recipientName || 'Sai Santosh',
        customerPhone: currentAddress.phoneNumber || '+91 98450 12345',
        status: 'ORDER PLACED',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        estimatedDeliveryTime: selectedSlot === 'express' ? '15–20 Mins' : selectedSlot === 'evening' ? 'Today, 7:00 PM' : 'Tomorrow, 7:00 AM',
        paymentMethod: paymentMethod === 'UPI' ? `UPI (${upiApp})` : paymentMethod,
        riderName: 'Suresh Reddy',
        riderPhone: '+91 98450 78901',
        darkStore: 'Sai Santosh Dark Store #04 - Himayatnagar'
      };
      setIsPlacing(false);
      onConfirmOrder(newOrder);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#e6ecf5] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#caead6] text-[#006c49] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
            </span>
            <div>
              <h2 className="text-[17px] font-extrabold text-[#141b2b]">
                Secure Checkout
              </h2>
              <p className="text-[11px] text-[#5b6b62]">
                {totalQuantity} Items • Grand Total: ₹{grandTotal}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f3ff] hover:bg-[#e4ebfc] text-[#141b2b] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 no-scrollbar">
          {/* 1. Delivery Address Card */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 border border-[#e6ecf5]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-[#006c49] bg-[#caead6] px-2 py-0.5 rounded-md uppercase">
                  1. Delivery Address
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenAddressModal}
                className="text-[12px] font-bold text-[#006c49] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Change / Add</span>
                <span className="material-symbols-outlined text-[14px]">edit</span>
              </button>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006c49] text-[22px] mt-0.5">
                location_on
              </span>
              <div>
                <h4 className="text-[13px] font-extrabold text-[#141b2b]">
                  {currentAddress.tag} • {currentAddress.recipientName}
                </h4>
                <p className="text-[12px] text-[#3c4a42] mt-0.5 leading-snug">
                  {currentAddress.fullAddress}, {currentAddress.locality}, Hyderabad, Telangana - {currentAddress.pincode}
                </p>
                <p className="text-[11px] text-[#5b6b62] mt-1">
                  Phone: {currentAddress.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Delivery Time Slot */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 border border-[#e6ecf5] flex flex-col gap-2.5">
            <span className="text-[11px] font-extrabold text-[#006c49] bg-[#caead6] px-2 py-0.5 rounded-md uppercase w-fit">
              2. Delivery Slot
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedSlot('express')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedSlot === 'express'
                    ? 'bg-[#caead6]/40 border-[#006c49] ring-1 ring-[#006c49]'
                    : 'bg-white border-[#e6ecf5] hover:border-[#006c49]/40'
                }`}
              >
                <div className="flex items-center gap-1 text-[#006c49] font-extrabold text-[12px]">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>15–20 Mins</span>
                </div>
                <p className="text-[10px] text-[#5b6b62] mt-1">
                  Superfast Express from Himayatnagar Hub
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlot('evening')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedSlot === 'evening'
                    ? 'bg-[#caead6]/40 border-[#006c49] ring-1 ring-[#006c49]'
                    : 'bg-white border-[#e6ecf5] hover:border-[#006c49]/40'
                }`}
              >
                <div className="flex items-center gap-1 text-[#141b2b] font-extrabold text-[12px]">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>Today Evening</span>
                </div>
                <p className="text-[10px] text-[#5b6b62] mt-1">
                  7:00 PM – 8:30 PM
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSlot('morning')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedSlot === 'morning'
                    ? 'bg-[#caead6]/40 border-[#006c49] ring-1 ring-[#006c49]'
                    : 'bg-white border-[#e6ecf5] hover:border-[#006c49]/40'
                }`}
              >
                <div className="flex items-center gap-1 text-[#141b2b] font-extrabold text-[12px]">
                  <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                  <span>Tomorrow</span>
                </div>
                <p className="text-[10px] text-[#5b6b62] mt-1">
                  7:00 AM – 9:00 AM
                </p>
              </button>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 border border-[#e6ecf5] flex flex-col gap-3">
            <span className="text-[11px] font-extrabold text-[#006c49] bg-[#caead6] px-2 py-0.5 rounded-md uppercase w-fit">
              3. Payment Method
            </span>

            <div className="flex flex-col gap-2">
              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-white border-[#006c49] ring-1 ring-[#006c49]'
                    : 'bg-white/60 border-[#e6ecf5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-[20px]">
                      qr_code_2
                    </span>
                    <span className="text-[13px] font-extrabold text-[#141b2b]">
                      UPI (Instant & Fastest)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#caead6] text-[#00422b] px-2 py-0.5 rounded-full">
                    Zero Surcharge
                  </span>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="flex gap-2 mt-3 pt-2 border-t border-[#e6ecf5]">
                    {(['GPay', 'PhonePe', 'Paytm'] as const).map(app => (
                      <button
                        key={app}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUpiApp(app);
                        }}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                          upiApp === app ? 'bg-[#006c49] text-white border-[#006c49]' : 'bg-[#f8fafc] text-[#5b6b62] border-[#e6ecf5]'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cards Option */}
              <div
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Card'
                    ? 'bg-white border-[#006c49] ring-1 ring-[#006c49]'
                    : 'bg-white/60 border-[#e6ecf5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-[20px]">
                      credit_card
                    </span>
                    <span className="text-[13px] font-extrabold text-[#141b2b]">
                      Credit / Debit Cards
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5b6b62]">Visa, Mastercard, RuPay</span>
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-white border-[#006c49] ring-1 ring-[#006c49]'
                    : 'bg-white/60 border-[#e6ecf5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c49] text-[20px]">
                      payments
                    </span>
                    <span className="text-[13px] font-extrabold text-[#141b2b]">
                      Cash / QR on Delivery
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5b6b62]">Pay at doorstep</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Order Summary Preview */}
          <div className="bg-[#f8fafc] rounded-2xl p-4 border border-[#e6ecf5] flex flex-col gap-2 text-[13px]">
            <div className="flex justify-between font-extrabold text-[#141b2b]">
              <span>Items Total ({totalQuantity})</span>
              <span>₹{itemTotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#006c49] font-bold">
                <span>Coupon Savings ({appliedCoupon?.code})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-[#5b6b62]">
              <span>Express Delivery Fee</span>
              <span>{deliveryFee === 0 ? <span className="text-[#006c49] font-bold">FREE</span> : `₹${deliveryFee}`}</span>
            </div>

            <div className="flex justify-between text-[#5b6b62]">
              <span>Handling & Packaging</span>
              <span>₹{handlingFee}</span>
            </div>

            {deliveryTip > 0 && (
              <div className="flex justify-between text-[#5b6b62]">
                <span>Rider Tip</span>
                <span>₹{deliveryTip}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-[#e6ecf5] text-[16px] font-extrabold text-[#141b2b]">
              <span>To Pay</span>
              <span className="text-[22px] text-[#006c49]">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Floating Confirm Button */}
        <div className="p-4 border-t border-[#e6ecf5] bg-white">
          <button
            type="button"
            disabled={isPlacing}
            onClick={handlePlaceOrder}
            className="w-full py-4 rounded-2xl bg-[#006c49] hover:bg-[#005236] text-white font-extrabold text-[15px] shadow-lg shadow-[#006c49]/30 flex items-center justify-between px-5 transition-all cursor-pointer active:scale-98 disabled:opacity-75"
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[11px] text-white/80">
                {paymentMethod === 'UPI' ? `Pay via ${upiApp}` : paymentMethod} • ₹{grandTotal}
              </span>
              <span className="text-[15px] font-extrabold">
                {isPlacing ? 'Placing Order...' : 'Place 15-Min Order'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full text-[13px]">
              <span>Confirm</span>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
