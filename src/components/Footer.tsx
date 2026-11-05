import React from 'react';
import { Compass, PhoneCall, Mail, MapPin, ShieldCheck, Heart, QrCode } from 'lucide-react';

interface FooterProps {
  onOpenTracking: () => void;
  onSelectCategory: (cat: any) => void;
  onToggleAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracking,
  onSelectCategory,
  onToggleAdmin,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 text-xs border-t border-amber-900/40">
      
      {/* Top Banner */}
      <div className="border-b border-stone-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-800 to-amber-900 flex items-center justify-center text-amber-200 border border-amber-500/30">
              <Compass className="w-6 h-6 animate-[spin_15s_linear_infinite]" />
            </div>
            <div>
              <span className="text-xl font-bold font-heritage tracking-wide text-white block">
                HỒN VIỆT HERITAGE
              </span>
              <span className="text-[11px] text-amber-400">
                Tinh Hoa Du Lịch & Di Sản Làng Nghề Việt Nam
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-stone-400 text-[11px]">Cổng thanh toán hỗ trợ:</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-stone-900 text-amber-300 font-bold rounded-lg border border-stone-700 text-[10px]">
                VietQR
              </span>
              <span className="px-2.5 py-1 bg-pink-900/60 text-pink-300 font-bold rounded-lg border border-pink-700 text-[10px]">
                MoMo
              </span>
              <span className="px-2.5 py-1 bg-blue-900/60 text-blue-300 font-bold rounded-lg border border-blue-700 text-[10px]">
                VNPay
              </span>
              <span className="px-2.5 py-1 bg-stone-900 text-stone-300 font-bold rounded-lg border border-stone-700 text-[10px]">
                VISA / Master
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: About */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white font-heritage">Về Dự Án Hồn Việt</h4>
          <p className="text-stone-400 leading-relaxed text-[11px]">
            Hồn Việt là nền tảng số bảo tồn và phát triển du lịch di sản văn hóa, kết nối trực tiếp du khách với hơn 100 nghệ nhân ưu tú và 50 làng nghề truyền thống dọc chiều dài đất nước.
          </p>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Được bảo trợ bởi Hiệp hội Làng nghề & Di sản Văn hóa</span>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white font-heritage">Sản Phẩm Trọng Tâm</h4>
          <ul className="space-y-1.5 text-stone-400">
            <li>
              <button onClick={() => onSelectCategory('tour-disan')} className="hover:text-amber-300 transition-colors">
                • Tour Đêm Hoàng Thành & Cố Đô
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('workshop-nghe')} className="hover:text-amber-300 transition-colors">
                • Workshop Gốm Bát Tràng & Tranh Đông Hồ
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('tinhhoa-thucong')} className="hover:text-amber-300 transition-colors">
                • Lụa Tơ Tằm Vạn Phúc & Trầm Hương Quảng
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('amthuc-nghethuat')} className="hover:text-amber-300 transition-colors">
                • Rối Nước Thăng Long & Nhã Nhạc Cung Đình
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white font-heritage">Dịch Vụ & Hỗ Trợ</h4>
          <ul className="space-y-1.5 text-stone-400">
            <li>
              <button onClick={onOpenTracking} className="hover:text-amber-300 transition-colors text-amber-400 font-semibold">
                • Tra cứu mã đơn & vé điện tử (E-Ticket)
              </button>
            </li>
            <li>
              <button onClick={onToggleAdmin} className="hover:text-amber-300 transition-colors">
                • Cổng quản trị viên (Admin Portal)
              </button>
            </li>
            <li>
              <span className="hover:text-amber-300 transition-colors cursor-pointer">
                • Chính sách hủy & đổi lịch miễn phí 24h
              </span>
            </li>
            <li>
              <span className="hover:text-amber-300 transition-colors cursor-pointer">
                • Quy chuẩn an toàn và bảo hiểm trải nghiệm
              </span>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white font-heritage">Trụ Sở & Liên Hệ</h4>
          <div className="space-y-2 text-stone-400 text-[11px]">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>Hà Nội: 19C Hoàng Diệu, Ba Đình, Hà Nội</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>Huế: 23 Lê Lợi, TP. Huế, Thừa Thiên Huế</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Hotline 24/7: <strong className="text-white">1900 8868</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Email: lienhe@honviet-heritage.vn</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal */}
      <div className="border-t border-stone-900 py-4 px-4 text-center text-stone-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Hồn Việt Heritage. Bản quyền thuộc về Nền tảng Du lịch Di sản Văn hóa Việt Nam.</span>
          <span className="flex items-center gap-1">
            Gìn giữ bằng cả tâm hồn <Heart className="w-3 h-3 text-red-500 fill-red-500" /> và tự hào dân tộc.
          </span>
        </div>
      </div>

    </footer>
  );
};
