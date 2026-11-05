import React, { useState } from 'react';
import { 
  X, 
  Search, 
  TicketCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  QrCode, 
  PhoneCall, 
  AlertCircle,
  Printer
} from 'lucide-react';
import { Order } from '../types';
import { formatVND } from '../utils/orderLogic';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const [searchKey, setSearchKey] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchKey.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.id.toLowerCase().replace(/-/g, '') === query.replace(/-/g, '') ||
        o.customerPhone.replace(/\s+/g, '') === query.replace(/\s+/g, '') ||
        o.eTicketCode.toLowerCase() === query
    );

    setMatchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepProgressIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'in_progress': return 2;
      case 'completed': return 3;
      case 'cancelled': return -1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-amber-300 my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-amber-50 px-5 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-900 text-amber-200">
              <TicketCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-heritage text-base sm:text-lg text-stone-900">
                Tra Cứu Vé & Đơn Đặt Chỗ Di Sản
              </h3>
              <p className="text-[11px] text-stone-500">
                Nhập mã đơn hàng (VD: HV-2026-8921) hoặc số điện thoại đặt chỗ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-amber-200 text-stone-500"
            aria-label="Đóng tra cứu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nhập mã đơn (HV-...) hoặc SĐT khách hàng"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-amber-300 rounded-xl focus:ring-2 focus:ring-red-900 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-900 hover:bg-red-950 text-amber-100 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-xs"
            >
              Tra cứu
            </button>
          </form>

          {/* Quick Demo Chips for Instant Testing */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 flex-wrap">
            <span>Mã gợi ý thử nghiệm:</span>
            <button
              type="button"
              onClick={() => {
                setSearchKey('HV-2026-8921');
                setMatchedOrder(orders.find(o => o.id === 'HV-2026-8921') || null);
                setHasSearched(true);
              }}
              className="text-red-900 font-mono font-bold hover:underline bg-amber-100/70 px-2 py-0.5 rounded-sm"
            >
              HV-2026-8921
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchKey('0988776655');
                setMatchedOrder(orders.find(o => o.customerPhone === '0988776655') || null);
                setHasSearched(true);
              }}
              className="text-red-900 font-mono font-bold hover:underline bg-amber-100/70 px-2 py-0.5 rounded-sm"
            >
              0988776655
            </button>
          </div>

          {/* Result view */}
          {hasSearched && !matchedOrder && (
            <div className="text-center p-8 bg-amber-50/50 rounded-2xl border border-amber-200 text-stone-500 text-xs space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-semibold text-stone-800">Không tìm thấy đơn hàng với thông tin vừa nhập.</p>
              <p>Vui lòng kiểm tra lại mã đơn hàng trên tin nhắn/email hoặc liên hệ hotline <strong className="text-red-900">1900 8868</strong> để được hỗ trợ nhanh.</p>
            </div>
          )}

          {matchedOrder && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Status Timeline Bar */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                <div className="text-xs font-bold text-stone-900 mb-3 flex items-center justify-between">
                  <span>Tiến trình xử lý đơn hàng</span>
                  <span className="font-mono text-red-900">{matchedOrder.id}</span>
                </div>

                {matchedOrder.orderStatus !== 'cancelled' ? (
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    {[
                      { label: 'Đã nhận đơn', step: 0 },
                      { label: 'Đã xuất vé', step: 1 },
                      { label: 'Đang diễn ra', step: 2 },
                      { label: 'Hoàn tất', step: 3 },
                    ].map((s) => {
                      const currentStep = getStepProgressIndex(matchedOrder.orderStatus);
                      const isDone = currentStep >= s.step;
                      return (
                        <div key={s.step} className="space-y-1.5">
                          <div className={`h-1.5 rounded-full ${isDone ? 'bg-emerald-600' : 'bg-stone-200'}`}></div>
                          <span className={isDone ? 'font-bold text-emerald-900' : 'text-stone-400'}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-2 bg-rose-100 text-rose-800 rounded-lg text-xs font-semibold text-center">
                    Đơn hàng này đã được hủy theo yêu cầu.
                  </div>
                )}
              </div>

              {/* Ticket Details Box */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Khách hàng</span>
                    <strong className="text-stone-900 text-sm">{matchedOrder.customerName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block">Mã E-Ticket check-in</span>
                    <strong className="font-mono text-red-900 text-sm">{matchedOrder.eTicketCode}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-stone-700 block">Chi tiết lịch trình:</span>
                  {matchedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-stone-900">{item.title}</div>
                        {item.bookingDate && (
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            📅 {item.bookingDate} ({item.timeSlot})
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-red-900 font-heritage text-xs">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <span className="font-semibold text-stone-700">Tổng thanh toán:</span>
                  <span className="text-base font-black text-red-950 font-heritage">
                    {formatVND(matchedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 hover:bg-stone-50"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In vé / Tải PDF</span>
                </button>

                <div className="flex items-center gap-1 text-xs text-amber-900 font-medium">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                  <span>Hỗ trợ: 1900 8868</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
