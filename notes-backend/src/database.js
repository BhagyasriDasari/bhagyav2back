const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE notes (id INTEGER PRIMARY KEY, content TEXT)");
});

module.exports = db;
