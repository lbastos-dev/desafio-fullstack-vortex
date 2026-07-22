import React, { useState, useEffect } from 'react';
import { apiGet } from '../api';

const CATEGORIES = [
  { value: '', label: 'Todas as Categorias' },
  { value: 'Livros', label: 'Livros / Xerox' },
  { value: 'Saude', label: 'Saúde / Jalecos' },
  { value: 'Exatas', label: 'Exatas / Calculadoras' },
  { value: 'Computacao', label: 'Computação' },
  { value: 'Engenharia', label: 'Engenharia' },
  { value: 'Geral', label: 'Geral' },
];

function LandingPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const path = category
          ? `/api/anuncios?category=${category}`
          : '/api/anuncios';
        const data = await apiGet(path);
        setAnnouncements(data);
      } catch (error) {
        console.error('Erro ao buscar anúncios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [category]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light p-5 rounded-3 border" style={{ margin: '2rem auto', maxWidth: '1100px' }}>
        <div className="container-fluid py-3 text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="display-5 fw-bold" style={{ color: 'var(--unfor-marinho)' }}>
            Economia Circular no Campus
          </h1>
          <p className="col-md-8 fs-5 mx-auto" style={{ color: 'var(--unfor-text-muted)', maxWidth: '680px' }}>
            Para aprender é preciso curiosidade. Doe, troque ou encontre materiais acadêmicos
            que impulsionam o aprendizado de quem está começando.
          </p>
          <div className="hero-cta-group">
            <a href="#anuncios" className="btn btn-primary btn-lg">
              <i className="bi bi-search me-2"></i>
              Explorar Itens
            </a>
            <a href="?view=mobile" className="btn btn-outline-primary btn-lg">
              <i className="bi bi-phone me-2"></i>
              Anunciar pelo App
            </a>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-number">150+</div>
              <div className="stat-label">Itens Desapegados</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-number">R$ 4.200</div>
              <div className="stat-label">Economizados por Alunos</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-number">85</div>
              <div className="stat-label">Doações Realizadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros e Vitrine */}
      <section id="anuncios" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1rem 3rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 className="section-title mb-0">Últimos Anúncios</h2>
          <select
            className="form-select w-auto"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ minWidth: '200px' }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="loading-spinner"></div>
            <p className="mt-3" style={{ color: 'var(--unfor-text-muted)' }}>Carregando anúncios...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-inbox" style={{ fontSize: '3rem', color: 'var(--unfor-azul-claro)' }}></i>
            <p className="mt-3" style={{ color: 'var(--unfor-text-muted)' }}>
              Nenhum item anunciado nesta categoria até o momento.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {announcements.map((item) => (
              <div className="col-lg-4 col-md-6" key={item.id}>
                <div className="card h-100">
                  <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                      <span className={`badge ${item.isDonation ? 'bg-info' : 'bg-success'}`}>
                        {item.isDonation ? 'Doação' : `R$ ${item.price}`}
                      </span>
                      <span className="badge bg-info ms-2" style={{ backgroundColor: 'var(--unfor-gelo)', color: 'var(--unfor-marinho)', border: '1px solid var(--unfor-azul-claro-light)' }}>
                        {item.category}
                      </span>
                    </div>
                    <h5 className="card-title fw-bold">{item.title}</h5>
                    <p className="card-text text-truncate" style={{ flex: 1 }}>{item.description}</p>
                  </div>
                  <div className="card-footer bg-transparent border-0 pt-0 pb-3">
                    <button className="btn btn-marinho btn-sm w-100">
                      <i className="bi bi-chat-dots me-1"></i>
                      Tenho Interesse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Institucional */}
      <footer className="footer-unifor">
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="footer-brand">Desapego Universitário</div>
              <div className="footer-copy mt-1">
                Marketplace de economia circular — Universidade de Fortaleza (UNIFOR)
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-copy">
                Campus vivo. Inquieto. Aberto. Conectado. Pulsante.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
