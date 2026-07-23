const db = require('../config/database');

class UserModel {
  static create({ name, matricula, password, phone }) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (name, matricula, password, phone) VALUES (?, ?, ?, ?)`;
      db.run(query, [name, matricula, password, phone || null], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, name, matricula, phone: phone || null });
      });
    });
  }

  static findByMatricula(matricula) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE matricula = ?`;
      db.get(query, [matricula], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, matricula, phone FROM users WHERE id = ?`;
      db.get(query, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
}

module.exports = UserModel;
