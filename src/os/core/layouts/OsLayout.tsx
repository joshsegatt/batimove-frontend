import React from "react";
import { cn } from "../utils/cn";

export function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] text-gray-900 font-sans antialiased overflow-hidden selection:bg-batimove-blue/20">
      {/* Desktop Thin Rail */}
      <aside className="hidden lg:flex w-16 flex-col items-center bg-white border-r border-gray-200/60 py-4 shadow-[1px_0_2px_rgba(0,0,0,0.02)] z-50">
        <div className="w-8 h-8 rounded-lg bg-batimove-blue flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-batimove-blue/20">B</div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        {/* Top Header Glassmorphism */}
        <header className="h-14 w-full flex items-center px-4 md:px-6 border-b border-gray-200/50 bg-white/70 backdrop-blur-md absolute top-0 z-40 supports-[backdrop-filter]:bg-white/50">
          <div className="text-sm font-medium">Batimove OS</div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-14 pb-16 lg:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden absolute bottom-0 w-full h-16 bg-white/80 backdrop-blur-lg border-t border-gray-200/60 flex items-center justify-around px-2 z-50 pb-safe">
        <div className="text-xs font-medium text-gray-400">Mobile Nav</div>
      </nav>
    </div>
  );
}
