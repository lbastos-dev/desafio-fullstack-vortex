const db = require('../config/database');

class UserModel {
  static create({ name, matricula, password }) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (name, matricula, password) VALUES (?, ?, ?)`;
      db.run(query, [name, matricula, password], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, name, matricula });
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
}

module.exports = UserModel;
