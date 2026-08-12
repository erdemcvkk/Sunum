'use client';

import { Check, Rocket, Zap, Crown, Sparkles, Info, MessageCircle } from 'lucide-react';

interface PricingPackage {
  id: string;
  title: string;
  postCount: number;
  price: string;
  features: string; // JSON string
  thumbnailImages?: string; // JSON string
  isPopular: boolean;
  order: number;
}

const DEFAULT_PACKAGES: PricingPackage[] = [
  {
    id: '1',
    title: 'BAŞLANGIÇ PAKETİ',
    postCount: 6,
    price: '6.999',
    features: JSON.stringify([
      '6 Post Tasarımı',
      '6 Story Tasarımı',
      'Marka Renklerinize Özel',
      'Kendi Logonuzla Kullanım',
      'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
      'Size Özel Şablon (Telefon Numarası, Adres vb.)',
      'Özel Gün Tasarımları Dahil',
      '1 Revize Hakkı',
      'Standart Tasarım Desteği',
      '7 İş Günü İçerisinde Teslimat',
      'Tek Seferlik Tasarım Paketi',
    ]),
    isPopular: false,
    order: 1,
  },
  {
    id: '2',
    title: 'STANDART PAKET',
    postCount: 8,
    price: '9.999',
    features: JSON.stringify([
      '8 Post Tasarımı',
      '8 Story Tasarımı',
      'Marka Renklerinize Özel',
      'Kendi Logonuzla Kullanım',
      'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
      'Size Özel Şablon (Telefon Numarası, Adres vb.)',
      'Özel Gün Tasarımları Dahil',
      '2 Revize Hakkı',
      'Kampanya Tasarımları',
      '7 İş Günü İçerisinde Teslimat',
      'Tek Seferlik Tasarım Paketi',
    ]),
    isPopular: false,
    order: 2,
  },
  {
    id: '3',
    title: 'PROFESYONEL PAKET',
    postCount: 12,
    price: '12.999',
    features: JSON.stringify([
      '12 Post Tasarımı',
      '12 Story Tasarımı',
      'Marka Renklerinize Özel',
      'Kendi Logonuzla Kullanım',
      'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
      'Size Özel Şablon (Telefon Numarası, Adres vb.)',
      'Özel Gün Tasarımları Dahil',
      '3 Revize Hakkı',
      'Özel Kampanya Tasarımları',
      'Öncelikli Destek',
      '5-7 İş Günü İçerisinde Teslimat',
      'Tek Seferlik Tasarım Paketi',
    ]),
    isPopular: true,
    order: 3,
  },
  {
    id: '4',
    title: 'PREMIUM PAKET',
    postCount: 15,
    price: '15.999',
    features: JSON.stringify([
      '15 Post Tasarımı',
      '15 Story Tasarımı',
      'Marka Renklerinize Özel',
      'Kendi Logonuzla Kullanım',
      'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)',
      'Size Özel Şablon (Telefon Numarası, Adres vb.)',
      'Özel Gün Tasarımları Dahil',
      '5 Revize Hakkı',
      'Özel Kampanya Tasarımları',
      'Öncelikli Destek',
    ]),
    isPopular: false,
    order: 4,
  },
];

