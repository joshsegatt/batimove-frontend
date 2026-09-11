import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Shield, ExternalLink, Linkedin, Instagram, Facebook, MapPin, Mail, Clock, Search, ChevronRight, Lock } from 'lucide-react';
import { Button, Logo } from './UIComponents';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);
  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À Propos', path: '/#about' },
    { name: 'Services', path: '/services' },
    { name: 'Calculateur', path: '/calculator' },
    { name: 'Tarifs', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="w-full z-50 sticky top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 font-sans">
      {/* 1. TOP BAR (DARK NAVY - MATCHING REFERENCE DESIGN) */}
      <div className="bg-[#07182b] text-slate-300 text-xs py-2 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              Rue de Monthoux 64, 1201 Genève
            </span>
            <a href="tel:0800825925" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-white">0800 825 925</span> (Gratuit en Suisse)
            </a>
            <a href="mailto:info@batimove.ch" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              info@batimove.ch
            </a>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Lun - Sam: 08h00 - 19h00
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="text-sky-400">🇨🇭</span> Garantie Régies Suisses
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="w-12 h-12 transition-transform duration-300 group-hover:scale-105" />
            <span className="text-2xl font-extrabold tracking-tight text-[#0B1E33] font-display">
              Batimove Sarl
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[15px] font-semibold text-slate-700 hover:text-sky-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action CTA & Phone */}
          <div className="hidden sm:flex items-center gap-4">
            <a 
              href="tel:0800825925" 
              className="hidden xl:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1E33] text-sm font-bold transition-all"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>0800 825 925</span>
            </a>
            <Link to="/quote">
              <Button className="bg-[#0B1E33] hover:bg-[#132c48] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <span>Devis Gratuit</span>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU - PURE TAILWIND STYLES (ZERO INLINES) */}
      {isMobileMenuOpen && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] transition-opacity"
          />

          <div className="fixed top-0 right-0 w-[85%] max-w-[400px] h-screen bg-white z-[80] flex flex-col p-6 overflow-y-auto shadow-2xl">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X className="w-8 h-8 text-slate-900" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-6">
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-bold text-slate-900 hover:text-sky-600 transition-colors text-center w-full py-2">Services</Link>
              <Link to="/calculator" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-bold text-slate-900 hover:text-sky-600 transition-colors text-center w-full py-2">Calculateur</Link>
              <Link to="/services?type=entreprise" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-bold text-slate-900 hover:text-sky-600 transition-colors text-center w-full py-2">Entreprises</Link>
              <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-bold text-slate-900 hover:text-sky-600 transition-colors text-center w-full py-2">Tarifs</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl sm:text-3xl font-bold text-slate-900 hover:text-sky-600 transition-colors text-center w-full py-2">Contact</Link>
              <div className="h-0.5 w-20 bg-slate-300 my-3" />
              <Link to="/quote" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-white bg-[#e10600] hover:bg-red-700 transition-colors text-center w-full py-3.5 px-6 rounded-xl block shadow-lg">Devis Express</Link>
            </div>

            <div className="mt-auto text-center text-slate-400 text-xs py-6 border-t border-slate-100">
              <p className="font-semibold text-slate-600">Batimove Sàrl • Genève</p>
              <p className="mt-0.5">Excellence in Motion • Qualité Suisse</p>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHidden = ['/quote', '/business', '/pricing', '/contact', '/calculator', '/services'].some(path => location.pathname === path || location.pathname.startsWith('/quote/'));

  if (isHidden) return null;

  return (
    <footer className="bg-[#0B1E33] text-slate-400 py-6 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Grid: Compact 5-Column Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 items-start pb-6 border-b border-white/5 text-xs">
          
          {/* Brand Info (2 cols wide on desktop) */}
          <div className="md:col-span-2 space-y-2.5">
            <Link to="/" className="flex items-center gap-2 text-white text-base font-bold font-display hover:opacity-80 transition-opacity">
              <Logo className="w-7 h-7" />
              <span>Batimove Sarl</span>
            </Link>
            <p className="text-slate-400 text-xs leading-tight font-medium">
              Rue de Monthoux 64, 1201 Genève, Suisse
            </p>
            <a href="tel:+41800825925" className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-batimove-blue transition-colors">
              <Phone className="w-3.5 h-3.5 text-batimove-red" />
              <span>0800 825 925</span>
            </a>
          </div>

          {/* Column 1: Expertise */}
          <div className="space-y-1.5">
            <h4 className="text-white font-semibold font-display text-xs tracking-wider uppercase mb-2">Expertise</h4>
            <ul className="space-y-1 text-slate-400 font-medium">
              <li><Link to="/services?type=prive" className="hover:text-white transition-colors">Déménagement</Link></li>
              <li><Link to="/services?type=entreprise" className="hover:text-white transition-colors">Transfert Pro</Link></li>
              <li><Link to="/services?type=prive" className="hover:text-white transition-colors">Garde-Meubles</Link></li>
              <li><Link to="/services?type=nettoyage" className="hover:text-white transition-colors">Nettoyage</Link></li>
            </ul>
          </div>

          {/* Column 2: Société */}
          <div className="space-y-1.5">
            <h4 className="text-white font-semibold font-display text-xs tracking-wider uppercase mb-2">Société</h4>
            <ul className="space-y-1 text-slate-400 font-medium">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Nos Tarifs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Carrières</Link></li>
            </ul>
          </div>

          {/* Column 3: Légal */}
          <div className="space-y-1.5">
            <h4 className="text-white font-semibold font-display text-xs tracking-wider uppercase mb-2">Légal</h4>
            <ul className="space-y-1 text-slate-400 font-medium">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Protection des données</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">CGV</Link></li>
              <li><Link to="/legal" className="hover:text-white transition-colors">Mentions Légales</Link></li>
            </ul>
          </div>

        </div>

        {/* Micro Bottom Bar: Clean Single Line */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Batimove Sarl. Tous droits réservés.</span>
            <Link 
              to="/portal" 
              title="Portail de Gestion Interne Batimove" 
              className="text-slate-600 hover:text-sky-400 transition-colors opacity-30 hover:opacity-100 cursor-pointer p-0.5"
            >
              <Lock className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://www.instagram.com/batimove.sarl/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1.5 group"
            >
              <Instagram className="w-3.5 h-3.5 group-hover:text-batimove-red transition-colors" />
              <span>@batimove.sarl</span>
            </a>

            <div className="flex items-center gap-1 text-slate-400">
              <span>Made with</span>
              <span className="text-red-500 text-xs">❤️</span>
              <span>by</span>
              <a 
                href="https://joshsegatt.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-slate-200 hover:text-white transition-colors flex items-center gap-0.5 group"
              >
                joshsegatt
                <ExternalLink className="w-3 h-3 text-batimove-blue opacity-80 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};