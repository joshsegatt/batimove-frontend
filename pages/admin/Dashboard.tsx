import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus,
  Search,
  Download,
  Printer,
  Phone,
  MessageSquare,
  ShieldCheck,
  Layers,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  QrCode,
  Check,
  Smartphone,
  RefreshCw,
  X,
  Bell,
  Settings,
  MapPin,
  Truck,
  Users,
  FileSpreadsheet,
  Receipt,
  ArrowRight,
  ArrowLeft,
  Eye,
  Trash2,
  Edit3,
  Save,
  Menu,
  GripVertical,
  Kanban,
  Table,
  RotateCcw,
  Star,
  BadgeCheck,
  Sliders
} from 'lucide-react';
import { 
  supabase,
  fetchLeads, 
  saveLead, 
  updateLeadStatus, 
  updateLeadDetails,
  deleteLead, 
  fetchFleetVehicles,
  saveFleetVehicle,
  updateFleetVehicleStatus,
  LeadItem,
  FleetVehicle
} from '../../services/supabaseClient';
import { InvoiceDocument } from '../../components/InvoiceDocument';
import { FinancialAppView } from '../../components/admin/FinancialAppView';
import { exportInvoiceToPdf } from '../../utils/pdfExport';
import { 
  adminLogout, 
  updateMasterPin,
  getCurrentUser,
  setCurrentUser,
  getUsersList,
  updateUserProfile,
  UserProfile
} from '../../services/adminAuth';

interface DashboardProps {
  onLogout: () => void;
}

type MainView = 'operations' | 'fiduciary' | 'fleet' | 'crm' | 'settings';
type BoardViewMode = 'table' | 'kanban';

// Swiss Currency Formatter (CHF 12'450.00)
const formatCHF = (val: any): string => {
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num) || !isFinite(num)) return "0.00";
  return num.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const getLeadAmount = (item: any): number => {
  if (!item) return 0;
  const val = item.amount_chf ?? item.estimated_amount_chf ?? 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

// Swiss E.164 Universal Phone & WhatsApp Normalizer (+41)
const formatSwissWhatsAppUrl = (phone: string, clientName?: string, customMessage?: string): string => {
  let cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.startsWith('0041')) {
    cleaned = '41' + cleaned.slice(4);
  } else if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
    cleaned = '41' + cleaned.slice(1);
  } else if (!cleaned.startsWith('41') && (cleaned.length === 9 || cleaned.length === 10)) {
    cleaned = '41' + cleaned;
  }
  const text = customMessage || (clientName 
    ? `Bonjour ${clientName}, concernant votre projet de déménagement Batimove Sàrl :`
    : `Bonjour, concernant votre projet de déménagement Batimove Sàrl :`);
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
};

// Monday.com Status Configuration System
interface StatusOption {
  key: string;
  label: string;
  bg: string;
  text: string;
  dot: string;
  border: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { key: 'nouveau', label: 'Nouveau Devis', bg: 'bg-sky-500', text: 'text-white', dot: 'bg-white', border: 'border-sky-600' },
  { key: 'visite', label: 'Visite Technique', bg: 'bg-amber-500', text: 'text-white', dot: 'bg-white', border: 'border-amber-600' },
  { key: 'en_cours', label: 'Devis Envoyé', bg: 'bg-indigo-600', text: 'text-white', dot: 'bg-white', border: 'border-indigo-700' },
  { key: 'confirme', label: 'Mission Confirmée', bg: 'bg-emerald-500', text: 'text-white', dot: 'bg-white', border: 'border-emerald-600' },
  { key: 'facture', label: 'Facturé / Payé', bg: 'bg-blue-600', text: 'text-white', dot: 'bg-white', border: 'border-blue-700' },
  { key: 'annule', label: 'Dossier Annulé', bg: 'bg-rose-500', text: 'text-white', dot: 'bg-white', border: 'border-rose-600' }
];

const DEFAULT_FLEET = [
  { id: '1', name: 'Iveco Daily 30m³ (GE-4921)', driver: 'Yannick M.', capacity: '30 m³', status: 'En mission', city: 'Cologny', next: '14:30', team: 'Équipe Alpha' },
  { id: '2', name: 'Iveco Eurocargo 45m³ (GE-8102)', driver: 'Marc V.', capacity: '45 m³', status: 'En mission', city: 'Genève Centre', next: '16:00', team: 'Équipe Bêta' },
  { id: '3', name: 'Renault Master 20m³ (VD-2910)', driver: 'David L.', capacity: '20 m³', status: 'Disponible', city: 'Dépôt Vernier', next: 'Demain', team: 'Équipe Gamma' },
  { id: '4', name: 'Monte-Meubles Klaas 25m (GE-119)', driver: 'Spécialiste Levage', capacity: 'Élévateur 400kg', status: 'Réservé', city: 'Champel', next: '10:00', team: 'Équipe Levage' }
];

