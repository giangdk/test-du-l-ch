import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  ProductCard 
} from './components/ProductCard';
import { 
  ProductDetailModal 
} from './components/ProductDetailModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  CheckoutModal 
} from './components/CheckoutModal';
import { 
  OrderTrackingModal 
} from './components/OrderTrackingModal';
import { 
  AdminPortal 
} from './components/AdminPortal';
import { 
  CulturalStorySection 
} from './components/CulturalStorySection';
import { 
  Footer 
} from './components/Footer';
import { 
  MobileBottomNav 
} from './components/MobileBottomNav';
import { 
  CULTURAL_PRODUCTS, 
  INITIAL_ORDERS 
} from './data/culturalProducts';
import { 
  CartItem, 
  CulturalProduct, 
  Order, 
  OrderStatus, 
  ProductCategory, 
  ProductRegion 
} from './types';
import { 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  Compass, 
  HeartHandshake 
} from 'lucide-react';

const LOCAL_STORAGE_ORDERS_KEY = 'honviet_heritage_orders_v1';
const LOCAL_STORAGE_CART_KEY = 'honviet_heritage_cart_v1';

export default function App() {
  // Load persistent orders or fall back to INITIAL_ORDERS
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read orders from localStorage', e);
    }
    return INITIAL_ORDERS;
  });

  // Load persistent cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    return [];
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<ProductRegion | 'all'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modal & View states
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CulturalProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string | undefined>('HONVIET2026');
  const [globalNotice, setGlobalNotice] = useState<string | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);

  const showGlobalNotice = (msg: string) => {
    setGlobalNotice(msg);
    setTimeout(() => setGlobalNotice(null), 3000);
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return CULTURAL_PRODUCTS.filter((prod) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = prod.title.toLowerCase().includes(q);
        const matchesLocation = prod.location.toLowerCase().includes(q);
        const matchesShortDesc = prod.shortDesc.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocation && !matchesShortDesc) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      // Region
      if (selectedRegion !== 'all' && prod.region !== selectedRegion) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first, then reviewCount
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.reviewCount - a.reviewCount;
    });
  }, [searchQuery, selectedCategory, selectedRegion, sortBy]);

  // Cart operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === item.product.id &&
          i.bookingDate === item.bookingDate &&
          i.timeSlot === item.timeSlot
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    showGlobalNotice(`Đã thêm "${item.product.title}" vào giỏ hàng`);
  };

  const handleUpdateCartQty = (idx: number, newQty: number) => {
    setCartItems((prev) => {
      const copy = [...prev];
      copy[idx].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveCartItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Direct checkout (Buy Now button)
  const handleDirectCheckout = (item: CartItem) => {
    setSelectedProduct(null);
    setCheckoutItems([item]);
    setIsCheckoutOpen(true);
  };

  // Cart checkout
  const handleOpenCheckoutFromCart = (promo?: string) => {
    setIsCartOpen(false);
    setCheckoutItems(cartItems);
    setAppliedPromo(promo);
    setIsCheckoutOpen(true);
  };

  // Order placed successfully
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Clear cart if checkout contained cart items
    setCartItems([]);
    showGlobalNotice(`Đặt thành công mã đơn: ${newOrder.id}`);
  };

  // Admin order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, noteText?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = [...order.timeline];
        if (noteText) {
          updatedTimeline.push({
            time: new Date().toISOString().replace('T', ' ').slice(0, 16),
            text: noteText,
            actor: 'admin',
          });
        }

        const updatedPaymentStatus =
          newStatus === 'confirmed' || newStatus === 'in_progress' || newStatus === 'completed'
            ? 'paid'
            : order.paymentStatus;

        return {
          ...order,
          orderStatus: newStatus,
          paymentStatus: updatedPaymentStatus,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const handleUpdateOrderNotes = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, staffNotes: notes } : order))
    );
  };

  const handleAddManualOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-800 flex flex-col font-sans">
      
      {/* Floating Global Success / Info Toast */}
      {globalNotice && (
        <div className="fixed top-18 right-4 sm:right-8 z-60 bg-red-950 text-amber-100 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-amber-400 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{globalNotice}</span>
        </div>
      )}

      {/* Main App Bar (for tourist storefront) */}
      {!isAdmin && (
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTracking={() => setIsTrackingOpen(true)}
          isAdmin={isAdmin}
          onToggleAdmin={() => setIsAdmin(!isAdmin)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />
      )}

      {/* Conditional Rendering: Admin Portal vs Tourist Storefront */}
      {isAdmin ? (
        <AdminPortal
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateOrderNotes={handleUpdateOrderNotes}
          onAddManualOrder={handleAddManualOrder}
          onCloseAdmin={() => setIsAdmin(false)}
        />
      ) : (
        <main className="flex-1 pb-16 sm:pb-0">
          
          {/* Hero Section */}
          <HeroBanner
            onExploreClick={scrollToCatalog}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              scrollToCatalog();
            }}
          />

          {/* Cultural Catalog Section */}
          <div ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
            
            {/* Catalog Filter Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-800"></span>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-heritage text-stone-900">
                    Sản Phẩm & Trải Nghiệm Di Sản Nổi Bật
                  </h2>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Hiển thị <strong className="text-red-900 font-bold">{filteredProducts.length}</strong> sản phẩm văn hóa được thẩm định chất lượng
                </p>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                  Sắp xếp:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs p-2 bg-white border border-amber-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-700 shadow-2xs"
                >
                  <option value="featured">Nổi bật & Đánh giá cao</option>
                  <option value="rating">Điểm đánh giá (Cao - Thấp)</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>

            {/* Category Quick Chips for Fast Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'tour-disan', label: '🏛️ Tour Di Sản' },
                { id: 'workshop-nghe', label: '🏺 Workshop Làng Nghề' },
                { id: 'tinhhoa-thucong', label: '🎁 Quà Tinh Hoa' },
                { id: 'amthuc-nghethuat', label: '🎭 Nghệ Thuật & Ẩm Thực' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedCategory(pill.id as any)}
                  className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all border ${
                    selectedCategory === pill.id
                      ? 'bg-red-900 text-amber-100 border-red-950 shadow-2xs'
                      : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/60'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-amber-200/80 p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-amber-800">
                  <Compass className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800 font-heritage">
                    Không tìm thấy sản phẩm phù hợp với bộ lọc
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác để khám phá các sản phẩm văn hóa độc đáo.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedRegion('all');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 text-amber-100 text-xs font-semibold hover:bg-amber-950 transition-colors"
                >
                  Xóa bộ lọc & Xem tất cả
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onQuickBook={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Cultural Story Section */}
          <CulturalStorySection />

          {/* Footer */}
          <Footer
            onOpenTracking={() => setIsTrackingOpen(true)}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              scrollToCatalog();
            }}
            onToggleAdmin={() => setIsAdmin(true)}
          />

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav
            currentTab={selectedCategory === 'all' ? 'home' : 'catalog'}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenTracking={() => setIsTrackingOpen(true)}
            onToggleAdmin={() => setIsAdmin(!isAdmin)}
            isAdmin={isAdmin}
            onGoHome={() => {
              setSelectedCategory('all');
              setSelectedRegion('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoCatalog={scrollToCatalog}
          />

        </main>
      )}

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleOpenCheckoutFromCart}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={checkoutItems}
        appliedPromo={appliedPromo}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 4. Customer Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
      />

    </div>
  );
}
