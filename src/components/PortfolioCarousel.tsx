'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Grid, Film, UserSquare2, ShieldCheck } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PortfolioItem {
  id: string;
  clientName: string;
  username?: string;
  category?: string;
  bio?: string; // JSON string or text
  link?: string;
  postsCount?: number;
  followers?: string;
  following?: number;
  mockupImageUrl?: string;
  imagesJson?: string; // JSON string
  order?: number;
}

const AVATAR_GRADIENTS = [
  'from-blue-600 via-indigo-600 to-blue-800',
  'from-orange-500 via-red-500 to-amber-600',
  'from-emerald-500 via-teal-600 to-green-700',
  'from-purple-600 via-pink-600 to-rose-700',
  'from-cyan-500 via-blue-600 to-indigo-700',
];

const DEFAULT_HIGHLIGHTS = [
  { name: 'Kayıtlar', icon: '📝' },
  { name: 'Araçlarımız', icon: '🚘' },
  { name: 'Başarılar', icon: '🏆' },
  { name: 'Yorumlar', icon: '⭐' },
];

// Fallback images strictly for initial empty states
const MARMARA_STATIC_IMAGES = [
  '/tasarimlar/optimized/thumbs/marmara-reklam-post.webp',
  '/tasarimlar/optimized/thumbs/06-07-2026-marmara-post.webp',
  '/tasarimlar/optimized/thumbs/08-07-2026-marmara-post.webp',
  '/tasarimlar/optimized/thumbs/10-06-2026-marmara-post.webp',
];

const YAMAN_STATIC_IMAGES = [
  '/tasarimlar/optimized/thumbs/yaman-reklam-post.webp',
  '/tasarimlar/optimized/thumbs/06-07-2026-yaman-post.webp',
  '/tasarimlar/optimized/thumbs/13-07-2026-yaman-post.webp',
  '/tasarimlar/optimized/thumbs/20-07-2026-yaman-post.webp',
];

