import React, { useState } from 'react';
import { Address, Order, Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface ProfileScreenProps {
  currentAddress: Address;
  customerName?: string;
  customerPhone?: string;
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
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentAddress,
  customerName = 'Sai Santosh',
  customerPhone = '+91 98450 12345',
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
  onToggleWishlist,
  onLogout
}) => {
  const [activeSection, setActiveSection] = useState<'orders' | 'wishlist' | 'settings' | 'support'>('orders');

  const initials = customerName
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SS';

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 animate-fade-in flex flex-col gap-5 pt-2">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-[#00422b] to-[#006c49] text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-[24px] font-black shadow-inner border border-white/30">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-black">{customerName}</h1>
              <span className="text-[10px] font-extrabold bg-[#caead6] text-[#00422b] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active Member
              </span>
            </div>
            <p className="text-[12px] text-white/80 mt-0.5">
              {customerPhone} • {customerName.toLowerCase().replace(/\s+/g, '')}@example.com
            </p>
            <p className="text-[11px] text-[#4edea3] font-bold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {currentAddress.locality}, Hyderabad, Telangana
            </p>
          </div>
        </div>

        {/* Quick stat pill & Logout */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
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

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 transition-all cursor-pointer flex items-center gap-1.5"
            title="Log out back to Landing Page"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Logout</span>
          </button>
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
          <div className="w-9 h-9 rounded-xl bg-[#f1f3ff] text-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </div>
          <div>
            <span className="text-[12px] font-extrabold text-[#141b2b] block">Wishlist</span>
            <span className="text-[10px] text-[#5b6b62]">{wishlistProducts.length} Saved items</span>
          </div>
        </button>

        <button
          onClick={onOpenAddressModal}
          className="p-3.5 rounded-2xl border text-left bg-white border-[#e6ecf5] hover:bg-[#f1f8f4] transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#f1f3ff] text-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">pin_drop</span>
          </div>
          <div>
            <span className="text-[12px] font-extrabold text-[#141b2b] block">Addresses</span>
            <span className="text-[10px] text-[#5b6b62]">{currentAddress.locality}, Hyd</span>
          </div>
        </button>

        <button
          onClick={onOpenNotifications}
          className="p-3.5 rounded-2xl border text-left bg-white border-[#e6ecf5] hover:bg-[#f1f8f4] transition-all cursor-pointer flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#f1f3ff] text-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </div>
          <div>
            <span className="text-[12px] font-extrabold text-[#141b2b] block">Notifications</span>
            <span className="text-[10px] text-[#5b6b62]">Order updates</span>
          </div>
        </button>
      </div>

      {/* Orders Section */}
      {activeSection === 'orders' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold text-[#141b2b]">
              Order History & Tracking
            </h2>
            <span className="text-[12px] font-semibold text-[#5b6b62]">
              {orders.length} Total Orders
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-[#e6ecf5] shadow-xs space-y-3"
              >
                {/* Top status bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6ecf5] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] font-black text-[#006c49]">
                      #{order.id}
                    </span>
                    <span className="text-[12px] text-[#5b6b62]">• {order.date}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      order.status === 'delivered' || (order.status as string) === 'DELIVERED'
                        ? 'bg-[#caead6] text-[#00422b]'
                        : order.status === 'out_for_delivery' || (order.status as string) === 'OUT FOR DELIVERY'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-xl border border-[#e6ecf5] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-[#141b2b] block truncate">
                            {item.product.name}
                          </span>
                          <span className="text-[11px] text-[#5b6b62]">
                            Qty: {item.quantity} • {item.product.weight}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#141b2b] shrink-0">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Address and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#e6ecf5]">
                  <span className="text-[11px] text-[#5b6b62]">
                    📍 Delivered to {order.address.locality}, Hyderabad ({order.address.tag})
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onTrackOrder(order)}
                      className="px-4 py-2 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white text-[12px] font-bold shadow-xs cursor-pointer"
                    >
                      {order.status === 'delivered' || (order.status as string) === 'DELIVERED' ? 'View Receipt' : 'Track Live ⚡'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onReorder(order)}
                      className="px-4 py-2 rounded-xl bg-[#f1f8f4] hover:bg-[#caead6] text-[#00422b] text-[12px] font-bold border border-[#006c49]/30 cursor-pointer"
                    >
                      Reorder
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
