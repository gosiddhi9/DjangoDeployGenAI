import React from 'react';
import { Terminal, ShieldCheck, Server } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">DjangoDeploy <span className="text-indigo-400">GenAI</span></h1>
          </div>
          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Generator</span>
            </div>
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4" />
              <span>Ubuntu VPS Optimized</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-slate-50 text-slate-500 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm">
          <p>Powered by Google Gemini 2.5 Flash. This tool generates scripts; always review code before running on production servers.</p>
        </div>
      </footer>
    </div>
  );
};