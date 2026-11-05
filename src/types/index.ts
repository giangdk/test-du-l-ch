export type ProductCategory = 'tour-disan' | 'workshop-nghe' | 'tinhhoa-thucong' | 'amthuc-nghethuat';
export type ProductRegion = 'mien-bac' | 'mien-trung' | 'mien-nam';
export type ProductType = 'tour' | 'workshop' | 'craft';

export interface ArtisanProfile {
  name: string;
  title: string;
  avatar: string;
  quote: string;
}

export interface CulturalProduct {
  id: string;
  title: string;
  subTitle: string;
  category: ProductCategory;
  region: ProductRegion;
  type: ProductType;
  location: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  duration?: string; // e.g. '3 giờ', '1 ngày', '2 ngày 1 đêm'
  shortDesc: string;
  story: string;
  highlights: string[];
  inclusions: string[];
  artisanInfo?: ArtisanProfile;
  availableDates?: string[];
  timeSlots?: string[];
  stock?: number;
  featured?: boolean;
  badge?: string;
}

export type PaymentMethod = 'vietqr' | 'momo' | 'vnpay' | 'card' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  type: ProductType;
  price: number;
  quantity: number;
  bookingDate?: string;
  timeSlot?: string;
  adultCount?: number;
  childCount?: number;
  customNote?: string;
}

export interface OrderTimelineEvent {
  time: string;
  text: string;
  actor: 'customer' | 'admin' | 'system';
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  specialRequest?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  timeline: OrderTimelineEvent[];
  staffNotes?: string;
  qrTransactionCode: string;
  eTicketCode: string;
}

export interface CartItem {
  product: CulturalProduct;
  quantity: number;
  bookingDate?: string;
  timeSlot?: string;
  adultCount?: number;
  childCount?: number;
  customNote?: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: ProductCategory | 'all';
  region: ProductRegion | 'all';
  type: ProductType | 'all';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  todayBookingsCount: number;
  revenueByRegion: { [key in ProductRegion]: number };
}
