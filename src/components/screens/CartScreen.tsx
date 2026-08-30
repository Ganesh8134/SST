import React, { useState } from 'react';
import { CartItem, Coupon } from '../../types';
import { AVAILABLE_COUPONS } from '../../data/products';

interface CartScreenProps {
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  deliveryTip: number;
  onSetDeliveryTip: (tip: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  appliedCoupon,
  onApplyCoupon,
  deliveryTip,
  onSetDeliveryTip,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  onContinueShopping
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [deliveryInstruction, setDeliveryInstruction] = useState<'door' | 'no_call' | 'guard' | null>(null);

  const freeDeliveryThreshold = 299;
  const itemTotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const totalOriginalPrice = cartItems.reduce(
    (acc, i) => acc + (i.product.originalPrice || i.product.price) * i.quantity,
    0
  );
  const productSavings = totalOriginalPrice - itemTotal;

  // Coupon discount calculation
  let couponDiscount = 0;
  if (appliedCoupon && itemTotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percent') {
      const calc = (itemTotal * appliedCoupon.discountValue) / 100;
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const isFreeDelivery = itemTotal >= freeDeliveryThreshold;
  const deliveryFee = itemTotal === 0 ? 0 : (isFreeDelivery ? 0 : 25);
  const handlingFee = itemTotal === 0 ? 0 : 2;
  const totalDiscount = productSavings + couponDiscount;
  const grandTotal = Math.max(0, itemTotal - couponDiscount + deliveryFee + handlingFee + deliveryTip);

  const handleApplyCouponCode = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find(c => c.code === code);
    if (!found) {
      setCouponError('Invalid coupon code. Try HYD30 or FRESH15.');
      return;
    }
    if (itemTotal < found.minOrder) {
      setCouponError(`Add items worth ₹${found.minOrder - itemTotal} more to apply ${code}`);
      return;
    }
    onApplyCoupon(found);
    setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 pb-24 text-center flex flex-col items-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-[#f1f8f4] text-[#006c49] flex items-center justify-center mb-4 shadow-sm">
          <span className="material-symbols-outlined text-[48px]">shopping_bag</span>
        </div>
        <h2 className="text-[20px] font-extrabold text-[#141b2b]">
          Your Grocery Bag is Empty
        </h2>
        <p className="text-[13px] text-[#5b6b62] max-w-xs mt-1 mb-6">
          Fresh milk, rice, dals, oils and snacks delivered in 15 minutes across Hyderabad.
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="px-8 py-3.5 rounded-2xl bg-[#006c49] text-white font-extrabold text-[14px] shadow-lg shadow-[#006c49]/30 hover:bg-[#005236] transition-all cursor-pointer"
        >
          Explore Fresh Groceries →
        </button>
      </div>
    );
  }

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - itemTotal);
  const deliveryProgress = Math.min(100, (itemTotal / freeDeliveryThreshold) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 animate-fade-in flex flex-col md:flex-row gap-5 pt-2">
      {/* Left Column: Cart Items List */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Free Delivery Bar */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e6ecf5] shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-1.5 font-extrabold text-[#00422b]">
              <span className="material-symbols-outlined text-[18px] text-[#006c49]">
                {isFreeDelivery ? 'check_circle' : 'local_shipping'}
              </span>
              <span>
                {isFreeDelivery
                  ? '🎉 You unlocked FREE Express Delivery!'
                  : `Add ₹${amountNeededForFreeDelivery} more for FREE delivery`}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#5b6b62]">
              Min ₹{freeDeliveryThreshold}
            </span>
          </div>

          <div className="w-full h-2 bg-[#f1f3ff] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#006c49] to-[#10b981] transition-all duration-500 rounded-full"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-extrabold text-[#141b2b]">
            Order Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
          </h2>
          <button
            type="button"
            onClick={onClearCart}
            className="text-[12px] font-bold text-[#ba1a1a] hover:underline"
          >
            Clear Cart
          </button>
        </div>

        {/* Item Cards */}
        <div className="flex flex-col gap-2.5">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-3.5 border border-[#e6ecf5] shadow-xs flex items-center justify-between gap-3"
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] p-1.5 flex items-center justify-center shrink-0 border border-[#e6ecf5]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Title & Price */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-[#006c49] uppercase tracking-wider block">
                  {product.brand}
                </span>
                <h4 className="text-[13px] font-bold text-[#141b2b] truncate leading-tight">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-[14px] font-extrabold text-[#141b2b]">
                    ₹{product.price * quantity}
                  </span>
                  <span className="text-[11px] text-[#5b6b62]">
                    (₹{product.price} / {product.weight})
                  </span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="h-8 rounded-xl bg-[#006c49] text-white flex items-center justify-between px-1 shadow-xs w-20 shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {quantity === 1 ? 'delete' : 'remove'}
                  </span>
                </button>
                <span className="text-[12px] font-extrabold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Partner Tip */}
        <div className="bg-white rounded-3xl p-4 border border-[#e6ecf5] shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#006c49]">
                sentiment_satisfied
              </span>
              <span className="text-[13px] font-extrabold text-[#141b2b]">
                Tip your Hyderabad delivery partner
              </span>
            </div>
            <span className="text-[11px] text-[#5b6b62]">100% goes to rider</span>
          </div>

          <div className="flex gap-2">
            {[0, 10, 20, 30].map((tip) => (
              <button
                key={tip}
                onClick={() => onSetDeliveryTip(tip)}
                className={`flex-1 py-1.5 rounded-xl text-[12px] font-bold border transition-all cursor-pointer ${
                  deliveryTip === tip
                    ? 'bg-[#006c49] text-white border-[#006c49]'
                    : 'bg-[#f8fafc] text-[#5b6b62] border-[#e6ecf5] hover:bg-[#f1f3ff]'
                }`}
              >
                {tip === 0 ? 'No Tip' : `₹${tip}`}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Instructions */}
        <div className="bg-white rounded-3xl p-4 border border-[#e6ecf5] shadow-xs flex flex-col gap-2.5">
          <span className="text-[13px] font-extrabold text-[#141b2b]">
            Delivery Instructions
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDeliveryInstruction(deliveryInstruction === 'door' ? null : 'door')}
              className={`p-2 rounded-2xl border text-center text-[11px] font-bold transition-all cursor-pointer ${
                deliveryInstruction === 'door' ? 'bg-[#caead6] border-[#006c49] text-[#00422b]' : 'bg-[#f8fafc] border-[#e6ecf5] text-[#5b6b62]'
              }`}
            >
              🚪 Leave at door
            </button>
            <button
              onClick={() => setDeliveryInstruction(deliveryInstruction === 'no_call' ? null : 'no_call')}
              className={`p-2 rounded-2xl border text-center text-[11px] font-bold transition-all cursor-pointer ${
                deliveryInstruction === 'no_call' ? 'bg-[#caead6] border-[#006c49] text-[#00422b]' : 'bg-[#f8fafc] border-[#e6ecf5] text-[#5b6b62]'
              }`}
            >
              🔕 Avoid calling
            </button>
            <button
              onClick={() => setDeliveryInstruction(deliveryInstruction === 'guard' ? null : 'guard')}
              className={`p-2 rounded-2xl border text-center text-[11px] font-bold transition-all cursor-pointer ${
                deliveryInstruction === 'guard' ? 'bg-[#caead6] border-[#006c49] text-[#00422b]' : 'bg-[#f8fafc] border-[#e6ecf5] text-[#5b6b62]'
              }`}
            >
              👮 Hand to guard
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Coupons & Bill Breakdown */}
      <div className="md:w-80 shrink-0 flex flex-col gap-4">
        {/* Coupon Selector */}
        <div className="bg-white rounded-3xl p-4 border border-[#e6ecf5] shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#006c49]">
              local_offer
            </span>
            <h3 className="text-[14px] font-extrabold text-[#141b2b]">
              Coupons & Offers
            </h3>
          </div>

          {appliedCoupon ? (
            <div className="p-3 rounded-2xl bg-[#f1f8f4] border border-[#006c49]/40 flex items-center justify-between">
              <div>
                <span className="text-[12px] font-mono font-extrabold text-[#006c49]">
                  ✓ {appliedCoupon.code} APPLIED
                </span>
                <p className="text-[11px] text-[#3c4a42]">{appliedCoupon.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onApplyCoupon(null)}
                className="text-[11px] font-bold text-[#ba1a1a] hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#f8fafc] border border-[#e6ecf5] text-[12px] font-mono font-bold uppercase outline-none focus:border-[#006c49]"
                />
                <button
                  type="button"
                  onClick={handleApplyCouponCode}
                  className="px-3 py-2 rounded-xl bg-[#006c49] text-white font-bold text-[12px] hover:bg-[#005236]"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <span className="text-[11px] font-bold text-[#ba1a1a]">{couponError}</span>
              )}

              {/* Available Coupons list */}
              <div className="flex flex-col gap-1.5 mt-1">
                {AVAILABLE_COUPONS.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      if (itemTotal >= c.minOrder) {
                        onApplyCoupon(c);
                        setCouponError(null);
                      } else {
                        setCouponError(`Add items worth ₹${c.minOrder - itemTotal} more for ${c.code}`);
                      }
                    }}
                    className="p-2 rounded-xl bg-[#f8fafc] hover:bg-[#caead6]/40 border border-[#e6ecf5] text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-mono font-extrabold text-[#006c49]">
                        {c.code}
                      </span>
                      <p className="text-[10px] text-[#5b6b62]">{c.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#006c49]">Apply</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bill Summary Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#e6ecf5] shadow-xs flex flex-col gap-2.5 text-[13px]">
          <h3 className="text-[14px] font-extrabold text-[#141b2b] pb-2 border-b border-[#e6ecf5]">
            Bill Summary
          </h3>

          <div className="flex justify-between text-[#5b6b62]">
            <span>Item Total</span>
            <span className="font-bold text-[#141b2b]">₹{itemTotal}</span>
          </div>

          {productSavings > 0 && (
            <div className="flex justify-between text-[#006c49]">
              <span>Product Discount</span>
              <span className="font-bold">-₹{productSavings}</span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-[#006c49]">
              <span>Coupon Discount ({appliedCoupon?.code})</span>
              <span className="font-bold">-₹{couponDiscount}</span>
            </div>
          )}

          <div className="flex justify-between text-[#5b6b62]">
            <span>Delivery Partner Fee</span>
            <span>{deliveryFee === 0 ? <span className="text-[#006c49] font-bold">FREE</span> : `₹${deliveryFee}`}</span>
          </div>

          <div className="flex justify-between text-[#5b6b62]">
            <span>Handling & Packaging</span>
            <span>₹{handlingFee}</span>
          </div>

          {deliveryTip > 0 && (
            <div className="flex justify-between text-[#5b6b62]">
              <span>Delivery Partner Tip</span>
              <span>₹{deliveryTip}</span>
            </div>
          )}

          <div className="pt-2 border-t border-[#e6ecf5] flex justify-between items-center text-[16px] font-extrabold text-[#141b2b]">
            <div>
              <span>Grand Total</span>
              {totalDiscount > 0 && (
                <span className="text-[11px] text-[#006c49] block font-bold">
                  Total Saved: ₹{totalDiscount}
                </span>
              )}
            </div>
            <span className="text-[22px] text-[#006c49]">₹{grandTotal}</span>
          </div>

          {/* Checkout CTA Button */}
          <button
            type="button"
            onClick={onProceedToCheckout}
            className="w-full mt-2 py-4 rounded-2xl bg-[#006c49] hover:bg-[#005236] text-white font-extrabold text-[15px] shadow-lg shadow-[#006c49]/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
