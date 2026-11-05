import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatVND,
  calculateItemTotal,
  calculateOrderSummary,
  generateVietQRData,
  canTransitionOrderStatus,
  filterOrders,
  calculateAdminMetrics,
} from './orderLogic';
import { Order, OrderItem } from '../types';

test('formatVND formats Vietnamese currency cleanly', () => {
  const formatted = formatVND(500000);
  assert.ok(formatted.includes('500.000'));
});

test('calculateItemTotal calculates craft item total correctly', () => {
  const craftItem: OrderItem = {
    productId: 'bat-trang-teapot',
    title: 'Ấm chén Bát Tràng',
    image: '',
    type: 'craft',
    price: 350000,
    quantity: 3,
  };
  assert.equal(calculateItemTotal(craftItem), 1050000);
});

test('calculateItemTotal calculates tour price with adults and discounted children', () => {
  const tourItem: OrderItem = {
    productId: 'tour-hoang-thanh',
    title: 'Tour Đêm Hoàng Thành Thăng Long',
    image: '',
    type: 'tour',
    price: 300000,
    quantity: 3,
    adultCount: 2,
    childCount: 1, // 70% of 300,000 = 210,000
  };
  // 2 * 300,000 + 210,000 = 810,000
  assert.equal(calculateItemTotal(tourItem), 810000);
});

test('calculateOrderSummary applies promo code correctly within limits', () => {
  const items: OrderItem[] = [
    {
      productId: 'tour-hue',
      title: 'Tour Di Sản Cố Đô Huế',
      image: '',
      type: 'tour',
      price: 1200000,
      quantity: 1,
      adultCount: 1,
      childCount: 0,
    },
  ];

  // HONVIET2026 gives 10% off (max 200,000) for min order 500,000
  const result = calculateOrderSummary(items, 'HONVIET2026');
  assert.equal(result.subtotal, 1200000);
  assert.equal(result.discount, 120000); // 10% of 1.2M is 120,000 < 200,000 max
  assert.equal(result.totalAmount, 1080000);
  assert.equal(result.appliedPromo, 'HONVIET2026');
});

test('calculateOrderSummary respects max discount cap', () => {
  const items: OrderItem[] = [
    {
      productId: 'luxury-craft',
      title: 'Trầm hương cao cấp',
      image: '',
      type: 'craft',
      price: 5000000,
      quantity: 1,
    },
  ];

  // HONVIET2026: 10% of 5,000,000 is 500,000, but maxDiscount is 200,000
  const result = calculateOrderSummary(items, 'HONVIET2026');
  assert.equal(result.discount, 200000);
  assert.equal(result.totalAmount, 4800000);
});

test('generateVietQRData produces valid transfer details and link', () => {
  const qrData = generateVietQRData('HV-2026-1001', 750000);
  assert.equal(qrData.bankShortName, 'MBBANK');
  assert.equal(qrData.transferContent, 'TT HV20261001');
  assert.equal(qrData.amount, 750000);
  assert.ok(qrData.qrImageUrl.includes('888899996868'));
  assert.ok(qrData.qrImageUrl.includes('750000'));
});

test('canTransitionOrderStatus validates lifecycle correctly', () => {
  assert.equal(canTransitionOrderStatus('pending', 'confirmed'), true);
  assert.equal(canTransitionOrderStatus('pending', 'cancelled'), true);
  assert.equal(canTransitionOrderStatus('confirmed', 'in_progress'), true);
  assert.equal(canTransitionOrderStatus('in_progress', 'completed'), true);

  // Invalid backward transitions
  assert.equal(canTransitionOrderStatus('completed', 'pending'), false);
  assert.equal(canTransitionOrderStatus('cancelled', 'confirmed'), false);
});

test('filterOrders accurately filters by keyword and status', () => {
  const mockOrders: Order[] = [
    {
      id: 'HV-2026-001',
      createdAt: '2026-11-05T08:00:00Z',
      customerName: 'Nguyễn Văn An',
      customerPhone: '0901234567',
      customerEmail: 'an@gmail.com',
      items: [
        {
          productId: 'p1',
          title: 'Workshop Gốm Bát Tràng',
          image: '',
          type: 'workshop',
          price: 250000,
          quantity: 2,
        },
      ],
      subtotal: 500000,
      discount: 0,
      totalAmount: 500000,
      paymentMethod: 'vietqr',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      timeline: [],
      qrTransactionCode: 'HV001',
      eTicketCode: 'TICKET-123',
    },
    {
      id: 'HV-2026-002',
      createdAt: '2026-11-05T09:00:00Z',
      customerName: 'Trần Thị Mai',
      customerPhone: '0987654321',
      customerEmail: 'mai@gmail.com',
      items: [
        {
          productId: 'p2',
          title: 'Lụa Vạn Phúc Thượng Hạng',
          image: '',
          type: 'craft',
          price: 800000,
          quantity: 1,
        },
      ],
      subtotal: 800000,
      discount: 0,
      totalAmount: 800000,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      timeline: [],
      qrTransactionCode: 'HV002',
      eTicketCode: 'TICKET-456',
    },
  ];

  // Filter by search query phone
  const byPhone = filterOrders(mockOrders, { search: '0901234' });
  assert.equal(byPhone.length, 1);
  assert.equal(byPhone[0].customerName, 'Nguyễn Văn An');

  // Filter by status
  const pendingOrders = filterOrders(mockOrders, { status: 'pending' });
  assert.equal(pendingOrders.length, 1);
  assert.equal(pendingOrders[0].id, 'HV-2026-002');

  // Filter by type
  const craftOrders = filterOrders(mockOrders, { type: 'craft' });
  assert.equal(craftOrders.length, 1);
  assert.equal(craftOrders[0].customerName, 'Trần Thị Mai');
});

test('calculateAdminMetrics aggregates totals correctly', () => {
  const todayIso = new Date().toISOString().slice(0, 10);
  const mockOrders: Order[] = [
    {
      id: 'HV-2026-001',
      createdAt: `${todayIso}T08:00:00Z`,
      customerName: 'Khách A',
      customerPhone: '0900000001',
      customerEmail: 'a@gmail.com',
      items: [],
      subtotal: 500000,
      discount: 0,
      totalAmount: 500000,
      paymentMethod: 'vietqr',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      timeline: [],
      qrTransactionCode: 'HV001',
      eTicketCode: 'T1',
    },
    {
      id: 'HV-2026-002',
      createdAt: `${todayIso}T09:00:00Z`,
      customerName: 'Khách B',
      customerPhone: '0900000002',
      customerEmail: 'b@gmail.com',
      items: [],
      subtotal: 700000,
      discount: 0,
      totalAmount: 700000,
      paymentMethod: 'vietqr',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      timeline: [],
      qrTransactionCode: 'HV002',
      eTicketCode: 'T2',
    },
  ];

  const metrics = calculateAdminMetrics(mockOrders);
  assert.equal(metrics.totalOrders, 2);
  assert.equal(metrics.pendingCount, 1);
  assert.equal(metrics.confirmedCount, 1);
  assert.equal(metrics.totalRevenue, 500000); // only paid/completed counted in revenue
  assert.equal(metrics.todayBookingsCount, 2);
});