export default function PortfolioCarousel({ items = [] }: { items?: PortfolioItem[] }) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section id="calismalarimiz" className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-fantas-blue px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-fantas-blue animate-pulse" />
            CANLI PROFiL ÖNİZLEMELERİ
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-fantas-dark tracking-tight">
            DAHA ÖNCE HAZIRLADIĞIMIZ <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fantas-blue to-indigo-600">
              INSTAGRAM PROFİLLERİ
            </span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-fantas-blue to-indigo-500 mx-auto mt-4 rounded-full" />
        </div>

        {safeItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Henüz eklenmiş bir portfolyo bulunmuyor. Admin panelinden yeni bir marka ekleyebilirsiniz.
          </div>
        ) : (
          <div className="relative px-2 md:px-6">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: safeItems.length === 1 ? 1 : 2, spaceBetween: 40 },
                1280: { slidesPerView: safeItems.length === 1 ? 1 : 2, spaceBetween: 50 },
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onInit={(swiper) => {
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              className="pb-4"
            >
              {safeItems.map((item, index) => {
                let bioLines: string[] = [];
                try {
                  const parsed = typeof item.bio === 'string' ? JSON.parse(item.bio || '[]') : item.bio;
                  bioLines = Array.isArray(parsed) ? parsed : [String(parsed || '')];
                } catch {
                  bioLines = item.bio ? [item.bio] : [];
                }

                // Parse DB images dynamically
                let images: string[] = [];
                try {
                  const parsedImg = typeof item.imagesJson === 'string' ? JSON.parse(item.imagesJson || '[]') : item.imagesJson;
                  images = Array.isArray(parsedImg) ? parsedImg : [];
                } catch {
                  images = [];
                }

                // FALLBACK ONLY IF DB IMAGES ARE COMPLETELY EMPTY
                if (images.length === 0) {
                  if (item.clientName?.toLowerCase().includes('marmara')) {
                    images = MARMARA_STATIC_IMAGES;
                  } else if (item.clientName?.toLowerCase().includes('yaman')) {
                    images = YAMAN_STATIC_IMAGES;
                  }
                }

                const clientNameStr = item.clientName || 'Sürücü Kursu';
                const username = (item.username && item.username.trim() !== '') 
                  ? item.username 
                  : clientNameStr.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                const avatarGradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
                const avatarLetter = clientNameStr.charAt(0).toUpperCase();

                return (
                  <SwiperSlide key={item.id || index} className="h-auto py-4">
                    {/* REALISTIC 3D IPHONE 16 PRO MAX FRAME */}
                    <div className="relative w-[280px] sm:w-[310px] md:w-[320px] aspect-[9/19] mx-auto transition-all duration-500 hover:scale-[1.02] group">
                      
                      {/* Outer Titanium Body & Shadow */}
                      <div className="absolute inset-0 rounded-[52px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-[10px] shadow-none border border-slate-600/80 ring-1 ring-black/40">
                        
                        {/* Metallic Highlight Bezels */}
                        <div className="w-full h-full rounded-[44px] bg-black p-[3px] border border-slate-900 shadow-inner relative flex flex-col overflow-hidden">
                          
                          {/* Hardware Buttons */}
                          <div className="absolute -left-[13px] top-24 w-[3px] h-6 bg-gradient-to-r from-slate-600 to-slate-800 rounded-l-sm" />
                          <div className="absolute -left-[13px] top-34 w-[3px] h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-l-sm" />
                          <div className="absolute -left-[13px] top-48 w-[3px] h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-l-sm" />
                          <div className="absolute -right-[13px] top-36 w-[3px] h-14 bg-gradient-to-l from-slate-600 to-slate-800 rounded-r-sm" />

                          {/* SCREEN CONTAINER */}
                          <div className="w-full h-full bg-white rounded-[41px] overflow-hidden flex flex-col justify-between relative select-none">
                            
                            {/* Dynamic Island Pill */}
                            <div className="absolute top-2 inset-x-0 z-30 flex justify-center pointer-events-none">
                              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 shadow-md">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                                  <div className="w-1 h-1 rounded-full bg-blue-950" />
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 animate-pulse" />
                              </div>
                            </div>

                            {/* iOS Status Bar */}
                            <div className="pt-2.5 px-5 pb-1 bg-white flex items-center justify-between z-20 shrink-0">
                              <span className="text-[11px] font-bold tracking-tight text-gray-900">09:41</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold text-gray-900">5G</span>
                                <div className="w-4 h-2.5 border border-gray-900 rounded-[3px] p-[1px] flex items-center">
                                  <div className="w-full h-full bg-gray-900 rounded-[1px]" />
                                </div>
                              </div>
                            </div>

                            {/* Instagram Header */}
                            <div className="px-3 py-1.5 bg-white flex items-center justify-between border-b border-gray-100 z-20 shrink-0">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="font-extrabold text-xs tracking-tight text-gray-900 truncate max-w-[140px]">{username}</span>
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500 shrink-0" />
                              </div>
                              <div className="flex items-center gap-2.5 text-gray-800 text-xs shrink-0">
                                <span className="font-bold cursor-pointer text-sm">+</span>
                                <span className="cursor-pointer">☰</span>
                              </div>
                            </div>

                            {/* Instagram Scrollable Body */}
                            <div className="flex-1 overflow-y-auto scrollbar-none bg-white flex flex-col justify-start items-stretch min-h-0">
                              {/* Profile Header Stats Section */}
                              <div className="p-3 bg-white shrink-0">
                                <div className="flex items-center justify-between mb-2.5 gap-2">
                                  {/* Story Avatar Circle */}
                                  <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 shrink-0">
                                    <div className="p-[1px] bg-white rounded-full">
                                      {item.mockupImageUrl ? (
                                        <div className="w-12 h-12 rounded-full overflow-hidden relative shadow-sm">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={item.mockupImageUrl} alt={clientNameStr} className="w-full h-full object-cover" />
                                        </div>
                                      ) : (
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-extrabold text-sm shadow-sm`}>
                                          {avatarLetter}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Stats (Posts, Followers, Following) */}
                                  <div className="flex items-center justify-around flex-1 text-center min-w-0">
                                    <div>
                                      <div className="font-extrabold text-xs text-gray-900">{item.postsCount ?? images.length}</div>
                                      <div className="text-[9px] text-gray-500 font-medium">Gönderi</div>
                                    </div>
                                    <div>
                                      <div className="font-extrabold text-xs text-gray-900">{item.followers || '4.850'}</div>
                                      <div className="text-[9px] text-gray-500 font-medium">Takipçi</div>
                                    </div>
                                    <div>
                                      <div className="font-extrabold text-xs text-gray-900">{item.following ?? 120}</div>
                                      <div className="text-[9px] text-gray-500 font-medium">Takip</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Name & Category Only */}
                                <div className="text-xs text-gray-950 mb-2.5">
                                  <div className="font-bold text-xs flex items-center gap-1 truncate">
                                    {clientNameStr}
                                  </div>
                                  <div className="text-[9px] text-gray-500 font-medium truncate">{item.category || 'Sürücü Kursu'}</div>
                                </div>

                                {/* Action Buttons (Takip Et / Mesaj Gönder) */}
                                <div className="grid grid-cols-2 gap-1.5 mb-1">
                                  <button className="bg-fantas-blue hover:bg-blue-700 text-white font-bold py-1 rounded-md text-[10px] transition-colors shadow-sm">
                                    Takip Et
                                  </button>
                                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-1 rounded-md text-[10px] transition-colors">
                                    Mesaj Gönder
                                  </button>
                                </div>
                              </div>

                              {/* Feed Tab Bar (Grid, Reels, Tagged) */}
                              <div className="flex border-t border-gray-200 text-gray-400 bg-white shrink-0">
                                <div className="flex-1 py-1.5 border-b-2 border-black flex justify-center text-black">
                                  <Grid className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 py-1.5 flex justify-center hover:text-gray-700">
                                  <Film className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 py-1.5 flex justify-center hover:text-gray-700">
                                  <UserSquare2 className="w-3.5 h-3.5" />
                                </div>
                              </div>

                              {/* Instagram Post Grid - Clean 4:5 Ratio & Pure White Background */}
                              <div className="grid grid-cols-3 gap-1 p-1 bg-white content-start flex-1 overflow-y-auto">
                                {Array.isArray(images) && images.length > 0 ? (
                                  images.map((imgUrl, i) => (
                                    <div key={i} className="aspect-[4/5] bg-gray-50 relative overflow-hidden rounded-sm cursor-default border border-gray-100">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={imgUrl}
                                        alt={`${clientNameStr} Gönderi ${i + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <div className="col-span-3 py-10 text-center text-xs text-gray-400 flex flex-col items-center justify-center">
                                    <span>Gönderi eklenmedi</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Home Indicator Bar */}
                            <div className="py-1.5 bg-white flex justify-center shrink-0 border-t border-gray-50 z-20">
                              <div className="w-24 h-1 bg-gray-900 rounded-full" />
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Custom Slider Navigation Arrows */}
            {safeItems.length > 1 && (
              <>
                <button
                  ref={prevRef}
                  className="absolute top-1/2 -left-2 md:-left-5 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:text-fantas-blue hover:bg-white transition-all border border-gray-100 hover:scale-110"
                  aria-label="Önceki"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  ref={nextRef}
                  className="absolute top-1/2 -right-2 md:-right-5 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:text-fantas-blue hover:bg-white transition-all border border-gray-100 hover:scale-110"
                  aria-label="Sonraki"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
