import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Plus, CheckCircle2, Clock, Wrench, Shield, 
  User, MapPin, Trash2, Edit2, Search, X, Check, MoreVertical
} from 'lucide-react';
import { 
  FleetVehicle, 
  updateFleetVehicleStatus, 
  saveFleetVehicle,
  deleteFleetVehicle 
} from '../../../../services/supabaseClient';
import { useToast } from '../../core/components/ToastContext';
import { cn } from '../../core/utils/cn';

interface FleetViewProps {
  vehicles: FleetVehicle[];
  onReload: () => void;
}

export function FleetView({ vehicles, onReload }: FleetViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<FleetVehicle | null>(null);

  const [formData, setFormData] = useState({
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

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = !searchQuery || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.team && v.team.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesStatus = true;
      if (filterStatus !== 'ALL') {
        matchesStatus = v.status.toLowerCase() === filterStatus.toLowerCase();
      }

      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchQuery, filterStatus]);

  const { toast, confirm } = useToast();

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      driver: '',
      capacity: '20 m³',
      status: 'Disponible',
      city: 'Genève',
      team: 'Équipe 1 (Direction AM)'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (v: FleetVehicle) => {
    setEditingVehicle(v);
    setFormData({
      name: v.name,
      driver: v.driver,
      capacity: v.capacity,
      status: v.status,
      city: v.city,
      team: v.team || 'Équipe 1 (Direction AM)'
    });
    setShowModal(true);
  };

  const handleStatusToggle = async (v: FleetVehicle) => {
    let nextStatus = 'Disponible';
    if (v.status === 'Disponible') nextStatus = 'En mission';
    else if (v.status === 'En mission') nextStatus = 'Maintenance';
    else nextStatus = 'Disponible';

    try {
      await updateFleetVehicleStatus(v.id, nextStatus);
      toast.success("Statut véhicule", `${v.name} est passé à : ${nextStatus}`);
      onReload();
    } catch (err) {
      toast.error("Erreur", "Impossible de modifier le statut du véhicule");
    }
  };

  const handleDelete = async (v: FleetVehicle) => {
    const ok = await confirm({
      title: `Supprimer ${v.name} ?`,
      message: `Voulez-vous retirer définitivement le véhicule ${v.id} (${v.driver}) de la flotte ?`,
      confirmLabel: "Supprimer",
      isDestructive: true
    });

    if (ok) {
      try {
        await deleteFleetVehicle(v.id);
        toast.success("Véhicule supprimé", `${v.name} a été retiré de la flotte.`);
        onReload();
      } catch (err) {
        toast.error("Erreur", "Échec de suppression du véhicule");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.driver) {
      toast.error('Champs manquants', 'Veuillez renseigner le nom du véhicule et le chauffeur.');
      return;
    }

    try {
      const vehicleToSave: FleetVehicle = {
        id: editingVehicle ? editingVehicle.id : 'FLT-' + Date.now().toString().slice(-4),
        ...formData
      };
      await saveFleetVehicle(vehicleToSave);
      setShowModal(false);
      toast.success("Flotte actualisée", `${formData.name} a été enregistré.`);
      onReload();
    } catch (err) {
      toast.error("Erreur", "Échec d'enregistrement du véhicule");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Counters Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterStatus(filterStatus === 'En mission' ? 'ALL' : 'En mission')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-sm flex items-center justify-between",
            filterStatus === 'En mission' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200/80 hover:border-gray-300"
          )}
        >
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">En Mission</span>
            <div className="text-2xl font-bold text-blue-600 mt-0.5 tabular-nums">{missionCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => setFilterStatus(filterStatus === 'Disponible' ? 'ALL' : 'Disponible')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-sm flex items-center justify-between",
            filterStatus === 'Disponible' ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-gray-200/80 hover:border-gray-300"
          )}
        >
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Disponibles</span>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5 tabular-nums">{availableCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div 
          onClick={() => setFilterStatus(filterStatus === 'Maintenance' ? 'ALL' : 'Maintenance')}
          className={cn(
            "p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-sm flex items-center justify-between",
            filterStatus === 'Maintenance' ? "border-amber-500 ring-2 ring-amber-500/20" : "border-gray-200/80 hover:border-gray-300"
          )}
        >
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Maintenance</span>
            <div className="text-2xl font-bold text-amber-600 mt-0.5 tabular-nums">{maintenanceCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher véhicule, chauffeur, immatriculation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-gray-200 text-xs focus:border-gray-900 focus:outline-none placeholder:text-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filterStatus !== 'ALL' && (
            <button
              onClick={() => setFilterStatus('ALL')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline px-2"
            >
              Réinitialiser filtre
            </button>
          )}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter Véhicule
          </button>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full p-12 text-center text-sm font-medium text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
            Aucun véhicule trouvé pour cette recherche.
          </div>
        ) : (
          filteredVehicles.map(v => (
            <motion.div
              key={v.id}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between group"
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
                      <MapPin className="w-3.5 h-3.5" /> Base / Dépôt
                    </span>
                    <span className="font-semibold text-gray-900">{v.city || 'Genève'}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-gray-300">ID: {v.id}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(v)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    title="Modifier véhicule"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(v)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingVehicle ? `Modifier ${editingVehicle.name}` : 'Nouveau Véhicule'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom / Immatriculation *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Iveco Daily 30m³ (GE-4921)"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Chauffeur Assigné *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Chauffeur 1 / Anderson M."
                  value={formData.driver}
                  onChange={e => setFormData({ ...formData, driver: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Capacité</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Statut Initial</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none bg-white"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En mission">En mission</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Équipe</label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={e => setFormData({ ...formData, team: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Base / Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
                >
                  {editingVehicle ? 'Enregistrer' : 'Créer le Véhicule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
