import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Shield, ExternalLink, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Button, Logo } from './UIComponents';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Quote page acts as a standalone funnel with its own internal navigation.
  // We hide the global navbar to prevent visual conflicts (white text on white bg) and double headers.
  const isQuotePage = location.pathname === '/quote' || location.pathname.startsWith('/quote/');

  // Pages that have dark/immersive backgrounds where navbar should be transparent or text white
  const isImmersivePage = ['/', '/business', '/pricing', '/contact'].some(path => location.pathname === path);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // If we are in the Quote Funnel, do not render the global navbar
  if (isQuotePage) return null;

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Entreprises', path: '/business' },
    { name: 'Tarifs', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`absolute top-0 w-full z-50 transition-colors duration-300 ${isImmersivePage
        ? 'bg-transparent'
        : 'bg-white border-b border-slate-100 shadow-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-1.5 z-50">
            {/* 3D Logo - No background */}
            <Logo className="w-14 h-14" />
            <span className={`text-2xl font-extrabold tracking-tight transition-colors ${isImmersivePage && !isMobileMenuOpen ? 'text-white' : 'text-slate-900'
              }`}>
              Batimove
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${isImmersivePage ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-batimove-blue'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/quote">
              <Button variant={isImmersivePage ? "secondary" : "primary"} size="sm">Devis Express</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-50 p-2 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {/* Only show menu icon here, X is inside the slide-over */}
            {!isMobileMenuOpen && (
              <Menu className={isImmersivePage ? "text-white" : "text-slate-900"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Slide-over */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] md:hidden"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[80] flex flex-col p-6 md:hidden"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-8 h-8 text-slate-900" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-3xl font-light tracking-tight text-slate-900 hover:text-batimove-blue transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px w-20 bg-slate-100 my-4"></div>
                <Link to="/quote" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full justify-center shadow-xl shadow-red-500/20 text-lg py-4">Devis Express</Button>
                </Link>
              </div>

              <div className="mt-auto text-center text-slate-400 text-sm py-8">
                <p>Batimove Sarl</p>
                <p>Excellence in Motion</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer: React.FC = () => {
  const location = useLocation();
  // Hide on specific full-screen flows to avoid clutter, but show on main pages
  const isHidden = ['/quote', '/business', '/pricing', '/contact'].some(path => location.pathname === path || location.pathname.startsWith('/quote/'));

  if (isHidden) return null;

  return (
    <footer className="bg-[#0B1E33] text-slate-400 py-8 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-8">

          {/* Identity Block - Compact */}
          <div className="space-y-3 max-w-xs">
            <Link to="/" className="flex items-center gap-1.5 text-white text-lg font-bold font-display hover:opacity-80 transition-opacity">
              <Logo className="w-9 h-9" />
              Batimove
            </Link>
            <div className="text-xs leading-relaxed text-slate-500 font-medium">
              <p>Rue de Monthoux 64</p>
              <p>1201 Genève, Suisse</p>
            </div>
            <a href="tel:+41800825925" className="inline-block text-sm font-bold text-white hover:text-batimove-blue transition-colors">
              0800 825 925
            </a>
          </div>

          {/* Compact Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 text-xs w-full md:w-auto">
            <div className="flex flex-col gap-2">
              <h4 className="text-white font-semibold font-display mb-1">Expertise</h4>
              <Link to="/services" className="hover:text-white transition-colors">Déménagement</Link>
              <Link to="/business" className="hover:text-white transition-colors">Transfert Pro</Link>
              <Link to="/services" className="hover:text-white transition-colors">Garde-Meubles</Link>
              <Link to="/services" className="hover:text-white transition-colors">Nettoyage</Link>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-white font-semibold font-display mb-1">Société</h4>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/pricing" className="hover:text-white transition-colors">Nos Tarifs</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Carrières</Link>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-white font-semibold font-display mb-1">Légal</h4>
              <Link to="/privacy" className="hover:text-white transition-colors">Protection des données</Link>
              <Link to="/terms" className="hover:text-white transition-colors">CGV</Link>
              <Link to="/legal" className="hover:text-white transition-colors">Mentions Légales</Link>
            </div>
          </div>
        </div>

        {/* Essential Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-medium text-slate-600">
          <p>© {new Date().getFullYear()} Batimove Sarl. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/batimove.sarl/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 group">
              <Instagram className="w-4 h-4 group-hover:text-batimove-red transition-colors" />
              <span className="hidden sm:inline">@batimove.sarl</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};