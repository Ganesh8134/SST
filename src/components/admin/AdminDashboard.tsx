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
  onAddProduct?: (newProduct: Product) => void;
  onEditProduct?: (updatedProduct: Product) => void;
  onDeleteProduct?: (productId: string) => void;
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
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onLogout,
  onSwitchToCustomerStore,
  onAddSimulatedOrder
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  
  // Order search & filtering
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderDateFilter, setOrderDateFilter] = useState<string>('all');

  // Customer search & detail view
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Inventory filtering & modals
  const [inventoryCategory, setInventoryCategory] = useState<CategoryId | 'all'>('all');
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryId>('dairy');
  const [newProdWeight, setNewProdWeight] = useState('500 g');
  const [newProdPrice, setNewProdPrice] = useState(50);
  const [newProdMrp, setNewProdMrp] = useState(60);
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80');

  // Real-time Status feedback toast
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Status progression flow
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

  // Comprehensive KPI Computations (10 metrics)
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const todayOrders = orders.filter(o => o.date.includes('Today') || o.date.includes('mins') || o.date.includes('Live')).length;
    const pendingOrders = orders.filter(o => {
      const n = normalizeOrderStatus(o.status);
      return n === 'ORDER PLACED';
    }).length;
    const confirmedOrders = orders.filter(o => normalizeOrderStatus(o.status) === 'ORDER CONFIRMED').length;
    const packingOrders = orders.filter(o => normalizeOrderStatus(o.status) === 'ORDER BEING PACKED' || normalizeOrderStatus(o.status) === 'READY FOR DELIVERY').length;
    const outForDelivery = orders.filter(o => normalizeOrderStatus(o.status) === 'OUT FOR DELIVERY').length;
    const deliveredOrders = orders.filter(o => normalizeOrderStatus(o.status) === 'DELIVERED').length;
    const cancelledOrders = orders.filter(o => normalizeOrderStatus(o.status) === 'CANCELLED').length;
    const totalCustomers = customers.length;
    const totalRevenue = orders
      .filter(o => normalizeOrderStatus(o.status) !== 'CANCELLED')
      .reduce((acc, o) => acc + o.grandTotal, 0);

    return {
      totalOrders,
      todayOrders,
      pendingOrders,
      confirmedOrders,
      packingOrders,
      outForDelivery,
      deliveredOrders,
      cancelledOrders,
      totalCustomers,
      totalRevenue
    };
  }, [orders, customers]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const norm = normalizeOrderStatus(order.status);
      
      // Status filter
      if (orderFilter !== 'all') {
        if (orderFilter === 'pending' && norm !== 'ORDER PLACED') return false;
        if (orderFilter === 'confirmed' && norm !== 'ORDER CONFIRMED') return false;
        if (orderFilter === 'packing' && norm !== 'ORDER BEING PACKED' && norm !== 'READY FOR DELIVERY') return false;
        if (orderFilter === 'out_for_delivery' && norm !== 'OUT FOR DELIVERY') return false;
        if (orderFilter === 'delivered' && norm !== 'DELIVERED') return false;
        if (orderFilter === 'cancelled' && norm !== 'CANCELLED') return false;
      }

      // Search by Customer Name, Mobile, Order ID, Date, Status
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchId = order.id.toLowerCase().includes(q);
        const matchName = order.customerName.toLowerCase().includes(q);
        const matchPhone = (order.customerPhone || '').includes(q);
        const matchLocality = order.address.locality.toLowerCase().includes(q);
        const matchStatus = norm.toLowerCase().includes(q);
        const matchDate = order.date.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchLocality && !matchStatus && !matchDate) {
          return false;
        }
      }

      return true;
    });
  }, [orders, orderFilter, orderSearchQuery]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (!customerSearchQuery.trim()) return true;
      const q = customerSearchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchEmail = (c.email || '').toLowerCase().includes(q);
      const matchLocality = c.addresses.some(a => a.locality.toLowerCase().includes(q));
      return matchName || matchPhone || matchEmail || matchLocality;
    });
  }, [customers, customerSearchQuery]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return products.filter(p => {
      const pCat = p.category || p.categoryId;
      if (inventoryCategory !== 'all' && pCat !== inventoryCategory) {
        return false;
      }

      // Stock status filter
      if (inventoryStockFilter === 'in_stock' && p.stock < 10) return false;
      if (inventoryStockFilter === 'low_stock' && (p.stock <= 0 || p.stock >= 10)) return false;
      if (inventoryStockFilter === 'out_of_stock' && p.stock > 0) return false;

      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchSku) return false;
      }
      return true;
    });
  }, [products, inventoryCategory, inventoryStockFilter, inventorySearch]);

  // Advance order status handler
  const handleAdvanceStatus = (order: Order) => {
    const next = getNextStatus(order.status);
    if (next) {
      onUpdateOrderStatus(order.id, next);
      setStatusToast(`✓ Order #${order.id} updated to "${next}" (Broadcast live to customer)`);
      setTimeout(() => setStatusToast(null), 3500);
    }
  };

  const handleManualStatusChange = (orderId: string, status: OrderStatus) => {
    onUpdateOrderStatus(orderId, status);
    setStatusToast(`✓ Order #${orderId} status changed to "${status}"`);
    setTimeout(() => setStatusToast(null), 3500);
  };

  // Add Product Submit
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const discountCalc = Math.max(0, Math.round(((newProdMrp - newProdPrice) / newProdMrp) * 100));
    const created: Product = {
      id: `prod-custom-${Date.now()}`,
      name: newProdName.trim(),
      brand: newProdBrand.trim() || 'Sai Santosh Select',
      category: newProdCategory,
      categoryId: newProdCategory,
      categoryName: CATEGORIES.find(c => c.id === newProdCategory)?.name || 'Dairy',
      weight: newProdWeight,
      mrp: newProdMrp,
      sellingPrice: newProdPrice,
      price: newProdPrice,
      originalPrice: newProdMrp,
      discount: discountCalc,
      discountPercentage: discountCalc,
      stock: newProdStock,
      sku: `SKU-${newProdCategory.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      availability: newProdStock > 10 ? 'in_stock' : newProdStock > 0 ? 'low_stock' : 'out_of_stock',
      rating: 4.8,
      reviewCount: 1,
      image: newProdImage,
      description: `Quality ${newProdName} delivered fresh by Sai Santosh Traders in Hyderabad.`,
      tags: [newProdCategory, 'grocery', 'hyderabad']
    };

    if (onAddProduct) {
      onAddProduct(created);
    }
    setIsAddProductModalOpen(false);
    setNewProdName('');
    setStatusToast(`✓ Added product "${created.name}" to inventory`);
    setTimeout(() => setStatusToast(null), 3500);
  };

  // Edit Product Submit
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (onEditProduct) {
      onEditProduct(editingProduct);
    }
    setEditingProduct(null);
    setStatusToast(`✓ Updated product "${editingProduct.name}"`);
    setTimeout(() => setStatusToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#090e17] text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0d1522]/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Fulfillment Center */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <span className="material-symbols-outlined text-[24px]">dashboard</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  Sai Santosh Traders
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ADMIN DASHBOARD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Hyderabad Fulfillment Hub • 10 Dark Stores Connected
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onAddSimulatedOrder && (
              <button
                type="button"
                onClick={onAddSimulatedOrder}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                title="Generate an incoming simulated live order from Hyderabad"
              >
                <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                <span>+ Simulate Live Order</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSwitchToCustomerStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-teal-400">storefront</span>
              <span className="hidden sm:inline">Customer Store</span>
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
        {/* Real-time Status Toast Notification */}
        {statusToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-emerald-400">sync_alt</span>
            <span className="text-sm font-semibold">{statusToast}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* 10 KPI STATS CARDS GRID */}
        {/* ======================================================== */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Total Orders */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Orders</span>
              <span className="material-symbols-outlined text-slate-500 text-[18px]">receipt_long</span>
            </div>
            <div className="text-2xl font-black text-white mt-2">{stats.totalOrders}</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">Lifetime orders</div>
          </div>

          {/* Today's Orders */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Today's Orders</span>
              <span className="material-symbols-outlined text-teal-400 text-[18px]">today</span>
            </div>
            <div className="text-2xl font-black text-teal-300 mt-2">{stats.todayOrders}</div>
            <div className="text-[11px] text-slate-400 mt-1">Live active today</div>
          </div>

          {/* Pending Orders */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Pending</span>
              <span className="material-symbols-outlined text-amber-400 text-[18px]">hourglass_empty</span>
            </div>
            <div className="text-2xl font-black text-amber-300 mt-2">{stats.pendingOrders}</div>
            <div className="text-[11px] text-amber-400/80 mt-1">Awaiting confirmation</div>
          </div>

          {/* Confirmed Orders */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Confirmed</span>
              <span className="material-symbols-outlined text-cyan-400 text-[18px]">check_circle</span>
            </div>
            <div className="text-2xl font-black text-cyan-300 mt-2">{stats.confirmedOrders}</div>
            <div className="text-[11px] text-cyan-400/80 mt-1">Sent to packing</div>
          </div>

          {/* Packing */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Packing</span>
              <span className="material-symbols-outlined text-purple-400 text-[18px]">inventory_2</span>
            </div>
            <div className="text-2xl font-black text-purple-300 mt-2">{stats.packingOrders}</div>
            <div className="text-[11px] text-purple-400/80 mt-1">At dark store hub</div>
          </div>

          {/* Out for Delivery */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Out for Delivery</span>
              <span className="material-symbols-outlined text-blue-400 text-[18px]">two_wheeler</span>
            </div>
            <div className="text-2xl font-black text-blue-300 mt-2">{stats.outForDelivery}</div>
            <div className="text-[11px] text-blue-400/80 mt-1">Riders on road</div>
          </div>

          {/* Delivered */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Delivered</span>
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">task_alt</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">{stats.deliveredOrders}</div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Completed successfully</div>
          </div>

          {/* Cancelled */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Cancelled</span>
              <span className="material-symbols-outlined text-red-400 text-[18px]">cancel</span>
            </div>
            <div className="text-2xl font-black text-red-400 mt-2">{stats.cancelledOrders}</div>
            <div className="text-[11px] text-red-400/80 mt-1">Refunded / rejected</div>
          </div>

          {/* Revenue */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Revenue</span>
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">payments</span>
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-2">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Gross sales total</div>
          </div>

          {/* Total Customers */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Customers</span>
              <span className="material-symbols-outlined text-indigo-400 text-[18px]">groups</span>
            </div>
            <div className="text-2xl font-black text-indigo-300 mt-2">{stats.totalCustomers}</div>
            <div className="text-[11px] text-indigo-400/80 mt-1">Registered Hyderabad users</div>
          </div>
        </section>

        {/* Tab Selector */}
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
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Orders Management</span>
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
            <span>Customers & Order History</span>
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
            <span>Inventory & Products</span>
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
        {/* TAB 1: RECENT ORDERS TABLE & LIVE STATUS DISPATCH */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter and Search controls */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'packing', label: 'Packing' },
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

              {/* Search Bar (Customer Name, Mobile, Order ID, Date, Status) */}
              <div className="relative min-w-[280px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by customer name, mobile, order ID, date, status..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* RECENT ORDERS TABLE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Mobile</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Address</th>
                      <th className="py-3 px-4">Order Time</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action / Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-500">
                          No orders matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => {
                        const norm = normalizeOrderStatus(order.status);
                        const next = getNextStatus(order.status);

                        return (
                          <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                              #{order.id}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                              {order.customerName}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                              {order.customerPhone}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                              <span className="font-semibold">{order.items.reduce((a, b) => a + b.quantity, 0)} items</span>
                              <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                                {order.items.map(i => i.product.name).join(', ')}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                              ₹{order.grandTotal}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-300">
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                              <span className="font-semibold text-emerald-400">{order.address.locality}</span>
                              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                {order.address.fullAddress}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                              {order.date}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border inline-block ${
                                norm === 'DELIVERED'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : norm === 'OUT FOR DELIVERY'
                                  ? 'bg-blue-950 text-blue-300 border-blue-800 animate-pulse'
                                  : norm === 'ORDER BEING PACKED' || norm === 'READY FOR DELIVERY'
                                  ? 'bg-purple-950 text-purple-300 border-purple-800'
                                  : norm === 'ORDER CONFIRMED'
                                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                  : norm === 'CANCELLED'
                                  ? 'bg-red-950 text-red-300 border-red-800'
                                  : 'bg-amber-950 text-amber-300 border-amber-800'
                              }`}>
                                {norm}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <select
                                  value={norm}
                                  onChange={(e) => handleManualStatusChange(order.id, e.target.value as OrderStatus)}
                                  className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                                >
                                  <option value="ORDER PLACED">Order Placed</option>
                                  <option value="ORDER CONFIRMED">Order Confirmed</option>
                                  <option value="ORDER BEING PACKED">Packing</option>
                                  <option value="READY FOR DELIVERY">Ready for Delivery</option>
                                  <option value="OUT FOR DELIVERY">Out for Delivery</option>
                                  <option value="DELIVERED">Delivered</option>
                                  <option value="CANCELLED">Cancelled</option>
                                </select>

                                {next && norm !== 'DELIVERED' && norm !== 'CANCELLED' && (
                                  <button
                                    type="button"
                                    onClick={() => handleAdvanceStatus(order)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
                                    title={`Advance to next status: ${next}`}
                                  >
                                    Next →
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CUSTOMERS & ORDER DETAILS */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            {/* Search Customers */}
            <div className="flex items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  placeholder="Search customer by name, mobile, email, area..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                Showing {filteredCustomers.length} registered Hyderabad customers
              </span>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCustomers.map(customer => {
                const customerOrders = orders.filter(o => o.customerId === customer.id || o.customerPhone === customer.phone);
                const totalSpent = customerOrders.reduce((acc, o) => acc + o.grandTotal, 0) || customer.totalSpent;
                const lastOrder = customerOrders[0]?.date || customer.lastOrderDate;

                return (
                  <div
                    key={customer.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white flex items-center justify-center font-black text-lg shadow-md">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{customer.name}</h4>
                          <p className="text-xs text-slate-400">{customer.email || 'customer@example.com'}</p>
                          <p className="text-xs font-mono text-emerald-400">{customer.phone}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 cursor-pointer transition-colors"
                      >
                        Customer Details
                      </button>
                    </div>

                    {/* Quick Stats: TOTAL ORDERS, TOTAL SPENT, LAST ORDER */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">TOTAL ORDERS</div>
                        <div className="text-base font-extrabold text-white mt-0.5">
                          {customerOrders.length || customer.totalOrders}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">TOTAL SPENT</div>
                        <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                          ₹{totalSpent.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">LAST ORDER</div>
                        <div className="text-[11px] font-semibold text-slate-300 mt-1 truncate">
                          {lastOrder}
                        </div>
                      </div>
                    </div>

                    {/* Saved Address */}
                    <div className="text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Delivery Address: </span>
                      {customer.addresses[0]?.locality || 'Himayatnagar'}, Hyderabad - {customer.addresses[0]?.fullAddress}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ADMIN INVENTORY & PRODUCT MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Inventory Controls Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                <button
                  type="button"
                  onClick={() => setInventoryCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    inventoryCategory === 'all'
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Categories ({products.length})
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

              {/* Stock Filter Pills & Add Product Button */}
              <div className="flex items-center gap-2">
                <select
                  value={inventoryStockFilter}
                  onChange={(e) => setInventoryStockFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in_stock">In Stock (10+)</option>
                  <option value="low_stock">Low Stock (1-9)</option>
                  <option value="out_of_stock">Out of Stock (0)</option>
                </select>

                <div className="relative min-w-[180px]">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[16px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search SKU/name..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Inventory SKUs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredInventory.map(product => (
                <div
                  key={product.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex gap-3 items-center justify-between hover:border-slate-700 transition-all"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0 border border-slate-700 bg-white"
                  />

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
                      <span className="text-[10px] font-mono text-slate-500">{product.sku}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                    <div className="text-[11px] text-slate-400">{product.weight}</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-2">
                      <span>₹{product.price}</span>
                      <span className="text-slate-500 line-through font-normal text-[10px]">₹{product.mrp}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 rounded">
                        {product.discount}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Actions & Real-Time Stock Stepper */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    {/* Stock Status Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.stock <= 0
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : product.stock < 10
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {product.stock <= 0 ? 'Out of Stock' : product.stock < 10 ? `Low Stock (${product.stock})` : `In Stock (${product.stock})`}
                    </span>

                    {/* Stock Stepper */}
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
                        className="w-10 text-center text-xs font-bold bg-transparent text-white focus:outline-none"
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

                    {/* Edit / Delete Product Buttons */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                        title="Edit Price & Details"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                      </button>
                      {onDeleteProduct && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete product ${product.name}?`)) {
                              onDeleteProduct(product.id);
                            }
                          }}
                          className="p-1 rounded bg-red-950/60 hover:bg-red-900 text-red-400 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                          title="Delete Product"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      )}
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
              <p className="text-xs text-slate-400">10 Active Fulfillment Centers powering 15–20 min quick grocery deliveries</p>
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
                      <div className="font-bold text-teal-300">14.2 Mins</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Fleet Active</div>
                      <div className="font-bold text-emerald-400">12 Riders</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CUSTOMER DETAILS MODAL (WITH LIFETIME ORDER HISTORY) */}
      {/* ======================================================== */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Customer Details</span>
                <h3 className="font-extrabold text-white text-lg">{selectedCustomer.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Profile Info Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-500 font-bold block">Mobile:</span>
                <span className="font-mono text-white text-sm font-semibold">{selectedCustomer.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Email:</span>
                <span className="text-white text-xs">{selectedCustomer.email || 'customer@saisantosh.com'}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 font-bold block">Hyderabad Address:</span>
                <span className="text-slate-200">
                  {selectedCustomer.addresses[0]?.fullAddress}, {selectedCustomer.addresses[0]?.locality}, Hyderabad ({selectedCustomer.addresses[0]?.pincode || '500029'})
                </span>
              </div>
            </div>

            {/* Lifetime Stats */}
            {(() => {
              const customerOrders = orders.filter(o => o.customerId === selectedCustomer.id || o.customerPhone === selectedCustomer.phone);
              const totalSpent = customerOrders.reduce((acc, o) => acc + o.grandTotal, 0) || selectedCustomer.totalSpent;
              return (
                <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">TOTAL ORDERS</span>
                    <span className="text-lg font-black text-white block">{customerOrders.length || selectedCustomer.totalOrders}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">TOTAL SPENT</span>
                    <span className="text-lg font-black text-emerald-400 block">₹{totalSpent.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">LAST ORDER</span>
                    <span className="text-xs font-bold text-slate-300 block mt-1">{customerOrders[0]?.date || selectedCustomer.lastOrderDate}</span>
                  </div>
                </div>
              );
            })()}

            {/* ORDER HISTORY SECTION */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider flex items-center justify-between">
                <span>ORDER HISTORY</span>
                <span className="text-[11px] font-normal text-slate-500">All customer transactions</span>
              </h4>

              <div className="space-y-2.5">
                {orders.filter(o => o.customerId === selectedCustomer.id || o.customerPhone === selectedCustomer.phone).length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950 text-center text-xs text-slate-500">
                    No past orders found for this customer.
                  </div>
                ) : (
                  orders.filter(o => o.customerId === selectedCustomer.id || o.customerPhone === selectedCustomer.phone).map(ord => (
                    <div key={ord.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">#{ord.id}</span>
                          <span className="text-slate-400">• {ord.date}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                          {ord.status}
                        </span>
                      </div>

                      <div className="text-slate-300 text-[11px]">
                        Items: {ord.items.map(i => `${i.product.name} (${i.quantity}x)`).join(', ')}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-slate-400 text-[11px]">
                        <span>Payment: {ord.paymentMethod}</span>
                        <span className="text-white font-bold text-xs">Total: ₹{ord.grandTotal}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD PRODUCT MODAL */}
      {/* ======================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Add New Grocery Product</h3>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Amul Pure Cow Ghee"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="e.g. Amul / Freedom"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as CategoryId)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="dairy">Dairy</option>
                    <option value="rice_flour">Rice & Flour</option>
                    <option value="dal_pulses">Dal & Pulses</option>
                    <option value="oil_ghee">Oil & Ghee</option>
                    <option value="snacks">Snacks</option>
                    <option value="biscuits">Biscuits</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Weight / Unit</label>
                  <input
                    type="text"
                    value={newProdWeight}
                    onChange={(e) => setNewProdWeight(e.target.value)}
                    placeholder="1 L / 1 kg"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={newProdMrp}
                    onChange={(e) => setNewProdMrp(Number(e.target.value))}
                    min="1"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    min="1"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    min="0"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="https://..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Publish Product to Store
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT PRODUCT MODAL */}
      {/* ======================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Edit: {editingProduct.name}</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => {
                      const newPrice = Number(e.target.value);
                      const discount = Math.max(0, Math.round(((editingProduct.mrp - newPrice) / editingProduct.mrp) * 100));
                      setEditingProduct({
                        ...editingProduct,
                        price: newPrice,
                        sellingPrice: newPrice,
                        discount,
                        discountPercentage: discount
                      });
                    }}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.mrp}
                    onChange={(e) => {
                      const newMrp = Number(e.target.value);
                      const discount = Math.max(0, Math.round(((newMrp - editingProduct.price) / newMrp) * 100));
                      setEditingProduct({
                        ...editingProduct,
                        mrp: newMrp,
                        originalPrice: newMrp,
                        discount,
                        discountPercentage: discount
                      });
                    }}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => {
                      const newStock = Number(e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        stock: newStock,
                        isOutOfStock: newStock <= 0,
                        availability: newStock > 10 ? 'in_stock' : newStock > 0 ? 'low_stock' : 'out_of_stock'
                      });
                    }}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Weight / Pack</label>
                  <input
                    type="text"
                    value={editingProduct.weight}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Save Changes (Live Update)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
