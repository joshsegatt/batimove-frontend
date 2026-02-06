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
    <footer className="bg-[#0B1E33] text-slate-400 py-8 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-8">
          <div className="space-y-3 max-w-xs">
            <Link to="/" className="flex items-center gap-1.5 text-white text-lg font-bold font-display hover:opacity-80 transition-opacity">
              <Logo className="w-9 h-9" />
              Batimove Sarl
            </Link>
            <div className="text-xs leading-relaxed text-slate-500 font-medium">
              <p>Rue de Monthoux 64</p>
              <p>1201 Genève, Suisse</p>
            </div>
            <a href="tel:+41800825925" className="inline-block text-sm font-bold text-white hover:text-batimove-blue transition-colors">
              0800 825 925
            </a>
          </div>

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