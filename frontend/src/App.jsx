import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import MobileApp from './pages/MobileApp';

function App() {
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' ou 'mobile'

  return (
    <div className="min-vh-100 bg-white">
      {/* Barra superior de simulação para a banca examinadora */}
      <nav className="navbar navbar-dark bg-dark sticky-top shadow-sm py-2">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h1 fs-6 fw-bold text-light">
            <i className="bi bi-cpu me-2 text-success"></i>Vortex Labs - Ambiente de Teste
          </span>
          <div className="btn-group btn-group-sm">
            <button 
              className={`btn ${viewMode === 'desktop' ? 'btn-success fw-bold' : 'btn-outline-light'}`}
              onClick={() => setViewMode('desktop')}
            >
              <i className="bi bi-laptop me-1"></i> Landing Page (Desktop)
            </button>
            <button 
              className={`btn ${viewMode === 'mobile' ? 'btn-success fw-bold' : 'btn-outline-light'}`}
              onClick={() => setViewMode('mobile')}
            >
              <i className="bi bi-phone me-1"></i> PWA App (Mobile)
            </button>
          </div>
        </div>
      </nav>

      {/* Renderização condicional das telas */}
      <main className="animate-fade-in">
        {viewMode === 'desktop' ? <LandingPage /> : <MobileApp />}
      </main>
    </div>
  );
}

export default App;