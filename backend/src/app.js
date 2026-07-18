const express = require('express');
const cors = require('cors');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares obrigatórios
app.use(cors()); // Essencial para o Frontend React consumir a API depois
app.use(express.json()); // Garante o formato estritamente JSON

// Vinculação de rotas da API
app.use('/api', announcementRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});