const DEFAULT_KPI_ORDER = ['revenue', 'tax', 'pipeline', 'fleet'];

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<MainView>('operations');
  const [boardViewMode, setBoardViewMode] = useState<BoardViewMode>('table');
  const [fiduciarySubView, setFiduciarySubView] = useState<'app' | 'statement'>('app');
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User Profile & Authentication State (Multi-User Monday.com)
  const [currentUser, setCurrentUserState] = useState<UserProfile>(getCurrentUser());
  const [teamUsers, setTeamUsers] = useState<UserProfile[]>(getUsersList());
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'profile' | 'security' | 'switch'>('profile');
  
  // Profile edit inputs
  const [editUserName, setEditUserName] = useState(currentUser.name);
  const [editUserEmail, setEditUserEmail] = useState(currentUser.email);
  const [editUserPhone, setEditUserPhone] = useState(currentUser.phone);

  // PIN change inputs
  const [profileCurrentPin, setProfileCurrentPin] = useState('');
  const [profileNewPin, setProfileNewPin] = useState('');
  const [profileConfirmPin, setProfileConfirmPin] = useState('');

  // Sidebar fold/unfold state (Monday.com Tier 2 panel)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Draggable KPI Cards Order state
  const [kpiOrder, setKpiOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('batimove_os_kpi_order_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) return parsed;
      }
    } catch {}
    return DEFAULT_KPI_ORDER;
  });

  const handleReorderKpis = (newOrder: string[]) => {
    setKpiOrder(newOrder);
    try {
      localStorage.setItem('batimove_os_kpi_order_v2', JSON.stringify(newOrder));
    } catch {}
  };

  const handleResetKpiOrder = () => {
    setKpiOrder(DEFAULT_KPI_ORDER);
    try {
      localStorage.setItem('batimove_os_kpi_order_v2', JSON.stringify(DEFAULT_KPI_ORDER));
    } catch {}
    showToast("Ordre par défaut des widgets restauré.");
  };

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Selected Lead for the Bexio-style Slide-over Inspector
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isEditingInspector, setIsEditingInspector] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [editMoveDate, setEditMoveDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editFromCity, setEditFromCity] = useState('');
  const [editToCity, setEditToCity] = useState('');

  // Delete lead confirmation modal
  const [leadToDelete, setLeadToDelete] = useState<LeadItem | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const invoiceContainerRef = useRef<HTMLDivElement>(null);

  // PDF Export Handler
  const handleDownloadPdf = async () => {
    if (!selectedLead || !invoiceContainerRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const invNum = `FAC-2026-${selectedLead.id.replace(/\D/g, '').padStart(3, '0') || '042'}`;
      const res = await exportInvoiceToPdf(
        invoiceContainerRef.current,
        invNum,
        selectedLead.client_name
      );
      if (res.success) {
        showToast(`Facture PDF téléchargée : ${res.filename}`);
      } else {
        showToast(res.error || "Erreur lors du téléchargement du PDF");
      }
    } catch (err) {
      console.error('PDF export error:', err);
      showToast("Erreur lors de la génération du PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Active status popover row ID (for Monday.com inline status picker)
  const [activeStatusDropdownId, setActiveStatusDropdownId] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cantonFilter, setCantonFilter] = useState('all');

  // Groups collapsed state in Monday.com board
  const [groupConfirmedOpen, setGroupConfirmedOpen] = useState(true);
  const [groupPendingOpen, setGroupPendingOpen] = useState(true);
  const [groupCompletedOpen, setGroupCompletedOpen] = useState(true);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New Lead Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newServiceType, setNewServiceType] = useState('Déménagement Résidentiel');
  const [newAmount, setNewAmount] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newFromCity, setNewFromCity] = useState('Genève');
  const [newToCity, setNewToCity] = useState('Lausanne');

  // Fleet management state
  const [fleetVehicles, setFleetVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('batimove_os_fleet_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FLEET;
  });

  const [isAssignVehicleModalOpen, setIsAssignVehicleModalOpen] = useState(false);
  const [newTruckName, setNewTruckName] = useState('');
  const [newTruckDriver, setNewTruckDriver] = useState('');
  const [newTruckCapacity, setNewTruckCapacity] = useState('30 m³');
  const [newTruckCity, setNewTruckCity] = useState('Genève');

  // PWA Install Prompt
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice?.outcome === 'accepted') {
      setInstallPrompt(null);
      showToast("Batimove OS installé avec succès sur cet appareil !");
    }
  };

  // Load Data from Supabase
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leadsData, fleetData] = await Promise.all([
        fetchLeads(),
        fetchFleetVehicles()
      ]);
      setLeads(leadsData || []);
      if (fleetData && fleetData.length > 0) {
        setFleetVehicles(fleetData);
      }
      if (leadsData && leadsData.length > 0 && !selectedLead) {
        setSelectedLead(leadsData[0]);
      }
    } catch (err) {
      console.error('Error loading Batimove OS data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const user = getCurrentUser();
    setCurrentUserState(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPhone(user.phone);
    setTeamUsers(getUsersList());

    // Supabase Realtime live sync across concurrent sessions
    const channel = supabase
      .channel('public-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          console.log('[Realtime] Leads change received:', payload);
          fetchLeads().then((leadsData) => {
            if (leadsData) {
              setLeads(leadsData);
              setSelectedLead((prev) => {
                if (!prev) return leadsData[0] || null;
                const match = leadsData.find((l) => l.id === prev.id);
                return match || prev;
              });
            }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fleet_vehicles' },
        (payload) => {
          console.log('[Realtime] Fleet change received:', payload);
          fetchFleetVehicles().then((fleetData) => {
            if (fleetData && fleetData.length > 0) {
              setFleetVehicles(fleetData);
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle Switch User (Fast User Switcher)
  const handleSwitchUser = (targetUser: UserProfile) => {
    setCurrentUser(targetUser);
    setCurrentUserState(targetUser);
    setEditUserName(targetUser.name);
    setEditUserEmail(targetUser.email);
    setEditUserPhone(targetUser.phone);
    setIsAccountModalOpen(false);
    showToast(`Session basculée sur : ${targetUser.name} (${targetUser.role})`);
  };

  // Handle Save User Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateUserProfile(currentUser.id, {
      name: editUserName,
      email: editUserEmail,
      phone: editUserPhone
    });
    if (res.success && res.user) {
      setCurrentUserState(res.user);
      setTeamUsers(getUsersList());
      showToast("Informations du profil mises à jour avec succès !");
    } else {
      showToast(res.message);
    }
  };

  // Handle Change PIN in Modal
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileNewPin !== profileConfirmPin) {
      showToast("Les nouveaux codes PIN ne correspondent pas.");
      return;
    }
    const res = updateMasterPin(profileCurrentPin, profileNewPin);
    if (res.success) {
      const updated = getCurrentUser();
      setCurrentUserState(updated);
      setProfileCurrentPin('');
      setProfileNewPin('');
      setProfileConfirmPin('');
      showToast("Code PIN personnel mis à jour avec succès !");
    } else {
      showToast(res.message);
    }
  };

  // Update Status in Supabase & Local state
  const handleStatusChange = async (leadId: string, newStatus: any) => {
    const targetLead = leads.find(l => l.id === leadId);
    try {
      const res = await updateLeadStatus(leadId, newStatus, undefined, targetLead?.version);
      if (res.success && res.lead) {
        setLeads(prev => prev.map(l => l.id === leadId ? res.lead! : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(res.lead);
        }
        showToast(`Dossier #${leadId} mis à jour : ${STATUS_OPTIONS.find(o => o.key === newStatus)?.label}`);
      } else if (res.error === 'CONCURRENCY_CONFLICT') {
        showToast("⚠️ Conflit de concurrence : Ce dossier a été modifié par un autre utilisateur. Rechargement...");
        await loadData();
      } else if (res.error === 'PERMISSION_DENIED') {
        showToast("Action refusée : Vous n'avez pas les permissions nécessaires sur le serveur.");
      } else {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
        }
        showToast(`Dossier #${leadId} mis à jour : ${STATUS_OPTIONS.find(o => o.key === newStatus)?.label}`);
      }
      setActiveStatusDropdownId(null);
    } catch (e) {
      console.error('Failed to update status:', e);
      showToast("Erreur lors de la mise à jour");
    }
  };

  // Open Drawer & Init Edit state
  const handleOpenLead = (lead: LeadItem) => {
    setSelectedLead(lead);
    setEditAmount(String(getLeadAmount(lead)));
    setEditMoveDate(lead.move_date || 'Mars 2026');
    setEditNotes(lead.notes || lead.details || '');
    setEditFromCity(lead.from_city || 'Genève');
    setEditToCity(lead.to_city || 'Lausanne');
    setIsEditingInspector(false);
    setIsInspectorOpen(true);
  };

  // Save Lead Updates from Drawer
  const handleSaveLeadDetails = async () => {
    if (!selectedLead || isSubmitting) return;
    if (!currentUser.permissions.canEditPricing && editAmount !== String(getLeadAmount(selectedLead))) {
      showToast("Action refusée : modification des tarifs réservée à la Direction et aux Conseillers.");
      return;
    }
    setIsSubmitting(true);
    try {
      const num = Number(editAmount) || getLeadAmount(selectedLead);
      const res = await updateLeadDetails(selectedLead.id, {
        amount_chf: num,
        estimated_amount_chf: num,
        move_date: editMoveDate,
        from_city: editFromCity,
        to_city: editToCity,
        notes: editNotes
      }, selectedLead.version);

      if (res.success && res.lead) {
        setSelectedLead(res.lead);
        setLeads(prev => prev.map(l => l.id === res.lead!.id ? res.lead! : l));
        setIsEditingInspector(false);
        showToast(`Dossier #${res.lead.id} mis à jour avec succès !`);
      } else if (res.error === 'CONCURRENCY_CONFLICT') {
        showToast("⚠️ Conflit : Ce dossier a été modifié par un autre utilisateur. Données rechargées.");
        await loadData();
      } else if (res.error === 'PERMISSION_DENIED') {
        showToast(`Action refusée : ${res.message || 'Permissions insuffisantes sur le serveur.'}`);
      } else {
        showToast(res.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error('Failed to save lead details:', err);
      showToast("Erreur inattendue");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Lead
  const handleConfirmDelete = async () => {
    if (!leadToDelete || isSubmitting) return;
    if (!currentUser.permissions.canDeleteLeads) {
      showToast("Action refusée : suppression de dossiers réservée à la Direction.");
      setLeadToDelete(null);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await deleteLead(leadToDelete.id);
      if (res.success) {
        setLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
        if (selectedLead && selectedLead.id === leadToDelete.id) {
          setIsInspectorOpen(false);
          setSelectedLead(null);
        }
        showToast(`Dossier #${leadToDelete.id} supprimé définitivement.`);
      } else {
        showToast(res.message || "Action refusée par le serveur.");
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
      showToast("Erreur lors de la suppression");
    } finally {
      setIsSubmitting(false);
      setLeadToDelete(null);
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const name = (lead.client_name || '').toLowerCase();
      const email = (lead.client_email || '').toLowerCase();
      const service = (lead.service_type || '').toLowerCase();
      const from = (lead.from_city || '').toLowerCase();
      const to = (lead.to_city || '').toLowerCase();
      const idStr = (lead.id || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchSearch = name.includes(q) || email.includes(q) || service.includes(q) || from.includes(q) || to.includes(q) || idStr.includes(q);
      if (!matchSearch) return false;

      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false;
      }

      if (cantonFilter !== 'all') {
        const fullRoute = `${from} ${to}`;
        if (!fullRoute.includes(cantonFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, cantonFilter]);

  // Grouped Leads for Monday.com Board view
  const confirmedLeads = useMemo(() => {
    return filteredLeads.filter(l => l.status === 'confirme');
  }, [filteredLeads]);

  const pendingLeads = useMemo(() => {
    return filteredLeads.filter(l => l.status === 'nouveau' || l.status === 'visite' || l.status === 'en_cours');
  }, [filteredLeads]);

  const completedLeads = useMemo(() => {
    return filteredLeads.filter(l => l.status === 'facture' || l.status === 'annule');
  }, [filteredLeads]);

  // Financial KPIs (Swiss Standard Bexio in CHF)
  const metrics = useMemo(() => {
    let totalHT = 0;
    let totalTTC = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let totalVolumeM3 = 0;

    leads.forEach((l, idx) => {
      const amt = getLeadAmount(l);
      totalTTC += amt;
      totalHT += amt / 1.081;
      totalVolumeM3 += (25 + (idx % 4) * 15);

      if (l.status === 'nouveau' || l.status === 'en_cours' || l.status === 'visite') {
        pendingCount++;
      } else if (l.status === 'confirme' || l.status === 'facture') {
        confirmedCount++;
      }
    });

    const tva81 = totalTTC * (8.1 / 108.1);
    const calculatedHT = totalTTC - tva81;

    return {
      totalHT: calculatedHT,
      totalTTC: totalTTC,
      tva81: tva81,
      pendingCount: pendingCount,
      confirmedCount: confirmedCount,
      totalVolumeM3: totalVolumeM3,
      totalMoves: leads.length
    };
  }, [leads]);

  // Create new lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientPhone.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const amt = Number(newAmount) || 3500;
      const saved = await saveLead({
        client_name: newClientName.trim(),
        client_phone: newClientPhone.trim(),
        client_email: newClientEmail.trim(),
        service_type: newServiceType,
        from_city: newFromCity,
        to_city: newToCity,
        move_date: 'Mars 2026',
        details: newDetails || 'Prestation complète déménagement Batimove',
        amount_chf: amt,
        estimated_amount_chf: amt,
        status: 'nouveau'
      });

      setLeads(prev => [saved, ...prev.filter(l => l.id !== saved.id)]);
      setSelectedLead(saved);
      setIsNewModalOpen(false);

      setNewClientName('');
      setNewClientPhone('');
      setNewClientEmail('');
      setNewAmount('');
      setNewDetails('');

      showToast(`Dossier #${saved.id} enregistré avec succès !`);
    } catch (err) {
      console.error('Failed to create lead:', err);
      showToast("Erreur lors de l'enregistrement du dossier");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Vehicle to Fleet
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.permissions.canManageFleet) {
      showToast("Action refusée : gestion de la flotte réservée aux Responsables Logistique.");
      return;
    }
    if (!newTruckName.trim() || !newTruckDriver.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newV: FleetVehicle = {
        id: String(Date.now()),
        name: newTruckName.trim(),
        driver: newTruckDriver.trim(),
        capacity: newTruckCapacity,
        status: 'Disponible',
        city: newTruckCity,
        next: 'Planning',
        next_mission: 'Planning',
        team: 'Équipe Flotte'
      };
      await saveFleetVehicle(newV);
      const updated = [newV, ...fleetVehicles.filter(v => v.id !== newV.id)];
      setFleetVehicles(updated);
      setIsAssignVehicleModalOpen(false);
      setNewTruckName('');
      setNewTruckDriver('');
      showToast(`Véhicule ${newV.name} ajouté au parc.`);
    } catch (err) {
      console.error('Failed to add vehicle:', err);
      showToast("Erreur lors de l'ajout du véhicule");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change Fleet Status
  const handleToggleVehicleStatus = async (truckId: string) => {
    if (!currentUser.permissions.canManageFleet) {
      showToast("Action refusée : gestion de la flotte réservée aux Responsables Logistique.");
      return;
    }
    const truck = fleetVehicles.find(v => v.id === truckId);
    if (!truck) return;
    const nextStatus = truck.status === 'En mission' ? 'Disponible' : truck.status === 'Disponible' ? 'Réservé' : 'En mission';
    
    await updateFleetVehicleStatus(truckId, nextStatus);
    const updated = fleetVehicles.map(v => v.id === truckId ? { ...v, status: nextStatus } : v);
    setFleetVehicles(updated);
    showToast("Statut du véhicule mis à jour.");
  };

  // Export CSV for Swiss Fiduciary (Winbiz / Bexio)
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Client', 'Telephone', 'Email', 'Trajet', 'Montant CHF HT', 'TVA 8.1%', 'Montant CHF TTC', 'Statut'];
    const rows = leads.map(l => {
      const ttc = getLeadAmount(l);
      const tva = ttc * (8.1 / 108.1);
      const ht = ttc - tva;
      return [
        l.id,
        l.move_date || 'Mars 2026',
        l.service_type,
        `"${l.client_name}"`,
        `"${l.client_phone}"`,
        `"${l.client_email || ''}"`,
        `"${l.from_city || 'Genève'} -> ${l.to_city || 'Lausanne'}"`,
        ht.toFixed(2),
        tva.toFixed(2),
        ttc.toFixed(2),
        l.status
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Batimove_Bexio_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV Bexio généré avec succès !");
  };

  // Export complete JSON backup
  const handleExportJSON = () => {
    const backup = {
      exported_at: new Date().toISOString(),
      company: 'Batimove Sàrl (Genève)',
      ide: 'CHE-492.836.215 TVA',
      user: currentUser.name,
      metrics,
      leads,
      fleet: fleetVehicles
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Batimove_Backup_Complet_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Sauvegarde JSON complète téléchargée !");
  };

  // =========================================================================
  // RENDER MODULAR DRAGGABLE LUXURY KPI CARD (ZERO INLINE STYLES)
  // =========================================================================
  const renderKpiCard = (key: string) => {
    if (key === 'revenue') {
      return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between group relative overflow-hidden select-none">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-500 transition-colors" title="Glisser pour réorganiser">
                <GripVertical className="w-4 h-4" />
              </span>
              <span>Chiffre d'Affaires Brut (TTC)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +18.4%
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
              CHF {formatCHF(metrics.totalTTC)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Montant Net (HT) : <strong className="text-slate-700 font-mono">CHF {formatCHF(metrics.totalHT)}</strong>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Objectif Trimestriel</span>
              <span className="font-bold text-emerald-600">84% Atteint</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-5/6" />
            </div>
          </div>
        </div>
      );
    }

    if (key === 'tax') {
      return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between group relative overflow-hidden select-none">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-500 transition-colors" title="Glisser pour réorganiser">
                <GripVertical className="w-4 h-4" />
              </span>
              <span>TVA Fédérale Due (8.1%)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              AFC / ESTV
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-blue-700 tracking-tight">
              CHF {formatCHF(metrics.tva81)}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Taux légal suisse 2026 (Genève)
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Clôture Trimestrielle</span>
              <span className="font-bold text-blue-600 font-mono">100% Conforme</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full w-full" />
            </div>
          </div>
        </div>
      );
    }

    if (key === 'pipeline') {
      return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between group relative overflow-hidden select-none">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-500 transition-colors" title="Glisser pour réorganiser">
                <GripVertical className="w-4 h-4" />
              </span>
              <span>Dossiers & Devis Actifs</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {metrics.pendingCount} en attente
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
              {leads.length} <span className="text-sm font-semibold text-slate-400">clients</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              <strong className="text-emerald-600">{metrics.confirmedCount} confirmés</strong> • {metrics.pendingCount} à relancer
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Taux de Signature</span>
              <span className="font-bold text-indigo-600">67% Conversion</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-500 h-full rounded-full w-2/3" />
            </div>
          </div>
        </div>
      );
    }

    if (key === 'fleet') {
      return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between group relative overflow-hidden select-none">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <span className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-500 transition-colors" title="Glisser pour réorganiser">
                <GripVertical className="w-4 h-4" />
              </span>
              <span>Capacité Flotte & Volume</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {fleetVehicles.length} Iveco Actifs
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
              {metrics.totalVolumeM3} <span className="text-sm font-semibold text-slate-400">m³</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Flotte 30m³, 45m³ & Monte-meubles
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Taux d'Occupation</span>
              <span className="font-bold text-amber-600">88% Réservé</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full w-4/5" />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 font-sans flex antialiased selection:bg-[#0073ea]/20 selection:text-[#0073ea] pb-16 lg:pb-0 overflow-hidden">
      
      {/* =========================================================================
          1. MONDAY.COM TWO-TIER SIDEBAR (DESKTOP)
          Tier 1: 56px Dark Micro-Rail (Logo, Core Views, Notifications, User Avatar)
          Tier 2: 240px Collapsible Workspace Panel (Folders, Boards, Switchers)
          ========================================================================= */}
      
      {/* TIER 1: MICRO-RAIL (56px) */}
      <aside className="w-14 shrink-0 bg-[#081627] text-white flex flex-col justify-between items-center py-3 border-r border-white/10 z-30 select-none hidden lg:flex no-print">
        
        {/* Top: Original Batimove Logo */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="/"
            title="Retour au site public Batimove"
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shadow-lg shadow-black/20 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer"
          >
            <img 
              src="/batimove-logo.png" 
              alt="Batimove Original Logo" 
              className="w-full h-full object-contain"
            />
          </a>

          <div className="w-6 h-px bg-white/10 my-1" />

          {/* Micro-Rail Main Navigation Icons */}
          <div className="flex flex-col items-center gap-2">
            
            <button
              onClick={() => setCurrentView('operations')}
              title="Tableau des Devis & Missions"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                currentView === 'operations'
                  ? 'bg-[#0073ea] text-white shadow-md shadow-blue-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-5 h-5" />
              {currentView === 'operations' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
              )}
            </button>

            <button
              onClick={() => { setCurrentView('operations'); setBoardViewMode('kanban'); }}
              title="Vue Kanban Pipeline"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                currentView === 'operations' && boardViewMode === 'kanban'
                  ? 'bg-[#0073ea]/30 text-sky-400 border border-sky-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Kanban className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentView('fiduciary')}
              title="Comptabilité & Extrait TVA Suisse"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                currentView === 'fiduciary'
                  ? 'bg-[#0073ea] text-white shadow-md shadow-blue-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Receipt className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentView('fleet')}
              title="Flotte Iveco & Planning"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                currentView === 'fleet'
                  ? 'bg-[#0073ea] text-white shadow-md shadow-blue-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Truck className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentView('crm')}
              title="CRM & Leads Web"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                currentView === 'crm'
                  ? 'bg-[#0073ea] text-white shadow-md shadow-blue-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>

            {/* Notifications with counter */}
            <button
              onClick={() => {
                setStatusFilter('nouveau');
                setCurrentView('operations');
                showToast("Affichage des nouvelles demandes en attente.");
              }}
              title="Alertes Devis en Attente"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative"
            >
              <Bell className="w-5 h-5" />
              {pendingLeads.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-sky-400 rounded-full ring-2 ring-[#081627]" />
              )}
            </button>

          </div>
        </div>

        {/* Bottom: Settings & Multi-User Avatar with Online Status */}
        <div className="flex flex-col items-center gap-3">
          
          <button
            onClick={() => { setIsAccountModalOpen(true); setAccountTab('security'); }}
            title="Paramètres de sécurité & PIN"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Avatar - Opens Account Settings & Fast Switcher Modal */}
          <button
            onClick={() => { setIsAccountModalOpen(true); setAccountTab('profile'); }}
            title={`Compte actif : ${currentUser.name} (${currentUser.role})`}
            className={`w-10 h-10 rounded-2xl ${currentUser.avatarBg} text-white flex items-center justify-center font-black text-xs relative shadow-lg ring-2 ring-white/20 hover:ring-sky-400 hover:scale-105 transition-all cursor-pointer`}
          >
            <span>{currentUser.initials}</span>
            {/* Green Online Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#081627] rounded-full" />
          </button>

          {/* Collapse / Unfold Tier 2 Rail Toggle */}
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            title={isSidebarExpanded ? "Replier le menu latéral" : "Déplier le menu latéral"}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            {isSidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

        </div>

      </aside>

      {/* TIER 2: COLLAPSIBLE WORKSPACE PANEL (240px) */}
      <AnimatePresence initial={false}>
        {isSidebarExpanded && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-60 bg-[#0c192c] text-white flex flex-col justify-between shrink-0 hidden lg:flex border-r border-slate-800/80 shadow-2xl z-20 select-none overflow-hidden no-print"
          >
            <div>
              {/* Workspace Header & Switcher */}
              <div className="p-3.5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-white tracking-tight truncate">BATIMOVE SÀRL</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">PRO</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      Espace : Direction Genève
                    </div>
                  </div>
                </div>

                {/* Workspace Quick Search */}
                <div className="mt-3 relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Filtrer les tableaux..."
                    className="w-full pl-8 pr-2 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Workspace Tree Folders (Monday.com high-contrast style) */}
              <div className="p-2.5 space-y-1 text-xs">
                
                {/* GROUP 1: OPÉRATIONS */}
                <div className="px-2 pt-2 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Opérations & Ventes</span>
                  <span className="text-[9px] font-mono text-slate-500">{leads.length}</span>
                </div>

                <button
                  onClick={() => setCurrentView('operations')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
                    currentView === 'operations'
                      ? 'bg-[#0073ea] text-white font-bold shadow-md shadow-blue-500/25'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    <span className="truncate">Devis & Missions</span>
                  </div>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    currentView === 'operations' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    {leads.length}
                  </span>
                </button>

                <button
                  onClick={() => { setCurrentView('operations'); setBoardViewMode('kanban'); }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  <Kanban className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="truncate">Pipeline Kanban</span>
                </button>

                <button
                  onClick={() => setCurrentView('crm')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
                    currentView === 'crm'
                      ? 'bg-[#0073ea] text-white font-bold shadow-md shadow-blue-500/25'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span className="truncate">CRM & Prospects Web</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                </button>

                {/* GROUP 2: FINANCE */}
                <div className="px-2 pt-4 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Finance & Comptabilité</span>
                  <span className="text-[9px] font-mono text-emerald-400">CHF</span>
                </div>

                <button
                  onClick={() => setCurrentView('fiduciary')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
                    currentView === 'fiduciary'
                      ? 'bg-[#0073ea] text-white font-bold shadow-md shadow-blue-500/25'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">TVA 8.1% & Grand Livre</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    Bexio
                  </span>
                </button>

                {/* GROUP 3: FLOTTE */}
                <div className="px-2 pt-4 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Logistique Suisse
                </div>

                <button
                  onClick={() => setCurrentView('fleet')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
                    currentView === 'fleet'
                      ? 'bg-[#0073ea] text-white font-bold shadow-md shadow-blue-500/25'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">Flotte Iveco & Levage</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {fleetVehicles.length}
                  </span>
                </button>

                {/* GROUP 4: ACTIONS RAPIDES */}
                <div className="px-2 pt-4 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Rapports & Exports
                </div>

                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">Exporter CSV (Bexio)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-400" />
                  <span className="truncate">Imprimer Bilan A4</span>
                </button>

              </div>
            </div>

            {/* User Profile Card at Bottom of Tier 2 */}
            <div className="p-3 border-t border-white/10 bg-black/20">
              
              {installPrompt && (
                <button
                  onClick={handleInstallApp}
                  className="w-full mb-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#0073ea] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Installer l'App PWA</span>
                </button>
              )}

              <div 
                onClick={() => { setIsAccountModalOpen(true); setAccountTab('profile'); }}
                className="p-2 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${currentUser.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                    {currentUser.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white leading-tight truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium leading-tight truncate mt-0.5">{currentUser.role}</div>
                  </div>
                </div>

                <div className="p-1 text-slate-400 hover:text-white">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span>IDE CHE-492.836.215</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Live</span>
                </span>
              </div>
            </div>

          </motion.aside>
        )}
      </AnimatePresence>

      {/* =========================================================================
          2. MAIN CONTENT AREA (MONDAY.COM BOARD STRUCTURE)
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Board Navigation Bar */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 shadow-2xs no-print">
          
          {/* Upper row: Breadcrumbs, Board Title & User Fast Actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <a
                href="/"
                title="Aller au site vitrine"
                className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </a>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-black text-slate-900 leading-none truncate">
                    {currentView === 'operations' && 'Tableau Principal des Devis & Missions'}
                    {currentView === 'fiduciary' && 'Extrait Fiducière Suisse & TVA 8.1%'}
                    {currentView === 'fleet' && 'Planning de la Flotte & Équipes'}
                    {currentView === 'crm' && 'CRM & Pipeline des Prospects Web'}
                    {currentView === 'settings' && 'Paramètres de Sécurité & PIN'}
                  </h1>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 hidden sm:inline" />
                  <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Supabase Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-none truncate">
                  Batimove Sàrl • Session active : <strong className="text-slate-700">{currentUser.name}</strong> ({currentUser.role})
                </p>
              </div>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              
              <button
                onClick={loadData}
                title="Synchroniser avec la base Supabase"
                className={`p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer ${isLoading ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => { setIsAccountModalOpen(true); setAccountTab('switch'); }}
                title="Changer d'utilisateur"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <div className={`w-5 h-5 rounded-md ${currentUser.avatarBg} text-white flex items-center justify-center font-bold text-[10px]`}>
                  {currentUser.initials}
                </div>
                <span className="truncate max-w-[120px]">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#0073ea] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouveau Devis</span>
                <span className="sm:hidden">Devis</span>
              </button>

            </div>
          </div>

          {/* Lower row: Monday.com Board Tabs & Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
            {/* Board View Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setCurrentView('operations'); setBoardViewMode('table'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'operations' && boardViewMode === 'table'
                    ? 'bg-[#0073ea] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Tableau Principal</span>
              </button>

              <button
                onClick={() => { setCurrentView('operations'); setBoardViewMode('kanban'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'operations' && boardViewMode === 'kanban'
                    ? 'bg-[#0073ea] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Vue Kanban</span>
              </button>

              <button
                onClick={() => setCurrentView('fleet')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'fleet'
                    ? 'bg-[#0073ea] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flotte & Équipes</span>
                <span className="sm:hidden">Flotte</span>
              </button>

              <button
                onClick={() => setCurrentView('fiduciary')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'fiduciary' && fiduciarySubView === 'statement'
                    ? 'bg-[#0073ea] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Extrait TVA</span>
                <span className="sm:hidden">TVA</span>
              </button>

              <button
                onClick={() => { setCurrentView('fiduciary'); setFiduciarySubView('app'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'fiduciary' && fiduciarySubView === 'app'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                }`}
                title="Afficher la Dashboard FinTech Mobile & Contrôle Financier"
              >
                <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                <span className="hidden sm:inline">Mode App FinTech</span>
                <span className="sm:hidden">FinTech</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {/* Quick Actions (Print & CSV) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Exporter pour Winbiz ou Bexio"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Export CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Imprimer la vue courante"
              >
                <Printer className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden md:inline">Imprimer A4</span>
              </button>
            </div>
          </div>

        </header>

        {/* Dashboard Body Container */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-[1700px] w-full mx-auto">
          
          {/* =========================================================================
              3. DRAGGABLE LUXURY KPI CARDS (OPERATIONS & CRM ONLY)
              ========================================================================= */}
          {currentView !== 'fiduciary' && (
            <div className="space-y-2 no-print">
              <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                  <span>Widgets interactifs : <strong>Glissez et déposez</strong> les cartes pour agencer votre tableau de bord.</span>
                </span>
                <button
                  onClick={handleResetKpiOrder}
                  className="hover:text-slate-700 flex items-center gap-1 text-[10px] transition-colors cursor-pointer"
                  title="Rétablir l'ordre d'origine"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rétablir l'ordre</span>
                </button>
              </div>

              <Reorder.Group
                axis="x"
                values={kpiOrder}
                onReorder={handleReorderKpis}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0 m-0"
              >
                {kpiOrder.map((key) => (
                  <Reorder.Item
                    key={key}
                    value={key}
                    className="list-none focus:outline-none"
                    whileDrag={{ scale: 1.03, zIndex: 40, cursor: 'grabbing' }}
                  >
                    {renderKpiCard(key)}
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          )}

          {/* =========================================================================
              4. MONDAY.COM BOARD VIEW (OPERATIONS: TABLE OR KANBAN)
              ========================================================================= */}
          {currentView === 'operations' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              
              {/* Filter & Search Toolbar */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 no-print">
                
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  
                  {/* Status Filter Pills */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === 'all' ? 'bg-[#0B1E33] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tous ({leads.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('confirme')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === 'confirme' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Confirmés ({confirmedLeads.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('en_cours')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === 'en_cours' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      En cours ({pendingLeads.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('facture')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        statusFilter === 'facture' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Facturés ({completedLeads.length})
                    </button>
                  </div>

                  {/* Canton Filter */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-slate-600 shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <select
                      value={cantonFilter}
                      onChange={e => setCantonFilter(e.target.value)}
                      className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                    >
                      <option value="all">Tous cantons (GE, VD)</option>
                      <option value="Genève">Genève (GE)</option>
                      <option value="Lausanne">Vaud / Lausanne (VD)</option>
                      <option value="Cologny">Cologny</option>
                    </select>
                  </div>

                </div>

                {/* Right: Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Chercher client, téléphone..."
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 outline-none focus:border-[#0073ea] shadow-2xs"
                  />
                </div>

              </div>

              {/* VIEW MODE 1: MONDAY.COM GRID TABLE */}
              {boardViewMode === 'table' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    
                    <thead>
                      <tr className="bg-slate-50/90 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 select-none">
                        <th className="p-3.5 pl-6">Dossier & Client</th>
                        <th className="p-3.5">Contact Rapide</th>
                        <th className="p-3.5">Prestation & Trajet</th>
                        <th className="p-3.5">Volume & Équipe</th>
                        <th className="p-3.5 text-right">Montant (CHF)</th>
                        <th className="p-3.5 text-center">Statut Opérationnel</th>
                        <th className="p-3.5 pr-6 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-xs">
                      
                      {/* GROUP 1: MISSIONS CONFIRMÉES */}
                      {confirmedLeads.length > 0 && (
                        <>
                          <tr className="bg-emerald-50/50 border-y border-emerald-100 text-emerald-950 font-bold text-xs select-none">
                            <td colSpan={7} className="py-2.5 px-6">
                              <button
                                onClick={() => setGroupConfirmedOpen(!groupConfirmedOpen)}
                                className="flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-black cursor-pointer"
                              >
                                {groupConfirmedOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <span>Missions Confirmées & Prévues ({confirmedLeads.length})</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  CHF {formatCHF(confirmedLeads.reduce((acc, l) => acc + getLeadAmount(l), 0))}
                                </span>
                              </button>
                            </td>
                          </tr>
                          {groupConfirmedOpen && confirmedLeads.map((lead, idx) => (
                            <LeadTableRow
                              key={lead.id}
                              lead={lead}
                              idx={idx}
                              isSelected={selectedLead?.id === lead.id}
                              onSelect={() => handleOpenLead(lead)}
                              activeStatusDropdownId={activeStatusDropdownId}
                              setActiveStatusDropdownId={setActiveStatusDropdownId}
                              onStatusChange={handleStatusChange}
                              onDelete={() => setLeadToDelete(lead)}
                            />
                          ))}
                        </>
                      )}

                      {/* GROUP 2: DEVIS EN COURS & NOUVEAUX */}
                      {pendingLeads.length > 0 && (
                        <>
                          <tr className="bg-sky-50/50 border-y border-sky-100 text-sky-950 font-bold text-xs select-none">
                            <td colSpan={7} className="py-2.5 px-6">
                              <button
                                onClick={() => setGroupPendingOpen(!groupPendingOpen)}
                                className="flex items-center gap-2 text-sky-800 hover:text-sky-950 font-black cursor-pointer"
                              >
                                {groupPendingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <span>Devis Transmis & Visites Techniques ({pendingLeads.length})</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                                  CHF {formatCHF(pendingLeads.reduce((acc, l) => acc + getLeadAmount(l), 0))}
                                </span>
                              </button>
                            </td>
                          </tr>
                          {groupPendingOpen && pendingLeads.map((lead, idx) => (
                            <LeadTableRow
                              key={lead.id}
                              lead={lead}
                              idx={idx}
                              isSelected={selectedLead?.id === lead.id}
                              onSelect={() => handleOpenLead(lead)}
                              activeStatusDropdownId={activeStatusDropdownId}
                              setActiveStatusDropdownId={setActiveStatusDropdownId}
                              onStatusChange={handleStatusChange}
                              onDelete={() => setLeadToDelete(lead)}
                            />
                          ))}
                        </>
                      )}

                      {/* GROUP 3: FACTURÉS & CLÔTURÉS */}
                      {completedLeads.length > 0 && (
                        <>
                          <tr className="bg-slate-100/60 border-y border-slate-200 text-slate-800 font-bold text-xs select-none">
                            <td colSpan={7} className="py-2.5 px-6">
                              <button
                                onClick={() => setGroupCompletedOpen(!groupCompletedOpen)}
                                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-black cursor-pointer"
                              >
                                {groupCompletedOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                <span>Facturés, Payés & Clôturés ({completedLeads.length})</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                  CHF {formatCHF(completedLeads.reduce((acc, l) => acc + getLeadAmount(l), 0))}
                                </span>
                              </button>
                            </td>
                          </tr>
                          {groupCompletedOpen && completedLeads.map((lead, idx) => (
                            <LeadTableRow
                              key={lead.id}
                              lead={lead}
                              idx={idx}
                              isSelected={selectedLead?.id === lead.id}
                              onSelect={() => handleOpenLead(lead)}
                              activeStatusDropdownId={activeStatusDropdownId}
                              setActiveStatusDropdownId={setActiveStatusDropdownId}
                              onStatusChange={handleStatusChange}
                              onDelete={() => setLeadToDelete(lead)}
                            />
                          ))}
                        </>
                      )}

                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-16 text-center text-slate-400">
                            <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p className="font-semibold text-sm">Aucun dossier trouvé pour ces critères.</p>
                            <button
                              onClick={() => { setSearchQuery(''); setStatusFilter('all'); setCantonFilter('all'); }}
                              className="mt-3 text-xs font-bold text-[#0073ea] hover:underline cursor-pointer"
                            >
                              Réinitialiser les filtres
                            </button>
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>
                </div>
              )}

              {/* VIEW MODE 2: MONDAY.COM LUXURY KANBAN PIPELINE */}
              {boardViewMode === 'kanban' && (
                <div className="p-5 overflow-x-auto">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 min-w-[1000px]">
                    
                    {/* Column 1: Nouveaux */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-sky-900">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                          <span>1. Nouveaux Devis</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono">
                          {filteredLeads.filter(l => l.status === 'nouveau').length}
                        </span>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                        {filteredLeads.filter(l => l.status === 'nouveau').map((lead) => (
                          <KanbanCard 
                            key={lead.id} 
                            lead={lead} 
                            onSelect={() => handleOpenLead(lead)}
                            onNextStatus={() => handleStatusChange(lead.id, 'en_cours')}
                            onDelete={() => setLeadToDelete(lead)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Devis Envoyés & Visites */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-indigo-900">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                          <span>2. Devis Envoyés / Visite</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                          {filteredLeads.filter(l => l.status === 'en_cours' || l.status === 'visite').length}
                        </span>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                        {filteredLeads.filter(l => l.status === 'en_cours' || l.status === 'visite').map((lead) => (
                          <KanbanCard 
                            key={lead.id} 
                            lead={lead} 
                            onSelect={() => handleOpenLead(lead)}
                            onNextStatus={() => handleStatusChange(lead.id, 'confirme')}
                            onDelete={() => setLeadToDelete(lead)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Missions Confirmées */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>3. Confirmés & Planning</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                          {filteredLeads.filter(l => l.status === 'confirme').length}
                        </span>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                        {filteredLeads.filter(l => l.status === 'confirme').map((lead) => (
                          <KanbanCard 
                            key={lead.id} 
                            lead={lead} 
                            onSelect={() => handleOpenLead(lead)}
                            onNextStatus={() => handleStatusChange(lead.id, 'facture')}
                            onDelete={() => setLeadToDelete(lead)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Column 4: Facturés & Payés */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          <span>4. Facturés / Payés</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                          {filteredLeads.filter(l => l.status === 'facture' || l.status === 'annule').length}
                        </span>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                        {filteredLeads.filter(l => l.status === 'facture' || l.status === 'annule').map((lead) => (
                          <KanbanCard 
                            key={lead.id} 
                            lead={lead} 
                            onSelect={() => handleOpenLead(lead)}
                            onDelete={() => setLeadToDelete(lead)}
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              5. SWISS FIDUCIARY & BEXIO TAX STATEMENT VIEW
              ========================================================================= */}
          {currentView === 'fiduciary' && !currentUser.permissions.canViewFinancials && (
            <div className="bg-white rounded-3xl border border-amber-200 shadow-sm p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Accès Restreint aux Données Financières</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Votre profil actif (<strong className="text-slate-900">{currentUser.name}</strong> • {currentUser.role}) ne dispose pas des privilèges nécessaires (<code>canViewFinancials: false</code>) pour consulter le grand livre fiscal et les bilans de TVA suisse.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('operations')}
                  className="px-5 py-2.5 rounded-xl bg-[#0073ea] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Retour aux Opérations & Missions
                </button>
              </div>
            </div>
          )}

          {currentView === 'fiduciary' && currentUser.permissions.canViewFinancials && (
            <div className="space-y-4">
              {/* Mode Subview Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 no-print bg-[#081525] border border-sky-500/30 p-2.5 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFiduciarySubView('app')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      fiduciarySubView === 'app'
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Tableau de Bord FinTech (App Mobile)</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
                      FIGMA HIGH-END
                    </span>
                  </button>

                  <button
                    onClick={() => setFiduciarySubView('statement')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      fiduciarySubView === 'statement'
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Extrait Déclaration Papier A4 (AFC)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pr-2 text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="hidden sm:inline">BCGE Genève • TVA 8.1% AFC</span>
                </div>
              </div>

              {fiduciarySubView === 'app' ? (
                <FinancialAppView
                  leads={leads}
                  currentUser={currentUser}
                  onRefreshLeads={loadData}
                />
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print-area">
              
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Déclaration Fiscale & Extrait Fiducière Suisse (CHF)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Conforme aux règles de l'Administration Fédérale des Contributions (AFC) et aux normes suisses nLPD.
                  </p>
                </div>

                <div className="flex items-center gap-3 no-print">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#0B1E33] hover:bg-[#0073ea] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer / Sauvegarder en PDF</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exporter CSV (Bexio / Winbiz)</span>
                  </button>
                </div>
              </div>

              {/* Swiss Official Letterhead */}
              <div className="pt-4 pb-6 border-b border-slate-200 flex justify-between items-start">
                <div>
                  <div className="font-black text-2xl text-[#0B1E33] tracking-tight">
                    BATIMOVE SÀRL
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Rue de Monthoux 64, 1201 Genève, Suisse<br />
                    Tél : 0800 825 925 • E-mail : info@batimove.ch
                  </p>
                  <p className="text-xs font-mono font-semibold text-slate-800 mt-2">
                    Numéro d'entreprise IDE : CHE-492.836.215 TVA
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
                    Déclaration Fiscale Mensuelle
                  </div>
                  <div className="text-xs font-mono text-slate-500 mt-2">
                    Date : {new Date().toLocaleDateString('fr-CH')}<br />
                    Devise : CHF (Francs Suisses)
                  </div>
                </div>
              </div>

              {/* Summary Breakdown */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Chiffre d'Affaires HT</div>
                  <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                    CHF {formatCHF(metrics.totalHT)}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                  <div className="text-xs font-semibold text-blue-800 uppercase">TVA Collectée (8.1%)</div>
                  <div className="text-2xl font-black font-mono text-blue-700 mt-1">
                    CHF {formatCHF(metrics.tva81)}
                  </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <div className="text-xs font-semibold text-emerald-800 uppercase">Total Facturé TTC</div>
                  <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
                    CHF {formatCHF(metrics.totalTTC)}
                  </div>
                </div>
              </div>

              {/* Transactions Table for Fiduciary */}
              <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Dossier</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Prestation</th>
                      <th className="p-3 text-right">Montant HT</th>
                      <th className="p-3 text-right">TVA 8.1%</th>
                      <th className="p-3 text-right">Total TTC (CHF)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {leads.map(l => {
                      const ttc = getLeadAmount(l);
                      const tva = ttc * (8.1 / 108.1);
                      const ht = ttc - tva;

                      return (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-600">#{l.id}</td>
                          <td className="p-3 font-bold text-slate-900">{l.client_name}</td>
                          <td className="p-3 text-slate-600">{l.service_type}</td>
                          <td className="p-3 text-right font-mono">CHF {formatCHF(ht)}</td>
                          <td className="p-3 text-right font-mono text-blue-700">CHF {formatCHF(tva)}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">CHF {formatCHF(ttc)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Signature block */}
              <div className="grid grid-cols-2 gap-10 mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700 mb-8">Pour la Direction de Batimove Sàrl :</p>
                  <div className="w-48 border-b border-slate-400" />
                  <p className="mt-1 text-[11px]">Signature autorisée & timbre</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-700 mb-8">Visa de la Fiduciaire :</p>
                  <div className="w-48 border-b border-slate-400 ml-auto" />
                  <p className="mt-1 text-[11px]">Date et visa de contrôle</p>
                </div>
              </div>

                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              6. FLEET & TEAMS PLANNING VIEW
              ========================================================================= */}
          {currentView === 'fleet' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Affectation de la Flotte & Équipes</h2>
                  <p className="text-xs text-slate-500">Suivi opérationnel des camions Iveco et monte-meubles à Genève et Lausanne.</p>
                </div>
                <button
                  onClick={() => setIsAssignVehicleModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#0073ea] text-white font-bold text-xs shadow-sm cursor-pointer hover:bg-blue-600 transition-all"
                >
                  + Ajouter un Véhicule
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {fleetVehicles.map((truck) => (
                  <div key={truck.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <Truck className="w-5 h-5" />
                      </div>
                      <button
                        onClick={() => handleToggleVehicleStatus(truck.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          truck.status === 'En mission' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                            : truck.status === 'Disponible' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {truck.status}
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{truck.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Chauffeur : <strong className="text-slate-700">{truck.driver}</strong></p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span>Équipe :</span>
                        <strong className="text-slate-900">{truck.team}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacité :</span>
                        <strong className="text-slate-900 font-mono">{truck.capacity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Zone active :</span>
                        <strong className="text-slate-900">{truck.city}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Prochain départ :</span>
                        <strong className="text-blue-700">{truck.next}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              7. CRM & WEB LEADS VIEW (SUPABASE PIPELINE)
              ========================================================================= */}
          {currentView === 'crm' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Pipeline CRM & Devis en Ligne</h2>
                  <p className="text-xs text-slate-500">Flux continu des demandes générées depuis le site web et le calculateur de volume.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Total Leads :</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">{leads.length} contacts</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                  <div className="text-xs font-bold text-sky-800">1. Nouveaux Prospects</div>
                  <div className="text-2xl font-black text-sky-900 font-mono mt-1">
                    {leads.filter(l => l.status === 'nouveau').length}
                  </div>
                  <div className="text-[11px] text-sky-700 mt-1">Visite technique ou appel de qualification à effectuer</div>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                  <div className="text-xs font-bold text-indigo-800">2. Devis Transmis</div>
                  <div className="text-2xl font-black text-indigo-900 font-mono mt-1">
                    {leads.filter(l => l.status === 'en_cours').length}
                  </div>
                  <div className="text-[11px] text-indigo-700 mt-1">Offres officielles envoyées avec délai de validité</div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <div className="text-xs font-bold text-emerald-800">3. Contrats Validés</div>
                  <div className="text-2xl font-black text-emerald-900 font-mono mt-1">
                    {leads.filter(l => l.status === 'confirme' || l.status === 'facture').length}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">Missions confirmées avec acompte versé</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-3 bg-slate-50 font-bold text-xs text-slate-700 border-b border-slate-200">
                  Flux chronologique des contacts récents (Cliquez pour inspecter)
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {leads.map((l) => (
                    <div 
                      key={l.id} 
                      onClick={() => handleOpenLead(l)}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {l.client_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{l.client_name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">#{l.id}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{l.client_phone} • {l.client_email || "Pas d'email"}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-slate-600 text-right">
                          <div className="font-mono font-bold text-slate-900">CHF {formatCHF(getLeadAmount(l))}</div>
                          <div className="text-[11px] text-slate-400">{l.from_city} ➔ {l.to_city}</div>
                        </div>
                        <a
                          href={formatSwissWhatsAppUrl(l.client_phone, l.client_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="WhatsApp direct"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              8. SETTINGS & NLPD SWISS SECURITY VIEW
              ========================================================================= */}
          {currentView === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Sécurité & Paramètres Exécutifs</h2>
                <p className="text-xs text-slate-500">Gestion des accès et conformité aux exigences suisses de protection des données (nLPD).</p>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Active User Info Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${currentUser.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {currentUser.initials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
                      <div className="text-slate-500 text-xs">{currentUser.role} • {currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsAccountModalOpen(true); setAccountTab('profile'); }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Gérer Profil
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Conformité nLPD Suisse (Genève)</div>
                      <div className="text-slate-400 text-[11px]">Chiffrement des données en transit et stockage sécurisé Supabase EU.</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Conforme
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Export Intégral de Sauvegarde (JSON)</div>
                      <div className="text-slate-400 text-[11px]">Télécharger une copie complète de tous les dossiers et de la comptabilité.</div>
                    </div>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="px-3.5 py-2 rounded-xl bg-[#0B1E33] hover:bg-blue-600 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    Sauvegarde JSON
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>

      {/* =========================================================================
          9. MONDAY.COM USER ACCOUNT & PARAMETERS MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isAccountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            >
              {/* Modal Top Banner */}
              <div className="bg-[#0B1E33] p-6 text-white relative">
                <button 
                  onClick={() => setIsAccountModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${currentUser.avatarBg} border-2 border-white/20 flex items-center justify-center font-black text-2xl shadow-lg`}>
                    {currentUser.initials}
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-white leading-tight">
                      {currentUser.name}
                    </h2>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mt-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>{currentUser.role}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {currentUser.email} • {currentUser.phone}
                    </p>
                  </div>
                </div>

                {/* Modal Navigation Tabs */}
                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10 text-xs font-bold">
                  <button
                    onClick={() => setAccountTab('profile')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      accountTab === 'profile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => setAccountTab('security')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      accountTab === 'security' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    PIN & Sécurité
                  </button>
                  <button
                    onClick={() => setAccountTab('switch')}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      accountTab === 'switch' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Changer d'Utilisateur
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
                
                {/* TAB 1: PROFILE EDIT */}
                {accountTab === 'profile' && (
                  <form onSubmit={handleSaveProfile} className="space-y-3.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nom Complet</label>
                      <input
                        type="text"
                        required
                        value={editUserName}
                        onChange={e => setEditUserName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Adresse Email</label>
                        <input
                          type="email"
                          required
                          value={editUserEmail}
                          onChange={e => setEditUserEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Téléphone Suisse</label>
                        <input
                          type="tel"
                          required
                          value={editUserPhone}
                          onChange={e => setEditUserPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea]"
                        />
                      </div>
                    </div>

                    {/* Active Permissions List */}
                    <div className="pt-2">
                      <div className="font-bold text-slate-800 mb-2">Autorisations Actives (RBAC) :</div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <Check className={`w-3.5 h-3.5 ${currentUser.permissions.canViewFinancials ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span className={currentUser.permissions.canViewFinancials ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                            Accès Comptabilité & TVA
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <Check className={`w-3.5 h-3.5 ${currentUser.permissions.canEditPricing ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span className={currentUser.permissions.canEditPricing ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                            Édition des Prix
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <Check className={`w-3.5 h-3.5 ${currentUser.permissions.canManageFleet ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span className={currentUser.permissions.canManageFleet ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                            Gestion de la Flotte
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <Check className={`w-3.5 h-3.5 ${currentUser.permissions.canDeleteLeads ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span className={currentUser.permissions.canDeleteLeads ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                            Suppression Dossiers
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0073ea] hover:bg-blue-600 text-white font-bold transition-all cursor-pointer shadow-md"
                      >
                        Enregistrer le Profil
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: SECURITY & PIN CHANGE */}
                {accountTab === 'security' && (
                  <form onSubmit={handleSavePin} className="space-y-3.5">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                      Votre code PIN à 6 chiffres protège votre session personnelle. Vous pouvez également utiliser le PIN Maître direction.
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Code PIN Actuel</label>
                      <input
                        type="password"
                        maxLength={6}
                        required
                        value={profileCurrentPin}
                        onChange={e => setProfileCurrentPin(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono tracking-widest outline-none focus:border-[#0073ea]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Nouveau PIN (6 chiffres)</label>
                        <input
                          type="password"
                          maxLength={6}
                          required
                          value={profileNewPin}
                          onChange={e => setProfileNewPin(e.target.value)}
                          placeholder="••••••"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono tracking-widest outline-none focus:border-[#0073ea]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Confirmer Nouveau PIN</label>
                        <input
                          type="password"
                          maxLength={6}
                          required
                          value={profileConfirmPin}
                          onChange={e => setProfileConfirmPin(e.target.value)}
                          placeholder="••••••"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono tracking-widest outline-none focus:border-[#0073ea]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0073ea] hover:bg-blue-600 text-white font-bold transition-all cursor-pointer shadow-md"
                      >
                        Mettre à Jour Mon PIN
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 3: FAST USER SWITCHER */}
                {accountTab === 'switch' && (
                  <div className="space-y-3">
                    <p className="text-slate-500 text-xs">
                      Basculez instantanément vers un autre profil de direction ou logistique :
                    </p>

                    <div className="grid grid-cols-1 gap-2">
                      {teamUsers.map(u => {
                        const isCurrent = u.id === currentUser.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => handleSwitchUser(u)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                              isCurrent 
                                ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400/20' 
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl ${u.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
                                {u.initials}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  <span>{u.name}</span>
                                  {isCurrent && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500 text-white">Actif</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">{u.role}</div>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-[#0073ea] hover:underline shrink-0">
                              {isCurrent ? 'Session Ouverte' : 'Basculer ➔'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    adminLogout();
                    onLogout();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se Déconnecter de Batimove OS</span>
                </button>

                <button
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          10. MONDAY.COM MOBILE BOTTOM NAVIGATION BAR (< 1024px)
          ========================================================================= */}
      {!(currentView === 'fiduciary' && fiduciarySubView === 'app') && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1E33] border-t border-white/10 px-2 py-2 flex items-center justify-around text-[10px] text-slate-300 backdrop-blur-lg shadow-2xl no-print">
          <button
            onClick={() => setCurrentView('operations')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'operations' ? 'text-sky-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Devis</span>
          </button>

          <button
            onClick={() => setCurrentView('fiduciary')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'fiduciary' ? 'text-emerald-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Compta</span>
          </button>

          <button
            onClick={() => setCurrentView('fleet')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'fleet' ? 'text-amber-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Flotte</span>
          </button>

          <button
            onClick={() => setCurrentView('crm')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'crm' ? 'text-purple-400 font-bold bg-white/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>CRM</span>
          </button>

          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-full ${currentUser.avatarBg} text-white flex items-center justify-center font-bold text-[8px]`}>
              {currentUser.initials}
            </div>
            <span>Compte</span>
          </button>
        </nav>
      )}

      {/* Mobile Menu Slide-Out Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs no-print">
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="w-72 bg-[#0B1E33] text-white h-full p-5 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2.5">
                    <img src="/batimove-logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                    <div className="font-extrabold text-sm tracking-tight text-white">
                      BATIMOVE<span className="text-sky-400">.OS</span>
                    </div>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => { setCurrentView('operations'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center gap-3 font-semibold"
                  >
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Devis & Missions</span>
                  </button>
                  <button
                    onClick={() => { setCurrentView('fiduciary'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center gap-3 font-semibold"
                  >
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>Comptabilité & TVA 8.1%</span>
                  </button>
                  <button
                    onClick={() => { setCurrentView('fleet'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center gap-3 font-semibold"
                  >
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Planning Flotte</span>
                  </button>
                  <button
                    onClick={() => { setCurrentView('crm'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center gap-3 font-semibold"
                  >
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>CRM & Leads</span>
                  </button>
                  <button
                    onClick={() => { setIsAccountModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center gap-3 font-semibold"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Mon Compte & Sécurité</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                  <button
                    onClick={() => { handleExportCSV(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center gap-2 text-xs text-emerald-300 font-semibold"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Exporter CSV (Bexio)</span>
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setTimeout(() => window.print(), 200); }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex items-center gap-2 text-xs text-sky-300 font-semibold"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer Bilan (PDF)</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    adminLogout();
                    onLogout();
                  }}
                  className="w-full p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          11. BEXIO-STYLE SLIDE-OVER INSPECTOR & SWISS INVOICE / QR-BILL
          ========================================================================= */}
      <AnimatePresence>
        {isInspectorOpen && selectedLead && (
          <div className="fixed inset-0 z-50 flex justify-end invoice-print-wrapper">
            
            {/* Backdrop click (hidden on print) */}
            <div className="flex-1 bg-black/40 backdrop-blur-xs no-print drawer-backdrop" onClick={() => setIsInspectorOpen(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full max-w-4xl bg-slate-100 h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 invoice-drawer-content"
            >
              
              {/* Slide-over Header (hidden on print) */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 shadow-2xs no-print drawer-controls">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B1E33] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {(selectedLead.client_name || 'BM').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Dossier #{selectedLead.id}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Fiche Client & Facture Officielle Batimove Sàrl
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingInspector(!isEditingInspector)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isEditingInspector ? 'bg-blue-50 text-[#0073ea]' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                    title={isEditingInspector ? "Quitter le mode édition" : "Éditer le dossier"}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setLeadToDelete(selectedLead)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Supprimer le dossier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                    title="Télécharger Facture PDF (A4)"
                  >
                    {isGeneratingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Imprimer cette facture (A4)"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsInspectorOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Slide-over Body */}
              <div className="p-4 sm:p-6 space-y-5 flex-1 text-xs">
                
                {/* Status Bar & Quick Actions (hidden on print) */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-600">Statut de la commande :</span>
                    <select
                      value={selectedLead.status}
                      onChange={e => handleStatusChange(selectedLead.id, e.target.value)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold border outline-none bg-slate-50 text-slate-800 border-slate-300 shadow-2xs cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingInspector(!isEditingInspector)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingInspector ? "Fermer Édition" : "Modifier Paramètres"}</span>
                    </button>
                  </div>
                </div>

                {/* Edit Form Drawer Panel (when editing is enabled, hidden on print) */}
                {isEditingInspector && (
                  <div className="bg-blue-50/70 p-4 sm:p-5 rounded-2xl border border-blue-200 space-y-3 no-print">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                        Modifier le Dossier #{selectedLead.id}
                      </h4>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Mode Édition Actif
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600">Ville Départ</label>
                        <input
                          type="text"
                          value={editFromCity}
                          onChange={e => setEditFromCity(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600">Ville Arrivée</label>
                        <input
                          type="text"
                          value={editToCity}
                          onChange={e => setEditToCity(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600">Date Prévue</label>
                        <input
                          type="text"
                          value={editMoveDate}
                          onChange={e => setEditMoveDate(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600">Montant Total TTC (CHF)</label>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={e => setEditAmount(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-600">Notes & Spécifications</label>
                      <textarea
                        rows={2}
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <button
                      onClick={handleSaveLeadDetails}
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-[#0073ea] hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Enregistrement...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Valider & Enregistrer les Modifications</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* THE PROFESSIONAL SWISS A4 INVOICE DOCUMENT */}
                <div ref={invoiceContainerRef} className="print:p-0">
                  <InvoiceDocument lead={selectedLead} />
                </div>

              </div>

              {/* Slide-over Actions Footer (hidden on print) */}
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-wrap items-center gap-3 no-print drawer-controls">
                <a
                  href={formatSwissWhatsAppUrl(
                    selectedLead.client_phone,
                    selectedLead.client_name,
                    `Bonjour ${selectedLead.client_name}, voici votre devis officiel Batimove Sàrl d'un montant de CHF ${formatCHF(getLeadAmount(selectedLead))} TTC. Restant à votre entière disposition pour planifier votre déménagement.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Envoyer Devis par WhatsApp</span>
                </a>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  title="Télécharger la facture au format PDF A4"
                >
                  {isGeneratingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Télécharger PDF</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-[#0B1E33] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  title="Imprimer cette facture (A4 Portrait)"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer</span>
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          12. MODAL: CONFIRM DELETE DOSSIER
          ========================================================================= */}
      <AnimatePresence>
        {leadToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-slate-900">Confirmer la suppression</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Êtes-vous sûr de vouloir supprimer définitivement le dossier <strong className="text-slate-800">#{leadToDelete.id}</strong> ({leadToDelete.client_name}) ? Cette action est irréversible.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setLeadToDelete(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Suppression...</span>
                    </>
                  ) : (
                    'Supprimer'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          13. MODAL: NOUVEAU DOSSIER RAPIDE
          ========================================================================= */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0073ea] flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-base text-slate-900">
                    Nouveau Dossier / Devis Batimove
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nom du Client / Entreprise *</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    placeholder="Ex: Alexandre de Senarclens"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={newClientPhone}
                      onChange={e => setNewClientPhone(e.target.value)}
                      placeholder="+41 79 123 45 67"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={newClientEmail}
                      onChange={e => setNewClientEmail(e.target.value)}
                      placeholder="client@domaine.ch"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Prestation</label>
                    <select
                      value={newServiceType}
                      onChange={e => setNewServiceType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea] cursor-pointer"
                    >
                      <option>Déménagement Résidentiel</option>
                      <option>Transfert Entreprise / B2B</option>
                      <option>Débarras Écologique</option>
                      <option>Nettoyage Fin de Bail</option>
                      <option>Garde-Meubles Sécurisé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Montant Devis (CHF TTC)</label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={e => setNewAmount(e.target.value)}
                      placeholder="Ex: 3450"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Ville Départ</label>
                    <input
                      type="text"
                      value={newFromCity}
                      onChange={e => setNewFromCity(e.target.value)}
                      placeholder="Genève"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Ville Arrivée</label>
                    <input
                      type="text"
                      value={newToCity}
                      onChange={e => setNewToCity(e.target.value)}
                      placeholder="Lausanne"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Notes Opérationnelles</label>
                  <textarea
                    rows={2}
                    value={newDetails}
                    onChange={e => setNewDetails(e.target.value)}
                    placeholder="Ex: Monte-meubles nécessaire, villa 5 pièces..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0073ea] resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newClientName.trim() || !newClientPhone.trim()}
                    className="px-5 py-2.5 text-xs font-bold bg-[#0073ea] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enregistrement en cours...</span>
                      </>
                    ) : (
                      <span>Enregistrer dans Supabase</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          14. MODAL: AJOUTER VÉHICULE FLOTTE
          ========================================================================= */}
      <AnimatePresence>
        {isAssignVehicleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900">Ajouter un Véhicule</h3>
                </div>
                <button onClick={() => setIsAssignVehicleModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Nom du Véhicule / Immatriculation</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Iveco Daily 30m³ (GE-9912)"
                    value={newTruckName}
                    onChange={e => setNewTruckName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Chauffeur Référent</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Yannick M."
                    value={newTruckDriver}
                    onChange={e => setNewTruckDriver(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Capacité</label>
                    <select
                      value={newTruckCapacity}
                      onChange={e => setNewTruckCapacity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      <option>20 m³</option>
                      <option>30 m³</option>
                      <option>45 m³</option>
                      <option>Monte-Meubles 25m</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Dépôt / Ville</label>
                    <input
                      type="text"
                      value={newTruckCity}
                      onChange={e => setNewTruckCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignVehicleModalOpen(false)}
                    className="px-4 py-2 text-slate-500 font-semibold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newTruckName.trim() || !newTruckDriver.trim()}
                    className="px-4 py-2 bg-[#0073ea] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Ajout...</span>
                      </>
                    ) : (
                      <span>Ajouter à la Flotte</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          15. TOAST NOTIFICATION SYSTEM
          ========================================================================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-[#0B1E33] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 text-xs font-semibold no-print"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: MONDAY.COM TABLE ROW
// =========================================================================
interface RowProps {
  lead: LeadItem;
  idx: number;
  isSelected: boolean;
  onSelect: () => void;
  activeStatusDropdownId: string | null;
  setActiveStatusDropdownId: (id: string | null) => void;
  onStatusChange: (id: string, st: any) => void;
  onDelete: () => void;
}

const LeadTableRow: React.FC<RowProps> = ({
  lead,
  idx,
  isSelected,
  onSelect,
  activeStatusDropdownId,
  setActiveStatusDropdownId,
  onStatusChange,
  onDelete
}) => {
  const amount = getLeadAmount(lead);
  const currentStatusConfig = STATUS_OPTIONS.find(o => o.key === lead.status) || STATUS_OPTIONS[0];
  const isDropdownOpen = activeStatusDropdownId === lead.id;

  return (
    <tr 
      className={`hover:bg-blue-50/40 transition-colors group relative ${
        isSelected ? 'bg-blue-50/70' : ''
      }`}
    >
      {/* Column 1: Ref & Client Name */}
      <td className="p-3.5 pl-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B1E33] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            {(lead.client_name || 'BM').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <span className="truncate">{lead.client_name}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              #{lead.id} • {lead.move_date || 'Mars 2026'}
            </div>
          </div>
        </div>
      </td>

      {/* Column 2: Fast Contact (WhatsApp & Call) */}
      <td className="p-3.5">
        <div className="flex items-center gap-1.5">
          <a
            href={formatSwissWhatsAppUrl(lead.client_phone, lead.client_name)}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir WhatsApp Client"
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <MessageSquare className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
          <a
            href={`tel:${lead.client_phone}`}
            title={lead.client_phone}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Phone className="w-3 h-3" />
          </a>
        </div>
      </td>

      {/* Column 3: Service & Route */}
      <td className="p-3.5">
        <div className="font-semibold text-slate-900 text-xs truncate max-w-[200px]">
          {lead.service_type}
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
          <span className="truncate">{lead.from_city || 'Genève'} ➔ {lead.to_city || 'Lausanne'}</span>
        </div>
      </td>

      {/* Column 4: Volume & Truck */}
      <td className="p-3.5">
        <div className="font-mono font-bold text-slate-700 text-xs">
          {30 + (idx % 3) * 15} m³
        </div>
        <div className="text-[11px] text-slate-400">
          Iveco 30m³ • 3 pros
        </div>
      </td>

      {/* Column 5: Amount in CHF */}
      <td className="p-3.5 text-right font-mono">
        <div className="font-black text-slate-900 text-xs sm:text-sm">
          CHF {formatCHF(amount)}
        </div>
        <div className="text-[10px] text-slate-400">
          HT : CHF {formatCHF(amount / 1.081)}
        </div>
      </td>

      {/* Column 6: Monday.com Custom Status Picker Popover */}
      <td className="p-3.5 text-center relative">
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setActiveStatusDropdownId(isDropdownOpen ? null : lead.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto ${currentStatusConfig.bg} ${currentStatusConfig.text}`}
          >
            <span className={`w-2 h-2 rounded-full ${currentStatusConfig.dot}`} />
            <span>{currentStatusConfig.label}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {/* Click-Outside Backdrop */}
          {isDropdownOpen && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setActiveStatusDropdownId(null)} 
            />
          )}

          {/* Popover Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 w-44 space-y-1">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onStatusChange(lead.id, opt.key)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    lead.status === opt.key ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.bg}`} />
                    <span>{opt.label}</span>
                  </div>
                  {lead.status === opt.key && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </td>

      {/* Column 7: Actions (Dossier Inspector + Delete) */}
      <td className="p-3.5 pr-6 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={onSelect}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0B1E33] hover:text-white text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
            title="Inspecter le dossier"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Dossier</span>
          </button>

          <button
            onClick={onDelete}
            className="p-1.5 rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Supprimer ce dossier"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

    </tr>
  );
};

// =========================================================================
// SUB-COMPONENT: MONDAY.COM LUXURY KANBAN CARD
// =========================================================================
interface KanbanCardProps {
  lead: LeadItem;
  onSelect: () => void;
  onNextStatus?: () => void;
  onDelete: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ lead, onSelect, onNextStatus, onDelete }) => {
  const amount = getLeadAmount(lead);

  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all cursor-pointer space-y-3 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#0B1E33] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
            {(lead.client_name || 'BM').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-slate-900 truncate">{lead.client_name}</h4>
            <div className="text-[10px] font-mono text-slate-400">#{lead.id}</div>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          title="Supprimer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-[11px] text-slate-600 flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
        <span className="truncate">{lead.from_city || 'Genève'} ➔ {lead.to_city || 'Lausanne'}</span>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="font-mono font-black text-xs text-slate-900">
          CHF {formatCHF(amount)}
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={formatSwissWhatsAppUrl(lead.client_phone, lead.client_name, `Bonjour ${lead.client_name}, concernant votre devis Batimove Sàrl :`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            title="WhatsApp rapide"
          >
            <MessageSquare className="w-3 h-3" />
          </a>

          {onNextStatus && (
            <button
              onClick={(e) => { e.stopPropagation(); onNextStatus(); }}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#0073ea] hover:text-white text-slate-700 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Passer à l'étape suivante"
            >
              <span>Suivant</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
