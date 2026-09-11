import React, { useState, useEffect, Component } from 'react';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { isAdminAuthenticated, adminLogout } from '../../services/adminAuth';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Batimove OS Portal caught runtime error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('batimove_os_leads_v1');
      localStorage.removeItem('batimove_os_leads_v2');
      localStorage.removeItem('batimove_os_financial_v1');
      localStorage.removeItem('batimove_os_financial_v2');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1E33] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold mb-2">Erreur d'affichage du portail</h2>
          <p className="text-slate-300 text-xs max-w-md mb-6 font-mono bg-black/30 p-3 rounded-xl border border-white/10">
            {this.state.error?.message || "Une exception s'est produite lors de l'exécution."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-sky-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Réinitialiser les données & Actualiser
            </button>
            <button
              onClick={() => {
                adminLogout();
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const Portal: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(() => isAdminAuthenticated());

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogout = () => {
    adminLogout();
    setAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  return (
    <ErrorBoundary>
      {!authenticated ? (
        <Login onSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </ErrorBoundary>
  );
};

export default Portal;
