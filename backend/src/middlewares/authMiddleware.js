const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'unifor_vortex_secret_key';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token malformatado.' });
  }

  const token = parts[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // O 'return' aqui impede que o Express tente continuar para o Controller
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    req.userId = decoded.id;
    return next();
  });
}

module.exports = authMiddleware;