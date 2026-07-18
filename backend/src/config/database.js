const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Cria ou abre o arquivo do banco na raiz do backend
const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado com sucesso ao banco de dados SQLite.');
  }
});

// Inicializa as tabelas necessárias
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      price REAL,
      isDonation INTEGER,
      imageUrl TEXT,
      createdAt TEXT
    )
  `);
});

module.exports = db;