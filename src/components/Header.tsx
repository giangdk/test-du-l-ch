import React from 'react';
import { 
  Compass, 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  TicketCheck, 
  SlidersHorizontal,
  MapPin,
  PhoneCall,
  Menu,
  X
} from 'lucide-react';
import { ProductCategory, ProductRegion } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  selectedRegion: ProductRegion | 'all';
  onSelectRegion: (reg: ProductRegion | 'all') => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracking,
  isAdmin,
  onToggleAdmin,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất cả sản phẩm' },
    { id: 'tour-disan', label: 'Tour Di Sản' },
    { id: 'workshop-nghe', label: 'Workshop Làng Nghề' },
    { id: 'tinhhoa-thucong', label: 'Quà Tinh Hoa' },
    { id: 'amthuc-nghethuat', label: 'Nghệ Thuật & Ẩm Thực' },
  ];

  const regions: { id: ProductRegion | 'all'; label: string }[] = [
    { id: 'all', label: 'Toàn quốc' },
    { id: 'mien-bac', label: 'Miền Bắc' },
    { id: 'mien-trung', label: 'Miền Trung' },
    { id: 'mien-nam', label: 'Miền Nam' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs transition-all">
      {/* Top Heritage Notice Bar */}
      <div className="bg-gradient-to-r from-red-950 via-amber-900 to-red-950 text-amber-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              Hồn Việt — Tôn Vinh Di Sản Văn Hóa & Nghề Thủ Công Truyền Thống Việt Nam
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-amber-200/90 text-xs">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              Hotline: <strong className="text-white">1900 8868</strong>
            </span>
            <span className="text-amber-500/40">|</span>
            <span className="flex items-center gap-1 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bảo chứng trải nghiệm thực thụ
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectRegion('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-3 text-left focus:outline-hidden"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-800 via-amber-800 to-amber-900 flex items-center justify-center text-amber-100 shadow-md group-hover:scale-105 transition-transform border border-amber-400/30">
                {/* Traditional stylized lotus / drum motif */}
                <Compass className="w-6 h-6 text-amber-300 animate-[spin_12s_linear_infinite]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold font-heritage tracking-tight text-red-950 block leading-tight">
                  HỒN VIỆT
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-amber-800/80 tracking-wider uppercase block">
                  Du Lịch & Di Sản Làng Nghề
                </span>
              </div>
            </button>
          </div>

          {/* Search Box Desktop & Tablet */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm tour di sản, workshop Bát Tràng, lụa Vạn Phúc..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white/90 border border-amber-200/90 rounded-full focus:outline-hidden focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all placeholder:text-stone-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Order Tracking Button */}
            <button
              onClick={onOpenTracking}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100/70 hover:bg-amber-100 rounded-lg border border-amber-300/60 transition-colors"
              title="Tra cứu đơn hàng và vé điện tử"
            >
              <TicketCheck className="w-4 h-4 text-amber-800" />
              <span>Tra cứu vé</span>
            </button>

            {/* Admin Switcher Button */}
            <button
              onClick={onToggleAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                isAdmin
                  ? 'bg-red-900 text-amber-100 border-red-950 shadow-sm'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title={isAdmin ? 'Chuyển về giao diện khách hàng' : 'Mở giao diện Quản trị viên'}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{isAdmin ? 'Thoát Admin' : 'Quản trị'}</span>
              {isAdmin && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 sm:px-3.5 sm:py-2 text-white bg-gradient-to-r from-red-800 to-amber-900 hover:from-red-900 hover:to-amber-950 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              aria-label="Giỏ hàng và lịch đặt chỗ"
            >
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline text-xs font-semibold">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-red-900 bg-amber-300 rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-amber-100/50"
              aria-label="Menu mở rộng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar if screen < md */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm tour di sản, quà tặng..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-amber-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-700/20"
            />
          </div>
        </div>

        {/* Category & Region Navigation Bar (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center justify-between py-2 border-t border-amber-200/50 text-xs overflow-x-auto no-scrollbar gap-4">
          <div className="flex items-center gap-1.5 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-900 text-amber-50 shadow-2xs'
                    : 'text-stone-600 hover:text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0 bg-amber-100/70 p-1 rounded-full border border-amber-200/60">
            <span className="flex items-center gap-1 pl-2 pr-1 text-amber-900 font-semibold text-[11px]">
              <MapPin className="w-3 h-3 text-amber-700" />
              Vùng miền:
            </span>
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => onSelectRegion(reg.id)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-white text-red-900 font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-50 border-t border-amber-200 px-4 py-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div>
            <p className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2">Danh mục sản phẩm</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedCategory === cat.id
                      ? 'bg-amber-900 text-white font-medium'
                      : 'bg-white text-stone-700 border border-amber-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2">Vùng miền văn hóa</p>
            <div className="flex flex-wrap gap-1.5">
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    onSelectRegion(reg.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedRegion === reg.id
                      ? 'bg-red-900 text-white font-medium'
                      : 'bg-white text-stone-700 border border-amber-200'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenTracking();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs text-amber-900 font-medium py-1.5"
            >
              <TicketCheck className="w-4 h-4 text-amber-700" />
              Tra cứu mã đơn & vé điện tử
            </button>
            <button
              onClick={() => {
                onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-stone-600 underline font-medium"
            >
              {isAdmin ? 'Đang ở Admin' : 'Vào trang Admin'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
