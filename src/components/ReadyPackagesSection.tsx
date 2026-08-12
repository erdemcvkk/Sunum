'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Eye, X, ChevronLeft, ChevronRight, MessageCircle, Sparkles, ShieldCheck, Flame, Zap, Grid } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

interface ReadyPackageItem {
  id: string;
  title: string;
  description?: string;
  price: string;
  badge?: string;
  imagesJson: string;
  isFeatured?: boolean;
  order?: number;
}

const DEFAULT_READY_PACKAGES: ReadyPackageItem[] = [
  {
    id: '1',
    title: 'Premium Ehliyet Kayıt Dönemi Sosyal Medya Paketi',
    description: 'Sürücü kursları için özel hazırlanan, kayıt dönemlerinde dönüşümleri artıran 12 adet yüksek çözünürlüklü sosyal medya tasarım seti.',
    price: '1.499',
    badge: '⚡ Çok Satan Paket',
    imagesJson: JSON.stringify([
      '/tasarimlar/optimized/thumbs/marmara-reklam-post.webp',
      '/tasarimlar/optimized/thumbs/06-07-2026-marmara-post.webp',
      '/tasarimlar/optimized/thumbs/08-07-2026-marmara-post.webp',
      '/tasarimlar/optimized/thumbs/10-06-2026-marmara-post.webp',
    ]),
  },
  {
    id: '2',
    title: 'Motosiklet & Özel Direksiyon Dersi Şablon Paketi',
    description: 'A1, A2, A Sınıfı motor ve B sınıfı birebir direksiyon eğitimlerini öne çıkaran hazır tasarım seti.',
    price: '1.299',
    badge: '🎯 Popüler Şablon',
    imagesJson: JSON.stringify([
      '/tasarimlar/optimized/thumbs/yaman-reklam-post.webp',
      '/tasarimlar/optimized/thumbs/06-07-2026-yaman-post.webp',
      '/tasarimlar/optimized/thumbs/13-07-2026-yaman-post.webp',
      '/tasarimlar/optimized/thumbs/20-07-2026-yaman-post.webp',
    ]),
  },
];

