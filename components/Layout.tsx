import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Shield, ExternalLink, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Button, Logo } from './UIComponents';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isQuotePage = location.pathname === '/quote' || location.pathname.startsWith('/quote/');
  const isImmersivePage = ['/', '/business', '/pricing', '/contact'].some(path => location.pathname === path);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  if (isQuotePage) return null;

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Calculateur', path: '/calculator' },
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
            <Logo className="w-14 h-14" />
            <span className={`text-2xl font-extrabold tracking-tight transition-colors ${isImmersivePage && !isMobileMenuOpen ? 'text-white' : 'text-slate-900'
              }`}>
              Batimove Sarl
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
            {!isMobileMenuOpen && (
              <Menu className={isImmersivePage ? "text-white" : "text-slate-900"} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU - PURE HTML WITH INLINE STYLES */}
      {isMobileMenuOpen && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 70
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '85%',
              maxWidth: '400px',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 80,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '32px', height: '32px', color: '#0f172a' }} />
              </button>
            </div>

            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '32px'
            }}>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', textDecoration: 'none', textAlign: 'center', width: '100%', padding: '12px' }}>Services</Link>
              <Link to="/calculator" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', textDecoration: 'none', textAlign: 'center', width: '100%', padding: '12px' }}>Calculateur</Link>
              <Link to="/business" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', textDecoration: 'none', textAlign: 'center', width: '100%', padding: '12px' }}>Entreprises</Link>
              <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', textDecoration: 'none', textAlign: 'center', width: '100%', padding: '12px' }}>Tarifs</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', textDecoration: 'none', textAlign: 'center', width: '100%', padding: '12px' }}>Contact</Link>
              <div style={{ height: '2px', width: '80px', backgroundColor: '#94a3b8', margin: '16px 0' }}></div>
              <Link to="/quote" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#e10600', textDecoration: 'none', textAlign: 'center', width: '100%', padding: '16px', borderRadius: '12px', display: 'block' }}>Devis Express</Link>
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center', color: '#94a3b8', fontSize: '14px', paddingTop: '32px', paddingBottom: '32px' }}>
              <p style={{ margin: 0 }}>Batimove Sarl</p>
              <p style={{ margin: 0 }}>Excellence in Motion</p>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  const location = useLocation();
  const isHidden = ['/quote', '/business', '/pricing', '/contact'].some(path => location.pathname === path || location.pathname.startsWith('/quote/'));

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
              <li><Link to="/services" className="hover:text-white transition-colors">Déménagement</Link></li>
              <li><Link to="/business" className="hover:text-white transition-colors">Transfert Pro</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Garde-Meubles</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Nettoyage</Link></li>
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
          <p>© {new Date().getFullYear()} Batimove Sarl. Tous droits réservés.</p>
          
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