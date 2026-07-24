'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Eye, X, ChevronLeft, ChevronRight, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface ReadyPackageItem {
  id: string;
  title: string;
  description?: string;
  price: string;
  badge?: string;
  imagesJson: string; // JSON string
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

  // Active modal image preview state
  const [activeModalPackage, setActiveModalPackage] = useState<ReadyPackageItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const openPackagePreview = (pkg: ReadyPackageItem, imgIdx = 0) => {
    setActiveModalPackage(pkg);
    setActiveImageIndex(imgIdx);
  };

  const closePreview = () => {
    setActiveModalPackage(null);
    setActiveImageIndex(0);
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

  const handlePrevImage = useCallback(() => {
    if (!currentModalImages.length) return;
    setActiveImageIndex(prev => (prev > 0 ? prev - 1 : currentModalImages.length - 1));
  }, [currentModalImages]);

  const handleNextImage = useCallback(() => {
    if (!currentModalImages.length) return;
    setActiveImageIndex(prev => (prev < currentModalImages.length - 1 ? prev + 1 : 0));
  }, [currentModalImages]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!activeModalPackage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalPackage, handlePrevImage, handleNextImage]);

  return (
    <section id="hazir-paketler" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wider uppercase backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            HEMEN TESLİM HAZIR TASARIMLAR
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            HAZIR PAKET <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
              TASARIM SETLERİ
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-slate-300 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
            Sürücü kursunuz için anında kullanıma hazır, yüksek dönüşümlü hazır sosyal medya şablon paketlerimizi inceleyin.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {displayItems.map((pkg, idx) => {
            const pkgImages = getPackageImages(pkg);

            return (
              <motion.div
                key={pkg.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
              >
                <div>
                  {/* Badge & Title */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                      {pkg.badge || 'Hazır Tasarım Seti'}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Tam Uyumlu
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors leading-snug">
                    {pkg.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  {/* Images Thumbnails Grid */}
                  {pkgImages.length > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
                        <span>Paket İçeriği ({pkgImages.length} Görsel)</span>
                        <span className="text-blue-400 group-hover:underline cursor-pointer flex items-center gap-1" onClick={() => openPackagePreview(pkg, 0)}>
                          <Eye className="w-3.5 h-3.5" /> Tümünü İncele
                        </span>
                      </div>
                      
                      <div 
                        className="grid grid-cols-4 gap-2 cursor-pointer select-none"
                        onClick={() => openPackagePreview(pkg, 0)}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        {pkgImages.slice(0, 4).map((imgUrl, i) => (
                          <div key={i} className="aspect-[4/5] bg-slate-900 rounded-xl overflow-hidden relative border border-slate-700/60 group/img">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`${pkg.title} Görsel ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 pointer-events-none"
                              draggable={false}
                            />
                            {/* Watermark Overlay */}
                            <div className="absolute inset-0 bg-black/20 pointer-events-none flex items-center justify-center">
                              <span className="text-[8px] text-white/40 font-extrabold tracking-widest uppercase -rotate-12 border-y border-white/10 px-1">
                                ÖRNEK
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer: Price & WhatsApp Action */}
                <div className="pt-5 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Paket Fiyatı</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      ₺{pkg.price}
                    </span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => openPackagePreview(pkg, 0)}
                      className="px-4 py-3 bg-slate-700/70 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" /> İncele
                    </button>
                    <a
                      href={`https://wa.me/905466308246?text=${encodeURIComponent(`Merhaba, "${pkg.title}" hazır paket tasarımı hakkında bilgi almak istiyorum.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> PAKETİ AL
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* FULLSCREEN PREVIEW LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeModalPackage && currentModalImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none"
            onClick={closePreview}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            {/* Close Button */}
            <button
              onClick={closePreview}
              className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 z-20 text-white/70 text-sm font-semibold">
              {activeImageIndex + 1} / {currentModalImages.length} — {activeModalPackage.title}
            </div>

            {/* Prev */}
            {currentModalImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Next */}
            {currentModalImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}

            {/* Modal Image Box */}
            <motion.div
              key={activeImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[80vh] z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentModalImages[activeImageIndex]}
                alt=""
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl pointer-events-none"
                draggable={false}
              />

              {/* Watermark Protection */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 overflow-hidden">
                <div className="flex justify-between items-center opacity-40 text-xs font-bold text-white tracking-widest uppercase">
                  <span>HAZIR TASARIM SETİ</span>
                  <span>ÖNİZLEME</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center -rotate-25">
                  <div className="bg-black/50 border-y border-white/20 py-2 px-6 backdrop-blur-sm">
                    <span className="text-white/40 font-black text-lg md:text-2xl tracking-[0.2em] uppercase">
                      HAZIR PAKET TASARIM • ÖRNEK
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                <div>
                  <h4 className="text-white font-bold text-sm">{activeModalPackage.title}</h4>
                  <span className="text-emerald-400 font-extrabold text-lg">₺{activeModalPackage.price}</span>
                </div>

                <a
                  href={`https://wa.me/905466308246?text=${encodeURIComponent(`Merhaba, "${activeModalPackage.title}" hazır paket tasarımı hakkında sipariş vermek istiyorum.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-extrabold text-xs transition-all shadow-lg flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> BİLGİ AL VE SİPARİŞ VER
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