export default function ReadyPackagesSection({ items = [] }: { items?: ReadyPackageItem[] }) {
  const displayItems = items.length > 0 ? items : DEFAULT_READY_PACKAGES;
  const featuredItems = displayItems.filter(p => p.isFeatured);
  const regularItems = displayItems.filter(p => !p.isFeatured);

  const featuredSwiperRef = useRef<SwiperType | null>(null);
  const regularSwiperRef = useRef<SwiperType | null>(null);

  const [activeModalPackage, setActiveModalPackage] = useState<ReadyPackageItem | null>(null);
  const [selectedLargeImageIndex, setSelectedLargeImageIndex] = useState<number | null>(null);

  // Show all modals state
  const [showAllFeaturedModal, setShowAllFeaturedModal] = useState(false);
  const [showAllRegularModal, setShowAllRegularModal] = useState(false);

  const openPackagePreview = (pkg: ReadyPackageItem) => {
    setActiveModalPackage(pkg);
    setSelectedLargeImageIndex(null);
  };

  const closePreview = () => {
    setActiveModalPackage(null);
    setSelectedLargeImageIndex(null);
  };

  const getPackageImages = (pkg: ReadyPackageItem): string[] => {
    try {
      const parsed = typeof pkg.imagesJson === 'string' ? JSON.parse(pkg.imagesJson) : pkg.imagesJson;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const currentModalImages = activeModalPackage ? getPackageImages(activeModalPackage) : [];

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedLargeImageIndex === null || !currentModalImages.length) return;
    setSelectedLargeImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : currentModalImages.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedLargeImageIndex === null || !currentModalImages.length) return;
    setSelectedLargeImageIndex(prev => (prev !== null && prev < currentModalImages.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (!activeModalPackage && !showAllFeaturedModal && !showAllRegularModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedLargeImageIndex !== null) {
          setSelectedLargeImageIndex(null);
        } else if (activeModalPackage) {
          closePreview();
        } else {
          setShowAllFeaturedModal(false);
          setShowAllRegularModal(false);
        }
      }
      if (selectedLargeImageIndex !== null) {
        if (e.key === 'ArrowLeft') handlePrevImage();
        if (e.key === 'ArrowRight') handleNextImage();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalPackage, selectedLargeImageIndex, currentModalImages, showAllFeaturedModal, showAllRegularModal]);

  return (
    <section id="hazir-paketler" className="py-12 bg-white text-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">

        {/* ===== FEATURED / FIRSAT PAKETLERİ SECTION ===== */}
        {featuredItems.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            {/* Header bar with Count & "Tümünü Gör" */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  🔥 Fırsat Paketleri
                </h3>
                <span className="bg-orange-100 text-orange-700 border border-orange-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {featuredItems.length} Paket
                </span>
              </div>
              <button
                onClick={() => setShowAllFeaturedModal(true)}
                className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Tümünü Gör</span>
                <span className="text-[10px] bg-orange-500 text-white rounded-full px-1.5 py-0.2 font-extrabold">{featuredItems.length}</span>
              </button>
            </div>

            {/* Slider */}
            <div className="relative group/slider">
              {featuredItems.length > 1 && (
                <>
                  <button
                    onClick={() => featuredSwiperRef.current?.slidePrev()}
                    className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-orange-200 text-orange-500 hover:bg-orange-50 flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={() => featuredSwiperRef.current?.slideNext()}
                    className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-orange-200 text-orange-500 hover:bg-orange-50 flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
              <Swiper
                onSwiper={(swiper) => { featuredSwiperRef.current = swiper; }}
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                loop={featuredItems.length > 1}
                autoplay={featuredItems.length > 1 ? { delay: 6000, disableOnInteraction: false } : false}
              >
                {featuredItems.map((pkg) => {
                  const pkgImages = getPackageImages(pkg);
                  return (
                    <SwiperSlide key={`featured-${pkg.id}`}>
                      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-[2px] shadow-2xl shadow-orange-500/20">
                        <div className="bg-white rounded-[22px] p-6 sm:p-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-orange-100 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-red-50 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-400/30 animate-pulse">
                                <Flame className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-md">
                                    <Zap className="w-3.5 h-3.5" /> FIRSAT PAKETİ
                                  </span>
                                  {pkg.badge && (
                                    <span className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold">
                                      {pkg.badge}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Sınırlı Süre Teklifi
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-400 block font-medium">Paket Fiyatı</span>
                              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 tracking-tight">
                                ₺{pkg.price}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 relative z-10 leading-snug">{pkg.title}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10 max-w-3xl">{pkg.description}</p>

                          {pkgImages.length > 0 && (
                            <div className="mb-6 relative z-10">
                              <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
                                <span>Paket İçeriği ({pkgImages.length} Görsel)</span>
                                <span className="text-orange-500 hover:underline cursor-pointer flex items-center gap-1 font-semibold" onClick={() => openPackagePreview(pkg)}>
                                  <Eye className="w-3.5 h-3.5" /> Tümünü İncele
                                </span>
                              </div>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 cursor-pointer select-none" onClick={() => openPackagePreview(pkg)} onContextMenu={(e) => e.preventDefault()}>
                                {pkgImages.slice(0, 6).map((imgUrl, i) => (
                                  <div key={i} className="aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden relative border border-orange-200 group/img">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imgUrl} alt={`${pkg.title} Görsel ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 pointer-events-none" draggable={false} />
                                    <div className="absolute inset-0 bg-black/5 pointer-events-none flex items-center justify-center">
                                      <span className="text-[8px] text-white/50 font-extrabold tracking-widest uppercase -rotate-12 border-y border-white/15 px-1 bg-black/10">ÖRNEK</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                            <button data-track="ready-package-preview" onClick={() => openPackagePreview(pkg)} className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                              <Eye className="w-4 h-4" /> İncele
                            </button>
                            <a
                              data-track="featured-package-buy"
                              href={`https://wa.me/905466308246?text=${encodeURIComponent(`Merhaba, "${pkg.title}" Fırsat Paketi hakkında bilgi almak istiyorum.`)}`}
                              target="_blank" rel="noreferrer"
                              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-extrabold text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="w-5 h-5" /> FIRSATI YAKALA
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        )}

        {/* ===== NORMAL PAKETLER SECTION ===== */}
        {regularItems.length > 0 && (
          <div className="max-w-6xl mx-auto">
            {/* Header bar with Count & "Tümünü Gör" */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  📦 Hazır Tasarım Paketleri
                </h3>
                <span className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {regularItems.length} Paket
                </span>
              </div>
              <button
                onClick={() => setShowAllRegularModal(true)}
                className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Tümünü Gör</span>
                <span className="text-[10px] bg-blue-600 text-white rounded-full px-1.5 py-0.2 font-extrabold">{regularItems.length}</span>
              </button>
            </div>

            {/* Slider */}
            <div className="relative group/slider2">
              {regularItems.length > 2 && (
                <>
                  <button
                    onClick={() => regularSwiperRef.current?.slidePrev()}
                    className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 flex items-center justify-center transition-all opacity-0 group-hover/slider2:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={() => regularSwiperRef.current?.slideNext()}
                    className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 flex items-center justify-center transition-all opacity-0 group-hover/slider2:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
              <Swiper
                onSwiper={(swiper) => { regularSwiperRef.current = swiper; }}
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                loop={regularItems.length > 2}
                autoplay={regularItems.length > 1 ? { delay: 5000, disableOnInteraction: false } : false}
                breakpoints={{
                  768: { slidesPerView: 2 },
                }}
              >
                {regularItems.map((pkg, idx) => {
                  const pkgImages = getPackageImages(pkg);
                  return (
                    <SwiperSlide key={pkg.id || idx} className="!h-auto">
                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group h-full">
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                              {pkg.badge || 'Hazır Tasarım Seti'}
                            </span>
                            <span className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Tam Uyumlu
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 mb-3 group-hover:text-blue-600 transition-colors leading-snug">{pkg.title}</h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">{pkg.description}</p>

                          {pkgImages.length > 0 && (
                            <div className="mb-6">
                              <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
                                <span>Paket İçeriği ({pkgImages.length} Görsel)</span>
                                <span className="text-blue-500 group-hover:underline cursor-pointer flex items-center gap-1 font-semibold" onClick={() => openPackagePreview(pkg)}>
                                  <Eye className="w-3.5 h-3.5" /> Tümünü İncele
                                </span>
                              </div>
                              <div className="grid grid-cols-4 gap-2 cursor-pointer select-none" onClick={() => openPackagePreview(pkg)} onContextMenu={(e) => e.preventDefault()}>
                                {pkgImages.slice(0, 4).map((imgUrl, i) => (
                                  <div key={i} className="aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 group/img">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={imgUrl} alt={`${pkg.title} Görsel ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 pointer-events-none" draggable={false} />
                                    <div className="absolute inset-0 bg-black/5 pointer-events-none flex items-center justify-center">
                                      <span className="text-[8px] text-white/50 font-extrabold tracking-widest uppercase -rotate-12 border-y border-white/15 px-1 bg-black/10">ÖRNEK</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Paket Fiyatı</span>
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">₺{pkg.price}</span>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button data-track="ready-package-preview" onClick={() => openPackagePreview(pkg)} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5">
                              <Eye className="w-4 h-4" /> İncele
                            </button>
                            <a
                              data-track="ready-package-buy"
                              href={`https://wa.me/905466308246?text=${encodeURIComponent(`Merhaba, "${pkg.title}" hazır paket tasarımı hakkında bilgi almak istiyorum.`)}`}
                              target="_blank" rel="noreferrer"
                              className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" /> PAKETİ AL
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        )}

      </div>

      {/* ===== TÜM FIRSAT PAKETLERİ GRID MODALI ===== */}
      <AnimatePresence>
        {showAllFeaturedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto select-none"
            onClick={() => setShowAllFeaturedModal(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 md:p-8 my-8 shadow-2xl overflow-hidden flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-xl text-white shadow-md">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Tüm Fırsat Paketleri ({featuredItems.length})</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Sürücü kurslarına özel kaçırılmayacak fırsat tasarımları</p>
                  </div>
                </div>
                <button onClick={() => setShowAllFeaturedModal(false)} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[65vh] pr-2 space-y-6">
                {featuredItems.map((pkg) => {
                  const pkgImages = getPackageImages(pkg);
                  return (
                    <div key={pkg.id} className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-[2px]">
                      <div className="bg-white rounded-[14px] p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase">
                            <Zap className="w-3 h-3" /> FIRSAT PAKETİ
                          </span>
                          <span className="text-2xl font-extrabold text-orange-600">₺{pkg.price}</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{pkg.title}</h4>
                        <p className="text-xs text-slate-600 mb-4">{pkg.description}</p>
                        
                        {pkgImages.length > 0 && (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
                            {pkgImages.slice(0, 6).map((imgUrl, i) => (
                              <div key={i} className="aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden relative border border-orange-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button onClick={() => { setShowAllFeaturedModal(false); openPackagePreview(pkg); }} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs">
                            <Eye className="w-4 h-4 inline mr-1" /> İncele
                          </button>
                          <a
                            href={`https://wa.me/905466308246?text=${encodeURIComponent(`Merhaba, "${pkg.title}" Fırsat Paketi hakkında bilgi almak istiyorum.`)}`}
                            target="_blank" rel="noreferrer"
                            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-extrabold text-xs text-center flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-4 h-4" /> FIRSATI YAKALA
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== TÜM NORMAL PAKETLER GRID MODALI ===== */}
      <AnimatePresence>
        {showAllRegularModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto select-none"
            onClick={() => setShowAllRegularModal(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 md:p-8 my-8 shadow-2xl overflow-hidden flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Tüm Hazır Tasarım Paketleri ({regularItems.length})</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Sürücü kursunuz için özenle tasarlanmış şablon setleri</p>
                  </div>
                </div>
                <button onClick={() => setShowAllRegularModal(false)} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[65vh] pr-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {regularItems.map((pkg) => {
                  const pkgImages = getPackageImages(pkg);
                  return (
                    <div key={pkg.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-300 transition-colors">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {pkg.badge || 'Hazır Set'}
                          </span>
                          <span className="text-xl font-extrabold text-slate-900">₺{pkg.price}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">{pkg.title}</h4>
                        <p className="text-xs text-slate-600 mb-3">{pkg.description}</p>
                        
                        {pkgImages.length > 0 && (
                          <div className="grid grid-cols-4 gap-1.5 mb-4">
                            {pkgImages.slice(0, 4).map((imgUrl, i) => (
                              <div key={i} className="aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-slate-200">
                        <button onClick={() => { setShowAllRegularModal(false); openPackagePreview(pkg); }} className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs">
                          <Eye className="w-3.5 h-3.5 inline mr-1" /> İncele
                        </button>
                        <a
                          href={`https://wa.me/905466308246?text=${encodeURIComponent(`Merhaba, "${pkg.title}" hazır paket tasarımı hakkında bilgi almak istiyorum.`)}`}
                          target="_blank" rel="noreferrer"
                          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs text-center flex items-center justify-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> PAKETİ AL
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== PACKAGE DETAILS PREVIEW MODAL ===== */}
      <AnimatePresence>
        {activeModalPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto select-none"
            onClick={closePreview}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 md:p-8 my-8 shadow-2xl overflow-hidden flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {activeModalPackage.badge || 'Hazır Set'}
                  </span>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-2 leading-tight">{activeModalPackage.title}</h3>
                  <p className="text-slate-500 text-xs md:text-sm mt-1 leading-relaxed">{activeModalPackage.description}</p>
                </div>
                <button onClick={closePreview} className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0" aria-label="Kapat">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Tüm Tasarımlar ({currentModalImages.length} Görsel)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {currentModalImages.map((imgUrl, idx) => (
                    <div key={idx} onClick={() => setSelectedLargeImageIndex(idx)} className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-200 hover:border-blue-500/80 cursor-zoom-in transition-all duration-300 group/item shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt={`${activeModalPackage.title} Görsel ${idx + 1}`} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500 pointer-events-none" loading="lazy" />
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none overflow-hidden">
                        <div className="absolute -rotate-25 whitespace-nowrap border-y border-white/20 bg-black/40 backdrop-blur-[1px] py-1 px-3 shadow-md">
                          <span className="text-white/80 font-black text-[9px] sm:text-xs tracking-[0.2em] uppercase select-none">ÖRNEK TASARIM</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Toplam Paket Fiyatı</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-emerald-600 tracking-tight">₺{activeModalPackage.price}</span>
                </div>
                <a
                  href={`https://wa.me/905466308246?text=${encodeURIComponent(`Merhaba, "${activeModalPackage.title}" hazır paket tasarımı hakkında sipariş vermek istiyorum.`)}`}
                  target="_blank" rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> <span className="hidden sm:inline">BİLGİ AL VE WHATSAPP&apos;TAN SİPARİŞ VER</span><span className="sm:hidden">WHATSAPP&apos;TAN SİPARİŞ VER</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LIGHTBOX FOR LARGE VIEW ===== */}
      <AnimatePresence>
        {selectedLargeImageIndex !== null && activeModalPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 select-none"
            onClick={() => setSelectedLargeImageIndex(null)}
          >
            <button onClick={() => setSelectedLargeImageIndex(null)} className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="absolute top-6 left-6 z-20 text-white/60 text-sm font-semibold">
              {selectedLargeImageIndex + 1} / {currentModalImages.length} — {activeModalPackage.title}
            </div>
            <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-colors">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-colors">
              <ChevronRight className="w-7 h-7" />
            </button>
            <motion.div
              key={selectedLargeImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[80vh] z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentModalImages[selectedLargeImageIndex]} alt="" className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl pointer-events-none" draggable={false} />
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 overflow-hidden">
                <div className="flex justify-between items-center opacity-40 text-xs font-bold text-white tracking-widest uppercase">
                  <span>HAZIR TASARIM SETİ</span>
                  <span>ÖNİZLEME</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center -rotate-25">
                  <div className="bg-black/50 border-y border-white/20 py-2 px-6 backdrop-blur-sm">
                    <span className="text-white/45 font-black text-lg md:text-2xl tracking-[0.2em] uppercase">HAZIR PAKET TASARIM • ÖRNEK</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
