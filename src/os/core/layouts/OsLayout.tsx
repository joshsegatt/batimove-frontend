import { Home, Layers, Calendar, Truck, User } from 'lucide-react';

export function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] text-gray-900 font-sans antialiased overflow-hidden selection:bg-batimove-blue/20">
      {/* Desktop Thin Rail */}
      <aside className="hidden lg:flex w-16 flex-col items-center bg-white border-r border-gray-200/60 py-4 shadow-[1px_0_2px_rgba(0,0,0,0.02)] z-50 justify-between">
        <div className="flex flex-col gap-6 items-center">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-gray-900/20">B</div>
          <nav className="flex flex-col gap-4 mt-4">
            <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 transition-colors"><Home className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Layers className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Calendar className="w-5 h-5" /></button>
            <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"><Truck className="w-5 h-5" /></button>
          </nav>
        </div>
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
           <User className="w-5 h-5 text-gray-500" />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        {/* Top Header Glassmorphism */}
        <header className="h-14 w-full flex justify-between items-center px-4 md:px-6 border-b border-gray-200/50 bg-white/70 backdrop-blur-md absolute top-0 z-40 supports-[backdrop-filter]:bg-white/50">
          <div className="text-sm font-semibold tracking-tight text-gray-900">Batimove OS</div>
          <button className="hidden lg:flex items-center gap-2 px-3 h-8 rounded-lg bg-gray-100 text-xs font-medium text-gray-500 hover:bg-gray-200 transition-colors border border-gray-200/50 shadow-sm">
             Rechercher... <kbd className="font-mono bg-white px-1.5 py-0.5 rounded text-[10px] shadow-sm border border-gray-200">⌘K</kbd>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-14 pb-20 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 w-full h-[84px] bg-white/80 backdrop-blur-xl border-t border-gray-200/60 flex items-start justify-around px-2 pt-3 pb-8 z-50">
        <button className="flex flex-col items-center gap-1 text-gray-900">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-semibold">Accueil</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Layers className="w-6 h-6" />
          <span className="text-[10px] font-medium">Devis</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-medium">Missions</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </nav>
    </div>
  );
}
