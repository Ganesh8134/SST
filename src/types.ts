export type CategoryId = 
  | 'dairy'
  | 'rice_flour'
  | 'dal_pulses'
  | 'oil_ghee'
  | 'snacks'
  | 'biscuits'
  | 'all';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'DELIVERY_PARTNER';

export type OrderStatus = 
  | 'ORDER PLACED'
  | 'ORDER CONFIRMED'
  | 'ORDER BEING PACKED'
  | 'READY FOR DELIVERY'
  | 'OUT FOR DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'confirmed'
  | 'packing'
  | 'out_for_delivery'
  | 'delivered';

export interface ProductVariant {
  weight: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock?: number;
  inStock?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  categoryId?: CategoryId;
  brand: string;
  description: string;
  image: string;
  gallery?: string[];
  weight: string;
  availableWeights?: string[];
  mrp: number;
  sellingPrice: number;
  price: number; // alias for sellingPrice
  originalPrice?: number; // alias for mrp
  discount: number;
  discountPercentage?: number; // alias for discount
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt?: string;
  updatedAt?: string;
  categoryName: string;
  subcategory?: string;
  badge?: string;
  badgeType?: 'discount' | 'bestseller' | 'stock' | 'deal';
  isOutOfStock?: boolean;
  isPopular?: boolean;
  isBestDeal?: boolean;
  isFrequentlyBought?: boolean;
  isRecommended?: boolean;
  ingredients?: string;
  nutritionalInfo?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
    [key: string]: string | undefined;
  };
  storageInfo?: string;
  origin?: string;
  tags?: string[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  image: string;
  itemCount: number;
  description: string;
  subcategories: string[];
}

export interface Address {
  id: string;
  title: string;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  locality: string;
  city: 'Hyderabad';
  state: 'Telangana';
  pincode: string;
  tag: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export interface Coupon {
  code: string;
  title?: string;
  description: string;
  discountType: 'percentage' | 'percent' | 'fixed';
  discountValue: number;
  minOrder?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  tag?: string;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  category: CategoryId;
  code?: string;
  image: string;
  bgColor: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  items: CartItem[];
  itemTotal: number;
  discount: number;
  deliveryFee: number;
  handlingFee: number;
  deliveryTip?: number;
  grandTotal: number;
  address: Address;
  status: OrderStatus;
  estimatedDeliveryTime: string;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  riderName?: string;
  riderPhone?: string;
  darkStore?: string;
  statusHistory?: OrderStatusHistoryItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  currentOrderId?: string;
  joinedDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'discount' | 'stock' | 'system';
  orderId?: string;
}
