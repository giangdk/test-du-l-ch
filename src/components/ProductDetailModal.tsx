import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ShoppingBag, 
  CheckCircle2, 
  Quote, 
  Plus, 
  Minus,
  ArrowRight
} from 'lucide-react';
import { CulturalProduct, CartItem } from '../types';
import { formatVND } from '../utils/orderLogic';

interface ProductDetailModalProps {
  product: CulturalProduct | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onDirectCheckout: (item: CartItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedDate, setSelectedDate] = useState<string>(
    product.availableDates ? product.availableDates[0] : new Date().toISOString().slice(0, 10)
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    product.timeSlots ? product.timeSlots[0] : 'Buổi sáng (08:30 - 11:30)'
  );
  const [adultCount, setAdultCount] = useState<number>(product.type === 'craft' ? 1 : 2);
  const [childCount, setChildCount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [customNote, setCustomNote] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute live price
  const childPrice = Math.round(product.price * 0.7);
  const calculatedTotal = product.type === 'craft'
    ? product.price * quantity
    : (adultCount * product.price) + (childCount * childPrice);

  const handleAddToCart = () => {
    const item: CartItem = {
      product,
      quantity: product.type === 'craft' ? quantity : (adultCount + childCount),
      bookingDate: product.type !== 'craft' ? selectedDate : undefined,
      timeSlot: product.type !== 'craft' ? selectedSlot : undefined,
      adultCount: product.type !== 'craft' ? adultCount : undefined,
      childCount: product.type !== 'craft' ? childCount : undefined,
      customNote: customNote.trim() ? customNote : undefined,
    };
    onAddToCart(item);
    setToastMessage('Đã thêm sản phẩm vào giỏ hàng thành công!');
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleDirectCheckout = () => {
    const item: CartItem = {
      product,
      quantity: product.type === 'craft' ? quantity : (adultCount + childCount),
      bookingDate: product.type !== 'craft' ? selectedDate : undefined,
      timeSlot: product.type !== 'craft' ? selectedSlot : undefined,
      adultCount: product.type !== 'craft' ? adultCount : undefined,
      childCount: product.type !== 'craft' ? childCount : undefined,
      customNote: customNote.trim() ? customNote : undefined,
    };
    onDirectCheckout(item);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-60 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-400 text-xs sm:text-sm animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-200 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-amber-50/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-900 text-amber-100">
              {product.type === 'craft' ? 'Sản Phẩm Thủ Công' : 'Trải Nghiệm Văn Hóa'}
            </span>
            <span className="text-xs text-stone-600 truncate flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-700" /> {product.location}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-amber-200/50 transition-colors"
            aria-label="Đóng chi tiết sản phẩm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Gallery & Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-3">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-amber-200/60 shadow-inner">
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === img ? 'border-red-900 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {product.rating} ({product.reviewCount} đánh giá từ du khách)
                  </span>
                  {product.duration && (
                    <span className="flex items-center gap-1 text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      {product.duration}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-heritage text-stone-900 leading-snug">
                  {product.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {product.shortDesc}
                </p>
              </div>

              {/* Artisan Profile Card */}
              {product.artisanInfo && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-100/70 to-red-50/50 border border-amber-300/60 flex items-start gap-3">
                  <img
                    src={product.artisanInfo.avatar}
                    alt={product.artisanInfo.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-400 shrink-0 shadow-xs"
                  />
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-stone-900">{product.artisanInfo.name}</div>
                    <div className="text-[11px] text-red-900 font-medium">{product.artisanInfo.title}</div>
                    <p className="italic text-stone-700 flex items-center gap-1">
                      <Quote className="w-3 h-3 text-amber-700 shrink-0 inline" />
                      <span>"{product.artisanInfo.quote}"</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Price Tag */}
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-600 font-medium">
                    {product.type === 'craft' ? 'Đơn giá' : 'Giá vé chuẩn / người lớn'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-red-900 font-heritage">
                      {formatVND(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-stone-600 line-through">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                {product.type !== 'craft' && (
                  <div className="text-right text-[11px] text-emerald-800 bg-emerald-100/70 px-2 py-1 rounded-md font-medium">
                    Trẻ em (dưới 12t): -30% ({formatVND(childPrice)})
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cultural Story & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-amber-200/50">
            {/* Story */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Câu chuyện di sản & Tinh hoa văn hóa
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-amber-50/40 p-4 rounded-xl border border-amber-200/50">
                {product.story}
              </p>
            </div>

            {/* Inclusions & Highlights */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Điểm nổi bật & Dịch vụ bao gồm
              </h4>
              <div className="space-y-2">
                {product.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Booking & Quantity Configuration */}
          <div className="bg-amber-100/50 rounded-2xl p-4 sm:p-5 border border-amber-300/70 space-y-4">
            <h4 className="text-sm font-bold text-red-950 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-900" />
              {product.type === 'craft' ? 'Tùy chọn số lượng & Ghi chú quà tặng' : 'Chọn lịch trình & Số lượng khách'}
            </h4>

            {product.type !== 'craft' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Ngày trải nghiệm
                  </label>
                  {product.availableDates && product.availableDates.length > 0 ? (
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 bg-white border border-amber-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-700"
                    >
                      {product.availableDates.map((date) => (
                        <option key={date} value={date}>
                          {date} (Còn chỗ)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 bg-white border border-amber-300 rounded-xl"
                    />
                  )}
                </div>

                {/* Time Slot Picker */}
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Khung giờ khởi hành
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 bg-white border border-amber-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-700"
                  >
                    {product.timeSlots?.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    )) || <option value="Theo thỏa thuận">Theo thỏa thuận với hướng dẫn viên</option>}
                  </select>
                </div>

                {/* Guest Counts */}
                <div className="sm:col-span-2 md:col-span-1 flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-amber-300">
                  <div className="text-xs">
                    <span className="font-semibold text-stone-900 block">Người lớn</span>
                    <span className="text-[10px] text-stone-500">{formatVND(product.price)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                      className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold"
                      aria-label="Giảm người lớn"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-stone-900">{adultCount}</span>
                    <button
                      onClick={() => setAdultCount(adultCount + 1)}
                      className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold"
                      aria-label="Tăng người lớn"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Child Count */}
                <div className="sm:col-span-2 md:col-span-3 flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-300">
                  <div className="text-xs">
                    <span className="font-semibold text-stone-900">Trẻ em (dưới 12 tuổi)</span>
                    <span className="text-[11px] text-emerald-700 ml-2 font-medium">Giảm 30% ({formatVND(childPrice)}/bé)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChildCount(Math.max(0, childCount - 1))}
                      className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold"
                      aria-label="Giảm trẻ em"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-stone-900">{childCount}</span>
                    <button
                      onClick={() => setChildCount(childCount + 1)}
                      className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold"
                      aria-label="Tăng trẻ em"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Craft Quantity */
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-amber-300">
                <div className="text-xs">
                  <span className="font-semibold text-stone-900 block">Số lượng sản phẩm</span>
                  <span className="text-[11px] text-emerald-700">Còn {product.stock || 20} sản phẩm trong kho</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-base font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 20, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center font-bold"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Custom Note Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                {product.type === 'craft' ? 'Ghi chú khắc tên / Thiệp chúc mừng quà tặng (Nếu có)' : 'Yêu cầu đặc biệt (Ăn chay, ngôn ngữ hướng dẫn viên, đón tại khách sạn...)'}
              </label>
              <input
                type="text"
                placeholder={product.type === 'craft' ? 'Ví dụ: Tặng đối tác anh Nam, kèm hộp quà gỗ sơn mài...' : 'Ví dụ: Có 1 bé cần xe đẩy, mong muốn hướng dẫn viên tiếng Anh...'}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-700"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Sticky Actions */}
        <div className="sticky bottom-0 z-20 bg-amber-50/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">Tạm tính ({product.type === 'craft' ? `${quantity} sản phẩm` : `${adultCount} lớn, ${childCount} trẻ`})</div>
            <div className="text-xl sm:text-2xl font-black text-red-950 font-heritage">
              {formatVND(calculatedTotal)}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-amber-800" />
              <span>Thêm vào giỏ</span>
            </button>

            <button
              onClick={handleDirectCheckout}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-red-800 to-amber-900 hover:from-red-900 hover:to-amber-950 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Đặt ngay & Thanh toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
