import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import './src/performance.css'; // 60fps optimizations
import { Home } from './pages/Home';
import { Quote } from './pages/Quote';
import { Services } from './pages/Services';
import { Business } from './pages/Business';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import Calculator from './pages/Calculator';
import CalculatorCheckout from './pages/CalculatorCheckout';
import { CookieConsent } from './components/CookieConsent';
import { WhatsAppButton } from './components/WhatsAppButton';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// ScrollToTop and Google Tag (gtag.js) SPA Route Tracker helper
const RouteTracker = () => {
  const { pathname, search } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'AW-18400207296', {
        page_path: pathname + search,
      });
    }
  }, [pathname, search]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <RouteTracker />
      <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-slate-50 antialiased selection:bg-batimove-blue/20 selection:text-batimove-blue">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/business" element={<Business />} />
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
            {/* Service Specific Quote Funnel */}
            <Route path="/quote/:serviceId" element={<Quote />} />
            {/* Fallback */}
            <Route path="*" element={<div className="h-screen flex items-center justify-center">404 - Page not found</div>} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
        <WhatsAppButton />
      </div>
    </HashRouter>
  );
};

export default App;