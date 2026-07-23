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
      phone TEXT,
      userId INTEGER,
      createdAt TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `
);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      matricula TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT
    )
  `, function () {
    const bcrypt = require('bcryptjs');
    const testMatricula = '20260001';
    const testPassword = '123456';

    db.get('SELECT id FROM users WHERE matricula = ?', [testMatricula], (err, row) => {
      if (!row) {
        const hash = bcrypt.hashSync(testPassword, 10);
        db.run(
          'INSERT INTO users (name, matricula, password, phone) VALUES (?, ?, ?, ?)',
          ['Aluno Teste', testMatricula, hash, '85997465937'],
          () => console.log(`Usuário teste criado: matrícula "${testMatricula}" / senha "${testPassword}" / telefone "85997465937"`)
        );
      } else {
        db.run(
          'UPDATE users SET phone = ? WHERE matricula = ? AND (phone IS NULL OR phone = "")',
          ['85997465937', testMatricula],
          () => console.log(`Telefone atualizado para o usuário "${testMatricula}"`)
        );
      }
    });
  });
});

module.exports = db;