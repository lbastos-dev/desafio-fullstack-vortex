const AnnouncementModel = require('../models/announcementModel');

class AnnouncementController {
  // POST /anuncios
  static async create(req, res) {
    try {
      const { title, description, category, price, isDonation, phone } = req.body;
      const userId = req.userId;

      if (!title || !description || !category) {
        return res.status(400).json({ error: 'Título, descrição e categoria são obrigatórios.' });
      }

      if (!isDonation && (price === undefined || price <= 0)) {
        return res.status(400).json({ error: 'Itens que não são doação precisam de um preço válido.' });
      }

      const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
      const imageUrl = req.file
        ? `${baseUrl}/uploads/${req.file.filename}`
        : null;

      const newAnnouncement = await AnnouncementModel.create({
        title,
        description,
        category,
        price,
        isDonation,
        imageUrl,
        phone,
        userId
      });

      return res.status(201).json(newAnnouncement);
    } catch (error) {
      console.error('Erro no Controller ao criar anúncio:', error);
      return res.status(500).json({ error: 'Erro interno ao criar o anúncio.' });
    }
  }

  // GET /anuncios
  static async list(req, res) {
    try {
      const { category } = req.query;
      
      const data = await AnnouncementModel.findAll(category);
      return res.status(200).json(data);
    } catch (error) {
      console.error('Erro no Controller ao listar anúncios:', error);
      return res.status(500).json({ error: 'Erro interno ao listar os anúncios.' });
    }
  }

  // DELETE /anuncios/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      
      const success = await AnnouncementModel.delete(id, userId);

      if (!success) {
        return res.status(404).json({ error: 'Anúncio não encontrado ou sem permissão.' });
      }

      return res.status(200).json({ message: 'Anúncio removido com sucesso.' });
    } catch (error) {
      console.error('Erro no Controller ao deletar anúncio:', error);
      return res.status(500).json({ error: 'Erro interno ao deletar o anúncio.' });
    }
  }
}

module.exports = AnnouncementController;
