import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Package2, MapPin, Euro } from 'lucide-react';
import { Button } from '../components/UIComponents';
import { sendQuoteEmail } from '../services/api';
import { trackGoogleAdsLeadConversion } from '../utils/analytics';

interface CalculatorData {
    items: Array<{
        id: string;
        name: string;
        quantity: number;
        volume: number;
        needsDisassembly: boolean;
    }>;
    totalVolume: number;
    estimatedPrice: number;
    totalItems: number;
    disassembleCount: number;
    timestamp: string;
}

export default function CalculatorCheckout() {
    const navigate = useNavigate();
    const [calculatorData, setCalculatorData] = useState<CalculatorData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        fromZip: '',
        toZip: '',
        message: '',
    });

    // Load calculator data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('calculatorData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                setCalculatorData(data);
            } catch (error) {
                console.error('Error parsing calculator data:', error);
                navigate('/calculator');
            }
        } else {
            // No data found, redirect back to calculator
            navigate('/calculator');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!calculatorData) {
            alert('Données de calculateur manquantes');
            navigate('/calculator');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare email data with ALL required fields
            const emailData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                fromZip: formData.fromZip,
                toZip: formData.toZip,
                message: formData.message,
                volume: calculatorData.totalVolume.toString(),
                estimatedPrice: calculatorData.estimatedPrice.toString(),
                itemCount: calculatorData.totalItems.toString(),
                disassembleCount: calculatorData.disassembleCount.toString(),
            };

            await sendQuoteEmail(emailData);

            // Track Google Ads Lead Conversion ONLY on confirmed API success
            trackGoogleAdsLeadConversion({
                value: calculatorData.estimatedPrice,
                currency: 'CHF'
            });

            // Clear localStorage after successful submission
            localStorage.removeItem('calculatorData');

            alert('Devis envoyé avec succès! Nous vous contacterons sous peu.');
            navigate('/calculator');
        } catch (error) {
            console.error('Error sending quote:', error);
            alert('Erreur lors de l\'envoi du devis. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading while data is being loaded
    if (!calculatorData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white text-xl">Chargement...</div>
            </div>
        );
    }

    // Filter items with quantity > 0
    const selectedItems = calculatorData.items.filter(item => item.quantity > 0);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-display text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            Finaliser Votre{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-batimove-blue to-blue-400">
                                Devis
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Complétez vos informations pour recevoir votre devis personnalisé
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* LEFT COLUMN: Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Summary Card */}
                            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Résumé de Votre Déménagement
                                </h2>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                                        <Package2 className="w-6 h-6 text-batimove-blue mx-auto mb-2" />
                                        <p className="text-3xl font-bold text-white">
                                            {calculatorData.totalVolume}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">m³</p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                                        <Euro className="w-6 h-6 text-batimove-blue mx-auto mb-2" />
                                        <p className="text-3xl font-bold text-batimove-blue">
                                            {calculatorData.estimatedPrice}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">CHF</p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                                        <MapPin className="w-6 h-6 text-batimove-blue mx-auto mb-2" />
                                        <p className="text-3xl font-bold text-white">
                                            {calculatorData.totalItems}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">items</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        Items Sélectionnés
                                    </h3>
                                    <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                                        {selectedItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-700/30"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-batimove-blue font-bold text-lg">
                                                        {item.quantity}x
                                                    </span>
                                                    <div>
                                                        <p className="text-white font-medium">
                                                            {item.name}
                                                        </p>
                                                        {item.needsDisassembly && (
                                                            <p className="text-xs text-orange-400">
                                                                À démonter
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-slate-400 text-sm">
                                                    {(item.volume * item.quantity).toFixed(1)} m³
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {calculatorData.disassembleCount > 0 && (
                                    <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                        <p className="text-orange-400 text-sm">
                                            <strong>{calculatorData.disassembleCount}</strong> item(s) à démonter
                                            (surcharge de 10% appliquée)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Vos Informations
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-batimove-blue"
                                            placeholder="Jean Dupont"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-batimove-blue"
                                            placeholder="jean.dupont@example.com"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Téléphone *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-batimove-blue"
                                            placeholder="079 123 45 67"
                                        />
                                    </div>

                                    {/* NPA Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                NPA Départ *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.fromZip}
                                                onChange={(e) => setFormData({ ...formData, fromZip: e.target.value })}
                                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-batimove-blue"
                                                placeholder="1201"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                NPA Arrivée *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.toZip}
                                                onChange={(e) => setFormData({ ...formData, toZip: e.target.value })}
                                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-batimove-blue"
                                                placeholder="1003"
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Message (optionnel)
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-batimove-blue resize-none"
                                            placeholder="Informations complémentaires sur votre déménagement..."
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/calculator')}
                                            className="flex-1 px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Retour
                                        </button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            {isSubmitting ? 'Envoi...' : 'Envoyer le Devis'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
