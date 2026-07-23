import React, { useState, useEffect } from 'react';
import { apiGet, apiGetAuth, apiPost, apiPostForm, apiDelete } from '../api';

const CATEGORIES = [
  { value: 'Saude', label: 'Saúde / Jalecos' },
  { value: 'Livros', label: 'Livros / Xerox' },
  { value: 'Exatas', label: 'Exatas / Calculadoras' },
  { value: 'Computacao', label: 'Computação' },
  { value: 'Engenharia', label: 'Engenharia' },
  { value: 'Geral', label: 'Geral' },
];

function MobileApp() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(null);
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [myItems, setMyItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Saude');
  const [price, setPrice] = useState('');
  const [isDonation, setIsDonation] = useState(false);
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMyItems = async () => {
    try {
      const data = await apiGet('/api/anuncios');
      setMyItems(data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const data = await apiGetAuth('/api/auth/me', token);
          setUserId(data.id);
        } catch {
          handleLogout();
        }
      })();
      fetchMyItems();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);

    try {
      const data = await apiPost('/api/auth/login', { matricula, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserId(null);
    setMatricula('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', isDonation ? 0 : Number(price));
    formData.append('isDonation', isDonation);
    formData.append('phone', phone);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await apiPostForm('/api/anuncios', formData, token);
      setTitle('');
      setDescription('');
      setPrice('');
      setIsDonation(false);
      setPhone('');
      setImageFile(null);
      document.getElementById('inputImagem').value = '';
      fetchMyItems();
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente remover este anúncio?')) return;
    try {
      await apiDelete(`/api/anuncios/${id}`, token);
      fetchMyItems();
    } catch (error) {
      console.error('Erro ao deletar item:', error);
    }
  };

  /* ==================== TELA DE LOGIN ==================== */
  if (!token) {
    return (
      <div className="container py-5 mx-auto" style={{ maxWidth: '400px', minHeight: '80vh' }}>
        <div className="card shadow border-0 p-4 mt-4">
          <div className="text-center mb-4">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--unfor-gelo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <i className="bi bi-person-lock" style={{ fontSize: '1.75rem', color: 'var(--unfor-anil)' }}></i>
            </div>
            <h3 className="fw-bold" style={{ color: 'var(--unfor-marinho)' }}>Acesse o Desapego</h3>
            <p style={{ color: 'var(--unfor-text-muted)', fontSize: '0.9rem' }}>
              Entre com suas credenciais institucionais
            </p>
          </div>

          {authError && (
            <div className="alert alert-danger py-2 small" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Matrícula</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite sua matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 fw-bold shadow-sm"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <><span className="loading-spinner me-2"></span>Entrando...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Entrar no App</>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ==================== PAINEL DO ALUNO ==================== */
  return (
    <div className="container py-3 mx-auto" style={{ maxWidth: '450px', background: 'var(--unfor-bg-alt)', minHeight: '85vh' }}>
      {/* Header do Usuário Logado */}
      <div
        className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded shadow-sm"
        style={{ borderLeft: '4px solid var(--unfor-anil)' }}
      >
        <div className="d-flex align-items-center">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--unfor-gelo)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem',
            }}
          >
            <i className="bi bi-person-fill" style={{ color: 'var(--unfor-anil)' }}></i>
          </div>
          <div>
            <div className="fw-bold" style={{ color: 'var(--unfor-marinho)', fontSize: '0.95rem' }}>Painel do Aluno</div>
            <div style={{ color: 'var(--unfor-text-muted)', fontSize: '0.8rem' }}>Gerencie seus anúncios</div>
          </div>
        </div>
        <button className="btn btn-sm fw-bold" style={{ color: 'var(--unfor-danger)', border: '1px solid var(--unfor-danger)', borderRadius: 'var(--radius-sm)' }} onClick={handleLogout}>
          Sair <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>

      {/* Formulário de Cadastro */}
      <div className="card shadow-sm p-4 mb-4 border-0">
        <h3 className="h5 fw-bold mb-3" style={{ color: 'var(--unfor-marinho)' }}>
          <i className="bi bi-plus-circle me-2" style={{ color: 'var(--unfor-anil)' }}></i>
          Novo Anúncio
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Ex: Cálculo I - Stewart"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-control form-control-sm"
              rows="2"
              placeholder="Descreva o item brevemente..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-2">
            <label className="form-label">Categoria</label>
            <select
              className="form-select form-select-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isDonation}
              onChange={(e) => setIsDonation(e.target.checked)}
              id="donationSwitch"
            />
            <label className="form-check-label fw-bold" style={{ fontSize: '0.85rem', color: 'var(--unfor-marinho)' }} htmlFor="donationSwitch">
              Este item é uma doação
            </label>
          </div>
          {!isDonation && (
            <div className="mb-2">
              <label className="form-label">Preço (R$)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-2">
            <label className="form-label">Telefone (WhatsApp)</label>
            <input
              type="tel"
              className="form-control form-control-sm"
              placeholder="Ex: 85999998888"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Imagem do Produto (Opcional)</label>
            <input
              type="file"
              id="inputImagem"
              className="form-control form-control-sm"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success btn-sm w-100 fw-bold shadow-sm"
            disabled={submitting}
          >
            {submitting ? (
              <><span className="loading-spinner me-2"></span>Publicando...</>
            ) : (
              <><i className="bi bi-send me-2"></i>Publicar Anúncio</>
            )}
          </button>
        </form>
      </div>

      {/* Listagem de Itens */}
      <h4 className="h6 fw-bold mb-3 px-1" style={{ color: 'var(--unfor-marinho)' }}>
        <i className="bi bi-collection me-2" style={{ color: 'var(--unfor-anil)' }}></i>
        Meus Anúncios Ativos
      </h4>
      <div className="list-group shadow-sm">
        {myItems.length === 0 ? (
          <div className="list-group-item text-center py-4" style={{ backgroundColor: 'var(--unfor-gelo)' }}>
            <i className="bi bi-inbox" style={{ fontSize: '2rem', color: 'var(--unfor-azul-claro)' }}></i>
            <p className="mt-2 mb-0" style={{ color: 'var(--unfor-text-muted)', fontSize: '0.9rem' }}>
              Nenhum anúncio publicado ainda.
            </p>
          </div>
        ) : (
          myItems.map((item) => (
            <div
              className="list-group-item d-flex justify-content-between align-items-center border-0 mb-2 rounded shadow-sm"
              key={item.id}
              style={{ backgroundColor: 'var(--unfor-white)' }}
            >
              <div className="d-flex align-items-center">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', marginRight: '0.75rem' }}
                  />
                )}
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: 'var(--unfor-marinho)', fontSize: '0.9rem' }}>{item.title}</h6>
                  <span className={`badge mt-1 ${item.isDonation ? 'bg-info' : 'bg-success'}`}>
                    {item.isDonation ? 'Doação' : `R$ ${item.price}`}
                  </span>
                </div>
              </div>
              {userId && item.userId === userId && (
                <button
                  className="btn btn-link p-2"
                  style={{ color: 'var(--unfor-text-muted)' }}
                  onClick={() => handleDelete(item.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MobileApp;
