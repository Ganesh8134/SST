import React, { useState, useMemo } from 'react';
import {
  Order,
  OrderStatus,
  Product,
  Customer,
  CategoryId,
  Address
} from '../../types';
import { CATEGORIES, HYDERABAD_LOCALITIES } from '../../data/products';
import { normalizeOrderStatus, broadcastRealtimeEvent } from '../../utils/realtime';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onUpdateProductPrice: (productId: string, newPrice: number, newMrp?: number) => void;
  onLogout: () => void;
  onSwitchToCustomerStore: () => void;
  onAddSimulatedOrder?: () => void;
}

type AdminTab = 'orders' | 'customers' | 'inventory' | 'darkstores';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  customers,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onUpdateProductPrice,
  onLogout,
  onSwitchToCustomerStore,
  onAddSimulatedOrder
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState<CategoryId | 'all'>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Status progression map
  const STATUS_FLOW: OrderStatus[] = [
    'ORDER PLACED',
    'ORDER CONFIRMED',
    'ORDER BEING PACKED',
    'READY FOR DELIVERY',
    'OUT FOR DELIVERY',
    'DELIVERED'
  ];

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const norm = normalizeOrderStatus(current);
    const idx = STATUS_FLOW.findIndex(s => s === norm);
    if (idx >= 0 && idx < STATUS_FLOW.length - 1) {
      return STATUS_FLOW[idx + 1];
    }
    return null;
  };

  // KPI Computations
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const todayOrders = orders.filter(o => o.date.includes('Today') || o.date.includes('mins')).length;
    const pendingOrders = orders.filter(o => {
      const n = normalizeOrderStatus(o.status);
      return n === 'ORDER PLACED' || n === 'ORDER CONFIRMED' || n === 'ORDER BEING PACKED';
    }).length;
    const confirmedOrders = orders.filter(o => normalizeOrderStatus(o.status) === 'ORDER CONFIRMED').length;
    const outForDelivery = orders.filter(o => normalizeOrderStatus(o.status) === 'OUT FOR DELIVERY').length;
    const deliveredOrders = orders.filter(o => normalizeOrderStatus(o.status) === 'DELIVERED').length;
    const cancelledOrders = orders.filter(o => normalizeOrderStatus(o.status) === 'CANCELLED').length;
    const totalRevenue = orders
      .filter(o => normalizeOrderStatus(o.status) !== 'CANCELLED')
      .reduce((acc, o) => acc + o.grandTotal, 0);

    return {
      totalOrders,
      todayOrders,
      pendingOrders,
      confirmedOrders,
      outForDelivery,
      deliveredOrders,
      cancelledOrders,
      totalCustomers: customers.length,
      totalRevenue
    };
  }, [orders, customers]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const norm = normalizeOrderStatus(order.status);
      if (orderFilter !== 'all') {
        if (orderFilter === 'pending') {
          if (norm !== 'ORDER PLACED' && norm !== 'ORDER CONFIRMED' && norm !== 'ORDER BEING PACKED') return false;
        } else if (orderFilter === 'out_for_delivery') {
          if (norm !== 'OUT FOR DELIVERY') return false;
        } else if (orderFilter === 'delivered') {
          if (norm !== 'DELIVERED') return false;
        } else if (orderFilter === 'cancelled') {
          if (norm !== 'CANCELLED') return false;
        }
      }

      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = order.id.toLowerCase().includes(q);
        const matchName = order.customerName.toLowerCase().includes(q);
        const matchPhone = order.customerPhone.includes(q);
        const matchLocality = order.address.locality.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchLocality) return false;
      }

      return true;
    });
  }, [orders, orderFilter, orderSearchQuery]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return products.filter(p => {
      if (inventoryCategory !== 'all' && p.category !== inventoryCategory) {
        return false;
      }
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchSku) return false;
      }
      return true;
    });
  }, [products, inventoryCategory, inventorySearch]);

  const handleAdvanceStatus = (order: Order) => {
    const next = getNextStatus(order.status);
    if (next) {
      onUpdateOrderStatus(order.id, next);
      setStatusToast(`Order #${order.id} status updated to "${next}"`);
      setTimeout(() => setStatusToast(null), 3000);
    }
  };

  const handleManualStatusChange = (orderId: string, status: OrderStatus) => {
    onUpdateOrderStatus(orderId, status);
    setStatusToast(`Order #${orderId} status changed to "${status}"`);
    setTimeout(() => setStatusToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#090e17] text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0d1522]/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Hub details */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <span className="material-symbols-outlined text-[24px]">dashboard</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  Sai Santosh Admin
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Dispatch
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Hyderabad Fulfillment Hub • 10 Dark Stores Online
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onAddSimulatedOrder && (
              <button
                type="button"
                onClick={onAddSimulatedOrder}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                title="Generate a realistic Hyderabad customer order to test real-time flow"
              >
                <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                <span>+ Simulate Order</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSwitchToCustomerStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-teal-400">storefront</span>
              <span className="hidden sm:inline">View Customer Store</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-semibold border border-red-800/50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Real-time Status Toast */}
        {statusToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="text-sm font-semibold">{statusToast}</span>
          </div>
        )}

        {/* 9 Metrics KPI Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Orders</span>
              <span className="material-symbols-outlined text-slate-500 text-[18px]">receipt_long</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">{stats.totalOrders}</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">All Hyderabad orders</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Today's Orders</span>
              <span className="material-symbols-outlined text-teal-400 text-[18px]">today</span>
            </div>
            <div className="text-2xl font-extrabold text-teal-300 mt-2">{stats.todayOrders}</div>
            <div className="text-[11px] text-slate-400 mt-1">Live active count</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Pending / Packing</span>
              <span className="material-symbols-outlined text-amber-400 text-[18px]">pending_actions</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-300 mt-2">{stats.pendingOrders}</div>
            <div className="text-[11px] text-amber-400/80 mt-1">Needs packing/dispatch</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Out for Delivery</span>
              <span className="material-symbols-outlined text-blue-400 text-[18px]">two_wheeler</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-300 mt-2">{stats.outForDelivery}</div>
            <div className="text-[11px] text-blue-400/80 mt-1">Riders on road</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Revenue</span>
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">payments</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-300 mt-2">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-emerald-400/80 mt-1">{stats.deliveredOrders} orders delivered</div>
          </div>
        </section>

        {/* Secondary KPI Bar (Delivered, Cancelled, Customers) */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold">Delivered Orders:</span>
            <span className="font-bold text-white">{stats.deliveredOrders}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="font-semibold">Cancelled:</span>
            <span className="font-bold text-white">{stats.cancelledOrders}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="font-semibold">Registered Customers:</span>
            <span className="font-bold text-white">{stats.totalCustomers}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="font-semibold">Catalog SKUs:</span>
            <span className="font-bold text-white">{products.length} Products (6 Categories)</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-800 flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Live Order Management</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === 'orders' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
            }`}>
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            <span>Customer Profiles & Insights</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === 'customers' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
            }`}>
              {customers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory</span>
            <span>Inventory & Stock Manager</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              activeTab === 'inventory' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('darkstores')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'darkstores'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
            <span>Hyderabad Dark Stores Hub</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDER MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'pending', label: 'Pending / Packing' },
                  { id: 'out_for_delivery', label: 'Out for Delivery' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'cancelled', label: 'Cancelled' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOrderFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      orderFilter === tab.id
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Customer, Area..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Orders List Table / Cards */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center">
                  <span className="material-symbols-outlined text-slate-600 text-[48px] mb-2">inbox</span>
                  <h3 className="text-base font-bold text-slate-300">No orders found</h3>
                  <p className="text-xs text-slate-500 mt-1">Try changing filter criteria or place a test order.</p>
                </div>
              ) : (
                filteredOrders.map(order => {
                  const norm = normalizeOrderStatus(order.status);
                  const next = getNextStatus(order.status);

                  return (
                    <div
                      key={order.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-emerald-400 font-extrabold text-sm sm:text-base">
                            #{order.id}
                          </span>
                          <span className="text-xs text-slate-400">• {order.date}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                            {order.darkStore || 'Dark Store #04 - Himayatnagar'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            norm === 'DELIVERED'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : norm === 'OUT FOR DELIVERY'
                              ? 'bg-blue-950 text-blue-300 border-blue-800 animate-pulse'
                              : norm === 'ORDER BEING PACKED'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : norm === 'CANCELLED'
                              ? 'bg-red-950 text-red-300 border-red-800'
                              : 'bg-teal-950 text-teal-300 border-teal-800'
                          }`}>
                            {norm}
                          </span>

                          <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                            {order.paymentMethod} • {order.paymentStatus || 'PAID'}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Customer Details, Address, Items & Pricing */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Customer & Address */}
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 space-y-1.5">
                          <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            Customer & Delivery Address
                          </div>
                          <div className="font-bold text-white text-sm">{order.customerName}</div>
                          <div className="text-slate-400 flex items-center gap-1 font-mono">
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            {order.customerPhone}
                          </div>
                          <div className="text-slate-300 text-[11px] pt-1 border-t border-slate-800/60">
                            📍 <span className="font-semibold text-emerald-400">{order.address.locality}, Hyderabad</span> - {order.address.fullAddress} ({order.address.pincode})
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 space-y-2">
                          <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <span>Items Ordered ({order.items.reduce((a, b) => a + b.quantity, 0)})</span>
                            <span className="text-emerald-400">₹{order.grandTotal}</span>
                          </div>
                          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-2 truncate">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-6 h-6 object-cover rounded shrink-0 border border-slate-700"
                                  />
                                  <span className="text-slate-200 truncate">{item.product.name}</span>
                                </div>
                                <span className="text-slate-400 font-mono shrink-0 ml-2">
                                  {item.quantity}x ₹{item.product.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rider & Speed Details */}
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              Assigned Delivery Partner
                            </div>
                            <div className="font-bold text-white text-sm mt-1 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-emerald-400 text-[18px]">two_wheeler</span>
                              {order.riderName || 'Suresh Reddy'}
                            </div>
                            <div className="text-slate-400 text-[11px] font-mono">
                              {order.riderPhone || '+91 98450 78901'}
                            </div>
                          </div>

                          <div className="text-[11px] text-teal-300 font-semibold bg-teal-950/50 px-2 py-1 rounded border border-teal-800/40">
                            ⏱️ ETA: {order.estimatedDeliveryTime || '15 mins'}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions: Advance Status & Manual Selector */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                        {/* Status Manual Dropdown */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400 font-semibold">Change Status:</span>
                          <select
                            value={norm}
                            onChange={(e) => handleManualStatusChange(order.id, e.target.value as OrderStatus)}
                            className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="ORDER PLACED">ORDER PLACED</option>
                            <option value="ORDER CONFIRMED">ORDER CONFIRMED</option>
                            <option value="ORDER BEING PACKED">ORDER BEING PACKED</option>
                            <option value="READY FOR DELIVERY">READY FOR DELIVERY</option>
                            <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>

                        {/* One-Click Advance Button */}
                        {next && norm !== 'DELIVERED' && norm !== 'CANCELLED' ? (
                          <button
                            type="button"
                            onClick={() => handleAdvanceStatus(order)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer ml-auto"
                          >
                            <span>Advance to: <strong>{next}</strong></span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </button>
                        ) : norm === 'DELIVERED' ? (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 ml-auto">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Order Completed & Delivered
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CUSTOMERS & ORDER INSIGHTS */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white">Registered Customers Who Placed Orders</h3>
                <p className="text-xs text-slate-400">View customer lifetime orders, total spent, contact and delivery addresses</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                {customers.length} Active Profiles
              </span>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map(customer => {
                const customerOrders = orders.filter(o => o.customerId === customer.id || o.customerPhone === customer.phone);
                const totalSpent = customerOrders.reduce((acc, o) => acc + o.grandTotal, 0) || customer.totalSpent;

                return (
                  <div
                    key={customer.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white flex items-center justify-center font-black text-lg shadow-md">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{customer.name}</h4>
                          <p className="text-xs text-slate-400">{customer.email}</p>
                          <p className="text-xs font-mono text-emerald-400">{customer.phone}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Orders</div>
                        <div className="text-base font-extrabold text-white">{customerOrders.length || customer.totalOrders}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Spent</div>
                        <div className="text-base font-extrabold text-emerald-400">₹{totalSpent.toLocaleString('en-IN')}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Last Order</div>
                        <div className="text-[11px] font-semibold text-slate-300 mt-1 truncate">{customer.lastOrderDate}</div>
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="text-xs text-slate-400 pt-1">
                      <span className="font-semibold text-slate-300">Saved Address: </span>
                      {customer.addresses[0]?.locality || 'Himayatnagar'}, Hyderabad - {customer.addresses[0]?.fullAddress}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INVENTORY & STOCK MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Inventory Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
              {/* Category selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setInventoryCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    inventoryCategory === 'all'
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All (60 SKUs)
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setInventoryCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      inventoryCategory === cat.id
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search product name, brand, SKU..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Inventory SKUs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredInventory.map(product => (
                <div
                  key={product.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex gap-3 items-center justify-between hover:border-slate-700 transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0 border border-slate-700 bg-white"
                  />

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
                      <span className="text-[10px] font-mono text-slate-500">{product.sku}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                    <div className="text-[11px] text-slate-400">{product.weight}</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">
                      ₹{product.price} <span className="text-slate-500 line-through font-normal text-[10px]">₹{product.mrp}</span>
                    </div>
                  </div>

                  {/* Real-time Stock Editor */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.stock <= 0
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : product.stock < 10
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {product.stock <= 0 ? 'OUT OF STOCK' : `${product.stock} in stock`}
                    </span>

                    <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => onUpdateProductStock(product.id, Math.max(0, product.stock - 5))}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                        title="Reduce stock by 5"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(e) => onUpdateProductStock(product.id, Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-12 text-center text-xs font-bold bg-transparent text-white focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => onUpdateProductStock(product.id, product.stock + 10)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center justify-center cursor-pointer"
                        title="Add +10 stock"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: HYDERABAD DARK STORES HUB */}
        {/* ======================================================== */}
        {activeTab === 'darkstores' && (
          <div className="space-y-4">
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-extrabold text-white">Hyderabad Hyperlocal Dark Store Network</h3>
              <p className="text-xs text-slate-400">10 Active Fulfillment Centers powering 12–15 min quick grocery deliveries</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {HYDERABAD_LOCALITIES.slice(0, 10).map((locality, idx) => (
                <div
                  key={locality}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">
                      Dark Store #{String(idx + 1).padStart(2, '0')} - {locality}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="text-xs text-slate-400">
                    📍 {locality}, Hyderabad, Telangana
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">Avg Delivery</div>
                      <div className="font-bold text-teal-300">12.4 Mins</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Fleet Active</div>
                      <div className="font-bold text-emerald-400">14 Riders</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-lg">Customer Profile: {selectedCustomer.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-300"><strong>Mobile:</strong> {selectedCustomer.phone}</div>
              <div className="text-slate-300"><strong>Email:</strong> {selectedCustomer.email}</div>
              <div className="text-slate-300"><strong>Customer Since:</strong> {selectedCustomer.joinedDate}</div>
              <div className="text-slate-300"><strong>Saved Address:</strong> {selectedCustomer.addresses[0]?.fullAddress}, {selectedCustomer.addresses[0]?.locality}, Hyderabad</div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Order History Breakdown</h4>
              <div className="space-y-2">
                {orders.filter(o => o.customerId === selectedCustomer.id || o.customerPhone === selectedCustomer.phone).map(ord => (
                  <div key={ord.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono text-emerald-400 font-bold">#{ord.id}</span> • {ord.date}
                      <div className="text-[11px] text-slate-400">{ord.items.length} items • {ord.paymentMethod}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">₹{ord.grandTotal}</div>
                      <span className="text-[10px] text-teal-400 font-semibold">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
