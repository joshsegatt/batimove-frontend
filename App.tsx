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
import { CookieConsent } from './components/CookieConsent';

// ScrollToTop helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
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
      </div>
    </HashRouter>
  );
};

export default App;