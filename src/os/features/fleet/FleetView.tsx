import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, CheckCircle2, Clock, Wrench, Shield, User, MapPin } from 'lucide-react';
import { FleetVehicle, updateFleetVehicleStatus, saveFleetVehicle } from '../../../../services/supabaseClient';
import { cn } from '../../core/utils/cn';

interface FleetViewProps {
  vehicles: FleetVehicle[];
  onReload: () => void;
}

export function FleetView({ vehicles, onReload }: FleetViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    driver: '',
    capacity: '20 m³',
    status: 'Disponible',
    city: 'Genève',
    team: 'Équipe Alpha'
  });

  const availableCount = vehicles.filter(v => v.status === 'Disponible' || v.status === 'disponible').length;
  const missionCount = vehicles.filter(v => v.status === 'En mission' || v.status === 'en_mission').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance' || v.status === 'maintenance').length;

  const handleStatusToggle = async (v: FleetVehicle) => {
    let nextStatus = 'Disponible';
    if (v.status === 'Disponible') nextStatus = 'En mission';
    else if (v.status === 'En mission') nextStatus = 'Maintenance';
    else nextStatus = 'Disponible';

    try {
      await updateFleetVehicleStatus(v.id, nextStatus);
      onReload();
    } catch (err) {
      alert('Erreur changement statut');
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.name || !newVehicle.driver) {
      alert('Veuillez remplir le nom et le chauffeur');
      return;
    }
    try {
      await saveFleetVehicle({
        id: 'FLT-' + Date.now().toString().slice(-4),
        ...newVehicle
      });
      setShowAddModal(false);
      onReload();
    } catch (err) {
      alert('Erreur ajout véhicule');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Counters Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">En Mission</span>
            <div className="text-2xl font-bold text-blue-600 mt-0.5 tabular-nums">{missionCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Disponibles</span>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5 tabular-nums">{availableCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Maintenance</span>
            <div className="text-2xl font-bold text-amber-600 mt-0.5 tabular-nums">{maintenanceCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Flotte & Équipes Logistiques</h3>
          <p className="text-xs text-gray-500">Affectation des camions, monte-meubles et chauffeurs</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter Véhicule
        </button>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <motion.div
            key={v.id}
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 leading-snug">{v.name}</h4>
                    <span className="text-[11px] font-semibold text-gray-400">Capacité : {v.capacity}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStatusToggle(v)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-bold transition-transform active:scale-95",
                    v.status === 'Disponible' ? "bg-emerald-100 text-emerald-800" :
                    v.status === 'En mission' ? "bg-blue-100 text-blue-800" :
                    "bg-amber-100 text-amber-800"
                  )}
                  title="Cliquer pour changer le statut"
                >
                  {v.status}
                </button>
              </div>

              <div className="space-y-2 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <User className="w-3.5 h-3.5" /> Chauffeur
                  </span>
                  <span className="font-semibold text-gray-900">{v.driver}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Shield className="w-3.5 h-3.5" /> Équipe
                  </span>
                  <span className="font-semibold text-gray-900">{v.team || 'Standard'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <MapPin className="w-3.5 h-3.5" /> Base / Ville
                  </span>
                  <span className="font-semibold text-gray-900">{v.city || 'Genève'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Statut modifiable au clic</span>
              <span className="font-mono text-[10px] text-gray-300">ID: {v.id}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nouveau Véhicule</h3>
            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom / Immatriculation</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Renault Master 22m³ (GE-12345)"
                  value={newVehicle.name}
                  onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Chauffeur Assigné</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Marc V."
                  value={newVehicle.driver}
                  onChange={e => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Capacité</label>
                  <input
                    type="text"
                    value={newVehicle.capacity}
                    onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Statut Initial</label>
                  <select
                    value={newVehicle.status}
                    onChange={e => setNewVehicle({ ...newVehicle, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none bg-white"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En mission">En mission</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
