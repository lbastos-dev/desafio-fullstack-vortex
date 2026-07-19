import React, { useState, useEffect } from 'react';

function LandingPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState('');

  // Busca os dados do seu backend em SQLite
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const url = category 
          ? `http://localhost:3000/api/anuncios?category=${category}`
          : 'http://localhost:3000/api/anuncios';
        const response = await fetch(url);
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error('Erro ao buscar anúncios:', error);
      }
    };

    fetchAnnouncements();
  }, [category]);

  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="p-5 mb-4 bg-light rounded-3 border">
        <div className="container-fluid py-3 text-center">
          <h1 className="display-5 fw-bold text-success">Economia Circular no Campus</h1>
          <p className="col-md-8 fs-5 mx-auto text-muted">
            Facilitando o acesso a materiais acadêmicos essenciais para quem está ingressando na universidade. Doe ou venda livros, jalecos e eletrônicos.
          </p>
        </div>
      </div>

      {/* Estatísticas Simuladas (Exigência do Edital) */}
      <div className="row text-center mb-5 g-3">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-success">
            <h3 className="fw-bold text-success">150+</h3>
            <p className="text-muted mb-0">Itens Desapegados</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-success">
            <h3 className="fw-bold text-success">R$ 4.200</h3>
            <p className="text-muted mb-0">Economizados por Alunos</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-success">
            <h3 className="fw-bold text-success">85</h3>
            <p className="text-muted mb-0">Doações Realizadas</p>
          </div>
        </div>
      </div>

      {/* Filtros e Vitrine */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 fw-bold mb-0">Últimos Anúncios Cadastrados</h2>
        <select 
          className="form-select w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Todas as Categorias</option>
          <option value="Saude">Saúde / Jalecos</option>
          <option value="Exatas">Exatas / Calculadoras</option>
          <option value="Livros">Livros / Xerox</option>
        </select>
      </div>

      {/* Grid de Anúncios */}
      <div className="row g-4">
        {announcements.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">Nenhum item anunciado nesta categoria até o momento.</p>
          </div>
        ) : (
          announcements.map((item) => (
            <div className="col-md-4 col-sm-6" key={item.id}>
              <div className="card h-100 shadow-sm border-0 bg-light">
                <img 
                  src={item.imageUrl} 
                  className="card-img-top border-bottom" 
                  alt={item.title}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <span className={`badge mb-2 ${item.isDonation ? 'bg-info' : 'bg-success'}`}>
                    {item.isDonation ? 'Doação' : `R$ ${item.price}`}
                  </span>
                  <h5 className="card-title fw-bold text-dark">{item.title}</h5>
                  <p className="card-text text-muted small text-truncate">{item.description}</p>
                </div>
                <div className="card-footer bg-transparent border-0 pt-0 pb-3">
                  <small className="text-muted d-block mb-2">Categoria: {item.category}</small>
                  <button className="btn btn-outline-success btn-sm w-100">Tenho Interesse</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LandingPage;