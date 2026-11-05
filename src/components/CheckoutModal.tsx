import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Banknote, 
  Copy, 
  Check, 
  ShieldCheck, 
  TicketCheck, 
  ArrowLeft, 
  ArrowRight, 
  Printer, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { CartItem, Order, OrderTimelineEvent, PaymentMethod, PaymentStatus } from '../types';
import { 
  formatVND, 
  calculateOrderSummary, 
  generateOrderCode, 
  generateETicketCode, 
  generateVietQRData,
  BANK_CONFIG 
} from '../utils/orderLogic';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedPromo?: string;
  onOrderPlaced: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedPromo,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');

  // Customer Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Result state
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const summary = calculateOrderSummary(cartItems, appliedPromo);
  const hasCraft = cartItems.some((item) => item.product.type === 'craft');

  // Validate form
  const validateInfo = () => {
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) errors.name = 'Vui lòng nhập họ và tên của bạn';
    if (!customerPhone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại liên hệ';
    } else if (!/^[0-9]{9,11}$/.test(customerPhone.replace(/\s+/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (9-11 chữ số)';
    }
    if (!customerEmail.trim()) {
      errors.email = 'Vui lòng nhập email nhận vé điện tử';
    } else if (!customerEmail.includes('@')) {
      errors.email = 'Định dạng email không hợp lệ';
    }
    if (hasCraft && !customerAddress.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ nhận sản phẩm thủ công';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInfo()) {
      setStep('payment');
    }
  };

  // Generate temporary order ID for QR display
  const tempOrderId = React.useMemo(() => generateOrderCode(), []);
  const qrData = React.useMemo(
    () => generateVietQRData(tempOrderId, summary.totalAmount),
    [tempOrderId, summary.totalAmount]
  );

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Execute payment & order placement
  const handleCompleteOrder = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const orderId = tempOrderId;
      const eTicketCode = generateETicketCode();

      const paymentStatus: PaymentStatus =
        paymentMethod === 'cod' ? 'pending' : 'paid';

      const initialTimeline: OrderTimelineEvent[] = [
        {
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          text: `Đơn hàng được đặt thành công qua phương thức ${
            paymentMethod === 'vietqr'
              ? 'VietQR Ngân hàng'
              : paymentMethod === 'momo'
              ? 'Ví MoMo'
              : paymentMethod === 'vnpay'
              ? 'Cổng VNPay'
              : paymentMethod === 'card'
              ? 'Thẻ quốc tế'
              : 'Thanh toán trực tiếp'
          }`,
          actor: 'customer',
        },
      ];

      if (paymentStatus === 'paid') {
        initialTimeline.push({
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          text: `Hệ thống xác nhận thanh toán thành công ${formatVND(
            summary.totalAmount
          )}`,
          actor: 'system' as const,
        });
      }

      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerAddress: customerAddress.trim() || undefined,
        specialRequest: specialRequest.trim() || undefined,
        items: cartItems.map((c) => ({
          productId: c.product.id,
          title: c.product.title,
          image: c.product.image,
          type: c.product.type,
          price: c.product.price,
          quantity: c.quantity,
          bookingDate: c.bookingDate,
          timeSlot: c.timeSlot,
          adultCount: c.adultCount,
          childCount: c.childCount,
          customNote: c.customNote,
        })),
        subtotal: summary.subtotal,
        discount: summary.discount,
        discountCode: summary.appliedPromo,
        totalAmount: summary.totalAmount,
        paymentMethod,
        paymentStatus,
        orderStatus: 'confirmed',
        timeline: initialTimeline,
        staffNotes: 'Đơn mới khởi tạo từ cổng trực tuyến.',
        qrTransactionCode: qrData.transferContent,
        eTicketCode,
      };

      setCreatedOrder(newOrder);
      onOrderPlaced(newOrder);
      setIsProcessingPayment(false);
      setStep('success');
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-200 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-amber-50/95 px-4 sm:px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-900 text-amber-100">
              <TicketCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-stone-900 text-base sm:text-lg font-heritage">
                {step === 'info' && 'Thông Tin Khách Hàng & Đặt Chỗ'}
                {step === 'payment' && 'Cổng Thanh Toán Trực Tuyến Linh Hoạt'}
                {step === 'success' && 'Đặt Chỗ & Thanh Toán Thành Công!'}
              </h2>
              <p className="text-xs text-stone-500">
                {step === 'info' && 'Bước 1/2: Điền thông tin liên hệ và nhận vé điện tử'}
                {step === 'payment' && 'Bước 2/2: Chọn kênh thanh toán bảo mật VietQR, MoMo, Thẻ'}
                {step === 'success' && 'Vé điện tử E-Ticket đã được phát hành'}
              </p>
            </div>
          </div>

          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-amber-200 text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Đóng thanh toán"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-6">
          
          {/* STEP 1: INFO FORM */}
          {step === 'info' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              
              {/* Items Mini Summary */}
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
                  <span>Dịch vụ & sản phẩm đang đặt ({cartItems.length}):</span>
                  <span className="text-red-900 font-heritage text-sm font-black">
                    {formatVND(summary.totalAmount)}
                  </span>
                </div>
                <div className="divide-y divide-amber-100">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="pt-2 text-xs text-stone-700 flex justify-between gap-2">
                      <div className="truncate">
                        <span className="font-semibold text-stone-900">{item.product.title}</span>
                        {item.bookingDate && (
                          <span className="block text-[11px] text-stone-500">
                            Ngày: {item.bookingDate} • {item.adultCount} lớn{item.childCount ? `, ${item.childCount} trẻ` : ''}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 font-medium">{formatVND(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Họ và tên du khách <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full p-2.5 text-xs sm:text-sm bg-stone-50 border rounded-xl focus:ring-2 focus:ring-amber-700 ${
                      formErrors.name ? 'border-red-500 bg-red-50/30' : 'border-amber-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Số điện thoại Zalo / Gọi <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full p-2.5 text-xs sm:text-sm bg-stone-50 border rounded-xl focus:ring-2 focus:ring-amber-700 ${
                      formErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-amber-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Địa chỉ Email (Nhận vé điện tử & hóa đơn) <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="nguyenvanan@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={`w-full p-2.5 text-xs sm:text-sm bg-stone-50 border rounded-xl focus:ring-2 focus:ring-amber-700 ${
                    formErrors.email ? 'border-red-500 bg-red-50/30' : 'border-amber-300'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Delivery address if physical craft goods */}
              {hasCraft && (
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Địa chỉ giao quà tặng thủ công <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className={`w-full p-2.5 text-xs sm:text-sm bg-stone-50 border rounded-xl focus:ring-2 focus:ring-amber-700 ${
                      formErrors.address ? 'border-red-500 bg-red-50/30' : 'border-amber-300'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.address}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Yêu cầu đặc biệt cho ban tổ chức (Không bắt buộc)
                </label>
                <textarea
                  rows={2}
                  placeholder="Yêu cầu ăn chay, đón tại sảnh khách sạn, hướng dẫn viên song ngữ Anh - Việt, v.v..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm bg-stone-50 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-700"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-800 via-red-900 to-amber-900 hover:from-red-900 hover:to-amber-950 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Tiếp tục chọn phương thức thanh toán</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: FLEXIBLE PAYMENT GATEWAYS */}
          {step === 'payment' && (
            <div className="space-y-5">
              
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">
                  Chọn cổng thanh toán bảo mật:
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Option 1: VietQR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'vietqr'
                        ? 'bg-amber-100/70 border-red-900 ring-2 ring-red-900/20'
                        : 'bg-white border-amber-200 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-red-900 text-amber-200 shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span>VietQR Ngân hàng</span>
                        <span className="text-[10px] bg-red-800 text-white px-1.5 py-0.2 rounded-full font-semibold">Khuyên dùng</span>
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        Quét mã chuyển khoản tức thì mọi ngân hàng
                      </div>
                    </div>
                  </button>

                  {/* Option 2: MoMo */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'momo'
                        ? 'bg-pink-50 border-pink-700 ring-2 ring-pink-700/20'
                        : 'bg-white border-amber-200 hover:bg-pink-50/30'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-pink-700 text-white shrink-0">
                      <span className="font-black text-xs">M</span>
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-stone-900">Ví Điện Tử MoMo</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        Quét mã MoMo hoặc chuyển ví siêu tốc
                      </div>
                    </div>
                  </button>

                  {/* Option 3: VNPay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vnpay')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'vnpay'
                        ? 'bg-blue-50 border-blue-700 ring-2 ring-blue-700/20'
                        : 'bg-white border-amber-200 hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-blue-700 text-white shrink-0">
                      <span className="font-black text-xs">V</span>
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-stone-900">Cổng VNPay</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        Thẻ ATM nội địa & VNPAY-QR
                      </div>
                    </div>
                  </button>

                  {/* Option 4: Thẻ quốc tế Visa/Mastercard */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-50 border-indigo-700 ring-2 ring-indigo-700/20'
                        : 'bg-white border-amber-200 hover:bg-indigo-50/30'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-indigo-700 text-white shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-stone-900">Thẻ Quốc Tế</div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        Visa, Mastercard, JCB bảo mật 3D Secure
                      </div>
                    </div>
                  </button>

                  {/* Option 5: COD / Tại điểm đến */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`sm:col-span-2 p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-amber-100/70 border-amber-800 ring-2 ring-amber-800/20'
                        : 'bg-white border-amber-200 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-amber-800 text-amber-100 shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-stone-900">
                        {hasCraft
                          ? 'Thanh toán khi nhận hàng (COD) / Tại điểm tham gia tour'
                          : 'Thanh toán trực tiếp khi tham gia tour tại điểm đến'}
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">
                        Đặt giữ chỗ trước, thanh toán tiền mặt cho hướng dẫn viên khi bắt đầu trải nghiệm
                      </div>
                    </div>
                  </button>

                </div>
              </div>

              {/* DYNAMIC PAYMENT UI DISPLAY */}
              {/* 1. VietQR Details */}
              {paymentMethod === 'vietqr' && (
                <div className="p-4 sm:p-5 bg-gradient-to-b from-amber-50 to-amber-100/60 rounded-2xl border border-amber-300 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    
                    {/* Live QR Code Box */}
                    <div className="bg-white p-3 rounded-2xl shadow-md border border-amber-200 text-center shrink-0">
                      <img
                        src={qrData.qrImageUrl}
                        alt="VietQR Chuyển khoản tự động"
                        className="w-44 h-44 object-contain mx-auto rounded-lg"
                        loading="eager"
                      />
                      <div className="mt-2 text-[10px] text-stone-500 font-medium">
                        Mở App Ngân hàng bất kỳ để quét
                      </div>
                    </div>

                    {/* Transfer Details with 1-click Copy */}
                    <div className="flex-1 w-full space-y-2.5 text-xs">
                      <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 block">Ngân hàng thụ hưởng</span>
                          <span className="font-bold text-stone-900">{BANK_CONFIG.bankName}</span>
                        </div>
                        <span className="text-xs font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded-sm">MBBANK</span>
                      </div>

                      <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 block">Số tài khoản</span>
                          <span className="font-mono font-bold text-stone-900 text-sm tracking-wide">
                            {BANK_CONFIG.accountNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(BANK_CONFIG.accountNumber, 'acc')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg flex items-center gap-1"
                        >
                          {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'acc' ? 'Đã sao chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 block">Chủ tài khoản</span>
                          <span className="font-bold text-stone-900 uppercase">{BANK_CONFIG.accountName}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-red-800 font-bold block">Nội dung chuyển khoản (Bắt buộc)</span>
                          <span className="font-mono font-bold text-red-950 text-sm">
                            {qrData.transferContent}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(qrData.transferContent, 'content')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-red-200/80 hover:bg-red-300 text-red-950 rounded-lg flex items-center gap-1"
                        >
                          {copiedField === 'content' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'content' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 block">Số tiền thanh toán chính xác</span>
                          <span className="text-base font-black text-red-900 font-heritage">
                            {formatVND(summary.totalAmount)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(String(summary.totalAmount), 'amount')}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg flex items-center gap-1"
                        >
                          {copiedField === 'amount' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  <div className="text-[11px] text-amber-900 flex items-center gap-1.5 bg-amber-200/50 p-2.5 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Sau khi chuyển khoản trên ứng dụng ngân hàng của bạn, bấm nút "Tôi đã hoàn tất chuyển khoản" bên dưới để hệ thống đối soát và kích hoạt vé điện tử.</span>
                  </div>
                </div>
              )}

              {/* 2. MoMo Details */}
              {paymentMethod === 'momo' && (
                <div className="p-4 bg-pink-50/70 rounded-2xl border border-pink-200 text-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
                      MoMo
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">Thanh toán qua Ví điện tử MoMo</div>
                      <div className="text-stone-600 text-[11px]">Số tiền: <strong className="text-pink-700">{formatVND(summary.totalAmount)}</strong></div>
                      <div className="text-stone-500 text-[11px]">Nội dung: {qrData.transferContent}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 bg-white p-2.5 rounded-xl border border-pink-200">
                    Hệ thống sẽ liên kết trực tiếp ứng dụng MoMo của bạn để thực hiện xác thực vân tay/khuôn mặt an toàn.
                  </p>
                </div>
              )}

              {/* 3. Card Details */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Số thẻ (16 chữ số)</label>
                    <input
                      type="text"
                      placeholder="4123 4567 8901 2345"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Ngày hết hạn (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Mã bảo mật (CVV)</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  disabled={isProcessingPayment}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-800 via-red-900 to-amber-900 hover:from-red-950 hover:to-amber-950 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Đang xác thực thanh toán...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>
                        {paymentMethod === 'vietqr'
                          ? 'Tôi đã hoàn tất chuyển khoản'
                          : paymentMethod === 'cod'
                          ? 'Xác nhận đặt giữ chỗ'
                          : 'Xác nhận thanh toán ngay'}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION & E-TICKET */}
          {step === 'success' && createdOrder && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              
              {/* Success Badge */}
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heritage text-stone-900">
                  Cảm ơn Quý khách! Đặt chỗ thành công
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Mã vé điện tử và hướng dẫn tham gia đã được gửi tới email <strong className="text-stone-900">{createdOrder.customerEmail}</strong> và số điện thoại <strong className="text-stone-900">{createdOrder.customerPhone}</strong>.
                </p>
              </div>

              {/* Printable E-Ticket Voucher Card */}
              <div className="text-left bg-gradient-to-b from-amber-50 to-amber-100/70 p-5 rounded-3xl border-2 border-amber-300/80 shadow-md relative overflow-hidden space-y-4">
                
                {/* Traditional motif header */}
                <div className="flex items-center justify-between border-b border-amber-300 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 tracking-wider uppercase block">
                      VÉ ĐIỆN TỬ DI SẢN (E-TICKET VOUCHER)
                    </span>
                    <span className="text-base font-bold font-heritage text-red-950">
                      HỒN VIỆT HERITAGE
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block">Mã đơn hàng</span>
                    <span className="font-mono font-bold text-sm text-stone-900">{createdOrder.id}</span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Họ tên du khách:</span>
                    <strong className="text-stone-900 text-sm">{createdOrder.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">Số điện thoại liên hệ:</span>
                    <strong className="text-stone-900">{createdOrder.customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">Trạng thái thanh toán:</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      createdOrder.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200 text-amber-950'
                    }`}>
                      {createdOrder.paymentStatus === 'paid' ? '✓ Đã thanh toán đầy đủ' : 'Thanh toán tại điểm đến'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">Tổng tiền thanh toán:</span>
                    <strong className="text-red-950 font-heritage text-base">{formatVND(createdOrder.totalAmount)}</strong>
                  </div>
                </div>

                {/* Products in Voucher */}
                <div className="border-t border-amber-200 pt-3 space-y-2">
                  <span className="text-[11px] font-bold text-amber-950 block">Danh mục trải nghiệm & vật phẩm:</span>
                  {createdOrder.items.map((item, i) => (
                    <div key={i} className="p-2.5 bg-white/90 rounded-xl border border-amber-200 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-900">{item.title}</div>
                        {item.bookingDate && (
                          <div className="text-[11px] text-stone-600 mt-0.5 flex items-center gap-2">
                            <span>📅 Ngày: {item.bookingDate}</span>
                            {item.timeSlot && <span>⏰ Giờ: {item.timeSlot}</span>}
                            <span>👥 {item.adultCount} lớn {item.childCount ? `, ${item.childCount} trẻ` : ''}</span>
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-red-900 shrink-0 font-heritage text-xs">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* QR Code Check-in */}
                <div className="border-t border-dashed border-amber-300 pt-3 flex items-center justify-between bg-white/80 p-3 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Mã Check-in vào cổng / Workshop:</span>
                    <span className="font-mono font-black text-lg text-red-900 tracking-wider">
                      {createdOrder.eTicketCode}
                    </span>
                    <span className="text-[10px] text-stone-500 block">Xuất trình mã này cho hướng dẫn viên</span>
                  </div>
                  <div className="w-14 h-14 bg-stone-900 p-1.5 rounded-xl flex items-center justify-center text-white shrink-0">
                    <QrCode className="w-10 h-10" />
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-amber-950 text-xs font-semibold flex items-center gap-2 shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-amber-800" />
                  <span>In vé / Lưu PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-red-900 hover:bg-red-950 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Hoàn tất & Về trang chủ
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
