import { AdminMetrics, CartItem, Order, OrderItem, OrderStatus, ProductRegion } from '../types';

export const BANK_CONFIG = {
  bankName: 'Ngân hàng TMCP Quân Đội (MB Bank)',
  bankShortName: 'MBBANK',
  accountNumber: '888899996868',
  accountName: 'CONG TY DU LICH DI SAN HON VIET',
  bin: '970422', // MBBank BIN code for VietQR
};

export const PROMO_CODES: Record<string, { discountPercent: number; maxDiscount: number; minOrder: number }> = {
  HONVIET2026: { discountPercent: 10, maxDiscount: 200000, minOrder: 500000 },
  DISANVIET: { discountPercent: 15, maxDiscount: 350000, minOrder: 1000000 },
  CHAOBANMOI: { discountPercent: 5, maxDiscount: 100000, minOrder: 200000 },
};

/**
 * Format currency to Vietnamese Dong standard
 */
export function formatVND(amount: number): string {
  if (isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate item subtotal based on product type (Tour vs Craft)
 * Tour/workshop price considers adults and children (children discount 30%)
 */
export function calculateItemTotal(item: CartItem | OrderItem): number {
  const itemType = 'product' in item ? item.product.type : item.type;
  const itemPrice = 'product' in item ? item.product.price : item.price;

  if (itemType === 'craft') {
    return itemPrice * (item.quantity || 1);
  }

  const adultCount = item.adultCount !== undefined ? item.adultCount : (item.quantity || 1);
  const childCount = item.childCount !== undefined ? item.childCount : 0;
  const childPrice = Math.round(itemPrice * 0.7);

  return (adultCount * itemPrice) + (childCount * childPrice);
}

/**
 * Calculate full order pricing with discount
 */
export function calculateOrderSummary(
  items: (CartItem | OrderItem)[],
  promoCode?: string
): { subtotal: number; discount: number; totalAmount: number; appliedPromo?: string } {
  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  let discount = 0;
  let appliedPromo: string | undefined = undefined;

  if (promoCode) {
    const code = promoCode.trim().toUpperCase();
    const promo = PROMO_CODES[code];
    if (promo && subtotal >= promo.minOrder) {
      discount = Math.min(Math.round((subtotal * promo.discountPercent) / 100), promo.maxDiscount);
      appliedPromo = code;
    }
  }

  const totalAmount = Math.max(0, subtotal - discount);

  return {
    subtotal,
    discount,
    totalAmount,
    appliedPromo,
  };
}

/**
 * Generate a unique, professional Order Code (HV-YYYY-XXXX)
 */
export function generateOrderCode(existingOrdersCount = 0): string {
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const sequence = String(existingOrdersCount + 1).padStart(3, '0');
  return `HV-${currentYear}-${sequence}${randomSuffix.toString().slice(-2)}`;
}

/**
 * Generate an e-ticket alphanumeric check-in code
 */
export function generateETicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'TICKET-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate VietQR payment transfer string and deep-link / image URL
 */
export function generateVietQRData(orderId: string, amount: number) {
  // Format transfer content: HV [ORDER_ID_WITHOUT_DASH]
  const cleanId = orderId.replace(/-/g, '');
  const transferContent = `TT ${cleanId}`;
  
  // Official VietQR public quick link image API (VietQR.io format compatible)
  const qrImageUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bin}-${BANK_CONFIG.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;

  return {
    bankName: BANK_CONFIG.bankName,
    bankShortName: BANK_CONFIG.bankShortName,
    accountNumber: BANK_CONFIG.accountNumber,
    accountName: BANK_CONFIG.accountName,
    transferContent,
    amount,
    qrImageUrl,
  };
}

/**
 * Validate order status transitions
 */
export function canTransitionOrderStatus(fromStatus: OrderStatus, toStatus: OrderStatus): boolean {
  if (fromStatus === toStatus) return true;

  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [], // Terminal
    cancelled: [], // Terminal
  };

  return validTransitions[fromStatus]?.includes(toStatus) ?? false;
}

/**
 * Filter orders for Admin or Customer Tracking
 */
export function filterOrders(
  orders: Order[],
  options: {
    search?: string;
    status?: OrderStatus | 'all';
    type?: 'all' | 'tour' | 'craft';
    startDate?: string;
    endDate?: string;
  }
): Order[] {
  return orders.filter(order => {
    // Search filter
    if (options.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesName = order.customerName.toLowerCase().includes(q);
      const matchesPhone = order.customerPhone.toLowerCase().includes(q);
      const matchesEmail = order.customerEmail.toLowerCase().includes(q);
      const matchesItem = order.items.some(i => i.title.toLowerCase().includes(q));
      if (!matchesId && !matchesName && !matchesPhone && !matchesEmail && !matchesItem) {
        return false;
      }
    }

    // Status filter
    if (options.status && options.status !== 'all') {
      if (order.orderStatus !== options.status) {
        return false;
      }
    }

    // Type filter
    if (options.type && options.type !== 'all') {
      if (options.type === 'tour') {
        const hasTour = order.items.some(i => i.type === 'tour' || i.type === 'workshop');
        if (!hasTour) return false;
      } else if (options.type === 'craft') {
        const hasCraft = order.items.some(i => i.type === 'craft');
        if (!hasCraft) return false;
      }
    }

    return true;
  });
}

/**
 * Compute Admin analytics and performance metrics
 */
export function calculateAdminMetrics(orders: Order[]): AdminMetrics {
  let totalRevenue = 0;
  let pendingCount = 0;
  let confirmedCount = 0;
  let completedCount = 0;
  let todayBookingsCount = 0;

  const revenueByRegion: { [key in ProductRegion]: number } = {
    'mien-bac': 0,
    'mien-trung': 0,
    'mien-nam': 0,
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  for (const order of orders) {
    if (order.paymentStatus === 'paid' || order.orderStatus === 'completed' || order.orderStatus === 'in_progress') {
      totalRevenue += order.totalAmount;
    }

    if (order.orderStatus === 'pending') pendingCount++;
    if (order.orderStatus === 'confirmed') confirmedCount++;
    if (order.orderStatus === 'completed') completedCount++;

    // Check if order has bookings scheduled for today or created today
    if (order.createdAt.startsWith(todayStr)) {
      todayBookingsCount++;
    }
  }

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingCount,
    confirmedCount,
    completedCount,
    todayBookingsCount,
    revenueByRegion,
  };
}
