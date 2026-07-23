const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'unifor_vortex_secret_key';

const register = async (req, res) => {
  const { name, matricula, password, phone } = req.body;

  if (!name || !matricula || !password) {
    return res.status(400).json({ error: 'Nome, matrícula e senha são obrigatórios.' });
  }

  try {
    const existing = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE matricula = ?', [matricula], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    if (existing) {
      return res.status(409).json({ error: 'Matrícula já cadastrada.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, matricula, password, phone) VALUES (?, ?, ?, ?)',
        [name, matricula, hashedPassword, phone || null],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });

    const token = jwt.sign({ id: userId, matricula }, JWT_SECRET, { expiresIn: '8h' });

    return res.status(201).json({
      token,
      usuario: { id: userId, name, matricula, phone: phone || null }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const login = async (req, res) => {
  const { matricula, password } = req.body;

  if (!matricula || !password) {
    return res.status(400).json({ error: 'Matrícula e senha são obrigatórias.' });
  }

  try {
    db.get('SELECT * FROM users WHERE matricula = ?', [matricula], async (err, user) => {
      if (err) {
        console.error('Erro na consulta ao banco:', err);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Matrícula ou senha inválidos.' });
      }

      const senhaValida = await bcrypt.compare(password, user.password);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Matrícula ou senha inválidos.' });
      }

      const token = jwt.sign(
        { id: user.id, matricula: user.matricula },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        usuario: {
          id: user.id,
          name: user.name,
          matricula: user.matricula,
          phone: user.phone || null
        }
      });
    });
  } catch (error) {
    console.error('Erro no fluxo de autenticação:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const me = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  db.get('SELECT id, name, matricula, phone FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }
    return res.json(user);
  });
};

module.exports = { register, login, me };
