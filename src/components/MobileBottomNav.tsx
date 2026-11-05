import React from 'react';
import { Home, Compass, ShoppingBag, TicketCheck, SlidersHorizontal } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'catalog' | 'admin';
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onToggleAdmin: () => void;
  isAdmin: boolean;
  onGoHome: () => void;
  onGoCatalog: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  cartCount,
  onOpenCart,
  onOpenTracking,
  onToggleAdmin,
  isAdmin,
  onGoHome,
  onGoCatalog,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/80 sm:hidden shadow-lg safe-bottom">
      <div className="grid grid-cols-5 h-15">
        
        {/* Tab 1: Home */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center gap-1 ${
            currentTab === 'home' && !isAdmin ? 'text-red-900 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">Trang chủ</span>
        </button>

        {/* Tab 2: Catalog / Tours */}
        <button
          onClick={onGoCatalog}
          className={`flex flex-col items-center justify-center gap-1 ${
            currentTab === 'catalog' && !isAdmin ? 'text-red-900 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">Di sản</span>
        </button>

        {/* Tab 3: Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-stone-900 relative"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-red-900 text-amber-200 text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Giỏ hàng</span>
        </button>

        {/* Tab 4: Track Order */}
        <button
          onClick={onOpenTracking}
          className="flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-stone-900"
        >
          <TicketCheck className="w-4 h-4" />
          <span className="text-[10px]">Tra cứu</span>
        </button>

        {/* Tab 5: Admin Switcher */}
        <button
          onClick={onToggleAdmin}
          className={`flex flex-col items-center justify-center gap-1 ${
            isAdmin ? 'text-red-900 font-bold bg-amber-100/50' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[10px]">{isAdmin ? 'Thoát Ad' : 'Quản trị'}</span>
        </button>

      </div>
    </nav>
  );
};
