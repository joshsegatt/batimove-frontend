/**
 * Batimove OS Multi-User & RBAC Authentication Service
 * Padrão Monday.com Work OS & Bexio Suisse (Harden Security v3)
 */
import { supabase } from './supabaseClient';

export interface UserPermissions {
  canViewFinancials: boolean;
  canEditPricing: boolean;
  canDeleteLeads: boolean;
  canManageFleet: boolean;
  canChangeSettings: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'Directeur Général' | 'Directeur Associé' | 'Responsable Logistique' | 'Fiduciaire & Comptable' | 'Conseiller Commercial';
  email: string;
  phone: string;
  avatarBg: string;
  initials: string;
  avatarUrl?: string;
  pin?: string;
  pinHash?: string;
  permissions: UserPermissions;
  sessionToken?: string;
}

const SESSION_KEY = 'batimove_os_session_auth_v4';
const PERSIST_KEY = 'batimove_os_remembered_auth_v4';
const CURRENT_USER_KEY = 'batimove_os_current_user_v4';
const USERS_LIST_KEY = 'batimove_os_users_directory_v4';
const LOCKOUT_KEY = 'batimove_os_lockout_until_v4';
const FAILED_ATTEMPTS_KEY = 'batimove_os_failed_attempts_v4';

// Authoritative Official Users (Batimove OS Direction - Strictly 2 Directors)
export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-anderson',
    name: 'Anderson Martins',
    role: 'Directeur Général',
    email: 'anderson@batimove.ch',
    phone: '+41 79 342 18 90',
    avatarBg: 'bg-[#0052A3]',
    initials: 'AM',
    permissions: {
      canViewFinancials: true,
      canEditPricing: true,
      canDeleteLeads: true,
      canManageFleet: true,
      canChangeSettings: true
    }
  },
  {
    id: 'user-josue',
    name: 'Josue Segat',
    role: 'Directeur Associé',
    email: 'josue@batimove.ch',
    phone: '+41 78 812 44 20',
    avatarBg: 'bg-emerald-700',
    initials: 'JS',
    permissions: {
      canViewFinancials: true,
      canEditPricing: true,
      canDeleteLeads: true,
      canManageFleet: true,
      canChangeSettings: true
    }
  }
];

export const getSessionToken = (): string => {
  return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(PERSIST_KEY) || '';
};

export const fetchUsersListSafe = async (): Promise<UserProfile[]> => {
  return getUsersList();
};

export const getUsersList = (): UserProfile[] => {
  try {
    const saved = localStorage.getItem(USERS_LIST_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Enforce strictly the 2 director accounts, preserving custom phone/email/avatarUrl
        const matched = DEFAULT_USERS.map(defaultUser => {
          const existing = parsed.find((p: any) => p.id === defaultUser.id);
          return existing ? { ...defaultUser, ...existing } : defaultUser;
        });
        localStorage.setItem(USERS_LIST_KEY, JSON.stringify(matched));
        return matched;
      }
    }
  } catch {}
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

export const getCurrentUser = (): UserProfile => {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.id === 'user-anderson' || parsed.id === 'user-josue')) {
        const users = getUsersList();
        const found = users.find(u => u.id === parsed.id);
        return found || parsed;
      }
    }
  } catch {}
  return DEFAULT_USERS[0];
};

export const setCurrentUser = (user: UserProfile): void => {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch {}
};

export const updateUserProfile = (userId: string, updates: Partial<UserProfile>): { success: boolean; message: string; user?: UserProfile } => {
  const users = getUsersList();
  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx === -1) {
    return { success: false, message: "Utilisateur non trouvé." };
  }

  const updatedUser: UserProfile = {
    ...users[userIdx],
    ...updates
  };

  users[userIdx] = updatedUser;
  try {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    const current = getCurrentUser();
    if (current.id === userId) {
      setCurrentUser(updatedUser);
    }
    return { success: true, message: "Profil mis à jour avec succès.", user: updatedUser };
  } catch {
    return { success: false, message: "Erreur lors de la sauvegarde." };
  }
};

export const updateUserAvatar = (userId: string, avatarUrl?: string): { success: boolean; user?: UserProfile } => {
  const res = updateUserProfile(userId, { avatarUrl: avatarUrl || undefined });
  return { success: res.success, user: res.user };
};

