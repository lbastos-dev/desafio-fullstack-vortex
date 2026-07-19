const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'vortex_lab_secret_key_2026'; // Em produção, usar variável de ambiente

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      // Criptografa a senha antes de salvar
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await UserModel.create({ name, email, password: hashedPassword });
      return res.status(201).json(newUser);
    } catch (error) {
      if (error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
      }

      // Gera o Token JWT válido por 24 horas
      const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '24h' });

      return res.status(200).json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao realizar login.' });
    }
  }
}

module.exports = AuthController;