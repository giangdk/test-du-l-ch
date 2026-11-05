import React from 'react';
import { Sparkles, Award, QrCode, Clock, Compass, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroBannerProps {
  onExploreClick: () => void;
  onSelectCategory: (category: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onSelectCategory,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-100/70 via-amber-50 to-amber-50/30 border-b border-amber-200/50 pb-12 pt-8 sm:py-16">
      {/* Subtle traditional ornamental backdrop */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-semibold tracking-wide shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
              <span>Bảo Tồn & Phát Triển Du Lịch Di Sản Văn Hóa Việt Nam</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heritage text-stone-900 tracking-tight leading-[1.15]">
              Chạm Vào <span className="text-red-900 underline decoration-amber-500/50 underline-offset-4">Hồn Cốt Di Sản</span> & Tinh Hoa Làng Nghề Nghìn Năm
            </h1>

            <p className="text-stone-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Trải nghiệm các tour di sản độc bản, hòa mình vào workshop vuốt gốm Bát Tràng, in tranh Đông Hồ cùng nghệ nhân ưu tú, và sở hữu những tác phẩm thủ công lưu giữ tinh hoa truyền thống đất Việt.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-amber-900 hover:from-red-950 hover:to-amber-950 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Khám phá sản phẩm di sản</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory('workshop-nghe')}
                className="px-5 py-3.5 rounded-xl bg-white/90 hover:bg-white text-amber-950 border border-amber-300 font-semibold text-sm shadow-2xs hover:shadow-md transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-800" />
                <span>Xem workshop làng nghề</span>
              </button>
            </div>

            {/* Key Cultural Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-amber-200/60 text-left">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/60">
                <div className="p-2 rounded-lg bg-red-900 text-amber-200 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Di sản UNESCO</div>
                  <div className="text-[11px] text-stone-600">Bảo chứng nguồn gốc</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/60">
                <div className="p-2 rounded-lg bg-amber-800 text-amber-100 shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">100% Nghệ Nhân</div>
                  <div className="text-[11px] text-stone-600">Truyền nhân làng nghề</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/60">
                <div className="p-2 rounded-lg bg-emerald-800 text-emerald-100 shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">VietQR Tức Thì</div>
                  <div className="text-[11px] text-stone-600">Đa dạng thanh toán</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-amber-50/80 border border-amber-200/60">
                <div className="p-2 rounded-lg bg-indigo-800 text-indigo-100 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Vé E-Ticket 24/7</div>
                  <div className="text-[11px] text-stone-600">Xác nhận tự động</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Feature Card Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-200 group bg-gradient-to-br from-red-950 via-amber-900 to-red-900 min-h-[320px]">
                <img
                  src="https://images.unsplash.com/photo-1557750298-c7a0a0dc7b71?auto=format&fit=crop&w=800&q=80"
                  alt="Đèn lồng Hội An lung linh"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 block"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to ceramic art image if needed
                    e.currentTarget.src = "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent"></div>
                
                {/* Overlay Quote Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-amber-950/80 backdrop-blur-md border border-amber-400/30 text-amber-100">
                  <p className="text-xs sm:text-sm italic font-heritage leading-snug">
                    "Giữ lấy nghề xưa, trao truyền hồn Việt cho muôn đời sau."
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-400/20 text-[11px] text-amber-300">
                    <span className="font-semibold">Nghệ nhân Phố Cổ Hội An</span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" /> Được kiểm duyệt
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Mini Card 1 - Bát Tràng */}
              <div className="hidden sm:flex absolute -top-4 -left-6 items-center gap-3 p-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-amber-200/80 max-w-[220px]">
                <img
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=120&q=80"
                  alt="Gốm Bát Tràng"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="text-left">
                  <div className="text-[11px] font-bold text-stone-900 leading-tight">Gốm Bát Tràng</div>
                  <div className="text-[10px] text-amber-800 font-semibold">Vuốt gốm & Nung men</div>
                  <div className="text-[10px] text-emerald-700">⭐ 4.95 (148 đánh giá)</div>
                </div>
              </div>

              {/* Floating Mini Card 2 - VietQR Ready */}
              <div className="hidden sm:flex absolute -bottom-4 -right-4 items-center gap-3 p-3 bg-amber-900 text-amber-100 rounded-xl shadow-xl border border-amber-400/40">
                <div className="p-2 rounded-lg bg-amber-800/80">
                  <QrCode className="w-5 h-5 text-amber-300" />
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white">Thanh toán VietQR</div>
                  <div className="text-[10px] text-amber-200">Quét mã nhận vé ngay</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
