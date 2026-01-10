import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/UIComponents';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Question Générale', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormState('loading');
    try {
      // Import API service
      const { submitContact } = await import('../services/api');

      // Submit to backend
      await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      setFormState('success');
      setFormData({ name: '', email: '', subject: 'Question Générale', message: '' });
      setTimeout(() => setFormState('idle'), 3000);
    } catch (error) {
      console.error('Error submitting contact:', error);
      setFormState('idle');
      alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* HEADER SECTION - Dark Background (Full Width) - Solves Navbar Contrast Issue */}
      <div className="relative bg-[#0B1E33] text-white pt-32 pb-32 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Switzerland_relief_location_map.jpg/1280px-Switzerland_relief_location_map.jpg')] bg-cover bg-center grayscale mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-[#0B1E33]"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 font-display mx-auto">
              <Globe className="w-3 h-3" />
              Siège Social & Support
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Parlons de votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Projet.</span>
            </h1>
            <p className="font-sans text-slate-300 text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-12">
              Notre équipe de conseillers est basée à Genève. <br className="hidden md:block" />
              Nous répondons à toutes les demandes sous 24h ouvrées.
            </p>
          </motion.div>

          {/* Contact Info Grid - 3D Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto text-center"
          >
            {/* Location Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center hover:bg-white/10 transition-colors group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <img
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Office%20Building.png"
                  alt="Genève Office"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">Genève</h3>
              <p className="text-slate-400 text-sm">Rue du Rhône 14<br />1204 Genève</p>
            </div>

            {/* Phone Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center hover:bg-white/10 transition-colors group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <img
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Telephone%20Receiver.png"
                  alt="Phone"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">Téléphone</h3>
              <p className="text-slate-400 text-sm">0800 825 925</p>
              <p className="text-xs text-slate-500 mt-1">Lun-Ven: 08h-18h</p>
            </div>

            {/* Email Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center hover:bg-white/10 transition-colors group">
              <div className="w-24 h-24 mb-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
                <img
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/E-Mail.png"
                  alt="Email"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-slate-400 text-sm">info@batimove.ch</p>
              <p className="text-xs text-slate-500 mt-1">Réponse sous 24h</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FORM SECTION - Centered Card */}
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 -mt-16 mb-24 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 p-8 md:p-12 border border-slate-100"
        >
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-8 text-center">Envoyez-nous un message</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Prénom</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-batimove-blue focus:border-batimove-blue outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" placeholder="Jean" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nom</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-batimove-blue focus:border-batimove-blue outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" placeholder="Dupont" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-batimove-blue focus:border-batimove-blue outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" placeholder="jean.dupont@email.com" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sujet</label>
              <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-batimove-blue focus:border-batimove-blue outline-none transition-all text-slate-700 font-medium">
                <option>Question Générale</option>
                <option>Devis Déménagement</option>
                <option>Partenariat B2B</option>
                <option>Presse</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message</label>
              <textarea required name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-batimove-blue focus:border-batimove-blue outline-none transition-all resize-none font-medium text-slate-700 placeholder:text-slate-400" placeholder="Comment pouvons-nous vous aider ?"></textarea>
            </div>

            <Button
              type="submit"
              disabled={formState === 'loading' || formState === 'success'}
              className={`w-full py-4 rounded-xl shadow-xl font-bold tracking-wide font-display transition-all duration-300 ${formState === 'success'
                ? 'bg-green-500 text-white shadow-green-500/30'
                : 'bg-batimove-red text-white hover:bg-[#c00500] shadow-red-500/30 hover:shadow-red-500/50'
                }`}
            >
              {formState === 'loading' && 'Envoi en cours...'}
              {formState === 'success' && <><CheckCircle2 className="w-5 h-5 mr-2" /> Message Envoyé</>}
              {formState === 'idle' && <><Send className="w-4 h-4 mr-2" /> Envoyer le message</>}
            </Button>

            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Vos données sont protégées (nLPD).
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};