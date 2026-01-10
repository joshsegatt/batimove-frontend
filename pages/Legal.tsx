import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';
import { Button } from '../components/UIComponents';

interface LegalProps {
  type: 'privacy' | 'terms' | 'impressum';
}

export const Legal: React.FC<LegalProps> = ({ type }) => {
  const content = {
    privacy: {
      title: "Protection des Données (nLPD)",
      icon: Shield,
      text: "Conformément à la nouvelle Loi sur la Protection des Données (nLPD), Batimove Suisse SA s'engage à protéger la confidentialité de vos informations personnelles. Vos données ne sont utilisées que dans le cadre strict de l'exécution de nos services de déménagement et ne sont jamais revendues à des tiers."
    },
    terms: {
      title: "Conditions Générales (CGV)",
      icon: FileText,
      text: "Nos Conditions Générales de Vente régissent l'ensemble des prestations fournies par Batimove Suisse SA. Elles définissent les responsabilités, les assurances incluses (couverture jusqu'à CHF 5M) et les modalités d'annulation ou de modification de service."
    },
    impressum: {
      title: "Mentions Légales",
      icon: Scale,
      text: "Batimove Suisse SA\nRue du Rhône 14, 1204 Genève\nIDE/UID: CHE-123.456.789 TVA\nContact: 0800 825 925\nEmail: info@batimove.ch"
    }
  };

  const current = content[type];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/">
          <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent text-slate-500 hover:text-batimove-blue">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
            <Icon className="w-8 h-8 text-batimove-blue" />
          </div>
          
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-6">
            {current.title}
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
              {current.text}
            </p>
            <p className="text-slate-400 text-sm mt-8 pt-8 border-t border-slate-100">
              Dernière mise à jour : Octobre 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};