import React, { useState } from 'react';
import { Address, Order, Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface ProfileScreenProps {
  currentAddress: Address;
  orders: Order[];
  wishlistProducts: Product[];
  cartItemsMap: Record<string, number>;
  onTrackOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
  onOpenAddressModal: () => void;
  onOpenNotifications: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentAddress,
  orders,
  wishlistProducts,
  cartItemsMap,
  onTrackOrder,
  onReorder,
  onOpenAddressModal,
  onOpenNotifications,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  onToggleWishlist
}) => {
  const [activeSection, setActiveSection] = useState<'orders' | 'wishlist' | 'support'>('orders');

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 animate-fade-in flex flex-col gap-5 pt-2">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-[#00422b] to-[#006c49] text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-[24px] font-black shadow-inner border border-white/30">
            SS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-black">Sai Santosh</h1>
              <span className="text-[10px] font-extrabold bg-[#caead6] text-[#00422b] px-2 py-0.5 rounded-full uppercase tracking-wider">
                VIP Member
              </span>
            </div>
            <p className="text-[12px] text-white/80 mt-0.5">
              +91 98450 12345 • santosh.hyd@example.com
            </p>
            <p className="text-[11px] text-[#4edea3] font-bold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {currentAddress.locality}, Hyderabad, Telangana
            </p>
          </div>
        </div>

        {/* Quick stat pill */}
        <div className="bg-white/15 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/20 flex gap-4 text-center">
          <div>
            <span className="text-[18px] font-black">{orders.length}</span>
            <span className="text-[10px] text-white/80 block uppercase">Orders</span>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <span className="text-[18px] font-black">{wishlistProducts.length}</span>
            <span className="text-[10px] text-white/80 block uppercase">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveSection('orders')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeSection === 'orders'
              ? 'bg-[#caead6]/60 border-[#006c49] text-[#00422b]'
              : 'bg-white border-[#e6ecf5] hover:bg-[#f1f8f4]'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-[#f1f3ff] text-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">package_2</span>
          </div>
          <div>
            <span className="text-[12px] font-extrabold text-[#141b2b] block">My Orders</span>
            <span className="text-[10px] text-[#5b6b62]">{orders.length} Past orders</span>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('wishlist')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            activeSection === 'wishlist'
              ? 'bg-[#caead6]/60 border-[#006c49] text-[#00422b]'
              : 'bg-white border-[#e6ecf5] hover:bg-[#f1f8f4]'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-[#f1f3ff] text-[#ba1a1a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </div>
          <div>
            <span className="text-[12px] font-extrabold text-[#141b2b] block">Wishlist</span>
            <span className="text-[10px] text-[#5b6b62]">{wishlistProducts.length} Saved items</span>
          </div>
        </button>

        <button
          onClick={onOpenAddressModal}
          className="p-3.5 rounded-2xl bg-white hover:bg-[#f1f8f4] border border-[#e6ecf5] text-left transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#f1f3ff] text-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">pin_drop</span>
          </div>
          <div>
            <span className="text-[12px] font-extrabold text-[#141b2b] block">Addresses</span>
            <span className="text-[10px] text-[#5b6b62]">Manage locations</span>
          </div>
        </button>

        <button
          onClick={onOpenNotifications}
          className="p-3.5 rounded-2xl bg-white hover:bg-[#f1f8f4] border border-[#e6ecf5] text-left transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#f1f3ff] text-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </div>
          <div>
            <span className="text-[12px] font-extrabold text-[#141b2b] block">Alerts</span>
            <span className="text-[10px] text-[#5b6b62]">Hyderabad offers</span>
          </div>
        </button>
      </div>

      {/* Main Section Content */}
      {activeSection === 'orders' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-[17px] font-extrabold text-[#141b2b]">
            Order History & Live Status
          </h2>

          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6ecf5] shadow-xs flex flex-col gap-3.5"
              >
                {/* Order Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e6ecf5]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-extrabold text-[#141b2b]">
                        Order #{order.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          order.status === 'delivered'
                            ? 'bg-[#caead6] text-[#00422b]'
                            : 'bg-[#fef08a] text-[#854d0e] animate-pulse'
                        }`}
                      >
                        {order.status === 'delivered' ? '✓ Delivered' : '● Live In Transit'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5b6b62] mt-0.5">
                      {order.date} • {order.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[16px] font-extrabold text-[#141b2b]">
                      ₹{order.grandTotal}
                    </span>
                    <p className="text-[11px] text-[#006c49] font-bold">
                      {order.items.reduce((a, b) => a + b.quantity, 0)} Items
                    </p>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex flex-wrap gap-2">
                  {order.items.map((i) => (
                    <div
                      key={i.product.id}
                      className="flex items-center gap-2 bg-[#f8fafc] px-2.5 py-1.5 rounded-xl border border-[#e6ecf5]"
                    >
                      <img
                        src={i.product.image}
                        alt={i.product.name}
                        className="w-7 h-7 object-contain mix-blend-multiply"
                      />
                      <span className="text-[11px] font-bold text-[#141b2b] truncate max-w-[140px]">
                        {i.product.name}
                      </span>
                      <span className="text-[10px] text-[#5b6b62]">×{i.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Address and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-[#5b6b62]">
                    📍 Delivered to {order.address.locality}, Hyderabad ({order.address.tag})
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onTrackOrder(order)}
                      className="px-4 py-2 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white text-[12px] font-bold shadow-xs cursor-pointer"
                    >
                      {order.status === 'delivered' ? 'View Details' : 'Track Order ⚡'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onReorder(order)}
                      className="px-4 py-2 rounded-xl bg-[#f1f8f4] hover:bg-[#caead6] text-[#00422b] text-[12px] font-bold border border-[#006c49]/30 cursor-pointer"
                    >
                      Reorder All
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist Section */}
      {activeSection === 'wishlist' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-[17px] font-extrabold text-[#141b2b]">
            My Wishlist ({wishlistProducts.length})
          </h2>

          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {wishlistProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  quantity={cartItemsMap[prod.id] || 0}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                  onOpenDetails={onOpenDetails}
                  isWishlisted={true}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#e6ecf5]">
              <div className="w-16 h-16 rounded-full bg-[#f1f8f4] text-[#ba1a1a] flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[32px]">favorite_border</span>
              </div>
              <h3 className="text-[16px] font-extrabold text-[#141b2b]">Your Wishlist is Empty</h3>
              <p className="text-[12px] text-[#5b6b62] mt-1">
                Tap the heart icon on any grocery item to save it for later.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Support & Store Info */}
      <div className="bg-white rounded-3xl p-5 border border-[#e6ecf5] shadow-xs flex flex-col gap-3">
        <h3 className="text-[14px] font-extrabold text-[#141b2b]">
          Sai Santosh Traders • Hyderabad Helpdesk
        </h3>
        <p className="text-[12px] text-[#5b6b62] leading-relaxed">
          Need help with your grocery delivery? Our Himayatnagar customer experience team is available 24/7.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
          <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#e6ecf5] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49]">call</span>
            <div>
              <span className="font-bold text-[#141b2b] block">Phone Support</span>
              <span className="text-[#5b6b62]">+91 040 2345 6789</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#f8fafc] border border-[#e6ecf5] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49]">mail</span>
            <div>
              <span className="font-bold text-[#141b2b] block">Email Support</span>
              <span className="text-[#5b6b62]">help@saisantoshtraders.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