export default function PricingSection({ packages = [], showMonthlyNote = false }: { packages?: PricingPackage[], showMonthlyNote?: boolean }) {
  const displayPackages = packages.length > 0 ? packages : DEFAULT_PACKAGES;

  const getPackageIcon = (index: number) => {
    switch (index % 4) {
      case 0: return Zap;
      case 1: return Rocket;
      case 2: return Sparkles;
      case 3: return Crown;
      default: return Zap;
    }
  };

  const formattedPrice = (rawPrice: string) => {
    const clean = rawPrice.replace(/[^\d.,]/g, '').trim();
    return clean ? `₺${clean}` : rawPrice;
  };

  return (
    <section id="paketler" className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-fantas-blue px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            ŞEFFAF & TEK SEFERLİK FİYATLANDIRMA
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-fantas-dark tracking-tight">
            SOSYAL MEDYA <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fantas-blue via-indigo-600 to-blue-700">
              TASARIM PAKETLERİMİZ
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-fantas-blue to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
            Markanızın ihtiyacına en uygun paketi seçin, yüksek kaliteli içeriklerinizle sosyal medyada hemen öne geçin.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 items-stretch max-w-7xl mx-auto mb-12">
          {displayPackages.map((pkg, idx) => {
            let features: string[] = [];
            try {
              const rawFeatures = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features;
              features = Array.isArray(rawFeatures) 
                ? rawFeatures.filter((f: string) => !f.toLowerCase().includes('reels kapak'))
                : [];

              if (!features.some(f => f.toLowerCase().includes('marka renkler'))) {
                features.splice(2, 0, 'Marka Renklerinize Özel');
              }
              if (!features.some(f => f.toLowerCase().includes('kendi logonuzla'))) {
                features.splice(3, 0, 'Kendi Logonuzla Kullanım');
              }
              if (!features.some(f => f.toLowerCase().includes('araçlara özel') || f.toLowerCase().includes('otomobil'))) {
                features.splice(4, 0, 'İstediğiniz Araçlara Özel (Otomobil, Motosiklet, Tır & Kamyon)');
              }
              if (!features.some(f => f.toLowerCase().includes('şablon') || f.toLowerCase().includes('telefon numarası'))) {
                features.splice(5, 0, 'Size Özel Şablon (Telefon Numarası, Adres vb.)');
              }
              if (!features.some(f => f.toLowerCase().includes('özel gün') || f.toLowerCase().includes('günler dahil'))) {
                features.splice(6, 0, 'Özel Gün Tasarımları Dahil');
              }
            } catch {
              features = [];
            }

            const Icon = getPackageIcon(idx);
            const isPopular = pkg.isPopular || pkg.title.toLowerCase().includes('profesyonel');

            return (
              <div 
                key={pkg.id || idx} 
                className={`relative bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 ${
                  isPopular 
                    ? 'border-2 border-fantas-blue shadow-2xl shadow-blue-500/15 ring-4 ring-blue-500/10 lg:scale-[1.03] z-20' 
                    : 'border border-gray-200/90 shadow-md hover:shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[11px] font-extrabold tracking-wider shadow-lg flex items-center gap-1.5 uppercase whitespace-nowrap">
                    ⭐ EN POPÜLER
                  </div>
                )}

                <div>
                  {/* Title & Icon Header */}
                  <div className="flex justify-between items-start mb-5 pt-1">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-snug">
                        {pkg.title}
                      </h3>
                      <div className="inline-flex items-center gap-1 text-fantas-blue font-semibold text-xs mt-1 bg-blue-50 px-2.5 py-0.5 rounded-md">
                        <span>{pkg.postCount} Post</span>
                        <span>+</span>
                        <span>{pkg.postCount} Story</span>
                      </div>
                    </div>
                    <div className={`p-2.5 rounded-2xl shrink-0 ${isPopular ? 'bg-fantas-blue text-white shadow-md' : 'bg-blue-50 text-fantas-blue'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Clean Price Display (NO /ay label) */}
                  <div className="mb-6 pb-5 border-b border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                        {formattedPrice(pkg.price)}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 mt-1 block">Tek seferlik ödeme</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-snug">
                        <div className="bg-emerald-50 text-emerald-600 p-0.5 rounded-full mt-0.5 shrink-0 border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className={feature.toLowerCase().includes('tek seferlik') ? 'font-semibold text-gray-900' : ''}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Package CTA Button */}
                <a
                  href={`https://wa.me/905466308246?text=${encodeURIComponent(`Merhaba, "${pkg.title}" (${formattedPrice(pkg.price)}) paketiniz hakkında bilgi almak ve sipariş vermek istiyorum.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  data-track="package-buy"
                  className={`w-full py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-300 text-center shadow-md flex items-center justify-center gap-2 ${
                    isPopular 
                      ? 'bg-fantas-blue text-white hover:bg-blue-700 shadow-blue-500/25 hover:shadow-blue-500/40' 
                      : 'bg-gray-900 text-white hover:bg-fantas-blue shadow-gray-900/10'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" /> PAKETİ SEÇ
                </a>

              </div>
            );
          })}
        </div>

        {/* Note Footer Box below Cards */}
        <div className="max-w-3xl mx-auto bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm text-center sm:text-left">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 hidden sm:block">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold text-amber-950 block sm:inline">Not: </span>
            Paketlerimiz aylık abonelik değildir. Belirtilen tasarımlar tek seferlik olarak özenle hazırlanır ve tarafınıza eksiksiz teslim edilir.
          </div>
        </div>

        {/* Optional Monthly Note */}
        {showMonthlyNote && (
          <div className="max-w-3xl mx-auto mt-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm text-center sm:text-left">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 hidden sm:block">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              <span className="font-bold text-emerald-950 block sm:inline">Aylık Paket Anlaşmaları: </span>
              Aylık paket anlaşmalarında markanıza özel marketing planının oluşturulması ve sosyal medya paylaşımlarının düzenli olarak yapılması pakete dahildir.
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
