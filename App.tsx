import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import './src/performance.css'; // 60fps optimizations
import { Home } from './pages/Home';
import { Quote } from './pages/Quote';
import { Services } from './pages/Services';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import Calculator from './pages/Calculator';
import CalculatorCheckout from './pages/CalculatorCheckout';
import { Portal } from './pages/admin/Portal';
import { CookieConsent } from './components/CookieConsent';
import { WhatsAppButton } from './components/WhatsAppButton';

import { trackPageView } from './utils/analytics';

// Auto-redirect if accessed via /portal or /admin without hash or non-standard hash
if (typeof window !== 'undefined') {
  const p = window.location.pathname.toLowerCase();
  const h = window.location.hash.toLowerCase();

  if (p === '/portal' || p === '/portal/' || p === '/admin' || p === '/admin/') {
    window.location.replace('/#/portal');
  } else if (h === '#portal' || h === '#portal/' || h === '#admin' || h === '#admin/') {
    window.location.replace('/#/portal');
  }
}

// ScrollToTop and Google Tag (gtag.js) SPA Route Tracker helper
const RouteTracker = () => {
  const { pathname, search } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname + search);
  }, [pathname, search]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();

  // Robust multi-variant portal detection
  const currentPath = (location.pathname || '').toLowerCase();
  const currentHash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
  const rawPath = (typeof window !== 'undefined' ? window.location.pathname : '').toLowerCase();

  const isPortal = (
    currentPath.startsWith('/portal') ||
    currentPath.startsWith('/admin') ||
    currentPath === 'portal' ||
    currentPath === 'admin' ||
    currentHash.includes('portal') ||
    currentHash.includes('admin') ||
    rawPath.includes('/portal') ||
    rawPath.includes('/admin')
  );

  if (isPortal) {
    return (
      <main className="flex-grow min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <Routes>
          <Route path="/portal" element={<Portal />} />
          <Route path="/portal/*" element={<Portal />} />
          <Route path="portal" element={<Portal />} />
          <Route path="portal/*" element={<Portal />} />
          <Route path="/admin" element={<Portal />} />
          <Route path="/admin/*" element={<Portal />} />
          <Route path="admin" element={<Portal />} />
          <Route path="admin/*" element={<Portal />} />
          <Route path="*" element={<Portal />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-slate-50 antialiased selection:bg-batimove-blue/20 selection:text-batimove-blue">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/business" element={<Navigate to="/services?type=entreprise" replace />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/calculator/checkout" element={<CalculatorCheckout />} />

          {/* Legal Routes */}
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/legal" element={<Legal type="impressum" />} />

          {/* General Quote Funnel */}
          <Route path="/quote" element={<Quote />} />
          <Route path="/quote/:serviceId" element={<Quote />} />

          {/* Fallbacks for portal under regular shell if ever routed here */}
          <Route path="/portal" element={<Portal />} />
          <Route path="/portal/*" element={<Portal />} />
          <Route path="portal" element={<Portal />} />
          <Route path="portal/*" element={<Portal />} />
          <Route path="/admin" element={<Portal />} />
          <Route path="/admin/*" element={<Portal />} />
          <Route path="admin" element={<Portal />} />
          <Route path="admin/*" element={<Portal />} />

          {/* Fallback 404 */}
          <Route path="*" element={<div className="h-screen flex items-center justify-center">404 - Page not found</div>} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
      <WhatsAppButton />
    </div>
  );
};

interface RootErrorBoundaryProps {
  children: React.ReactNode;
}

interface RootErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends React.Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  override state: RootErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Batimove] Root application error caught:', error, errorInfo);
  }

  handleHardReset = () => {
    try {
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((k) => caches.delete(k));
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => r.unregister());
        });
      }
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1E33] text-white flex flex-col items-center justify-center p-6 text-center font-sans select-none">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mb-5 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold mb-2 font-display">Batimove Déménagement Sàrl</h1>
          <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">
            Une mise à jour ou un incident temporaire d'affichage s'est produit. Cliquez sur le bouton ci-dessous pour actualiser les données.
          </p>
          {this.state.error && (
            <p className="text-slate-400 text-xs max-w-lg mb-6 font-mono bg-black/40 p-3 rounded-xl border border-white/10 overflow-auto">
              {this.state.error.message}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleHardReset}
              className="px-6 py-3 rounded-xl bg-[#0052A3] hover:bg-sky-600 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
            >
              Vider le cache & Actualiser
            </button>
            <a
              href="tel:0800825925"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
            >
              Appel gratuit : 0800 825 925
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <RootErrorBoundary>
        <RouteTracker />
        <AppContent />
      </RootErrorBoundary>
    </HashRouter>
  );
};

export default App;