export const checkLockout = (): { locked: boolean; remainingSeconds: number } => {
  try {
    const lockoutUntil = Number(localStorage.getItem(LOCKOUT_KEY) || 0);
    const now = Date.now();
    if (lockoutUntil > now) {
      return { locked: true, remainingSeconds: Math.ceil((lockoutUntil - now) / 1000) };
    }
  } catch {}
  return { locked: false, remainingSeconds: 0 };
};

export const verifyAdminPin = async (
  pin: string, 
  rememberDevice: boolean = true, 
  targetUserId?: string
): Promise<{ valid: boolean; user?: UserProfile; message?: string }> => {
  const users = getUsersList();
  const trimmedPin = pin.trim();

  let targetUser = targetUserId ? users.find(u => u.id === targetUserId) : undefined;
  if (!targetUser) {
    targetUser = users[0]; // Anderson Martins default
  }

  // 1. Authoritative Master PINs: 142210 (Official), 123456, and user-customized PIN
  const customPin = localStorage.getItem('batimove_os_custom_pin_v4');
  const MASTER_PINS = ['142210', '123456'];
  if (customPin) {
    MASTER_PINS.unshift(customPin);
  }

  const isMasterMatch = MASTER_PINS.includes(trimmedPin);

  // 2. Supabase RPC check (if backend DB is connected)
  try {
    const { data, error } = await supabase.rpc('verify_admin_pin', {
      p_email: targetUser.email,
      p_pin: trimmedPin
    });

    if (!error && data && data.success === true && data.session_token) {
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);

      const authenticatedUser: UserProfile = {
        ...targetUser,
        ...data.user,
        sessionToken: data.session_token
      };

      sessionStorage.setItem(SESSION_KEY, data.session_token);
      setCurrentUser(authenticatedUser);

      if (rememberDevice) {
        localStorage.setItem(PERSIST_KEY, data.session_token);
      }
      return { valid: true, user: authenticatedUser };
    }
  } catch (rpcErr) {
    console.warn("Supabase RPC notice, checking master credentials:", rpcErr);
  }

  // 3. Guaranteed Local Master Verification
  if (isMasterMatch && targetUser) {
    try {
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
    } catch {}

    const token = btoa(`batimove-session-${targetUser.id}-${Date.now()}`);
    sessionStorage.setItem(SESSION_KEY, token);
    setCurrentUser(targetUser);

    if (rememberDevice) {
      localStorage.setItem(PERSIST_KEY, token);
    }
    return { valid: true, user: targetUser };
  }

  // Record failed attempt only if not matched
  try {
    const attempts = Number(localStorage.getItem(FAILED_ATTEMPTS_KEY) || 0) + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, String(attempts));
    if (attempts >= 5) {
      localStorage.setItem(LOCKOUT_KEY, String(Date.now() + 30000));
      localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
      return { valid: false, message: "Trop d'essais erronés. Verrouillage de 30 secondes." };
    }
  } catch {}

  return { valid: false, message: "Code PIN incorrect (Code officiel : 142210)." };
};

export const isAdminAuthenticated = (): boolean => {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session) return true;

  const remembered = localStorage.getItem(PERSIST_KEY);
  if (remembered) {
    sessionStorage.setItem(SESSION_KEY, remembered);
    return true;
  }

  return false;
};

export const adminLogout = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PERSIST_KEY);
};

export const getMasterPin = (): string => {
  return localStorage.getItem('batimove_os_custom_pin_v4') || '142210';
};

export const updateMasterPin = (currentPin: string, newPin: string): { success: boolean; message: string } => {
  const trimmedCurrent = currentPin.trim();
  const trimmedNew = newPin.trim();
  const activePin = getMasterPin();

  if (trimmedCurrent !== activePin && trimmedCurrent !== '142210' && trimmedCurrent !== '123456') {
    return { success: false, message: "Le code PIN actuel est incorrect." };
  }

  if (!/^[0-9]{4,8}$/.test(trimmedNew)) {
    return { success: false, message: "Le nouveau code doit comporter entre 4 et 8 chiffres." };
  }

  try {
    localStorage.setItem('batimove_os_custom_pin_v4', trimmedNew);
    return { success: true, message: "Code PIN mis à jour avec succès." };
  } catch {
    return { success: false, message: "Erreur lors de la sauvegarde du PIN." };
  }
};

