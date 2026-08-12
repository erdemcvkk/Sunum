'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('anasayfa');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Active section detection
      const sections = ['anasayfa', 'calismalarimiz', 'paketler', 'surec', 'iletisim'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Ana Sayfa', href: '#anasayfa', id: 'anasayfa', track: 'nav-anasayfa' },
    { name: 'Çalışmalarımız', href: '#calismalarimiz', id: 'calismalarimiz', track: 'nav-calismalarimiz' },
    { name: 'Sürücü Kurslarına Özel', href: '/surucu-kurslarina-ozel', id: 'surucu-kurslarina-ozel', isExternal: true, track: 'nav-surucu-kursu' },
    { name: 'Fiyatlar', href: '#paketler', id: 'paketler', track: 'nav-paketler' },
    { name: 'Süreç', href: '#surec', id: 'surec', track: 'nav-surec' },
    { name: 'İletişim', href: '#iletisim', id: 'iletisim', track: 'nav-iletisim' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isExternal?: boolean) => {
    if (isExternal) {
      setIsMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    if (pathname !== '/') {
      router.push('/' + href);
      setIsMobileMenuOpen(false);
      return;
    }
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.06)] py-3' 
          : 'bg-white/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 z-50 relative group"
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-fantas-blue text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.isExternal 
                ? pathname === link.href 
                : pathname === '/' && activeSection === link.id;

              return link.isExternal ? (
                <Link
                  key={link.name}
                  href={link.href}
                  data-track={link.track}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'text-fantas-blue bg-blue-50'
                      : 'text-fantas-text hover:text-fantas-blue hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  data-track={link.track}
                  onClick={(e) => handleNavClick(e, link.href, link.isExternal)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-fantas-blue bg-blue-50'
                      : 'text-fantas-text hover:text-fantas-blue hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center">
            <a
              href="https://wa.me/905466308246"
              target="_blank"
              rel="noreferrer"
              className="bg-fantas-blue text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
            >
              Hemen Başla
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-fantas-text hover:text-fantas-blue hover:bg-gray-50 transition-colors z-50 relative"
            aria-label="Menüyü Aç/Kapat"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-45 flex flex-col pt-24 px-6 lg:hidden animate-in fade-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4 mb-8">
            {navLinks.map((link) => {
              const isActive = link.isExternal 
                ? pathname === link.href 
                : pathname === '/' && activeSection === link.id;

              return link.isExternal ? (
                <Link
                  key={link.name}
                  href={link.href}
                  data-track={link.track}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl font-bold py-2 border-b border-gray-100 ${
                    isActive ? 'text-fantas-blue' : 'text-fantas-text'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  data-track={link.track}
                  onClick={(e) => handleNavClick(e, link.href, link.isExternal)}
                  className={`text-xl font-bold py-2 border-b border-gray-100 ${
                    isActive ? 'text-fantas-blue' : 'text-fantas-text'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
          <a
            href="https://wa.me/905466308246"
            target="_blank"
            rel="noreferrer"
            className="bg-fantas-blue text-white py-4 rounded-full font-bold text-center shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            Hemen Başla
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      )}
    </header>
  );
}
