'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight, ShieldAlert, Tag, Info } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  category: string;
  imageUrl: string;
  title: string | null;
  order: number;
}

interface GalleryCategory {
  id: string;
  name: string;
  order: number;
}

export default function DesignGallery({ 
  images = [], 
  categories = [] 
}: { 
  images?: GalleryImage[];
  categories?: GalleryCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [shuffledAllImages, setShuffledAllImages] = useState<GalleryImage[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Shuffle images for "Tümü" category when images change
  useEffect(() => {
    if (images.length > 0) {
      const shuffled = [...images].sort(() => Math.random() - 0.5);
      setShuffledAllImages(shuffled);
    } else {
      setShuffledAllImages([]);
    }
  }, [images]);

  // Reset showAll state on category change
  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    setShowAll(false);
  };

  // Filter images based on dynamic category name
  const filteredImages = activeCategory === 'Tümü'
    ? shuffledAllImages
    : images.filter(img => img.category === activeCategory);

  // Pagination / Limit logic: show only 8 items initially, show all on click
  const visibleImages = showAll ? filteredImages : filteredImages.slice(0, 8);

  const isRealImage = (url: string) => url && (url.startsWith('/') || url.startsWith('http'));

  const openLightbox = (idx: number) => {
    if (isRealImage(visibleImages[idx]?.imageUrl)) {
      setLightboxIndex(idx);
    }
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goToPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    let prev = lightboxIndex - 1;
    while (prev >= 0 && !isRealImage(visibleImages[prev]?.imageUrl)) {
      prev--;
    }
    if (prev >= 0) setLightboxIndex(prev);
  }, [lightboxIndex, visibleImages]);

  const goToNext = useCallback(() => {
    if (lightboxIndex === null) return;
    let next = lightboxIndex + 1;
    while (next < visibleImages.length && !isRealImage(visibleImages[next]?.imageUrl)) {
      next++;
    }
    if (next < visibleImages.length) setLightboxIndex(next);
  }, [lightboxIndex, visibleImages]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, goToPrev, goToNext]);

  const currentImage = lightboxIndex !== null ? visibleImages[lightboxIndex] : null;
  const tabList = ['Tümü', ...categories.map(c => c.name)];

  return (
    <>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fantas-dark">
              TASARIM <span className="text-transparent bg-clip-text bg-gradient-to-r from-fantas-blue to-indigo-500">GALERİSİ</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-fantas-blue to-indigo-500 mx-auto mt-4 rounded-full mb-6" />
            
            {/* Disclaimers & Warnings */}
            <div className="flex flex-col gap-3 max-w-3xl mx-auto mb-8 select-none">
              <div className="inline-flex items-center justify-center gap-2.5 bg-red-50 border border-red-100 text-red-700 px-5 py-3 rounded-2xl text-xs md:text-sm font-medium shadow-sm text-left">
                <ShieldAlert className="w-4.5 h-4.5 text-red-600 shrink-0" />
                <span>
                  <strong>Yasal Uyarı:</strong> Bu galeride yer alan örnek tasarımların kopyalanması, izinsiz kullanılması veya çoğaltılması durumunda yasal yollara başvurulacaktır.
                </span>
              </div>
              <div className="inline-flex items-center justify-center gap-2.5 bg-blue-50 border border-blue-100 text-blue-700 px-5 py-3 rounded-2xl text-xs md:text-sm font-medium shadow-sm text-left">
                <Info className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                <span>
                  <strong>Bilgilendirme:</strong> Galerideki tasarımlar daha önce hazırlanmış örnekler olup, içerdiği kampanya, indirim ve fiyat tekliflerinin güncel bir geçerliliği bulunmamaktadır.
                </span>
              </div>
            </div>

            {/* Dynamic Category Tabs */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto mt-2">
                {tabList.map(categoryName => (
                  <button
                    key={categoryName}
                    onClick={() => handleCategoryChange(categoryName)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeCategory === categoryName
                        ? 'bg-fantas-blue text-white shadow-md shadow-blue-500/20'
                        : 'border border-gray-200 text-gray-500 hover:border-fantas-blue hover:text-fantas-blue bg-white'
                    }`}
                  >
                    {categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Image Grid */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 select-none">
            <AnimatePresence mode="popLayout">
              {visibleImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                  onClick={() => openLightbox(idx)}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {isRealImage(image.imageUrl) && (
                    <>
                      <Image
                        src={image.imageUrl}
                        alt={image.title || image.category}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        draggable={false}
                      />
                      
                      {/* Grid Watermark Layer */}
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 overflow-hidden z-10">
                        {/* Top-Right Badge */}
                        <div className="self-end bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white/80 border border-white/10 tracking-widest uppercase">
                          SOSYAL MEDYA AJANSI
                        </div>

                        {/* Diagonal Center Watermark Text */}
                        <div className="absolute inset-0 flex items-center justify-center -rotate-25 pointer-events-none">
                          <span className="text-white/35 font-black text-xs md:text-sm tracking-[0.2em] whitespace-nowrap drop-shadow-md select-none uppercase border-y border-white/20 py-1 px-4 bg-black/10 backdrop-blur-[1px]">
                            SOSYAL MEDYA AJANSI • ÖRNEK TASARIM
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4 md:p-5 z-20">
                    <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.15em] mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {image.category}
                    </span>
                    <h3 className="text-white font-bold text-sm md:text-base leading-snug">{image.title || 'Örnek Tasarım'}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {visibleImages.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5Z" />
                </svg>
              </div>
              Bu kategoride henüz tasarım bulunmamaktadır.
            </div>
          )}

          {/* Premium styled "Show More" / "Tüm Tasarımları Gör" Button */}
          {filteredImages.length > 8 && !showAll && (
            <div className="mt-16 text-center">
              <button 
                onClick={() => setShowAll(true)}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-fantas-blue to-indigo-600 text-white px-12 py-5 rounded-full font-extrabold text-sm md:text-base shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 select-none cursor-pointer tracking-wider uppercase border border-white/10"
              >
                {/* Glow layer */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />
                
                TÜM TASARIMLARI GÖR ({filteredImages.length})
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== FULLSCREEN LIGHTBOX WITH WATERMARK ===== */}
      <AnimatePresence>
        {lightboxIndex !== null && currentImage && isRealImage(currentImage.imageUrl) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
            onClick={closeLightbox}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 z-20 text-white/60 text-sm font-medium">
              {lightboxIndex + 1} / {visibleImages.filter(img => isRealImage(img.imageUrl)).length}
            </div>

            {/* Prev Button */}
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                aria-label="Önceki"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Next Button */}
            {lightboxIndex < visibleImages.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                aria-label="Sonraki"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}

            {/* Full Image Container */}
            <motion.div
              key={currentImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-[90vw] max-h-[85vh] z-[1] overflow-hidden rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage.imageUrl}
                alt={currentImage.title || currentImage.category}
                className="max-w-full max-h-[85vh] object-contain rounded-lg pointer-events-none select-none"
                draggable={false}
              />

              {/* Watermark Protection Overlays */}
              <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-6 overflow-hidden">
                
                {/* Top Repeated Watermark Strip */}
                <div className="w-full flex justify-between items-center opacity-40 text-[10px] md:text-xs font-bold text-white tracking-widest uppercase">
                  <span>SOSYAL MEDYA AJANSI</span>
                  <span>TÜM HAKLARI SAKLIDIR</span>
                  <span>SOSYAL MEDYA AJANSI</span>
                </div>

                {/* Big Diagonal Center Watermark */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-25 pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-[2px] border-y border-white/30 py-3 px-8 text-center shadow-2xl">
                    <span className="text-white/45 font-black text-xl md:text-3xl tracking-[0.25em] block uppercase drop-shadow-lg">
                      SOSYAL MEDYA AJANSI
                    </span>
                    <span className="text-white/35 font-extrabold text-xs md:text-sm tracking-[0.2em] block mt-1 uppercase">
                      TELİF HAKKI İLE KORUNMAKTADIR • ÖRNEK TASARIM
                    </span>
                  </div>
                </div>

                {/* Bottom Protection Bar */}
                <div className="w-full flex items-center justify-between opacity-50 text-[10px] text-white font-semibold">
                  <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    <span>İzinsiz Kopyalanamaz & Kullanılamaz</span>
                  </div>
                </div>
              </div>

              {/* Caption Bar */}
              {(currentImage.title || currentImage.category) && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-lg px-6 py-4 z-10">
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Tag className="w-3 h-3 inline" /> {currentImage.category}
                  </span>
                  <h3 className="text-white font-bold text-base md:text-lg">{currentImage.title || 'Örnek Tasarım'}</h3>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
