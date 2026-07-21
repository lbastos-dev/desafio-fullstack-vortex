# Desapego Universitário — Marketplace de Economia Circular do Campus

> **"Para aprender é preciso curiosidade."**

O Desapego Universitário é um marketplace digital que facilita a doação e comercialização de materiais acadêmicos entre estudantes da Universidade de Fortaleza (UNIFOR). O projeto promove a **economia circular no campus**, conectando quem quer se desapegar de livros, jalecos, calculadoras e eletrônicos a quem precisa desses materiais para iniciar ou continuar seus estudos.

---

## Stack Tecnológica

### Backend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Node.js | 20 | Runtime |
| Express | 5.2 | Framework web |
| SQLite3 | 6.0 | Banco de dados relacional leve |
| JSON Web Token | 9.0 | Autenticação (JWT) |
| bcryptjs | 3.0 | Criptografia de senhas |
| Multer | 2.2 | Upload de imagens |
| Docker | — | Containerização e deploy |

### Frontend

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 19.2 | Biblioteca de UI |
| Vite | 8.1 | Build tool e dev server |
| Bootstrap | 5.3 | Framework CSS responsivo |
| Bootstrap Icons | 1.13 | Ícones |
| Oxlint | 1.71 | Linter |
| PWA (Manifest + SW) | — | Instalabilidade e cache offline |

### Infraestrutura e CI/CD

| Ferramenta | Finalidade |
|------------|------------|
| Vercel | Hosting do frontend (PWA) |
| Render | Hospedagem do backend (Docker) |
| GitHub Actions | CI — lint e build automático |
| Fontshare CDN | Tipografia Satoshi Variable |

---

## Instruções de Execução Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- [Git](https://git-scm.com/)
- npm (vem junto com o Node)

### 1. Clonar o repositório

```bash
git clone https://github.com/lbastos-dev/desafio-fullstack-vortex.git
cd desafio-fullstack-vortex
```

### 2. Instalar e iniciar o Backend

```bash
cd backend
npm install
npm run dev
```

O servidor iniciará em `http://localhost:3000`.

### 3. Instalar e iniciar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite iniciará em `http://localhost:5173` com proxy automático para o backend.

### 4. Testar a aplicação

1. Acesse `http://localhost:5173`
2. Clique em **PWA App (Mobile)** na barra superior
3. Faça login com as credenciais de teste:

| Campo | Valor |
|-------|-------|
| Matrícula | `20260001` |
| Senha | `123456` |

### 5. Build para produção

```bash
cd frontend
npm run build
```

O build será gerado na pasta `frontend/dist/`.

---

## Estrutura do Projeto

```
desapego-universitario/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── src/
│   │   ├── app.js                        # Entry point do Express
│   │   ├── config/database.js            # Conexao SQLite + schema
│   │   ├── controllers/
│   │   │   ├── authController.js         # Registro, login, /me
│   │   │   └── announcementController.js # CRUD de anuncios
│   │   ├── middlewares/authMiddleware.js  # Verificacao JWT
│   │   ├── models/
│   │   │   ├── announcementModel.js
│   │   │   └── userModel.js
│   │   └── routes/announcementRoutes.js  # Definicao de rotas
│   └── uploads/                          # Imagens enviadas
├── frontend/
│   ├── vercel.json                       # Rewrites para proxy API
│   ├── vite.config.js                    # Config Vite + proxy dev
│   ├── public/
│   │   ├── manifest.json                 # PWA manifest
│   │   ├── sw.js                         # Service Worker
│   │   └── icons/                        # Icones PWA
│   └── src/
│       ├── main.jsx                      # Entry point React
│       ├── App.jsx                       # Root component
│       ├── api.js                        # Helper centralizado de chamadas API
│       ├── index.css                     # Design system UNIFOR
│       └── pages/
│           ├── LandingPage.jsx           # Desktop — vitrine publica
│           └── MobileApp.jsx             # Mobile — login + CRUD
└── .github/workflows/ci.yml             # GitHub Actions CI
```

---

## API Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|:------------:|-----------|
| `POST` | `/api/auth/register` | Não | Cadastrar novo estudante |
| `POST` | `/api/auth/login` | Não | Login com matrícula + senha |
| `GET` | `/api/anuncios` | Não | Listar anúncios (`?category=`) |
| `POST` | `/api/anuncios` | JWT | Criar anúncio (multipart) |
| `DELETE` | `/api/anuncios/:id` | JWT | Remover anúncio |
| `GET` | `/health` | Não | Health check do servidor |

---

## Links de Produção

| Serviço | URL |
|---------|-----|
| Frontend (Vercel) | https://desafio-fullstack-vortex.vercel.app |
| Backend (Render) | https://desafio-fullstack-vortex.onrender.com |
| Health Check | https://desafio-fullstack-vortex.onrender.com/health |

---

## Diário de Bordo da IA

