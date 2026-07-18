const db = require('../config/database');

class AnnouncementModel {
  static create({ title, description, category, price, isDonation, imageUrl }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO announcements (title, description, category, price, isDonation, imageUrl, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const finalPrice = isDonation ? 0 : Number(price);
      const finalIsDonation = isDonation ? 1 : 0; // SQLite armazena booleanos como 0 ou 1
      const finalImageUrl = imageUrl || 'https://via.placeholder.com/150';
      const createdAt = new Date().toISOString();

      db.run(
        query,
        [title, description, category, finalPrice, finalIsDonation, finalImageUrl, createdAt],
        function (err) {
          if (err) return reject(err);
          
          // 'this.lastID' retorna o ID gerado automaticamente pelo SQLite
          resolve({
            id: this.lastID,
            title,
            description,
            category,
            price: finalPrice,
            isDonation: Boolean(finalIsDonation),
            imageUrl: finalImageUrl,
            createdAt
          });
        }
      );
    });
  }

  static findAll(categoryFilter) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM announcements';
      const params = [];

      if (categoryFilter) {
        query += ' WHERE LOWER(category) = LOWER(?)';
        params.push(categoryFilter);
      }

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        
        // Mapeia os dados para garantir o formato booleano correto no JSON de saída
        const formattedRows = rows.map(row => ({
          ...row,
          isDonation: Boolean(row.isDonation)
        }));
        
        resolve(formattedRows);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM announcements WHERE id = ?';
      
      db.run(query, [id], function (err) {
        if (err) return reject(err);
        // 'this.changes' indica o número de linhas afetadas pela query
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = AnnouncementModel;