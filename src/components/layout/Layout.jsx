import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children, activeView, onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header activeView={activeView} onNavigate={onNavigate} />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {children}
      </main>
      <Footer onNavigate={onNavigate} activeView={activeView} />
    </div>
  );
}
