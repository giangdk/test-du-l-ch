import React from 'react';
import { Star, MapPin, Clock, ArrowUpRight, Sparkles, ShoppingBag } from 'lucide-react';
import { CulturalProduct } from '../types';
import { formatVND } from '../utils/orderLogic';

interface ProductCardProps {
  product: CulturalProduct;
  onSelect: (product: CulturalProduct) => void;
  onQuickBook: (product: CulturalProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickBook,
}) => {
  const regionNames = {
    'mien-bac': 'Miền Bắc',
    'mien-trung': 'Miền Trung',
    'mien-nam': 'Miền Nam',
  };

  const typeLabels = {
    tour: 'Tour Di Sản',
    workshop: 'Workshop Thủ Công',
    craft: 'Quà Tinh Hoa',
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-amber-200/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Top Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent"></div>

        {/* Region & Badge Pills */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-red-950/85 backdrop-blur-xs text-amber-200 border border-amber-400/30 shadow-2xs">
            {regionNames[product.region]}
          </span>
          {product.badge && (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-500/90 backdrop-blur-xs text-stone-950 shadow-2xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-stone-950" />
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Type Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-[11px] font-medium border border-white/20">
            {typeLabels[product.type]}
          </span>
          {product.duration && (
            <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md text-[11px] font-medium">
              <Clock className="w-3 h-3 text-amber-300" />
              {product.duration}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-1.5">
            <span className="flex items-center gap-1 truncate text-stone-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">{product.location}</span>
            </span>
            <span className="flex items-center gap-1 text-amber-900 font-bold shrink-0 bg-amber-50 px-1.5 py-0.5 rounded-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {product.rating} <span className="text-[10px] text-stone-600 font-normal">({product.reviewCount})</span>
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(product)}
            className="font-bold text-stone-900 text-base sm:text-lg line-clamp-2 leading-snug group-hover:text-red-900 transition-colors cursor-pointer"
          >
            {product.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-600 font-medium">
              {product.type === 'craft' ? 'Giá sản phẩm' : 'Giá từ / người'}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-red-900">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-600 line-through">
                  {formatVND(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(product)}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-amber-950 bg-amber-100/80 hover:bg-amber-200 rounded-xl transition-colors flex items-center gap-1"
              aria-label={`Xem chi tiết ${product.title}`}
            >
              <span className="hidden sm:inline">Chi tiết</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onQuickBook(product)}
              className="px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-red-800 to-amber-900 hover:from-red-900 hover:to-amber-950 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1"
              aria-label={`Đặt chỗ hoặc mua ngay ${product.title}`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
              <span>{product.type === 'craft' ? 'Mua ngay' : 'Đặt chỗ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
