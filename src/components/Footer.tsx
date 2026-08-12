import Link from 'next/link';
import { MapPin, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7v-2h7v2zm-11.848 2.668c.953-.615 1.548-1.576 1.548-2.768 0-2.476-1.947-3.9-5.1-3.9h-6.6v16h6.8c3.55 0 5.4-1.744 5.4-4.332 0-2.124-1.025-3.8-2.048-4.999zm-6.152-4.668h2.35c1.45 0 2.25.688 2.25 1.838 0 1.25-.8 1.932-2.25 1.932h-2.35v-3.77zm2.5 11.77h-2.5v-4.1h2.5c1.6 0 2.5.832 2.5 2.05 0 1.25-.9 2.05-2.5 2.05zm14.348-4.57c-2.348 0-4.048 1.6-4.048 4.2 0 2.65 1.65 4.3 4.148 4.3 1.9 0 3.25-.9 3.8-2.4h-2.05c-.3.55-.9.9-1.65.9-1.25 0-2-.8-2-2.1h5.85c.05-.3.05-.6.05-.9 0-2.4-1.55-4-4.1-4zm-1.9 2.9c0-1.15.75-1.8 1.85-1.8 1.1 0 1.75.65 1.8 1.8h-3.65z"/>
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Ana Sayfa', href: '#anasayfa' },
    { name: 'Çalışmalarımız', href: '#calismalarimiz' },
    { name: 'Paketler', href: '#paketler' },
    { name: 'Süreç', href: '#surec' },
    { name: 'İletişim', href: '#iletisim' },
  ];

  return (
    <footer className="bg-gray-50 pt-12 sm:pt-16 lg:pt-20 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
          
          {/* Col 1: Logo & Desc */}
          <div>
            <Link href="#anasayfa" className="flex items-center gap-2.5 mb-6 group">
              <div className="bg-gradient-to-br from-blue-600 to-fantas-blue text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
            <p className="text-fantas-text-light text-sm leading-relaxed">
              Markanıza özel sosyal medya tasarım çözümleri. Markanızı dijitalde bir adım öne taşıyın.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-fantas-dark uppercase tracking-wider">Hızlı Linkler</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-fantas-text-light hover:text-fantas-blue transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-fantas-dark uppercase tracking-wider">İletişim</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-fantas-text-light group">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <a href="https://wa.me/905466308246" target="_blank" rel="noreferrer" data-track="footer-whatsapp" className="hover:text-fantas-blue transition-colors font-medium">0 (546) 630 82 46</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-fantas-text-light group">
                <div className="p-1.5 bg-blue-50 rounded-lg text-fantas-blue shrink-0 group-hover:bg-fantas-blue group-hover:text-white transition-all duration-300">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:erdemcvk@outlook.com" className="hover:text-fantas-blue transition-colors">erdemcvk@outlook.com</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-fantas-text-light group">
                <div className="p-1.5 bg-blue-50 rounded-lg text-fantas-blue shrink-0 group-hover:bg-fantas-blue group-hover:text-white transition-all duration-300">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>İstanbul / Türkiye</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Social */}
          <div>
            <h4 className="text-sm font-bold mb-6 text-fantas-dark uppercase tracking-wider">Bizi Takip Edin</h4>
            <div className="flex gap-2.5">
              {[
                { icon: <InstagramIcon className="w-4.5 h-4.5" />, href: 'https://www.instagram.com/erdemcvkk/', label: 'Instagram', hoverColor: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
                { icon: <BehanceIcon className="w-4.5 h-4.5" />, href: 'https://www.behance.net/erdemcvkk', label: 'Behance', hoverColor: 'hover:bg-[#1769FF]' },
                { icon: <MessageCircle className="w-4.5 h-4.5" />, href: 'https://wa.me/905466308246', label: 'WhatsApp', hoverColor: 'hover:bg-[#25D366]' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  data-track={social.label === 'Instagram' ? 'footer-instagram' : social.label === 'WhatsApp' ? 'footer-whatsapp' : undefined}
                  className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center text-fantas-text-light hover:text-white ${social.hoverColor} transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-gray-100`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-fantas-text-light text-xs">
          <p>&copy; {currentYear} Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-fantas-blue transition-colors">Gizlilik Politikası</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-fantas-blue transition-colors">Kullanım Koşulları</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
