'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('anasayfa');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Active section detection
      const sections = ['anasayfa', 'calismalarimiz', 'galeri', 'paketler', 'surec', 'iletisim'];
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
    { name: 'Ana Sayfa', href: '#anasayfa', id: 'anasayfa' },
    { name: 'Çalışmalarımız', href: '#calismalarimiz', id: 'calismalarimiz' },
    { name: 'Hazır Paketler', href: '#hazir-paketler', id: 'hazir-paketler' },
    { name: 'Fiyatlar', href: '#paketler', id: 'paketler' },
    { name: 'Süreç', href: '#surec', id: 'surec' },
    { name: 'İletişim', href: '#iletisim', id: 'iletisim' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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
          <a 
            href="#anasayfa" 
            onClick={(e) => handleNavClick(e, '#anasayfa')}
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
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === link.id
                    ? 'text-fantas-blue bg-blue-50'
                    : 'text-fantas-text hover:text-fantas-blue hover:bg-gray-50'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#iletisim"
              onClick={(e) => handleNavClick(e, '#iletisim')}
              className="hidden md:inline-flex items-center justify-center gap-2 bg-fantas-blue text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group"
            >
              TEKLİF AL 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <button
              className="lg:hidden p-2.5 text-fantas-dark z-50 relative rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
                <span className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed inset-0 bg-white z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className={`flex flex-col justify-center items-center h-full px-8 transition-all duration-500 delay-100 ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}>
          <nav className="flex flex-col items-center gap-2 w-full max-w-sm">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`w-full text-center text-xl font-semibold py-4 rounded-2xl transition-all duration-300 ${
                  activeSection === link.id
                    ? 'text-fantas-blue bg-blue-50'
                    : 'text-fantas-dark hover:bg-gray-50'
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${idx * 50}ms` : '0ms' }}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#iletisim"
              onClick={(e) => handleNavClick(e, '#iletisim')}
              className="w-full text-center bg-fantas-blue text-white px-8 py-4 rounded-2xl font-bold text-lg mt-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              TEKLİF AL <ArrowRight className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
