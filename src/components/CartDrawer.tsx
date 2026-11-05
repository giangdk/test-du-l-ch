import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Sparkles, Calendar, Clock, Users } from 'lucide-react';
import { CartItem } from '../types';
import { formatVND, calculateItemTotal, calculateOrderSummary } from '../utils/orderLogic';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (appliedPromo?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string>('HONVIET2026');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const summary = calculateOrderSummary(cartItems, appliedPromo);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const res = calculateOrderSummary(cartItems, code);
    if (res.appliedPromo) {
      setAppliedPromo(res.appliedPromo);
      setPromoError(null);
    } else {
      setPromoError('Mã không hợp lệ hoặc đơn hàng chưa đạt giá trị tối thiểu');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-amber-50/98 h-full shadow-2xl flex flex-col border-l border-amber-200 animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-200 bg-amber-100/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-900 text-amber-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base sm:text-lg font-heritage">
                Giỏ Hàng & Lịch Đặt Chỗ
              </h2>
              <span className="text-xs text-amber-900 font-medium">
                {cartItems.length} dịch vụ / sản phẩm đã chọn
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-200 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-base font-heritage">Giỏ hàng của bạn đang trống</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Hãy chọn tour di sản, workshop trải nghiệm hoặc quà lưu niệm thủ công để bắt đầu hành trình.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-red-900 text-amber-100 text-xs font-semibold hover:bg-red-950 transition-colors"
              >
                Khám phá sản phẩm di sản ngay
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => {
              const itemTotal = calculateItemTotal(item);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs space-y-2.5 relative group"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-18 h-18 rounded-xl object-cover shrink-0 border border-amber-100"
                    />
                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 leading-snug">
                        {item.product.title}
                      </h4>
                      <div className="text-[11px] text-red-900 font-extrabold mt-0.5">
                        {formatVND(item.product.price)}
                      </div>

                      {/* Tour / Booking Specific Info */}
                      {item.bookingDate && (
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-stone-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/50">
                          <span className="flex items-center gap-0.5">
                            <Calendar className="w-3 h-3 text-amber-800" />
                            {item.bookingDate}
                          </span>
                          {item.timeSlot && (
                            <span className="flex items-center gap-0.5 truncate max-w-[120px]">
                              <Clock className="w-3 h-3 text-amber-800" />
                              {item.timeSlot}
                            </span>
                          )}
                          {item.adultCount !== undefined && (
                            <span className="flex items-center gap-0.5 font-medium text-stone-700">
                              <Users className="w-3 h-3 text-amber-800" />
                              {item.adultCount} lớn{item.childCount ? `, ${item.childCount} trẻ` : ''}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Custom note if any */}
                      {item.customNote && (
                        <div className="text-[10px] text-amber-900 italic mt-1 truncate">
                          Ghi chú: {item.customNote}
                        </div>
                      )}
                    </div>

                    {/* Delete item button */}
                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="absolute top-3 right-3 text-stone-400 hover:text-red-700 p-1 transition-colors"
                      aria-label="Xóa mục khỏi giỏ hàng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Subtotal and Quantity adjustment */}
                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-500">Số lượng:</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 rounded-md bg-amber-100 hover:bg-amber-200 text-stone-800 flex items-center justify-center font-bold"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-stone-900 w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-amber-100 hover:bg-amber-200 text-stone-800 flex items-center justify-center font-bold"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-extrabold text-sm text-red-950 font-heritage">
                      {formatVND(itemTotal)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Pricing & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-amber-200 bg-white space-y-3.5 shadow-lg">
            
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Nhập mã ưu đãi (HONVIET2026, DISANVIET)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-stone-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-700 font-medium"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3.5 py-2 text-xs font-semibold bg-amber-900 text-amber-100 rounded-xl hover:bg-amber-950 transition-colors"
                >
                  Áp dụng
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Đã áp dụng mã: {appliedPromo}
                  </span>
                  <button
                    onClick={() => setAppliedPromo('')}
                    className="text-stone-400 hover:text-stone-700 text-xs"
                  >
                    Gỡ bỏ
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] text-red-600 font-medium">{promoError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-dashed border-amber-200 pt-2.5">
              <div className="flex justify-between">
                <span>Tổng tiền dịch vụ:</span>
                <span className="font-semibold text-stone-800">{formatVND(summary.subtotal)}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Ưu đãi di sản ({summary.appliedPromo}):</span>
                  <span>- {formatVND(summary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-900 text-sm font-bold pt-1.5 border-t border-amber-100">
                <span>Tổng thanh toán:</span>
                <span className="text-lg font-black text-red-900 font-heritage">
                  {formatVND(summary.totalAmount)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => onCheckout(summary.appliedPromo)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-800 via-red-900 to-amber-900 hover:from-red-900 hover:to-amber-950 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Tiến hành Đặt hàng & Thanh toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
