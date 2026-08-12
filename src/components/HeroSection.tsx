'use client';

import { motion } from 'framer-motion';
import { PenTool, Target, Clock, ThumbsUp, Heart, Send, Bookmark, ArrowRight } from 'lucide-react';

interface HeroContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  image?: string | null;
}

export default function HeroSection({ heroContent }: { heroContent?: HeroContent }) {
  const features = [
    { icon: <PenTool className="w-5 h-5" />, label: 'Dikkat Çekici Tasarım' },
    { icon: <Target className="w-5 h-5" />, label: 'Markanıza Özel Çözümler' },
    { icon: <Clock className="w-5 h-5" />, label: 'Zamanında Teslimat' },
    { icon: <ThumbsUp className="w-5 h-5" />, label: '%100 Müşteri Memnuniyeti' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } }
  };

  return (
    <section id="anasayfa" className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-blue-50 to-transparent rounded-l-full opacity-70 -z-10 translate-x-1/4" />
      <div className="absolute -top-32 -right-32 w-[500px] max-w-full h-[500px] bg-fantas-blue/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 -left-20 w-[400px] max-w-full h-[400px] bg-indigo-50 rounded-full blur-3xl -z-10" />
      
      {/* Dot Pattern */}
      <div className="absolute top-28 right-8 w-48 h-48 opacity-[0.08] -z-10" 
        style={{ backgroundImage: 'radial-gradient(circle, #0047FF 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} 
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-gradient-to-r from-fantas-blue to-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold mb-8 shadow-lg shadow-blue-500/20 tracking-wider">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {heroContent?.badge || 'SÜRÜCÜ KURSLARINA ÖZEL'}
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-fantas-dark leading-[1.1] mb-6">
              Sosyal Medya{' '}
              <br className="hidden sm:block" />
              Tasarımı ile{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fantas-blue to-indigo-500">
                Fark Yaratın!
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-base md:text-lg text-fantas-text-light mb-10 max-w-lg leading-relaxed">
              {heroContent?.subtitle || 'Markanız için özel olarak hazırladığımız sosyal medya tasarımları ile markanızı dijitalde bir adım öne taşıyın.'}
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-14">
              <a 
                href="#calismalarimiz" 
                data-track="hero-designs-btn"
                className="group bg-fantas-blue text-white px-5 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-full font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
              >
                TASARIMLARI İNCELE 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a 
                href="#paketler" 
                data-track="hero-packages-btn"
                className="group border-2 border-gray-200 text-fantas-dark px-5 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base rounded-full font-bold hover:border-fantas-blue hover:text-fantas-blue transition-all duration-300 bg-white flex items-center gap-2"
              >
                PAKETLERİ GÖR
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </a>
            </motion.div>

            {/* Feature Icons */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-fantas-dark font-medium text-xs sm:text-sm group cursor-default"
                >
                  <div className="bg-blue-50 p-2.5 rounded-xl text-fantas-blue group-hover:bg-fantas-blue group-hover:text-white transition-all duration-300 shrink-0">
                    {feature.icon}
                  </div>
                  <span className="group-hover:text-fantas-blue transition-colors duration-300">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Real 3D iPhone 16 Pro Max Mockup (9:19 Aspect Ratio) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative flex justify-center items-center py-4"
          >
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-indigo-400/10 to-transparent rounded-full blur-3xl scale-75" />

            {/* Floating Card - Top Left */}
            <motion.div 
              animate={{ y: [-8, 8, -8] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="hidden sm:block absolute top-12 left-0 lg:-left-2 w-28 h-28 sm:w-32 sm:h-32 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-2.5 z-40 border border-white rotate-[-8deg]"
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex flex-col items-center justify-center text-white overflow-hidden relative">
                <div className="text-[10px] font-bold tracking-wider opacity-80">KAMPANYA</div>
                <div className="text-2xl font-extrabold mt-1">%30</div>
                <div className="text-[9px] font-medium opacity-70">İNDİRİM</div>
              </div>
            </motion.div>

            {/* Floating Card - Bottom Right */}
            <motion.div 
              animate={{ y: [8, -8, 8] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="hidden sm:block absolute bottom-16 right-0 lg:right-2 w-36 sm:w-40 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-3 z-40 border border-white rotate-[6deg]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                </div>
                <span className="text-xs font-semibold text-gray-700">Yeni Kayıt!</span>
              </div>
              <div className="text-[10px] text-gray-500">Ahmet Y. kaydını tamamladı</div>
            </motion.div>

            {/* Like Bubble */}
            <motion.div 
              animate={{ y: [-12, 12, -12], scale: [1, 1.05, 1] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="hidden sm:block absolute top-1/4 -right-2 lg:right-4 w-14 h-14 bg-white rounded-full shadow-lg z-40 flex items-center justify-center border border-pink-100"
            >
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </motion.div>

            {/* Engagement Stats */}
            <motion.div 
              animate={{ y: [-6, 6, -6] }} 
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="hidden sm:block absolute bottom-1/3 -left-4 lg:-left-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-3 z-40 border border-white"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white" />
                  <div className="w-5 h-5 rounded-full bg-purple-500 border-2 border-white" />
                  <div className="w-5 h-5 rounded-full bg-pink-500 border-2 border-white" />
                </div>
                <span className="text-[10px] font-bold text-gray-700">+2.4K takipçi</span>
              </div>
            </motion.div>

            {/* REALISTIC 3D IPHONE 16 PRO MAX FRAME (9:19 Ratio) */}
            <div className="relative w-[240px] xs:w-[280px] sm:w-[310px] aspect-[9/19] z-20 transition-all duration-500 hover:scale-[1.02]">
              {/* Outer Body */}
              <div className="w-full h-full rounded-[52px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-[10px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.45),0_15px_30px_-10px_rgba(0,71,255,0.15)] border border-slate-600/80 ring-1 ring-black/40 relative">
                
                {/* Hardware Buttons */}
                <div className="absolute -left-[13px] top-24 w-[3px] h-6 bg-gradient-to-r from-slate-600 to-slate-800 rounded-l-sm" />
                <div className="absolute -left-[13px] top-34 w-[3px] h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-l-sm" />
                <div className="absolute -left-[13px] top-48 w-[3px] h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-l-sm" />
                <div className="absolute -right-[13px] top-36 w-[3px] h-14 bg-gradient-to-l from-slate-600 to-slate-800 rounded-r-sm" />

                {/* Inner Screen Bezel */}
                <div className="w-full h-full rounded-[44px] bg-black p-[3px] border border-slate-900 shadow-inner relative flex flex-col justify-between overflow-hidden">
                  
                  {/* Dynamic Island Pill */}
                  <div className="absolute top-2 inset-x-0 z-30 flex justify-center pointer-events-none">
                    <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 shadow-md">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-blue-950" />
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 animate-pulse" />
                    </div>
                  </div>

                  {/* iOS Screen */}
                  <div className="w-full h-full bg-white rounded-[41px] overflow-hidden flex flex-col justify-between relative select-none">
                    
                    {/* Status Bar */}
                    <div className="pt-2.5 px-6 pb-1 bg-white flex items-center justify-between z-20">
                      <span className="text-[11px] font-bold tracking-tight text-gray-900">09:41</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-gray-900">5G</span>
                        <div className="w-4 h-2.5 border border-gray-900 rounded-[3px] p-[1px] flex items-center">
                          <div className="w-full h-full bg-gray-900 rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* Instagram Header */}
                    <div className="pt-1 pb-2.5 px-4 bg-white flex items-center justify-between border-b border-gray-50 z-20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fantas-blue to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">M</div>
                        <div>
                          <div className="font-bold text-xs text-gray-900">markaniz</div>
                          <div className="text-[9px] text-gray-400">Markanız</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-xs">•••</div>
                    </div>

                    {/* Main Post Image */}
                    <div className="w-full flex-1 bg-gradient-to-br from-fantas-blue via-blue-600 to-indigo-700 relative flex flex-col justify-between p-5 overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
                      <div className="absolute bottom-10 -left-8 w-24 h-24 bg-white/5 rounded-full" />
                      
                      <div className="relative z-10 pt-2">
                        <div className="text-white/70 font-semibold tracking-[0.2em] text-[9px] mb-2">SOSYAL MEDYA YÖNETİMİ</div>
                      </div>
                      <div className="relative z-10 pb-2">
                        <div className="text-white font-extrabold text-3xl leading-none mb-3">
                          MARKANIZI<br/>DİJİTALDE<br/><span className="text-yellow-300">BÜYÜTÜN!</span>
                        </div>
                        <div className="inline-flex bg-white text-fantas-blue px-3.5 py-1.5 rounded-full font-bold text-[10px] shadow-lg">
                          HEMEN BİLGİ AL
                        </div>
                      </div>
                    </div>

                    {/* Interactions */}
                    <div className="px-4 py-2 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500" />
                        <MessageCircleIcon className="w-4.5 h-4.5 text-gray-700" />
                        <Send className="w-4.5 h-4.5 text-gray-700" />
                      </div>
                      <Bookmark className="w-4.5 h-4.5 text-gray-700" />
                    </div>
                    <div className="px-4 pb-2 bg-white">
                      <div className="text-[10px] font-bold text-gray-900">1.245 beğenme</div>
                      <div className="text-[9px] text-gray-400 mt-0.5">2 saat önce</div>
                    </div>

                    {/* Home Indicator */}
                    <div className="py-2 bg-white flex justify-center z-20">
                      <div className="w-28 h-1 bg-gray-900 rounded-full" />
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
    </svg>
  );
}
