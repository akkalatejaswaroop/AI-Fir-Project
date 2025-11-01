import React from 'react';
import { HistoryIcon } from '../constants';

interface HeaderProps {
  currentView: 'main' | 'history';
  onToggleView: () => void;
}


export const Header: React.FC<HeaderProps> = ({ currentView, onToggleView }) => {
  return (
    <header className="bg-brand-blue shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">AI-FIR Vision</h1>
        {currentView === 'main' && (
          <button onClick={onToggleView} className="flex items-center px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
            <HistoryIcon />
            <span className="ml-2">View History</span>
          </button>
        )}
      </div>
    </header>
  );
};