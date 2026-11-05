import React, { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Eye, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  FileText, 
  ArrowUpDown, 
  TrendingUp, 
  Users, 
  QrCode, 
  Save, 
  X,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Order, OrderStatus, ProductType } from '../types';
import { 
  formatVND, 
  filterOrders, 
  calculateAdminMetrics, 
  canTransitionOrderStatus, 
  generateOrderCode, 
  generateETicketCode 
} from '../utils/orderLogic';
import { CULTURAL_PRODUCTS } from '../data/culturalProducts';

interface AdminPortalProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, noteText?: string) => void;
  onUpdateOrderNotes: (orderId: string, notes: string) => void;
  onAddManualOrder: (newOrder: Order) => void;
  onCloseAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  orders,
  onUpdateOrderStatus,
  onUpdateOrderNotes,
  onAddManualOrder,
  onCloseAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'tour' | 'craft'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Manual order form state
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualProductId, setManualProductId] = useState(CULTURAL_PRODUCTS[0].id);
  const [manualGuestCount, setManualGuestCount] = useState(2);
  const [manualDate, setManualDate] = useState(new Date().toISOString().slice(0, 10));

  const metrics = calculateAdminMetrics(orders);
  const filteredOrders = filterOrders(orders, {
    search: searchQuery,
    status: statusFilter,
    type: typeFilter,
  });

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setEditingNotes(order.staffNotes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedOrder) return;
    onUpdateOrderNotes(selectedOrder.id, editingNotes);
    setSelectedOrder({ ...selectedOrder, staffNotes: editingNotes });
    showToast('Đã lưu ghi chú nội bộ của đơn hàng!');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus, actionLabel: string) => {
    onUpdateOrderStatus(orderId, newStatus, `Quản trị viên đã chuyển trạng thái sang [${actionLabel}]`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        orderStatus: newStatus,
        paymentStatus: newStatus === 'confirmed' || newStatus === 'in_progress' || newStatus === 'completed' ? 'paid' : selectedOrder.paymentStatus,
      });
    }
    showToast(`Đã cập nhật: ${actionLabel}`);
  };

  // Export orders to CSV with UTF-8 BOM for Microsoft Excel
  const handleExportCSV = () => {
    const headers = ['Mã Đơn', 'Ngày Đặt', 'Khách Hàng', 'SĐT', 'Email', 'Sản Phẩm / Tour', 'Số Tiền', 'Thanh Toán', 'Trạng Thái'];
    const rows = filteredOrders.map(o => [
      o.id,
      o.createdAt.slice(0, 10),
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.customerEmail}"`,
      `"${o.items.map(i => i.title).join('; ').replace(/"/g, '""')}"`,
      o.totalAmount,
      o.paymentStatus,
      o.orderStatus,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HonViet_BaoCao_DonHang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file báo cáo CSV thành công!');
  };

  // Handle create manual order
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim() || !manualPhone.trim()) return;

    const prod = CULTURAL_PRODUCTS.find(p => p.id === manualProductId) || CULTURAL_PRODUCTS[0];
    const totalAmount = prod.price * manualGuestCount;
    const orderId = generateOrderCode(orders.length);
    const eTicketCode = generateETicketCode();

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: manualCustomerName.trim(),
      customerPhone: manualPhone.trim(),
      customerEmail: manualEmail.trim() || 'walkin.guest@honviet.vn',
      items: [
        {
          productId: prod.id,
          title: prod.title,
          image: prod.image,
          type: prod.type,
          price: prod.price,
          quantity: manualGuestCount,
          bookingDate: manualDate,
          timeSlot: prod.timeSlots?.[0] || '09:00 - 12:00',
          adultCount: manualGuestCount,
          childCount: 0,
        },
      ],
      subtotal: totalAmount,
      discount: 0,
      totalAmount,
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      timeline: [
        {
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          text: 'Tạo đơn tại quầy di sản cho khách vãng lai',
          actor: 'admin',
        },
      ],
      staffNotes: 'Khách thanh toán trực tiếp tại quầy thông tin.',
      qrTransactionCode: `TT ${orderId.replace(/-/g, '')}`,
      eTicketCode,
    };

    onAddManualOrder(newOrder);
    setShowCreateModal(false);
    setManualCustomerName('');
    setManualPhone('');
    showToast(`Đã tạo đơn hàng tại quầy: ${orderId}`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-900 border border-amber-300">Chờ xử lý</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-900 border border-blue-300">Đã xác nhận vé</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-900 border border-purple-300">Đang thực hiện</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">Đã hoàn thành</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-900 border border-rose-300">Đã hủy</span>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 pb-16">
      
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed top-6 right-6 z-60 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium border border-amber-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <div className="bg-red-950 text-amber-100 px-4 sm:px-8 py-3.5 border-b border-red-900 shadow-sm sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-800 text-amber-200">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold font-heritage tracking-wide">
              Hệ Thống Quản Lý Đơn Hàng & Đặt Chỗ Du Lịch Di Sản
            </h1>
            <p className="text-[11px] text-amber-300/80">
              Cổng Điều Hành Tour & Phân Bổ Nghệ Nhân • Phiên Bản Quản Trị Thông Minh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tạo đơn tại quầy</span>
          </button>

          <button
            onClick={onCloseAdmin}
            className="px-3.5 py-2 text-xs font-semibold bg-red-900 hover:bg-red-800 text-amber-100 rounded-xl border border-red-800 transition-all flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Thoát Admin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
              <span>Doanh Thu Thực Tế</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-red-950 font-heritage">
              {formatVND(metrics.totalRevenue)}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">Đã bao gồm VietQR & Thẻ</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
              <span>Tổng Đơn & Lịch Tour</span>
              <FileText className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 font-heritage">
              {metrics.totalOrders}
            </div>
            <div className="text-[10px] text-stone-500">Khách đặt toàn quốc</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
              <span>Chờ Phê Duyệt</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-700 font-heritage">
              {metrics.pendingCount}
            </div>
            <div className="text-[10px] text-amber-700 font-medium">Cần xác nhận thanh toán</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
              <span>Vé Đã Xác Nhận</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-800 font-heritage">
              {metrics.confirmedCount}
            </div>
            <div className="text-[10px] text-blue-700">Đã gửi mã vé E-Ticket</div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
              <span>Lịch Khởi Hành Hôm Nay</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-900 font-heritage">
              {metrics.todayBookingsCount}
            </div>
            <div className="text-[10px] text-purple-700">Khách tham gia trải nghiệm</div>
          </div>

        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách, SĐT, tour..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-900"
              />
            </div>

            {/* Filters & Export */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-red-900"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý (Pending)</option>
                <option value="confirmed">Đã xác nhận vé (Confirmed)</option>
                <option value="in_progress">Đang thực hiện (In Progress)</option>
                <option value="completed">Đã hoàn thành (Completed)</option>
                <option value="cancelled">Đã hủy (Cancelled)</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-red-900"
              >
                <option value="all">Tất cả loại sản phẩm</option>
                <option value="tour">Tour & Workshop Di Sản</option>
                <option value="craft">Quà Lưu Niệm Thủ Công</option>
              </select>

              {/* CSV Export */}
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl flex items-center gap-1.5 transition-colors border border-stone-300"
                title="Tải báo cáo đơn hàng Excel/CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất CSV</span>
              </button>

            </div>

          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-amber-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/80 border-b border-amber-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Mã Đơn / Ngày</th>
                  <th className="py-3.5 px-4">Khách Hàng</th>
                  <th className="py-3.5 px-4">Sản Phẩm & Lịch Trình</th>
                  <th className="py-3.5 px-4">Tổng Tiền</th>
                  <th className="py-3.5 px-4">Thanh Toán</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác Nhanh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                      
                      {/* Order Code & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenDetail(order)}
                          className="font-mono font-bold text-red-950 hover:underline block text-xs"
                        >
                          {order.id}
                        </button>
                        <span className="text-[10px] text-stone-500">
                          {order.createdAt.slice(0, 10)} {order.createdAt.slice(11, 16)}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{order.customerName}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </td>

                      {/* Products summary */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="truncate">
                            <span className="font-medium text-stone-800">{item.title}</span>
                            {item.bookingDate && (
                              <span className="text-[10px] text-amber-900 block truncate">
                                📅 {item.bookingDate} ({item.adultCount} lớn{item.childCount ? `, ${item.childCount} bé` : ''})
                              </span>
                            )}
                          </div>
                        ))}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-red-950 font-heritage text-sm">
                        {formatVND(order.totalAmount)}
                      </td>

                      {/* Payment Method & Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] font-bold uppercase text-stone-700">
                            {order.paymentMethod}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        </div>
                        <span className={`text-[10px] font-semibold ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thu tiền'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(order.orderStatus)}
                      </td>

                      {/* Fast Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                        
                        {/* Quick progression buttons */}
                        {order.orderStatus === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'confirmed', 'Xác nhận vé')}
                            className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="Xác nhận vé và phân bổ nghệ nhân"
                          >
                            Xác nhận
                          </button>
                        )}

                        {order.orderStatus === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'in_progress', 'Bắt đầu tour')}
                            className="px-2.5 py-1 text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            title="Tour đang đón khách hoặc hàng đang vận chuyển"
                          >
                            Khởi hành
                          </button>
                        )}

                        {order.orderStatus === 'in_progress' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'completed', 'Hoàn thành')}
                            className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                            title="Đã kết thúc tour tốt đẹp"
                          >
                            Hoàn tất
                          </button>
                        )}

                        {/* View Details modal button */}
                        <button
                          onClick={() => handleOpenDetail(order)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-red-950 transition-colors inline-flex items-center"
                          title="Xem chi tiết & Sửa ghi chú"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ORDER DETAIL DRILLDOWN MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-amber-300 max-h-[90vh] flex flex-col">
              
              <div className="bg-amber-50 px-5 py-4 border-b border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase">Chi Tiết Đơn Hàng Di Sản</span>
                  <h3 className="text-lg font-bold font-heritage text-stone-900">{selectedOrder.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full hover:bg-amber-200 text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-5 space-y-4 text-xs">
                
                {/* Status Switcher Bar */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Trạng thái hiện tại:</span>
                    <div className="mt-1">{getStatusBadge(selectedOrder.orderStatus)}</div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'confirmed', 'Đã xác nhận')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-blue-100 text-blue-900 hover:bg-blue-200 rounded-lg"
                    >
                      Duyệt vé
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'in_progress', 'Đang thực hiện')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-purple-100 text-purple-900 hover:bg-purple-200 rounded-lg"
                    >
                      Bắt đầu tour
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed', 'Hoàn tất')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 rounded-lg"
                    >
                      Đã hoàn thành
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled', 'Đã hủy')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-rose-100 text-rose-900 hover:bg-rose-200 rounded-lg"
                    >
                      Hủy đơn
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Tên khách hàng:</span>
                    <strong className="text-stone-900 text-sm">{selectedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Số điện thoại:</span>
                    <strong className="text-stone-900">{selectedOrder.customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Email:</span>
                    <span className="text-stone-800">{selectedOrder.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Mã E-Ticket check-in:</span>
                    <span className="font-mono font-bold text-red-900">{selectedOrder.eTicketCode}</span>
                  </div>
                  {selectedOrder.customerAddress && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-stone-500 block">Địa chỉ nhận sản phẩm:</span>
                      <span className="text-stone-800">{selectedOrder.customerAddress}</span>
                    </div>
                  )}
                  {selectedOrder.specialRequest && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-stone-500 block">Yêu cầu đặc biệt của khách:</span>
                      <span className="text-amber-950 italic">{selectedOrder.specialRequest}</span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="font-bold text-stone-800 block text-[11px] uppercase">Dịch vụ & Sản phẩm trong đơn</span>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-900">{item.title}</div>
                        {item.bookingDate && (
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            📅 {item.bookingDate} ({item.timeSlot}) • {item.adultCount} lớn{item.childCount ? `, ${item.childCount} trẻ` : ''}
                          </div>
                        )}
                        {item.customNote && (
                          <div className="text-[10px] text-amber-800 italic">Ghi chú: {item.customNote}</div>
                        )}
                      </div>
                      <div className="font-bold text-red-950 font-heritage text-sm">
                        {formatVND(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timeline History */}
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-800 block text-[11px] uppercase">Nhật ký xử lý hệ thống</span>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2">
                    {selectedOrder.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px]">
                        <span className="text-stone-400 font-mono shrink-0">{event.time}</span>
                        <span className="text-stone-800">{event.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staff Private Notes */}
                <div className="space-y-1.5">
                  <span className="font-bold text-stone-800 block text-[11px] uppercase">Ghi chú nội bộ cho nhân viên</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Ghi chú phân bổ nghệ nhân, xe đưa đón..."
                      className="flex-1 p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-2 bg-red-900 text-amber-100 rounded-xl font-semibold flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* CREATE WALK-IN MANUAL ORDER MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-amber-300 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <h3 className="font-bold font-heritage text-base text-stone-900">
                  Tạo Đơn Hàng Tại Quầy / Khách Vãng Lai
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Họ tên khách hàng</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn Khách"
                    value={manualCustomerName}
                    onChange={(e) => setManualCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 000 111"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Email (Tùy chọn)</label>
                    <input
                      type="email"
                      placeholder="guest@gmail.com"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Chọn sản phẩm di sản / tour</label>
                  <select
                    value={manualProductId}
                    onChange={(e) => setManualProductId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                  >
                    {CULTURAL_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.title} — {formatVND(prod.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Ngày diễn ra</label>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Số lượng khách</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={manualGuestCount}
                      onChange={(e) => setManualGuestCount(Number(e.target.value))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-red-900 hover:bg-red-950 text-white font-bold rounded-xl shadow-md transition-all"
                  >
                    Xác nhận xuất vé tại quầy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
