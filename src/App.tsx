/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  Address,
  Order,
  OrderStatus,
  Customer,
  CategoryId,
  NotificationItem,
  Coupon
} from './types';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  SAVED_ADDRESSES,
  INITIAL_NOTIFICATIONS,
  AVAILABLE_COUPONS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  HYDERABAD_LOCALITIES
} from './data/products';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoriesScreen } from './components/screens/CategoriesScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { CartScreen } from './components/screens/CartScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AddressModal } from './components/AddressModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { NotificationsModal } from './components/NotificationsModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { Toast } from './components/Toast';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { broadcastRealtimeEvent, subscribeToRealtimeEvents, normalizeOrderStatus } from './utils/realtime';

export default function App() {
  // Mode: 'customer' | 'admin'
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  // Customer Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('dairy');

  // Shared Central Datasets (Real-time synchronized)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // Cart Quantities map { [productId]: count }
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({
    'prod-amul-milk': 2,
    'prod-lays-chips': 1
  });

  // Wishlist product IDs
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'prod-amul-ghee',
    'prod-india-gate-rice',
    'prod-tata-sampann-toor-dal'
  ]);

  // Hyderabad Delivery Addresses
  const [addresses, setAddresses] = useState<Address[]>(SAVED_ADDRESSES);
  const [currentAddress, setCurrentAddress] = useState<Address>(SAVED_ADDRESSES[0]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Coupons & Pricing
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(AVAILABLE_COUPONS[0]);
  const [deliveryTip, setDeliveryTip] = useState<number>(10);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isVoiceSearchModalOpen, setIsVoiceSearchModalOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Toast feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // REAL-TIME EVENT BUS LISTENER
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeEvents((payload) => {
      if (payload.type === 'ORDER_STATUS_UPDATED') {
        setOrders(prev =>
          prev.map(ord => {
            if (ord.id === payload.orderId) {
              const updatedStatus = payload.newStatus || ord.status;
              return {
                ...ord,
                status: updatedStatus,
                ...(payload.order || {})
              };
            }
            return ord;
          })
        );
      } else if (payload.type === 'PRODUCT_STOCK_UPDATED') {
        setProducts(prev =>
          prev.map(p => {
            if (p.id === payload.productId) {
              return {
                ...p,
                stock: payload.newStock ?? p.stock,
                isOutOfStock: (payload.newStock ?? p.stock) <= 0
              };
            }
            return p;
          })
        );
      } else if (payload.type === 'NEW_ORDER_RECEIVED' && payload.order) {
        setOrders(prev => {
          if (prev.some(o => o.id === payload.order!.id)) return prev;
          return [payload.order!, ...prev];
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync trackingOrder state if it is updated in orders
  useEffect(() => {
    if (trackingOrder) {
      const updated = orders.find(o => o.id === trackingOrder.id);
      if (updated && updated.status !== trackingOrder.status) {
        setTrackingOrder(updated);
      }
    }
  }, [orders, trackingOrder]);

  // Cart Helper functions
  const handleAddToCart = (product: Product) => {
    if (product.stock !== undefined && product.stock <= 0) {
      setToastMessage(`Sorry, ${product.name} is currently out of stock.`);
      return;
    }
    const currentQty = cartQuantities[product.id] || 0;
    if (product.stock !== undefined && currentQty >= product.stock) {
      setToastMessage(`Only ${product.stock} units of ${product.name} available.`);
      return;
    }

    setCartQuantities(prev => ({
      ...prev,
      [product.id]: currentQty + 1
    }));
    setToastMessage(`✓ ${product.name} added to cart`);
  };

  const handleRemoveFromCart = (product: Product) => {
    setCartQuantities(prev => {
      const current = prev[product.id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[product.id];
        return next;
      }
      return {
        ...prev,
        [product.id]: current - 1
      };
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const prod = products.find(p => p.id === productId);
    if (prod && prod.stock !== undefined && quantity > prod.stock) {
      setToastMessage(`Only ${prod.stock} items available in stock.`);
      quantity = prod.stock;
    }

    if (quantity <= 0) {
      setCartQuantities(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } else {
      setCartQuantities(prev => ({
        ...prev,
        [productId]: quantity
      }));
    }
  };

  const handleClearCart = () => {
    setCartQuantities({});
    setToastMessage('Cart cleared');
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev => {
      const exists = prev.includes(product.id);
      if (exists) {
        setToastMessage(`Removed ${product.name} from Wishlist`);
        return prev.filter(id => id !== product.id);
      } else {
        setToastMessage(`❤️ Saved ${product.name} to Wishlist`);
        return [...prev, product.id];
      }
    });
  };

  // Derived Cart Items list
  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cartQuantities)
      .map(([id, qty]) => {
        const prod = products.find(p => p.id === id);
        const quantityNum = Number(qty) || 0;
        if (!prod || quantityNum <= 0) return null;
        return { product: prod, quantity: quantityNum };
      })
      .filter((item): item is CartItem => item !== null);
  }, [cartQuantities, products]);

  const totalCartCount = useMemo(() => {
    return Object.values(cartQuantities).reduce((acc: number, q: number) => acc + (q || 0), 0);
  }, [cartQuantities]);

  const wishlistedProducts = useMemo(() => {
    return products.filter(p => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Pricing calculations
  const itemTotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const totalOriginalPrice = cartItems.reduce(
    (acc, i) => acc + (i.product.originalPrice || i.product.mrp || i.product.price) * i.quantity,
    0
  );
  const productSavings = totalOriginalPrice - itemTotal;

  let couponDiscount = 0;
  if (appliedCoupon && itemTotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percent') {
      const calc = (itemTotal * appliedCoupon.discountValue) / 100;
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const isFreeDelivery = itemTotal >= 299;
  const deliveryFee = itemTotal === 0 ? 0 : (isFreeDelivery ? 0 : 25);
  const handlingFee = itemTotal === 0 ? 0 : 2;
  const grandTotal = Math.max(0, itemTotal - couponDiscount + deliveryFee + handlingFee + deliveryTip);

  // Buy Now flow
  const handleBuyNow = (product: Product) => {
    setSelectedProductDetails(null);
    setIsCheckoutModalOpen(true);
  };

  // Confirm order from Customer checkout
  const handleConfirmOrder = (newOrder: Order) => {
    // Add customer name and phone
    const fullOrder: Order = {
      ...newOrder,
      customerName: newOrder.customerName || 'Sai Santosh',
      customerPhone: newOrder.customerPhone || '+91 98450 12345',
      customerId: newOrder.customerId || 'cust-1'
    };

    setOrders(prev => [fullOrder, ...prev]);
    setCartQuantities({});
    setTrackingOrder(fullOrder);
    setToastMessage(`🎉 Order #${fullOrder.id} placed! Tracking live in Hyderabad.`);

    // Broadcast in real-time to admin dashboard
    broadcastRealtimeEvent({
      type: 'NEW_ORDER_RECEIVED',
      order: fullOrder
    });

    // Also deduct product stocks
    fullOrder.items.forEach(item => {
      setProducts(prevProds =>
        prevProds.map(p => {
          if (p.id === item.product.id) {
            const nextStock = Math.max(0, p.stock - item.quantity);
            return { ...p, stock: nextStock, isOutOfStock: nextStock <= 0 };
          }
          return p;
        })
      );
    });
  };

  // Reorder
  const handleReorder = (order: Order) => {
    const newCart: Record<string, number> = {};
    order.items.forEach(i => {
      newCart[i.product.id] = i.quantity;
    });
    setCartQuantities(newCart);
    setActiveTab('cart');
    setToastMessage(`Reordered ${order.items.length} items to cart!`);
  };

  // ADMIN DASHBOARD ACTIONS
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setViewMode('admin');
    setShowAdminLoginModal(false);
    setToastMessage('✓ Authenticated as Sai Santosh Admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setViewMode('customer');
    setToastMessage('Logged out from Admin Hub');
  };

  const handleUpdateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated: Order = {
            ...ord,
            status: newStatus
          };
          return updated;
        }
        return ord;
      })
    );

    // Broadcast real-time status update to all client listeners
    broadcastRealtimeEvent({
      type: 'ORDER_STATUS_UPDATED',
      orderId,
      newStatus
    });
  }, []);

  const handleUpdateProductStock = useCallback((productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            stock: newStock,
            isOutOfStock: newStock <= 0
          };
        }
        return p;
      })
    );

    // Broadcast real-time stock update
    broadcastRealtimeEvent({
      type: 'PRODUCT_STOCK_UPDATED',
      productId,
      newStock
    });
  }, []);

  const handleUpdateProductPrice = useCallback((productId: string, newPrice: number, newMrp?: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            price: newPrice,
            ...(newMrp ? { mrp: newMrp, originalPrice: newMrp } : {})
          };
        }
        return p;
      })
    );
  }, []);

  // Admin Quick Action: Simulate a live incoming customer order from Hyderabad
  const handleAddSimulatedOrder = () => {
    const randomLocality = HYDERABAD_LOCALITIES[Math.floor(Math.random() * HYDERABAD_LOCALITIES.length)];
    const randomCustomer = INITIAL_CUSTOMERS[Math.floor(Math.random() * INITIAL_CUSTOMERS.length)];
    const sampleItems = [
      { product: products[Math.floor(Math.random() * 10)], quantity: 1 },
      { product: products[10 + Math.floor(Math.random() * 10)], quantity: 2 }
    ];
    const itemSubtotal = sampleItems.reduce((a, b) => a + b.product.price * b.quantity, 0);

    const simulatedOrder: Order = {
      id: `SS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now (Live)',
      items: sampleItems,
      itemTotal: itemSubtotal,
      discount: 25,
      deliveryFee: 0,
      handlingFee: 2,
      deliveryTip: 10,
      grandTotal: Math.max(40, itemSubtotal - 25 + 2 + 10),
      customerId: randomCustomer.id,
      customerName: randomCustomer.name,
      customerPhone: randomCustomer.phone,
      address: {
        id: `addr-sim-${Date.now()}`,
        title: 'Home',
        recipientName: randomCustomer.name,
        phoneNumber: randomCustomer.phone,
        fullAddress: `Plot No. ${Math.floor(10 + Math.random() * 90)}, Street 4`,
        locality: randomLocality,
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        tag: 'Home',
        isDefault: true
      },
      status: 'ORDER PLACED',
      estimatedDeliveryTime: '15 mins',
      paymentMethod: 'UPI (PhonePe)',
      paymentStatus: 'PAID',
      riderName: 'Ravi Kumar',
      riderPhone: '+91 98480 34567',
      darkStore: `Sai Santosh Dark Store - ${randomLocality}`
    };

    setOrders(prev => [simulatedOrder, ...prev]);
    setToastMessage(`⚡ Incoming Live Order #${simulatedOrder.id} from ${randomLocality}, Hyderabad!`);

    broadcastRealtimeEvent({
      type: 'NEW_ORDER_RECEIVED',
      order: simulatedOrder
    });
  };

  // IF IN ADMIN MODE & LOGGED IN: Render full Admin Dashboard
  if (viewMode === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        orders={orders}
        products={products}
        customers={customers}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateProductStock={handleUpdateProductStock}
        onUpdateProductPrice={handleUpdateProductPrice}
        onLogout={handleAdminLogout}
        onSwitchToCustomerStore={() => setViewMode('customer')}
        onAddSimulatedOrder={handleAddSimulatedOrder}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#141b2b] flex flex-col items-center justify-start selection:bg-[#caead6] selection:text-[#00422b]">
      {/* Top Header */}
      <Header
        currentAddress={currentAddress}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setViewMode('admin');
          } else {
            setShowAdminLoginModal(true);
          }
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        notifications={notifications}
      />

      {/* Main Screen Router */}
      <main className="flex-1 pt-18 sm:pt-20 w-full">
        {activeTab === 'home' && (
          <HomeScreen
            categories={CATEGORIES}
            products={products}
            currentAddress={currentAddress}
            cartItemsMap={cartQuantities}
            wishlistIds={wishlistIds}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenDetails={(p) => setSelectedProductDetails(p)}
            onToggleWishlist={handleToggleWishlist}
            onSelectCategory={(catId) => {
              setSelectedCategoryId(catId);
              setActiveTab('categories');
            }}
            onSearchClick={() => setActiveTab('search')}
            onVoiceSearchClick={() => setIsVoiceSearchModalOpen(true)}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesScreen
            categories={CATEGORIES}
            products={products}
            selectedCategoryId={selectedCategoryId}
            cartItemsMap={cartQuantities}
            wishlistIds={wishlistIds}
            onSelectCategory={setSelectedCategoryId}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenDetails={(p) => setSelectedProductDetails(p)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeTab === 'search' && (
          <SearchScreen
            products={products}
            categories={CATEGORIES}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cartItemsMap={cartQuantities}
            wishlistIds={wishlistIds}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenDetails={(p) => setSelectedProductDetails(p)}
            onToggleWishlist={handleToggleWishlist}
            onVoiceSearchClick={() => setIsVoiceSearchModalOpen(true)}
          />
        )}

        {activeTab === 'cart' && (
          <CartScreen
            cartItems={cartItems}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
            deliveryTip={deliveryTip}
            onSetDeliveryTip={setDeliveryTip}
            onUpdateQuantity={handleUpdateCartQuantity}
            onClearCart={handleClearCart}
            onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
            onContinueShopping={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            currentAddress={currentAddress}
            orders={orders}
            wishlistProducts={wishlistedProducts}
            cartItemsMap={cartQuantities}
            onTrackOrder={(order) => setTrackingOrder(order)}
            onReorder={handleReorder}
            onOpenAddressModal={() => setIsAddressModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsModalOpen(true)}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenDetails={(p) => setSelectedProductDetails(p)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartItemCount={totalCartCount}
      />

      {/* Floating Micro-interaction Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        onViewCart={totalCartCount > 0 ? () => setActiveTab('cart') : undefined}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetails}
        quantity={selectedProductDetails ? cartQuantities[selectedProductDetails.id] || 0 : 0}
        onClose={() => setSelectedProductDetails(null)}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onBuyNow={handleBuyNow}
        similarProducts={
          selectedProductDetails
            ? products.filter(
                p => (p.category || p.categoryId) === (selectedProductDetails.category || selectedProductDetails.categoryId) && p.id !== selectedProductDetails.id
              )
            : []
        }
        onSelectSimilarProduct={(sim) => setSelectedProductDetails(sim)}
      />

      {/* Delivery Location Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        currentAddress={currentAddress}
        onSelectAddress={setCurrentAddress}
        onAddNewAddress={(newAddr) => setAddresses(prev => [newAddr, ...prev])}
        onDeleteAddress={(addrId) => setAddresses(prev => prev.filter(a => a.id !== addrId))}
        onSetDefaultAddress={(addrId) =>
          setAddresses(prev =>
            prev.map(a => ({ ...a, isDefault: a.id === addrId }))
          )
        }
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        currentAddress={currentAddress}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        appliedCoupon={appliedCoupon}
        discountAmount={couponDiscount}
        deliveryFee={deliveryFee}
        handlingFee={handlingFee}
        deliveryTip={deliveryTip}
        grandTotal={grandTotal}
        itemTotal={itemTotal}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
      />

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceSearchModalOpen}
        onClose={() => setIsVoiceSearchModalOpen(false)}
        onSelectQuery={(q) => {
          setSearchQuery(q);
          setActiveTab('search');
        }}
      />

      {/* Admin Login Modal */}
      {showAdminLoginModal && (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onCancel={() => setShowAdminLoginModal(false)}
        />
      )}
    </div>
  );
}
