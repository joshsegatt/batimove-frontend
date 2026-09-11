import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Lock
} from 'lucide-react';
import { Button } from '../components/UIComponents';
import { trackPhoneConversionNumber } from '../utils/analytics';

export const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Déménagement Résidentiel',
    message: ''
  });

  useEffect(() => {
    trackPhoneConversionNumber('0800 825 925');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { submitContact } = await import('../services/api');
      await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.service,
        message: `Téléphone: ${formData.phone}\nPrestation: ${formData.service}\n\nMessage:\n${formData.message}`
      });
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormSubmitted(true);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100dvh-98px)] lg:h-[calc(100dvh-98px)] lg:max-h-[calc(100dvh-98px)] bg-gradient-to-b from-[#07182b] via-[#0B1E33] to-[#061424] text-slate-100 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Wrapper */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col justify-center relative z-10 my-auto">
        
        {/* Compact Fixed Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-5 sm:mb-7 flex-shrink-0"
        >
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Parlons de Votre Projet de Déménagement
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto mt-2 font-normal leading-relaxed">
            Nos conseillers spécialisés sont à votre disposition pour vous orienter et vous délivrer un devis clair et sans engagement sous 2h ouvrées.
          </p>
        </motion.div>

        {/* 2-Column Perfectly Proportioned Cards (Aligned to center of screen) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch w-full">
          
          {/* Left Column: Dark Navy Interactive Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 bg-[#081a2e]/90 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-2xl shadow-2xl flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="mb-2">
                <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                  Nos Coordonnées
                </h2>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mb-5">
                Besoin d'un renseignement immédiat ? Contactez notre équipe par téléphone ou rendez-nous visite.
              </p>

              {/* Interactive Contact List */}
              <div className="space-y-3.5 text-xs">
                
                {/* Address with Google Maps link */}
                <a 
                  href="https://maps.google.com/?q=Rue+de+Monthoux+64,+1201+Genève" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">Adresse du Siège</div>
                      <div className="text-slate-300 text-[11px]">Rue de Monthoux 64, 1201 Genève</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </a>

                {/* Free Phone */}
                <a 
                  href="tel:0800825925" 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-2">
                        <span>0800 825 925</span>
                        <span className="text-emerald-400 font-semibold text-[11px]">(Gratuit en Suisse)</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">+41 22 800 82 92 (International)</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">Appeler →</span>
                </a>

                {/* Email */}
                <a 
                  href="mailto:info@batimove.ch" 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">Email Officiel</div>
                      <div className="text-slate-300 text-[11px]">info@batimove.ch</div>
                    </div>
                  </div>
                  <span className="text-sky-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">Écrire →</span>
                </a>

                {/* Business Hours */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">Horaires d'Ouverture</div>
                      <div className="text-slate-300 text-[11px]">Lun. - Sam. : 08h00 - 19h00</div>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Ouvert
                  </span>
                </div>

              </div>
            </div>

            {/* Swiss Guarantee Footer inside left card */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2.5 bg-white/[0.02] p-2.5 rounded-xl">
              <span className="text-lg">🇨🇭</span>
              <p className="text-[11px] text-slate-300 leading-tight">
                <span className="font-bold text-white">Batimove Sàrl :</span> Entreprise enregistrée au RC de Genève. Assurance RC Pro 5M CHF.
              </p>
            </div>
          </motion.div>

          {/* Right Column: High-Converting Refined White Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-7 bg-white text-slate-900 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xl border border-slate-100 flex flex-col justify-between relative"
          >
            <div>
              <div className="mb-1">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B1E33]">
                  Contactez-Nous
                </h2>
              </div>
              <p className="text-slate-500 text-xs mb-4">
                Transmettez-nous vos besoins, nous vous recontactons sous 2h avec un chiffrage précis.
              </p>

              {formSubmitted ? (
                <div className="py-8 px-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-emerald-950">Demande Envoyée avec Succès !</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                    Merci. Un spécialiste Batimove a bien reçu votre demande et analyse actuellement votre besoin.
                  </p>
                  <Button 
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', service: 'Déménagement Résidentiel', message: '' });
                    }}
                    className="bg-[#0B1E33] text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    Envoyer une autre demande
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Row 1: Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Nom & Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jean Dupont"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: +41 79 123 45 67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: jean.dupont@bluewin.ch"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Prestation Souhaitée *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      >
                        <option value="Déménagement Résidentiel">Déménagement Résidentiel</option>
                        <option value="Transfert d'Entreprise">Transfert d'Entreprise</option>
                        <option value="Garde-Meubles">Garde-Meubles Sécurisé</option>
                        <option value="Nettoyage Fin de Bail">Nettoyage État des Lieux</option>
                        <option value="Location Monte-Meubles">Location Monte-Meubles</option>
                        <option value="Débarras & Évacuation">Débarras & Évacuation</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Message */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Détails de Votre Projet
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Trajet (ex: Genève vers Lausanne), dates estimées, volume approximatif ou particularités..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Action Row */}
                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Button
                      type="submit"
                      isLoading={formLoading}
                      className="w-full sm:w-auto bg-batimove-red hover:bg-[#c00500] text-white px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl shadow-red-900/25 hover:shadow-red-500/35 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                    >
                      <span>Envoyer Ma Demande</span>
                      <Send className="w-3.5 h-3.5 text-white" />
                    </Button>
                    
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Données protégées selon la nLPD suisse</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Sleek Minimal Bottom Bar (Anchors page without generating page scroll) */}
      <div className="w-full border-t border-white/5 bg-[#05101c]/80 backdrop-blur-md py-2.5 px-4 flex-shrink-0 text-[11px] text-slate-400 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <span>© {new Date().getFullYear()} Batimove Sàrl • Rue de Monthoux 64, 1201 Genève</span>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:0800825925" className="hover:text-white transition-colors">Hotline: 0800 825 925</a>
            <span className="text-slate-600">•</span>
            <a href="mailto:info@batimove.ch" className="hover:text-white transition-colors">info@batimove.ch</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;