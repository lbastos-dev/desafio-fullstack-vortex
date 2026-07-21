import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import MobileApp from './pages/MobileApp';

function App() {
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' ou 'mobile'

  return (
  <div className="min-vh-100 bg-white">
    {/* Barra superior de simulação adaptada ao padrão institucional */}
    <nav className="navbar navbar-expand-lg navbar-light menu-main-bar">
      <div className="container-fluid d-flex align-items-center justify-content-between px-4">
        
        {/* Lado Esquerdo: Logo e Identificação */}
        <a className="navbar-brand d-flex align-items-center m-0" href="/">
          <img 
            src="/unifor-horizontal.png" 
            alt="Logo UNIFOR" 
            style={{ height: '100px', width: 'auto', objectFit: 'contain', display:'flex' }} 
          />
          <span className="ms-3 font-weight-semi-bold text-muted navbar-sub-title">
            | Ambiente de Teste
          </span>
        </a>

        {/* Lado Direito: Grupo de Botões de Simulação */}
        <div className="btn-group btn-group-sm simulation-controls" role="group" aria-label="Controle de Telas">
          <button
            className={`btn ${viewMode === 'desktop' ? 'btn-success fw-bold active' : 'btn-outline-light text-dark'}`}
            onClick={() => setViewMode('desktop')}
          >
            Landing Page (Desktop)
          </button>
          <button
            className={`btn ${viewMode === 'mobile' ? 'btn-success fw-bold active' : 'btn-outline-light text-dark'}`}
            onClick={() => setViewMode('mobile')}
          >
            PWA App (Mobile)
          </button>
        </div>

      </div>
    </nav>

    {/* Renderização condicional das telas permanece igual */}
    <main className="animate-fade-in">
      {viewMode === 'desktop' ? <LandingPage /> : <MobileApp />}
    </main>
  </div>
);
}

export default App;