import { MessageCircle, Package, Settings, Share2, ArrowRight } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'İletişime Geçin',
      desc: 'WhatsApp üzerinden bize ulaşın ve ihtiyaçlarınızı anlatın.',
      icon: <MessageCircle className="w-8 h-8" />
    },
    {
      num: '02',
      title: 'Paketinizi Seçin',
      desc: 'Size en uygun tasarımı ve paketi birlikte belirleyelim.',
      icon: <Package className="w-8 h-8" />
    },
    {
      num: '03',
      title: 'Tasarım Süreci',
      desc: 'Profesyonel ekibimiz dikkat çekici tasarımlarınızı hazırlasın.',
      icon: <Settings className="w-8 h-8" />
    },
    {
      num: '04',
      title: 'Paylaş & Büyü!',
      desc: 'Tasarımlarınızı sosyal medyada paylaşın, kayıtlarınızı artırın.',
      icon: <Share2 className="w-8 h-8" />
    }
  ];

  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fantas-light rounded-full blur-3xl opacity-60"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side - Timeline */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl md:text-4xl font-bold text-fantas-dark mb-4">
              ÇALIŞMA SÜRECİMİZ
            </h2>
            <div className="w-20 h-1 bg-fantas-blue rounded-full mb-12"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 relative">
              {/* Connecting Lines for Desktop */}
              <div className="hidden sm:block absolute top-[50px] left-10 right-10 h-0.5 bg-fantas-border/60 z-0"></div>
              <div className="hidden sm:block absolute top-[230px] left-10 right-10 h-0.5 bg-fantas-border/60 z-0"></div>
              
              {steps.map((step, idx) => (
                <div key={idx} className="relative z-10">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-fantas-border/30 flex items-center justify-center text-fantas-blue shrink-0 relative group">
                       <div className="absolute inset-0 bg-fantas-blue opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
                       {step.icon}
                       {/* Arrow indicator for next step (except last) */}
                       {(idx === 0 || idx === 2) && (
                         <div className="hidden sm:block absolute -right-8 top-1/2 -translate-y-1/2 text-fantas-border">
                           <ArrowRight className="w-5 h-5" />
                         </div>
                       )}
                     </div>
                     <div>
                       <span className="text-fantas-blue font-bold text-sm bg-blue-50 px-2 py-1 rounded">{step.num}</span>
                       <h3 className="text-xl font-bold text-fantas-dark mt-1">{step.title}</h3>
                     </div>
                   </div>
                   <p className="text-fantas-text-light text-sm pl-20 sm:pl-0 sm:mt-4">
                     {step.desc}
                   </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - CTA Box */}
          <div className="lg:col-span-5">
            <div className="bg-fantas-blue rounded-[2.5rem] p-6 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden">
               {/* Decor circles */}
               <div className="absolute -top-20 -right-20 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
               <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
               
               <h3 className="text-2xl sm:text-3xl font-extrabold mb-6 leading-tight relative z-10">
                 Markanızın <br/>
                 Sosyal Medyasını <br/>
                 <span className="text-yellow-300">Bir Üst Seviyeye Taşıyın!</span>
               </h3>
               
               <p className="mb-10 text-blue-100 font-medium relative z-10 text-base sm:text-lg">
                 Profesyonel tasarımlarla rakiplerinizin önüne geçmek için hemen bizimle iletişime geçin.
               </p>
               
               <a href="https://wa.me/905466308246?text=Merhaba,%20sosyal%20medya%20tasar%C4%B1mlar%C4%B1n%C4%B1z%20hakk%C4%B1nda%20bilgi%20ve%20teklif%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" 
                  data-track="whatsapp-process"
                  className="inline-flex items-center justify-center gap-3 bg-white text-fantas-dark px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto relative z-10 group">
                  <div className="bg-[#25D366] p-1.5 rounded-full text-white group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </div>
                  HEMEN TEKLİF AL &rarr;
               </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