> Esta seção documenta o uso de Inteligência Artificial Generativa como ferramenta de produtividade durante o desenvolvimento do projeto. Todo o código foi revisado, auditado e integrado por um desenvolvedor humano.

### 1. Ferramentas Utilizadas

| Ferramenta | Uso |
|------------|-----|
| **Claude (Anthropic)** | Arquitetura de software, refatoração de código, criação de design system, debug de CORS, configuração de deploy, documentação |
| **GitHub Copilot** | Autocomplete de código no editor (sugestões de boilerplate e funções auxiliares) |
| **ChatGPT (OpenAI)** | Consultas pontuais sobre sintaxe de Express 5 e configurção de Service Workers |

### 2. Estratégia de Engenharia de Prompts

#### Prompt 1 — Refatoração do Design System com Branding UNIFOR

```
Você é um Arquiteto de Software Sênior e Especialista em Front-end/UI alinhado
às diretrizes de identidade visual da UNIFOR. Sua missão é criar ou adaptar uma
aplicação web full-stack (Marketplace de Economia Circular do Campus).

Especificações:
- Paleta de Cores: Anil (#004AF7), Marinho (#132190), Gelo (#E4F2FE), Azul Claro (#87B7FE)
- Tipografia: Satoshi Variable via CDN Fontshare
- Tom de Voz: visionário, acolhedor, agregador, realizador

Analise a estrutura atual do projeto e reaplique o design system em todos os
componentes visuais (index.css, LandingPage.jsx, MobileApp.jsx, manifest.json).
```

**Resultado:** Reescrita completa de 327 linhas de CSS com variáveis de paleta
institucional, tipografia Satoshi, componentes de cards e botões alinhados à
identidade UNIFOR.

#### Prompt 2 — Correção de CORS com Deploy em Produção

```
O frontend está deployado no Vercel e o backend no Render. O browser retorna
"NetworkError when attempting to fetch resource". O CORS no backend usa
origin: FRONTEND_URL. O Vercel usa rewrites para proxyar /api/ para o Render.

Analise o fluxo: Browser → Vercel Rewrite → Render. Identifique por que o
CORS bloqueia a requisção mesmo com o header access-control-allow-origin
presente. Proponha a correção.
```

**Resultado:** Identificação de trailing slash no header CORS
(`https://app.vercel.app/` vs `https://app.vercel.app`). Correção com
`.replace(/\/+$/, '')` na variável `FRONTEND_URL` no backend.

#### Prompt 3 — Dockerização do Backend para Deploy no Render

```
Dockerize o backend Node.js/Express para deploy no Render. O backend usa
SQLite para persistência e multer para uploads de imagens em disco.

Crie um Dockerfile otimizado (multi-stage se necessário), .dockerignore
adequado e garanta que o health check /health funcione dentro do container.
Teste o build localmente com docker build e docker run.
```

**Resultado:** Dockerfile com `node:20-alpine`, `npm ci --omit=dev`, diretório
`uploads/` criado. Build testado e validado localmente.

### 3. Compartilhamento de Histórico

> Espaço reservado para links públicos de chats de desenvolvimento.

| Ferramenta | Tema | Link |
|------------|------|------|
| Claude | Arquitetura + Deploy | *[Inserir link do chat]* |
| Claude | Debug CORS | *[Inserir link do chat]* |

### 4. Reflexão Crítica — Gestão de Alucinações

**O incidente:** Durante a configuração do deploy, a IA sugeriu inicialmente que
o problema de CORS era causado por uma configuração incorreta do middleware
`cors()` no Express. O código sugerido incluía `origin: true` (que reflete o
origin da requisição) como solução.

**Como foi identificado:** Ao inspecionar os headers da resposta via
`curl -I`, percebi que o header `access-control-allow-origin` já estava
presente e correto. O problema real era um **trailing slash** na variável de
ambiente `FRONTEND_URL` no Render — `https://app.vercel.app/` em vez de
`https://app.vercel.app`. O navegador compara origins de forma exata e
rejeitava o header porISMATCH.

**Como foi corrigido:** Após análise manual dos headers com curl e
comparação com o código do backend, identifiquei que a IA havia diagnosticado
o sintoma (CORS bloqueado) mas não a causa raiz (trailing slash na env var).
A correção definitiva foi adicionado `.replace(/\/+$/, '')` na leitura da
variável de ambiente, garantindo que o CORS receba sempre uma URL sem barra final.

**Lição aprendida:** IAs são eficientes em sugerir soluções para problemas
conhecidos, mas podem falhar em diagnósticos que exigem inspeção de estado
em runtime (headers HTTP, valores de env vars em produção). A auditoria
humana — testar com curl, inspecionar logs, comparar com o código — continua
sendo essencial para validar qualquer correção sugerida.

---

## Licença

Este projeto foi desenvolvido com fins acadêmicos para a Universidade de Fortaleza (UNIFOR).
