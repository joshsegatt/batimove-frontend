import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Star, Phone } from 'lucide-react';
import { Button } from '../components/UIComponents';
import { Link } from 'react-router-dom';

const servicesList = [
  {
    id: 'priv',
    title: "Déménagement Privé",
    subtitle: "Confort & Sérénité",
    description: "Une prise en charge complète de votre foyer. De l'emballage de vos objets fragiles au remontage de vos meubles, nous traitons vos biens avec une délicatesse absolue.",
    features: ["Emballage 'Art & Vaisselle'", "Démontage/Remontage inclus", "Protection des sols et murs", "Assurance tous risques incluse"],
    image: "/service-demenagement.png",
    isPopular: true
  },
  {
    id: 'pro',
    title: "Transfert d'Entreprise",
    subtitle: "Business Solutions",
    description: "Minimisez l'impact sur votre productivité. Nos équipes opèrent le soir ou le week-end pour garantir une reprise d'activité immédiate dès le lundi matin.",
    features: ["Intervention hors horaires", "Gestion de parc informatique", "Archives et confidentialité", "Coordinateur de projet dédié"],
    image: "/service-business.png",
    isPopular: false
  },
  {
    id: 'clean',
    title: "Nettoyage & Remise",
    subtitle: "Garantie de Bails",
    description: "Ne craignez plus l'état des lieux de sortie. Nous assurons un nettoyage conforme aux normes des régies suisses avec garantie de reprise.",
    features: ["Garantie d'acceptation", "Présence lors de l'état des lieux", "Nettoyage vitres & stores", "Shampouinage moquettes"],
    image: "/service-cleaning.png",
    isPopular: false
  },
  {
    id: 'storage',
    title: "Garde-Meubles",
    subtitle: "Sécurité Maximale",
    description: "Vos biens stockés dans des containers individuels plombés, au sein d'entrepôts tempérés et sécurisés 24/7 sous vidéo-surveillance.",
    features: ["Accès sur rendez-vous", "Containers ventilés", "Courte ou longue durée", "Inventaire photo détaillé"],
    image: "/service-storage.png",
    isPopular: false
  },
  {
    id: 'lift',
    title: "Monte-Meubles",
    subtitle: "Accès Difficiles",
    description: "Passage par la fenêtre jusqu'au 12ème étage. Idéal pour les canapés volumineux ou les cages d'escalier étroites des immeubles anciens.",
    features: ["Jusqu'à 300kg de charge", "Opérateur qualifié inclus", "Sécurisation de la zone", "Permis de voirie géré"],
    image: "/service-lift.png",
    isPopular: false
  },
  {
    id: 'inter',
    title: "International",
    subtitle: "Douanes & Logistique",
    description: "Quittez ou rejoignez la Suisse sans tracas administratifs. Nous gérons les formalités douanières et la logistique transfrontalière.",
    features: ["Gestion formalités douanières", "Fret routier, maritime ou aérien", "Emballage export spécifique", "Réseau de partenaires mondiaux"],
    image: "/service-international.png",
    isPopular: false
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans">

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Nos Services <span className="text-batimove-red">Premium</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Une gamme complète de prestations conçue pour répondre aux exigences les plus élevées.
            Précision, ponctualité et savoir-faire suisse à chaque étape.
          </p>
        </motion.div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {servicesList.map((service) => (
            <motion.div
              key={service.id}
              variants={item}
              className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-2 relative"
            >
              {service.isPopular && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-batimove-red border border-red-100 shadow-sm flex items-center gap-1 font-display tracking-wide">
                    <Star className="w-3 h-3 fill-current" />
                    RECOMMANDÉ
                  </div>
                </div>
              )}

              {/* Image Container with Zoom Effect */}
              <div className="h-64 overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="mb-4">
                  <span className="font-display text-xs font-bold text-batimove-blue uppercase tracking-widest mb-2 block">
                    {service.subtitle}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-900 group-hover:text-batimove-blue transition-colors">
                    {service.title}
                  </h3>
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed text-[15px] flex-grow font-normal">
                  {service.description}
                </p>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="mt-0.5 min-w-[18px]">
                        <Check className="w-4.5 h-4.5 text-green-600" strokeWidth={3} />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50">
                  <Link to={`/quote/${service.id}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-between text-slate-700 font-bold text-sm border-slate-200 group-hover:bg-batimove-blue group-hover:text-white group-hover:border-batimove-blue transition-all rounded-xl py-3"
                    >
                      Demander une offre
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-batimove-dark rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            {/* Cube Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

            {/* Subtle Blue Gradient */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-batimove-blue opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Un projet spécifique ?</h2>
              <p className="text-slate-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
                Nous réalisons également des transports d'objets d'art, de pianos, de coffres-forts et des déménagements VIP avec conciergerie.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-5 items-center">
                {/* Primary Button */}
                <Link to="/quote/general" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-batimove-red hover:bg-red-600 text-white rounded-full px-10 py-4 shadow-lg shadow-red-900/50 hover:shadow-red-500/50 transition-all hover:-translate-y-1 font-bold font-display tracking-wide">
                    Obtenir un devis sur mesure
                  </Button>
                </Link>

                {/* Secondary Button - FIXED COLOR VISIBILITY */}
                <a href="tel:+41225550000" className="w-full sm:w-auto group">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-full px-10 py-4 bg-white text-batimove-blue hover:bg-slate-50 border-2 border-white shadow-xl font-bold flex items-center justify-center gap-2 font-display transition-all hover:-translate-y-1"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler un conseiller
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};