/**
 * Real-time event synchronization utility for Sai Santosh Traders.
 * Uses BroadcastChannel and CustomEvents to sync state live between
 * Admin Dashboard and Customer storefront across views and tabs without page reload.
 */

import { Order, OrderStatus, Product } from '../types';

export type RealtimeEventType = 
  | 'ORDER_STATUS_UPDATED'
  | 'NEW_ORDER_CREATED'
  | 'NEW_ORDER_RECEIVED'
  | 'STOCK_UPDATED'
  | 'PRODUCT_STOCK_UPDATED'
  | 'PRODUCT_UPDATED';

export interface RealtimeEventPayload {
  type: RealtimeEventType;
  order?: Order;
  orderId?: string;
  newStatus?: OrderStatus;
  productId?: string;
  newStock?: number;
  product?: Product;
  message?: string;
  timestamp?: string;
}

const CHANNEL_NAME = 'sai_santosh_hyperlocal_realtime';

// Initialize BroadcastChannel if available in browser
let channel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch {
  // Graceful fallback for non-supporting environments
}

/**
 * Broadcast an event to all subscribers and tabs
 */
export function broadcastRealtimeEvent(payload: RealtimeEventPayload) {
  const completePayload: RealtimeEventPayload = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString()
  };

  // 1. Post to BroadcastChannel for multi-tab sync
  if (channel) {
    try {
      channel.postMessage(completePayload);
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }

  // 2. Dispatch window custom event for same-page sync
  if (typeof window !== 'undefined') {
    const customEvent = new CustomEvent('saisantosh:realtime', { detail: completePayload });
    window.dispatchEvent(customEvent);
  }
}

/**
 * Subscribe to real-time events
 */
export function subscribeToRealtimeEvents(
  callback: (payload: RealtimeEventPayload) => void
): () => void {
  const handleCustomEvent = (e: Event) => {
    const customEvt = e as CustomEvent<RealtimeEventPayload>;
    if (customEvt.detail) {
      callback(customEvt.detail);
    }
  };

  const handleBroadcastMessage = (event: MessageEvent<RealtimeEventPayload>) => {
    if (event.data) {
      callback(event.data);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('saisantosh:realtime', handleCustomEvent);
    if (channel) {
      channel.addEventListener('message', handleBroadcastMessage);
    }
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('saisantosh:realtime', handleCustomEvent);
      if (channel) {
        channel.removeEventListener('message', handleBroadcastMessage);
      }
    }
  };
}

/**
 * Normalizes order status strings for uniform comparison
 */
export function normalizeOrderStatus(status: string): OrderStatus {
  const upper = (status || '').toUpperCase().trim();
  if (upper.includes('PACK')) return 'ORDER BEING PACKED';
  if (upper.includes('READY')) return 'READY FOR DELIVERY';
  if (upper.includes('OUT') || upper.includes('DELIVERY')) {
    if (upper === 'DELIVERED') return 'DELIVERED';
    return 'OUT FOR DELIVERY';
  }
  if (upper.includes('DELIVERED')) return 'DELIVERED';
  if (upper.includes('CONFIRM')) return 'ORDER CONFIRMED';
  if (upper.includes('CANCEL')) return 'CANCELLED';
  return 'ORDER PLACED';
}

/**
 * Helper to get human-friendly status label and notification text
 */
export function getStatusNotificationDetails(status: OrderStatus, orderId: string): { title: string; message: string; icon: string } {
  const norm = normalizeOrderStatus(status);
  switch (norm) {
    case 'ORDER CONFIRMED':
      return {
        title: '✓ Order Confirmed',
        message: `Your order #${orderId} has been verified and confirmed by the dark store.`,
        icon: 'check_circle'
      };
    case 'ORDER BEING PACKED':
      return {
        title: '📦 Order Being Packed',
        message: `Your fresh groceries for #${orderId} are being packed at the dark store.`,
        icon: 'inventory_2'
      };
    case 'READY FOR DELIVERY':
      return {
        title: '🛍️ Ready for Delivery',
        message: `Order #${orderId} is packed and waiting for delivery partner pickup.`,
        icon: 'shopping_bag'
      };
    case 'OUT FOR DELIVERY':
      return {
        title: '🚚 Out for Delivery',
        message: `Order #${orderId} is on the way! Rider is arriving in 10-15 mins.`,
        icon: 'local_shipping'
      };
    case 'DELIVERED':
      return {
        title: '🎉 Order Delivered!',
        message: `Order #${orderId} has been delivered. Enjoy your fresh groceries!`,
        icon: 'task_alt'
      };
    case 'CANCELLED':
      return {
        title: '❌ Order Cancelled',
        message: `Order #${orderId} has been cancelled. Any refund has been initiated.`,
        icon: 'cancel'
      };
    default:
      return {
        title: '✓ Order Placed',
        message: `Your order #${orderId} has been placed successfully.`,
        icon: 'receipt_long'
      };
  }
}
