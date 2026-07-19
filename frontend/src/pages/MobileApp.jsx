import React, { useState, useEffect } from 'react';

function MobileApp() {
  // Estados de Autenticação
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Estados dos Anúncios
  const [myItems, setMyItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Saude');
  const [price, setPrice] = useState('');
  const [isDonation, setIsDonation] = useState(false);

  // Busca os itens cadastrados
  const fetchMyItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/anuncios');
      const data = await response.json();
      setMyItems(data);
    } catch (error) {
      console.error('Erro ao buscar meus itens:', error);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  // Fluxo de Login na API
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha na autenticação.');
      }

      // Salva o token no estado e no localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
      alert(`Bem-vindo de volta, ${data.user.name}!`);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Fluxo de Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setEmail('');
    setPassword('');
  };

  // Fluxo de Criação de Anúncio com JWT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, category, price: isDonation ? 0 : Number(price), isDonation };

    try {
      const response = await fetch('http://localhost:3000/api/anuncios', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Injeta o token armazenado
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao publicar item.');
      }

      setTitle('');
      setDescription('');
      setPrice('');
      setIsDonation(false);
      fetchMyItems(); // Atualiza a lista na hora
      alert('Anúncio cadastrado com sucesso!');
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente remover este anúncio?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/anuncios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchMyItems();
      }
    } catch (error) {
      console.error('Erro ao deletar item:', error);
    }
  };

  // TELA 1: Se não houver Token, renderiza o Formulário de Login
  if (!token) {
    return (
      <div className="container py-5 mx-auto" style={{ maxWidth: '400px', minHeight: '80vh' }}>
        <div className="card shadow border-0 p-4 mt-4">
          <div className="text-center mb-4">
            <i className="bi bi-person-lock text-success" style={{ fontSize: '3rem' }}></i>
            <h3 className="fw-bold mt-2">Acesso ao App</h3>
            <p className="text-muted small">Entre com suas credenciais institucionais</p>
          </div>

          {authError && (
            <div className="alert alert-danger py-2 small" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold">E-mail</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="exemplo@unifor.br"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold">Senha</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm">
              Entrar no App
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TELA 2: Se o usuário estiver autenticado, exibe o Painel do PWA
  return (
    <div className="container py-3 mx-auto" style={{ maxWidth: '450px', background: '#f8f9fa', minHeight: '85vh' }}>
      {/* Header do Usuário Logado */}
      <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-2 rounded shadow-sm border-start border-success border-3">
        <div className="small">
          <i className="bi bi-person-circle text-success me-2"></i>
          <span className="fw-bold text-dark">Painel do Aluno</span>
        </div>
        <button className="btn btn-outline-danger btn-sm py-0 px-2 fw-bold" onClick={handleLogout}>
          Sair <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>

      {/* Formulário de Cadastro de Anúncios */}
      <div className="card shadow-sm p-4 mb-4 border-0">
        <h3 className="h5 fw-bold text-success mb-3">
          <i className="bi bi-plus-circle me-2"></i>Anunciar Novo Item
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label small fw-bold">Título</label>
            <input type="text" className="form-control form-control-sm" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label className="form-label small fw-bold">Descrição</label>
            <textarea className="form-control form-control-sm" rows="2" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
          <div className="mb-2">
            <label className="form-label small fw-bold">Categoria</label>
            <select className="form-select form-select-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Saude">Saúde / Jalecos</option>
              <option value="Exatas">Exatas / Calculadoras</option>
              <option value="Livros">Livros / Xerox</option>
            </select>
          </div>
          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" checked={isDonation} onChange={(e) => setIsDonation(e.target.checked)} id="donationSwitch" />
            <label className="form-check-label small fw-bold" htmlFor="donationSwitch">Este item é uma doação</label>
          </div>
          {!isDonation && (
            <div className="mb-3">
              <label className="form-label small fw-bold">Preço (R$)</label>
              <input type="number" className="form-control form-control-sm" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
          )}
          <button type="submit" className="btn btn-success btn-sm w-100 fw-bold shadow-sm">Publicar Anúncio</button>
        </form>
      </div>

      {/* Listagem de Itens Cadastrados */}
      <h4 className="h6 fw-bold text-secondary mb-3 px-1">Meus Anúncios Ativos</h4>
      <div className="list-group shadow-sm">
        {myItems.map(item => (
          <div className="list-group-item d-flex justify-content-between align-items-center bg-white border-0 mb-2 rounded shadow-sm" key={item.id}>
            <div>
              <h6 className="mb-0 fw-bold text-dark">{item.title}</h6>
              <span className={`badge p-1 mt-1 ${item.isDonation ? 'bg-info' : 'bg-success'}`}>
                {item.isDonation ? 'Doação' : `R$ ${item.price}`}
              </span>
            </div>
            <button className="btn btn-link text-danger p-0" onClick={() => handleDelete(item.id)}>
              <i className="bi bi-trash fs-5"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MobileApp;