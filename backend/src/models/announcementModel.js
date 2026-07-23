const db = require('../config/database');

class AnnouncementModel {
  static create({ title, description, category, price, isDonation, imageUrl, phone, userId }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO announcements (title, description, category, price, isDonation, imageUrl, phone, userId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const finalPrice = isDonation ? 0 : Number(price);
      const finalIsDonation = isDonation ? 1 : 0;
      const finalImageUrl = imageUrl || 'https://via.placeholder.com/150';
      const createdAt = new Date().toISOString();

      db.run(
        query,
        [title, description, category, finalPrice, finalIsDonation, finalImageUrl, phone || null, userId, createdAt],
        function (err) {
          if (err) return reject(err);
          
          resolve({
            id: this.lastID,
            title,
            description,
            category,
            price: finalPrice,
            isDonation: Boolean(finalIsDonation),
            imageUrl: finalImageUrl,
            phone: phone || null,
            userId,
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
        
        const formattedRows = rows.map(row => ({
          ...row,
          isDonation: Boolean(row.isDonation)
        }));
        
        resolve(formattedRows);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM announcements WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static delete(id, userId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM announcements WHERE id = ? AND userId = ?';
      
      db.run(query, [id, userId], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = AnnouncementModel;
