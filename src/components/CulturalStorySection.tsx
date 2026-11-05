import React from 'react';
import { Award, Compass, HeartHandshake, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export const CulturalStorySection: React.FC = () => {
  const heritageSites = [
    {
      title: 'Hoàng Thành Thăng Long',
      year: 'UNESCO 2010',
      desc: 'Trung tâm quyền lực chính trị liên tục suốt 13 thế kỷ, hội tụ tinh hoa văn hóa Đại Việt qua các triều đại Lý, Trần, Lê, Mạc, Nguyễn.',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Quần Thể Di Tích Cố Đô Huế',
      year: 'UNESCO 1993',
      desc: 'Kinh đô phong kiến cuối cùng với hệ thống thành quách, lăng tẩm uy nghiêm và kiệt tác Nhã nhạc Cung đình truyền khẩu của nhân loại.',
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Đô Thị Cổ Hội An',
      year: 'UNESCO 1999',
      desc: 'Thương cảng quốc tế sầm uất thế kỷ 16-17 với những mái ngói rêu phong, hội quán cổ kính và sắc màu đèn lồng lung linh bên dòng sông Hoài.',
      image: 'https://images.unsplash.com/photo-1557750298-c7a0a0dc7b71?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Làng Nghề Truyền Thống Việt',
      year: 'Di Sản Quốc Gia',
      desc: 'Hơn 5.400 làng nghề thủ công từ gốm Bát Tràng, lụa Vạn Phúc đến tranh Đông Hồ gìn giữ bàn tay tài hoa của các nghệ nhân đất Việt.',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-amber-50/30 to-amber-100/60 border-t border-b border-amber-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/10 text-red-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-red-800" />
            <span>Giá Trị Văn Hóa Vô Giá</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heritage text-stone-900">
            Hành Trình Gìn Giữ & Lan Tỏa Hồn Cốt Dân Tộc
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Mỗi trải nghiệm tại Hồn Việt không chỉ là một chuyến du ngoạn, mà là nhịp cầu kết nối du khách với những nghệ nhân lão thành — những "báu vật nhân văn sống" đang ngày đêm thổi hồn cho di sản nghìn năm.
          </p>
        </div>

        {/* 4 Heritage Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {heritageSites.map((site, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-lg transition-all group"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                <img
                  src={site.image}
                  alt={site.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-400/30">
                  {site.year}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-stone-900 text-sm font-heritage group-hover:text-red-900 transition-colors">
                  {site.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {site.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Commitments Bar */}
        <div className="mt-12 p-6 rounded-3xl bg-amber-950 text-amber-100 border border-amber-400/30 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-900 text-amber-300 shrink-0 mx-auto md:mx-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Trải Nghiệm Độc Bản</h4>
              <p className="text-xs text-amber-200/80 mt-0.5">Không thương mại hóa xô bồ, giữ trọn tính chân xác di sản.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-900 text-amber-300 shrink-0 mx-auto md:mx-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Đồng Hành Cùng Nghệ Nhân</h4>
              <p className="text-xs text-amber-200/80 mt-0.5">70% doanh thu trực tiếp hỗ trợ nghệ nhân và làng nghề bản địa.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-900 text-amber-300 shrink-0 mx-auto md:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Bảo Hiểm & An Toàn 100%</h4>
              <p className="text-xs text-amber-200/80 mt-0.5">Trọn gói bảo hiểm du lịch và hỗ trợ khách hàng 24/7.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
